import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch live stock items joined with products, categories, warehouses
    const stockResult = await query(`
      SELECT 
        s.inventory_stock_id::text as id,
        s.product_id as "productId",
        p.product_code as "itemCode",
        p.product_name as "itemName",
        COALESCE(c.category_name, 'General') as category,
        COALESCE(w.warehouse_name, 'Main Warehouse') as warehouse,
        COALESCE(w.warehouse_id::text, '1') as "warehouseId",
        p.unit,
        COALESCE(s.current_quantity, 0)::float as "quantityOnHand",
        0 as "reservedQuantity",
        COALESCE(s.reorder_level, 0)::float as "reorderLevel",
        COALESCE(s.reorder_quantity, 1000)::float as "normalStockLevel",
        COALESCE(s.unit_cost, 0)::float as "unitCost",
        COALESCE(w.location, 'Bin-A1') as "locationBin",
        COALESCE(s.reorder_quantity, 500)::float as "minOrderQuantity",
        7 as "leadTimeDays",
        COALESCE(p.created_at, NOW())::text as "createdAt",
        COALESCE(s.updated_at, NOW())::text as "updatedAt"
      FROM inventory_stock s
      JOIN products p ON s.product_id = p.product_id
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN warehouses w ON s.warehouse_id = w.warehouse_id
      ORDER BY p.product_name ASC;
    `);

    // 2. Fetch live transactions
    const trxResult = await query(`
      SELECT 
        t.inventory_transaction_id::text as id,
        CONCAT('TRX-', LPAD(t.inventory_transaction_id::text, 4, '0')) as "transactionId",
        COALESCE(t.transaction_date, t.created_at, NOW())::text as date,
        t.product_id::text as "itemId",
        p.product_code as "itemCode",
        p.product_name as "itemName",
        COALESCE(w.warehouse_name, 'Main Warehouse') as warehouse,
        t.transaction_type as "transactionType",
        t.transaction_quantity::float as quantity,
        p.unit,
        CONCAT('REF-', LPAD(t.inventory_transaction_id::text, 4, '0')) as reference,
        COALESCE(t.transaction_type, 'Movement Log') as notes,
        'System Admin' as "performedBy"
      FROM inventory_transactions t
      JOIN products p ON t.product_id = p.product_id
      LEFT JOIN warehouses w ON t.warehouse_id = w.warehouse_id
      ORDER BY t.transaction_date DESC;
    `);

    // 3. Category Breakdown aggregated directly from live DB
    const categoryResult = await query(`
      SELECT 
        COALESCE(c.category_name, 'General') as category,
        COUNT(s.inventory_stock_id)::int as "itemCount",
        SUM(s.current_quantity)::float as "totalQuantity",
        SUM(s.current_quantity * s.unit_cost)::float as "totalValue"
      FROM inventory_stock s
      JOIN products p ON s.product_id = p.product_id
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      GROUP BY c.category_name;
    `);

    const colorMap: Record<string, string> = {
      'Raw Material': '#06b6d4',
      'Finished Goods': '#10b981',
      'Work In Progress': '#f59e0b',
      'Packaging Material': '#8b5cf6',
    };

    const categoriesWithColors = categoryResult.rows.map((row: any) => ({
      category: row.category,
      itemCount: row.itemCount,
      totalQuantity: row.totalQuantity || 0,
      totalValue: row.totalValue || 0,
      color: colorMap[row.category] || '#64748b',
    }));

    // 4. Generate dynamic trend points for recent days
    const totalCurrentStock = stockResult.rows.reduce(
      (acc: number, item: any) => acc + item.quantityOnHand,
      0
    );

    const trendDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trendData = trendDays.map((day, idx) => {
      const dayOffset = 6 - idx;
      const d = new Date();
      d.setDate(d.getDate() - dayOffset);
      const isoDate = d.toISOString().split('T')[0];

      return {
        date: isoDate,
        dayLabel: day,
        stockReceived: idx === 6 ? 1500 : (idx * 250) % 1200 + 400,
        productionConsumption: (idx * 320) % 900 + 200,
        currentStock: Math.round(totalCurrentStock - (6 - idx) * 300),
      };
    });

    return NextResponse.json({
      status: 'success',
      items: stockResult.rows,
      transactions: trxResult.rows,
      categorySummary: categoriesWithColors,
      trendData,
    });
  } catch (error: any) {
    console.error('Error fetching inventory data:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'adjustStock') {
      const { itemId, newQuantityOnHand, adjustmentDelta, reason, notes } = body;

      // Find stock row
      const stockCheck = await query(
        `SELECT product_id, warehouse_id, current_quantity, unit_cost FROM inventory_stock WHERE inventory_stock_id = $1`,
        [itemId]
      );

      if (stockCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Stock item not found' }, { status: 404 });
      }

      const stockRow = stockCheck.rows[0];
      const openingStock = stockRow.current_quantity;
      const closingStock = newQuantityOnHand;
      const newValue = closingStock * (stockRow.unit_cost || 0);

      // Update inventory_stock
      await query(
        `UPDATE inventory_stock 
         SET current_quantity = $1, inventory_value = $2, updated_at = NOW() 
         WHERE inventory_stock_id = $3`,
        [closingStock, newValue, itemId]
      );

      // Insert into inventory_transactions
      await query(
        `INSERT INTO inventory_transactions 
         (transaction_date, product_id, warehouse_id, transaction_type, transaction_quantity, opening_stock, closing_stock, created_at)
         VALUES (NOW(), $1, $2, 'Adjustment', $3, $4, $5, NOW())`,
        [stockRow.product_id, stockRow.warehouse_id, adjustmentDelta, openingStock, closingStock]
      );

      return NextResponse.json({ status: 'success', message: 'Stock adjusted in database successfully' });
    }

    if (action === 'transferStock') {
      const { itemId, targetWarehouse, transferQuantity, notes } = body;

      const stockCheck = await query(
        `SELECT product_id, warehouse_id, current_quantity FROM inventory_stock WHERE inventory_stock_id = $1`,
        [itemId]
      );

      if (stockCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Stock item not found' }, { status: 404 });
      }

      const stockRow = stockCheck.rows[0];
      const openingStock = stockRow.current_quantity;
      const closingStock = Math.max(0, openingStock - transferQuantity);

      // Decrement source warehouse stock
      await query(
        `UPDATE inventory_stock 
         SET current_quantity = $1, updated_at = NOW() 
         WHERE inventory_stock_id = $2`,
        [closingStock, itemId]
      );

      // Log transaction
      await query(
        `INSERT INTO inventory_transactions 
         (transaction_date, product_id, warehouse_id, transaction_type, transaction_quantity, opening_stock, closing_stock, created_at)
         VALUES (NOW(), $1, $2, 'Transfer Out', $3, $4, $5, NOW())`,
        [stockRow.product_id, stockRow.warehouse_id, -transferQuantity, openingStock, closingStock]
      );

      return NextResponse.json({ status: 'success', message: 'Stock transfer logged in database successfully' });
    }

    if (action === 'purchaseRequest') {
      const { itemCode, requestedQuantity, reason } = body;

      // Find product
      const prod = await query(`SELECT product_id FROM products WHERE product_code = $1`, [itemCode]);
      const productId = prod.rows.length > 0 ? prod.rows[0].product_id : null;

      // Insert purchase request
      const reqNumber = `PR-${Date.now().toString().slice(-6)}`;
      const prRes = await query(
        `INSERT INTO purchase_requests (request_number, request_date, request_status, created_at)
         VALUES ($1, CURRENT_DATE, 'Pending', NOW())
         RETURNING purchase_request_id`,
        [reqNumber]
      );

      if (productId && prRes.rows.length > 0) {
        await query(
          `INSERT INTO purchase_request_items (purchase_request_id, product_id, requested_quantity)
           VALUES ($1, $2, $3)`,
          [prRes.rows[0].purchase_request_id, productId, requestedQuantity]
        );
      }

      return NextResponse.json({ status: 'success', requestNumber: reqNumber });
    }

    if (action === 'addItem') {
      const {
        productName,
        productCode,
        categoryId = 1,
        quantity = 1000,
        unitPrice = 10.0,
        warehouseId = 1,
        unit = 'kg',
      } = body;

      const code = productCode || `RAW-${Date.now().toString().slice(-4)}`;

      // Insert product
      const prodRes = await query(
        `INSERT INTO products (product_name, product_code, category_id, unit, is_active, created_at)
         VALUES ($1, $2, $3, $4, true, NOW())
         RETURNING product_id, product_name, product_code`,
        [productName, code, categoryId, unit]
      );

      const createdProduct = prodRes.rows[0];

      // Insert initial stock
      await query(
        `INSERT INTO inventory_stock (product_id, warehouse_id, current_quantity, unit_cost, inventory_value, reorder_level, reorder_quantity, stock_status, updated_at)
         VALUES ($1, $2, $3, $4, $5, 200, 500, 'In Stock', NOW())`,
        [createdProduct.product_id, warehouseId, quantity, unitPrice, quantity * unitPrice]
      );

      return NextResponse.json({
        status: 'success',
        message: 'Product added and stock initialized in database successfully',
        product: createdProduct,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error handling inventory POST action:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
