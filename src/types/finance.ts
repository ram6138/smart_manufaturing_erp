// Matches PostgreSQL Schema Entities for Manufacturing Finance Module

export type ExpenseCategory =
  | "Maintenance"
  | "Electricity"
  | "Salary"
  | "Logistics"
  | "Software"
  | "Utilities"
  | "Raw Materials"
  | "Packaging Materials"
  | "Other";

export type PaymentStatus = "Paid" | "Pending" | "Overdue";

export type InvoiceType = "Customer Invoice" | "Supplier Invoice";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Cancelled";

export type FinanceDepartment =
  | "Production"
  | "Quality"
  | "Maintenance"
  | "Inventory"
  | "Procurement"
  | "Workforce"
  | "Administration"
  | "Finance";

// Operational Expense Record
export interface ExpenseRecord {
  id: string;
  expenseId: string; // e.g. EXP-2026-101
  date: string;
  category: ExpenseCategory;
  department: FinanceDepartment;
  description: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  invoiceRef?: string;
}

// Product Production Cost Calculation
export interface ProductCostAnalysis {
  id: string;
  productName: string;
  unitsProduced: number;
  materialCost: number;
  laborCost: number;
  machineCost: number;
  totalCost: number;
  costPerUnit: number; // totalCost / unitsProduced
}

// Product-wise Profitability Analysis
export interface ProductProfitability {
  id: string;
  productName: string;
  revenue: number;
  productionCost: number;
  profit: number; // revenue - productionCost
  profitMargin: number; // (profit / revenue) * 100
  unitsSold: number;
}

// Department Budget Item
export interface DepartmentBudget {
  id: string;
  department: FinanceDepartment;
  allocatedBudget: number;
  usedAmount: number;
  remainingBudget: number;
  utilizationRate: number; // (usedAmount / allocatedBudget) * 100
  status: "Normal" | "Near Limit" | "Exceeded";
}

// Supplier Procurement Spending
export interface SupplierSpending {
  id: string;
  supplier: string;
  purchaseOrdersCount: number;
  totalSpend: number;
  paidAmount: number;
  pendingAmount: number;
  category: string;
}

// Invoice & Payment Item
export interface InvoiceRecord {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-401
  entityName: string; // Customer or Supplier name
  type: InvoiceType;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  notes?: string;
}

// 12-Month Revenue vs Expense Trend Point
export interface MonthlyFinancialTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number; // %
}

// Cost Breakdown Item
export interface CostCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// Monthly Cost Trend Point (for Cost Analysis)
export interface MonthlyCostPoint {
  month: string;
  rawMaterials: number;
  labor: number;
  maintenance: number;
  utilities: number;
  logistics: number;
}

// Cash Flow Item
export interface CashFlowPoint {
  month: string;
  incoming: number;
  outgoing: number;
  netCashFlow: number;
}

// Finance Operational Alert
export interface FinanceAlert {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  category: "Production Cost" | "Overdue Payment" | "Budget Overrun" | "Maintenance Expense" | "Cash Flow";
  reason: string;
  recommendedAction: string;
  timestamp: string;
}

// Filter State for Expenses & Invoices
export interface FinanceFilterState {
  searchQuery: string;
  dateRange: string;
  category: string;
  department: string;
  paymentStatus: string;
}
