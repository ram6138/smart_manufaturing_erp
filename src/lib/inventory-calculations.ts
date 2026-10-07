import {
  ComputedInventoryItem,
  InventoryItem,
  InventoryStatus,
} from "@/types/inventory";

/**
 * Calculates dynamic fields according to strict ERP business logic:
 * - Available Quantity = quantityOnHand - reservedQuantity
 * - Stock Value = quantityOnHand * unitCost
 * - Status logic:
 *   - Available Quantity > Reorder Level: Healthy (or Overstock if Qty On Hand > 2x Normal)
 *   - Available Quantity <= Reorder Level (and > 50% of Reorder Level): Low Stock
 *   - Available Quantity <= 50% of Reorder Level: Critical
 *   - Quantity On Hand significantly above normal stock level: Overstock
 */
export function computeInventoryItem(item: InventoryItem): ComputedInventoryItem {
  const availableQuantity = Math.max(0, item.quantityOnHand - item.reservedQuantity);
  const stockValue = Number((item.quantityOnHand * item.unitCost).toFixed(2));

  let status: InventoryStatus = "Healthy";

  if (availableQuantity <= item.reorderLevel * 0.5) {
    status = "Critical";
  } else if (availableQuantity <= item.reorderLevel) {
    status = "Low Stock";
  } else if (item.quantityOnHand >= item.normalStockLevel * 2.2) {
    status = "Overstock";
  } else {
    status = "Healthy";
  }

  return {
    ...item,
    availableQuantity,
    stockValue,
    status,
  };
}

export function computeAllInventoryItems(items: InventoryItem[]): ComputedInventoryItem[] {
  return items.map(computeInventoryItem);
}
