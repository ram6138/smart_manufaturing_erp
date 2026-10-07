import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch all customer orders with customer details
    const ordersRes = await query(`
      SELECT 
        o.order_id as id,
        o.order_number as "orderNumber",
        o.order_date as "orderDate",
        o.expected_delivery_date as "expectedDeliveryDate",
        COALESCE(o.order_status, 'Pending') as status,
        COALESCE(o.total_amount, 0)::float as "totalAmount",
        o.created_at as "createdAt",
        c.customer_id as "customerId",
        COALESCE(c.customer_name, 'Direct Client') as "customerName",
        c.email as "customerEmail",
        c.city as "customerCity"
      FROM customer_orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_id DESC;
    `);

    // 2. Fetch all order items with product details
    const itemsRes = await query(`
      SELECT 
        oi.order_item_id as id,
        oi.order_id as "orderId",
        oi.product_id as "productId",
        p.product_code as "productCode",
        p.product_name as "productName",
        p.unit,
        oi.ordered_quantity::float as quantity,
        oi.unit_price::float as "unitPrice",
        (oi.ordered_quantity * oi.unit_price)::float as "totalPrice"
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id;
    `);

    // 3. Fetch customer list & available products for order creation
    const customersRes = await query(`SELECT customer_id as id, customer_name as name, city, email FROM customers;`);
    const productsRes = await query(`
      SELECT 
        p.product_id as id, 
        p.product_code as code, 
        p.product_name as name, 
        p.unit,
        COALESCE(s.current_quantity, 0)::float as "stockAvailable",
        COALESCE(s.unit_cost * 1.5, 30.0)::float as "defaultPrice"
      FROM products p
      LEFT JOIN inventory_stock s ON p.product_id = s.product_id;
    `);

    // Attach items to their respective orders
    const ordersWithItems = ordersRes.rows.map((order: any) => ({
      ...order,
      items: itemsRes.rows.filter((item: any) => item.orderId === order.id),
    }));

    return NextResponse.json({
      status: 'success',
      orders: ordersWithItems,
      customers: customersRes.rows,
      products: productsRes.rows,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, customerName, items, expectedDays = 7 } = body;

    // 1. Resolve or create customer
    let resolvedCustomerId = customerId;
    if (!resolvedCustomerId && customerName) {
      const existingCust = await query(`SELECT customer_id FROM customers WHERE customer_name = $1`, [customerName]);
      if (existingCust.rows.length > 0) {
        resolvedCustomerId = existingCust.rows[0].customer_id;
      } else {
        const newCust = await query(
          `INSERT INTO customers (customer_name, city, created_at) VALUES ($1, 'Regional Hub', NOW()) RETURNING customer_id`,
          [customerName]
        );
        resolvedCustomerId = newCust.rows[0].customer_id;
      }
    }

    if (!resolvedCustomerId) {
      resolvedCustomerId = 1; // Default to ABC Retail Pvt Ltd
    }

    // 2. Generate unique Order Number (e.g. ORD-0008)
    const maxRes = await query(`SELECT COALESCE(MAX(order_id), 0) as max_id FROM customer_orders;`);
    const nextId = parseInt(maxRes.rows[0].max_id, 10) + 1;
    let orderNumber = `ORD-${String(nextId).padStart(4, '0')}`;
    
    // Safety check against existing order_number
    const numCheck = await query(`SELECT 1 FROM customer_orders WHERE order_number = $1`, [orderNumber]);
    if (numCheck.rows.length > 0) {
      orderNumber = `ORD-${nextId}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // 3. Compute total amount
    let totalAmount = 0;
    const lineItems = items && items.length > 0 ? items : [
      { productId: 1, quantity: 1000, unitPrice: 25.00 } // Default: 1,000 packets of Biscuit - Coconut
    ];

    lineItems.forEach((it: any) => {
      totalAmount += (it.quantity || 1000) * (it.unitPrice || 25.00);
    });

    // 4. Insert into `customer_orders`
    const orderInsert = await query(`
      INSERT INTO customer_orders 
        (order_number, customer_id, order_date, expected_delivery_date, order_status, total_amount, created_at)
      VALUES 
        ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '${expectedDays} days', 'Confirmed', $3, NOW())
      RETURNING order_id, order_number, total_amount;
    `, [orderNumber, resolvedCustomerId, totalAmount]);

    const createdOrder = orderInsert.rows[0];

    // 5. Insert line items into `order_items`
    for (const item of lineItems) {
      await query(`
        INSERT INTO order_items (order_id, product_id, ordered_quantity, unit_price)
        VALUES ($1, $2, $3, $4);
      `, [createdOrder.order_id, item.productId || 1, item.quantity || 1000, item.unitPrice || 25.00]);
    }

    // 6. Optional: Log dispatch / reservation transaction in `inventory_transactions`
    for (const item of lineItems) {
      await query(`
        INSERT INTO inventory_transactions 
          (transaction_date, product_id, warehouse_id, transaction_type, transaction_quantity, created_at)
        VALUES (NOW(), $1, 2, 'Sales Order Allocation', $2, NOW());
      `, [item.productId || 1, item.quantity || 1000]);
    }

    return NextResponse.json({
      status: 'success',
      message: `Customer Order ${orderNumber} placed successfully in PostgreSQL!`,
      order: {
        id: createdOrder.order_id,
        orderNumber: createdOrder.order_number,
        totalAmount,
        itemCount: lineItems.length,
        totalPackets: lineItems.reduce((acc: number, cur: any) => acc + (cur.quantity || 0), 0),
      },
    });
  } catch (error: any) {
    console.error('Error placing customer order:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Delete associated line items first (referential integrity)
    await query(`DELETE FROM order_items WHERE order_id = $1`, [orderId]);

    // 2. Delete the order header
    const delRes = await query(`DELETE FROM customer_orders WHERE order_id = $1 RETURNING order_number`, [orderId]);

    if (delRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: `Order ${delRes.rows[0].order_number} has been deleted from PostgreSQL successfully!`,
      orderNumber: delRes.rows[0].order_number,
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, newStatus } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Order ID and newStatus are required' }, { status: 400 });
    }

    const updateRes = await query(
      `UPDATE customer_orders 
       SET order_status = $1 
       WHERE order_id = $2 
       RETURNING order_id, order_number, order_status`,
      [newStatus, orderId]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: `Order ${updateRes.rows[0].order_number} status updated to '${newStatus}' in PostgreSQL!`,
      order: updateRes.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}


