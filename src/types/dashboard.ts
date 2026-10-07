export interface KPICardData {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  previousValue?: string | number;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  isPositive: boolean; // whether "up" is good or bad (e.g., rejection rate up is bad)
  periodLabel: string;
  iconName: string;
  href?: string;
}

export interface ProductionTrendPoint {
  date: string;
  dayLabel: string;
  planned: number;
  actual: number;
  efficiency: number;
}

export interface ProductProductionItem {
  product: string;
  quantity: number;
  target: number;
  unit: string;
  share: number;
  fillColor: string;
}

export type MachineStatusType = "Running" | "Idle" | "Maintenance" | "Warning";

export interface MachineStatusItem {
  id: string;
  name: string;
  type: string;
  status: MachineStatusType;
  utilization: number; // percentage 0-100
  downtime: string; // e.g. "12 mins today" or "0 mins"
  temperature?: string;
  currentWorkOrder?: string;
}

export interface DefectTypeBreakdown {
  name: "Burnt Product" | "Broken Product" | "Incorrect Weight" | "Packaging Defect";
  count: number;
  percentage: number;
  color: string;
}

export interface QualityOverviewData {
  passedInspections: number;
  failedInspections: number;
  rejectionRate: number;
  totalDefects: number;
  inspectedBatches: number;
  defects: DefectTypeBreakdown[];
}

export type InventoryStatusType = "Healthy" | "Low Stock" | "Critical";

export interface InventoryAlertItem {
  id: string;
  material: string;
  category: string;
  availableQuantity: number;
  unit: string;
  reorderLevel: number;
  status: InventoryStatusType;
  stockPercentage: number; // calculated relative to optimal max
  daysOfSupplyRemaining: number;
}

export type OrderStatusType = "Scheduled" | "In Progress" | "Completed" | "Delayed";
export type OrderPriorityType = "Low" | "Normal" | "High" | "Urgent";

export interface ProductionOrderItem {
  id: string;
  orderNumber: string;
  product: string;
  plannedQuantity: number;
  producedQuantity: number;
  unit: string;
  efficiency: number;
  status: OrderStatusType;
  priority: OrderPriorityType;
  targetLine: string;
  dueDate: string;
}

export type AIInsightSeverity = "High" | "Medium" | "Low";

export interface AIInsightItem {
  id: string;
  title: string;
  severity: AIInsightSeverity;
  category: "Machine Uptime" | "Quality Variance" | "Material Consumption" | "Schedule Optimization";
  explanation: string;
  recommendedAction: string;
  impact: string;
  timestamp: string;
}

export type ActivityEventType = "production" | "quality" | "inventory" | "maintenance" | "procurement";

export interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: ActivityEventType;
  badgeText?: string;
}
