// Matches PostgreSQL Schema Entities for Inventory Module

export type InventoryCategory = "Raw Materials" | "Packaging Materials";

export type InventoryStatus = "Healthy" | "Low Stock" | "Critical" | "Overstock";

export type InventoryTransactionType =
  | "Receipt"
  | "Production Consumption"
  | "Adjustment"
  | "Transfer"
  | "Return";

// Maps to `inventory_items` & `inventory_stock` joined in PostgreSQL
export interface InventoryItem {
  id: string;
  itemCode: string; // e.g. RM-FLOUR, PKG-WRAP
  itemName: string; // e.g. Wheat Flour
  category: InventoryCategory;
  warehouse: string; // e.g. Raw Material Warehouse
  warehouseId: string;
  unit: string; // kg, meters, pieces, bags
  quantityOnHand: number; // raw on-hand stock
  reservedQuantity: number; // reserved for scheduled production work orders
  reorderLevel: number;
  normalStockLevel: number;
  unitCost: number; // in USD or standard ERP currency
  locationBin: string; // e.g. Bin-A12, Rack-04
  minOrderQuantity: number;
  leadTimeDays: number;
  createdAt: string;
  updatedAt: string;
}

// Maps to `inventory_transactions` table
export interface InventoryTransaction {
  id: string;
  transactionId: string; // e.g. TRX-2026-0891
  date: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouse: string;
  transactionType: InventoryTransactionType;
  quantity: number; // positive for receipt/return, negative for consumption
  unit: string;
  reference: string; // e.g. PO-0042, PROD-00001, ADJ-082, TRF-019
  notes: string;
  performedBy: string;
}

// 7-day Stock Movement Trend Point
export interface InventoryTrendPoint {
  date: string;
  dayLabel: string;
  stockReceived: number;
  productionConsumption: number;
  currentStock: number;
}

// Category Distribution Summary
export interface StockCategorySummary {
  category: InventoryCategory;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
  color: string;
}

// Inventory Operational Alert
export interface InventoryAlert {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  category: InventoryCategory;
  availableQuantity: number;
  reorderLevel: number;
  unit: string;
  severity: "Critical" | "Warning" | "Info";
  status: InventoryStatus;
  message: string;
  recommendedAction:
    | "Create Purchase Request"
    | "Review Consumption"
    | "Check Upcoming Production"
    | "Redistribute Stock";
}

// Purchase Request Draft (connected to Procurement)
export interface PurchaseRequestDraft {
  id: string;
  itemCode: string;
  itemName: string;
  currentAvailableQuantity: number;
  reorderLevel: number;
  unit: string;
  requestedQuantity: number;
  reason: string;
  status: "Draft" | "Submitted";
  createdAt: string;
}

// Filter State interface
export interface InventoryFilterState {
  searchQuery: string;
  category: string;
  warehouse: string;
  status: string;
  dateRange: string;
}

// Calculated Item with dynamic Available Qty and Stock Value
export interface ComputedInventoryItem extends InventoryItem {
  availableQuantity: number; // quantityOnHand - reservedQuantity
  stockValue: number; // quantityOnHand * unitCost
  status: InventoryStatus;
}
