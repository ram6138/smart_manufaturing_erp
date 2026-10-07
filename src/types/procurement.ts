// Matches PostgreSQL Schema Entities for Procurement Module

export type RequestStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Converted to PO";

export type RequestPriority = "Low" | "Normal" | "High" | "Urgent";

export type SupplierStatus = "Active" | "On Hold" | "Inactive";

export type POStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Confirmed"
  | "Ordered"
  | "Partially Received"
  | "Received"
  | "Cancelled";

export type PODeliveryStatus = "Not Shipped" | "In Transit" | "Delivered" | "Delayed";

export type POPaymentStatus = "Pending" | "Partially Paid" | "Paid";

export type MaterialCategory =
  | "Raw Materials"
  | "Packaging"
  | "Spare Parts"
  | "Maintenance"
  | "Operations";

export type MaterialProcurementState =
  | "Sufficient"
  | "Reorder Required"
  | "On Order"
  | "Delayed"
  | "Critical";

// Purchase Requisition item
export interface PurchaseRequest {
  id: string;
  requestId: string; // e.g. PR-2026-0042
  requestedBy: string;
  department: string; // e.g. Production, Maintenance, Packaging, QA/QC, Inventory
  material: string; // e.g. Wheat Flour, Sugar, Biscuit Wrapper
  category: MaterialCategory;
  quantity: number;
  unit: string; // kg, boxes, rolls, units, liters
  requiredDate: string; // ISO string
  estimatedUnitCost: number;
  estimatedTotalCost: number;
  priority: RequestPriority;
  status: RequestStatus;
  supplierPreference?: string;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  convertedPoId?: string;
}

// Supplier Item
export interface SupplierItem {
  id: string;
  supplierCode: string; // e.g. SUP-001
  supplierName: string; // e.g. Odisha Agro Foods Pvt Ltd
  category: MaterialCategory;
  contactPerson: string;
  phone: string;
  email: string;
  rating: number; // 1 - 5 stars
  totalOrders: number;
  onTimeDeliveryRate: number; // %
  qualityScore: number; // %
  averageLeadTimeDays: number;
  totalSpend: number;
  status: SupplierStatus;
  city: string;
}

// Purchase Order Line Item
export interface POLineItem {
  id: string;
  material: string;
  category: MaterialCategory;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  taxPercent: number;
  totalPrice: number;
}

// Purchase Order
export interface PurchaseOrderItem {
  id: string;
  poNumber: string; // e.g. PO-2026-0081
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  paymentTerms: string; // e.g. Net 30, Advance 50%, Net 45
  buyer: string; // e.g. Rajesh Sharma (Procurement Head)
  items: POLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: POPaymentStatus;
  deliveryStatus: PODeliveryStatus;
  poStatus: POStatus;
  notes?: string;
  rejectionReason?: string;
}

// Procurement Alert
export interface ProcurementAlert {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  relatedEntity: string; // PO-2026-014 or PR-2026-0042
  entityType: "PO" | "PR" | "Material" | "Supplier";
  reason: string;
  recommendedAction: string;
  timestamp: string;
}

// Material Procurement Status Row (connects with Inventory/Production)
export interface MaterialProcurementRow {
  id: string;
  materialName: string;
  category: MaterialCategory;
  currentStock: number;
  requiredQuantity: number;
  onOrderQuantity: number;
  pendingQuantity: number;
  unit: string;
  expectedDelivery: string;
  status: MaterialProcurementState;
  primarySupplier: string;
}

// Spend Trend Point
export interface ProcurementSpendTrendPoint {
  period: string; // e.g. "May", "Jun", "Jul", or "Week 1"
  purchaseSpend: number;
  approvedSpend: number;
  pendingSpend: number;
}

// Category Analytics
export interface CategorySpendPoint {
  category: MaterialCategory;
  spend: number;
  orderCount: number;
  color: string;
}

// Filter States
export interface PurchaseRequestFilterState {
  searchQuery: string;
  department: string;
  status: string;
  priority: string;
  material: string;
}

export interface PurchaseOrderFilterState {
  searchQuery: string;
  supplier: string;
  poStatus: string;
  deliveryStatus: string;
  paymentStatus: string;
}
