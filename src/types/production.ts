// Matches PostgreSQL Schema Entities for Production Module

export type ProductionOrderStatus =
  | "Planned"
  | "Scheduled"
  | "Released"
  | "In Progress"
  | "Paused"
  | "Completed"
  | "Cancelled"
  | "Pending"
  | "Draft";

export type ProductionPriority = "Low" | "Normal" | "High" | "Urgent";

export type ProductionShift = "Morning" | "Evening" | "Night";

export interface MaterialRequirement {
  id: string;
  materialName: string;
  category: "Raw Material" | "Packaging";
  requiredQuantity: number;
  issuedQuantity: number;
  unit: string;
  status: "Fully Issued" | "Partially Issued" | "Pending";
}

// Maps to `production_orders` table
export interface ProductionOrder {
  id: string;
  orderNumber: string; // e.g. PROD-00001
  product: string; // e.g. Classic Butter Biscuit
  productSku: string; // e.g. SKU-CBB-01
  batchNumber: string; // e.g. BAT-2026-0901
  machine: string; // e.g. Baking Oven 1
  shift: ProductionShift;
  plannedQuantity: number;
  actualQuantity: number;
  goodQuantity: number;
  rejectedQuantity: number;
  unit: string; // units
  efficiency: number; // percentage
  rejectionRate: number; // percentage
  status: ProductionOrderStatus;
  priority: ProductionPriority;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  downtimeMinutes: number;
  notes?: string;
  materials: MaterialRequirement[];
  createdAt: string;
  updatedAt: string;
}

// Maps to `production_kpis`
export interface ProductionKPIData {
  plannedProduction: number;
  actualProduction: number;
  productionEfficiency: number;
  rejectedQuantity: number;
  downtimeHours: number;
  completedOrders: number;
  plannedChangePercent: number;
  actualChangePercent: number;
  efficiencyChangePercent: number;
  rejectedChangePercent: number;
  downtimeChangePercent: number;
  completedChangePercent: number;
}

// Maps to 7-day daily performance points
export interface DailyProductionPerformance {
  date: string;
  dayLabel: string;
  planned: number;
  actual: number;
  efficiency: number;
  targetEfficiency: number;
}

// Maps to `product_performance` summary
export interface ProductPerformanceItem {
  id: string;
  product: string;
  sku: string;
  plannedQuantity: number;
  actualQuantity: number;
  rejectedQuantity: number;
  efficiency: number;
  unit: string;
  fillColor: string;
}

// Maps to `machine_performance` summary
export interface MachinePerformanceItem {
  id: string;
  machine: string;
  type: string;
  productionQuantity: number;
  utilization: number; // %
  downtimeHours: number; // hours or minutes formatted
  efficiency: number; // %
  status: "Running" | "Idle" | "Maintenance" | "Warning";
  currentBatch?: string;
}

// Filter State interface
export interface ProductionFilterState {
  searchQuery: string;
  dateRange: string;
  product: string;
  machine: string;
  shift: string;
  status: string;
  priority: string;
}
