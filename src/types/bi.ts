// Business Intelligence (BI) Domain Entities & Cross-Module Intelligence Types

export type PeriodType =
  | "Today"
  | "This Week"
  | "This Month"
  | "Last 30 Days"
  | "Last 90 Days"
  | "This Year";

export type HealthStatus = "Healthy" | "Watch" | "Attention Required";

// Factory Health Overview
export interface FactoryHealthScore {
  id: string;
  area: "Production" | "Quality" | "Operations" | "Finance";
  currentScore: number;
  previousScore: number;
  trend: string;
  trendUp: boolean;
  status: HealthStatus;
  summary: string;
}

// Executive KPI Metrics
export interface ExecutiveKpiData {
  productionEfficiency: number; // 91.4%
  oee: number; // 81.2%
  qualityPassRate: number; // 96.2%
  inventoryHealth: number; // 88.5%
  machineAvailability: number; // 93.1%
  onTimeDelivery: number; // 91.8%
  workforceProductivity: number; // 88.4%
  profitMargin: number; // 19.1%
}

// OEE 3-Factor Breakdown
export interface OeeFactorData {
  availability: number; // 0.93 -> 93.0%
  performance: number; // 0.91 -> 91.0%
  quality: number; // 0.96 -> 96.0%
  oee: number; // 0.93 * 0.91 * 0.96 = 81.2%
  trend: Array<{
    month: string;
    availability: number;
    performance: number;
    quality: number;
    oee: number;
  }>;
}

// Production Intelligence
export interface ProductionIntelligenceData {
  plannedProduction: number;
  actualProduction: number;
  productionEfficiency: number;
  rejectionRate: number;
  downtimeHours: number;
  completedOrdersCount: number;
  trend: Array<{
    period: string;
    planned: number;
    actual: number;
    efficiency: number;
  }>;
  productBreakdown: Array<{
    productName: string;
    planned: number;
    actual: number;
    efficiency: number;
    rejectionRate: number;
  }>;
}

// Machine Intelligence
export interface MachineIntelligenceItem {
  id: string;
  machine: string;
  availability: number;
  utilization: number;
  downtime: number; // hours
  risk: "Low" | "Medium" | "High";
  maintenanceStatus: "Operational" | "Scheduled" | "Overdue" | "Warning";
}

// Quality Intelligence
export interface QualityIntelligenceData {
  passRate: number;
  rejectionRate: number;
  defectRate: number;
  openDefects: number;
  qualityScore: number;
  defectDistribution: Array<{
    defectType: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  productQuality: Array<{
    productName: string;
    inspected: number;
    passed: number;
    rejected: number;
    passRate: number;
  }>;
  trend: Array<{
    date: string;
    passRate: number;
    defectRate: number;
  }>;
}

// Inventory Intelligence
export interface InventoryIntelligenceData {
  inventoryValue: number;
  totalOnHand: number;
  totalReserved: number;
  availableStock: number; // onHand - reserved
  lowStockItems: number;
  criticalStockItems: number;
  overstockItems: number;
  healthCategories: Array<{
    category: "Healthy" | "Low Stock" | "Critical" | "Overstock";
    count: number;
    percentage: number;
    color: string;
  }>;
  trend: Array<{
    month: string;
    received: number;
    consumed: number;
    onHand: number;
  }>;
}

// Procurement Intelligence
export interface ProcurementIntelligenceData {
  procurementSpend: number;
  activePurchaseOrders: number;
  pendingRequests: number;
  overdueOrders: number;
  onTimeDelivery: number;
  supplierCount: number;
  spendCategories: Array<{
    category: "Raw Materials" | "Packaging" | "Spare Parts" | "Maintenance" | "Operations";
    amount: number;
    percentage: number;
    color: string;
  }>;
  spendTrend: Array<{
    month: string;
    spend: number;
    posCount: number;
  }>;
}

// Workforce Intelligence
export interface WorkforceIntelligenceData {
  totalEmployees: number;
  attendanceRate: number;
  workforceProductivity: number;
  overtimeHours: number;
  workforceUtilization: number;
  openWorkforceGaps: number;
  departmentProductivity: Array<{
    department: string;
    productivity: number;
    headcount: number;
    color: string;
  }>;
}

// Finance Intelligence
export interface FinanceIntelligenceData {
  revenue: number;
  totalExpenses: number;
  productionCost: number;
  procurementCost: number;
  grossProfit: number;
  profitMargin: number;
  pendingPayments: number;
  trend: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  costBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

// Cross-Module Analysis Link
export interface CrossModuleAnalysisItem {
  id: string;
  relationship: string; // e.g. "Production → Inventory"
  title: string;
  description: string;
  sourceModule: string;
  targetModule: string;
  impactLevel: "Positive" | "Warning" | "Critical" | "Neutral";
  metricImpact: string;
}

// Business Analytical Insights
export interface BusinessInsightItem {
  id: string;
  category: string;
  severity: "Info" | "Low" | "Medium" | "High";
  description: string;
  relatedModule: string;
  recommendedAction: string;
  timestamp: string;
}

// AI Intelligence Preview
export interface AiIntelligencePreviewCard {
  id: string;
  title: string;
  status: "Prototype AI Capability";
  description: string;
  potentialValue: string;
  forecastType: string;
  iconName: string;
}

// Management Alert
export interface ManagementAlertItem {
  id: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  module: string;
  description: string;
  recommendedAction: string;
  targetSection: string;
  timestamp: string;
}
