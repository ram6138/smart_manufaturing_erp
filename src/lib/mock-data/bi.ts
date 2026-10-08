import {
  FactoryHealthScore,
  ExecutiveKpiData,
  OeeFactorData,
  ProductionIntelligenceData,
  MachineIntelligenceItem,
  QualityIntelligenceData,
  InventoryIntelligenceData,
  ProcurementIntelligenceData,
  WorkforceIntelligenceData,
  FinanceIntelligenceData,
  CrossModuleAnalysisItem,
  BusinessInsightItem,
  AiIntelligencePreviewCard,
  ManagementAlertItem,
} from "@/types/bi";

// 1. Executive 8 KPI Data Points
export const INITIAL_EXECUTIVE_KPIS: ExecutiveKpiData = {
  productionEfficiency: 91.4,
  oee: 81.2,
  qualityPassRate: 96.2,
  inventoryHealth: 88.5,
  machineAvailability: 93.1,
  onTimeDelivery: 91.8,
  workforceProductivity: 88.4,
  profitMargin: 19.1,
};

// 2. Factory Health Overview across 4 Major Areas
export const INITIAL_FACTORY_HEALTH: FactoryHealthScore[] = [
  {
    id: "fh_001",
    area: "Production",
    currentScore: 91,
    previousScore: 88,
    trend: "+3.4%",
    trendUp: true,
    status: "Healthy",
    summary: "Consistent throughput on Line-01 and high output fulfillment rate",
  },
  {
    id: "fh_002",
    area: "Quality",
    currentScore: 94,
    previousScore: 91,
    trend: "+3.3%",
    trendUp: true,
    status: "Healthy",
    summary: "Inspection pass rate holding at 96.2% with low sensory defect rates",
  },
  {
    id: "fh_003",
    area: "Operations",
    currentScore: 87,
    previousScore: 89,
    trend: "-2.2%",
    trendUp: false,
    status: "Watch",
    summary: "Packaging-02 downtime and wrapper stock reorder trigger monitoring",
  },
  {
    id: "fh_004",
    area: "Finance",
    currentScore: 82,
    previousScore: 84,
    trend: "-2.4%",
    trendUp: false,
    status: "Watch",
    summary: "Elevated thermal sensor maintenance parts expenses & raw material inflation",
  },
];

// 3. OEE Calculation: Availability (93%) × Performance (91%) × Quality (96%) = 81.2%
export const INITIAL_OEE_FACTORS: OeeFactorData = {
  availability: 0.93,
  performance: 0.91,
  quality: 0.96,
  oee: 81.2,
  trend: [
    { month: "May 26", availability: 91.2, performance: 88.5, quality: 95.0, oee: 76.7 },
    { month: "Jun 26", availability: 92.0, performance: 89.2, quality: 95.4, oee: 78.3 },
    { month: "Jul 26", availability: 92.5, performance: 90.0, quality: 95.8, oee: 79.7 },
    { month: "Aug 26", availability: 91.8, performance: 89.8, quality: 95.5, oee: 78.7 },
    { month: "Sep 26", availability: 92.8, performance: 90.4, quality: 96.0, oee: 80.5 },
    { month: "Oct 26", availability: 93.0, performance: 91.0, quality: 96.0, oee: 81.2 },
  ],
};

// 4. Production Intelligence
export const INITIAL_PRODUCTION_INTELLIGENCE: ProductionIntelligenceData = {
  plannedProduction: 150000,
  actualProduction: 142500,
  productionEfficiency: 95.0,
  rejectionRate: 2.28,
  downtimeHours: 18.6,
  completedOrdersCount: 14,
  trend: [
    { period: "Week 1", planned: 37500, actual: 36200, efficiency: 96.5 },
    { period: "Week 2", planned: 37500, actual: 35100, efficiency: 93.6 },
    { period: "Week 3", planned: 37500, actual: 35800, efficiency: 95.5 },
    { period: "Week 4", planned: 37500, actual: 35400, efficiency: 94.4 },
  ],
  productBreakdown: [
    { productName: "Classic Butter Biscuit", planned: 68000, actual: 65000, efficiency: 95.6, rejectionRate: 1.8 },
    { productName: "Chocolate Biscuit", planned: 45000, actual: 42000, efficiency: 93.3, rejectionRate: 4.2 },
    { productName: "Marie Biscuit", planned: 58000, actual: 55000, efficiency: 94.8, rejectionRate: 1.9 },
    { productName: "Coconut Biscuit", planned: 32000, actual: 30000, efficiency: 93.8, rejectionRate: 2.1 },
    { productName: "Cream Biscuit", planned: 30000, actual: 28000, efficiency: 93.3, rejectionRate: 2.6 },
    { productName: "Salted Biscuit", planned: 26000, actual: 25000, efficiency: 96.2, rejectionRate: 1.5 },
  ],
};

// 5. Machine Intelligence
export const INITIAL_MACHINE_INTELLIGENCE: MachineIntelligenceItem[] = [
  {
    id: "m_001",
    machine: "Baking Oven 1",
    availability: 96.5,
    utilization: 92.0,
    downtime: 4.2,
    risk: "Low",
    maintenanceStatus: "Operational",
  },
  {
    id: "m_002",
    machine: "Packaging Machine 1",
    availability: 94.0,
    utilization: 88.0,
    downtime: 6.5,
    risk: "Low",
    maintenanceStatus: "Operational",
  },
  {
    id: "m_003",
    machine: "Mixer 1",
    availability: 95.2,
    utilization: 85.0,
    downtime: 5.1,
    risk: "Low",
    maintenanceStatus: "Operational",
  },
  {
    id: "m_004",
    machine: "Baking Oven 2",
    availability: 89.4,
    utilization: 82.0,
    downtime: 14.8,
    risk: "High",
    maintenanceStatus: "Warning",
  },
  {
    id: "m_005",
    machine: "Packaging Machine 2",
    availability: 88.5,
    utilization: 78.0,
    downtime: 16.2,
    risk: "Medium",
    maintenanceStatus: "Scheduled",
  },
];

// 6. Quality Intelligence
export const INITIAL_QUALITY_INTELLIGENCE: QualityIntelligenceData = {
  passRate: 96.2,
  rejectionRate: 2.3,
  defectRate: 1.5,
  openDefects: 12,
  qualityScore: 94.8,
  defectDistribution: [
    { defectType: "Burnt Product", count: 48, percentage: 38.0, color: "#ef4444" },
    { defectType: "Broken Product", count: 35, percentage: 28.0, color: "#f59e0b" },
    { defectType: "Incorrect Weight", count: 25, percentage: 20.0, color: "#06b6d4" },
    { defectType: "Packaging Defect", count: 18, percentage: 14.0, color: "#a855f7" },
  ],
  productQuality: [
    { productName: "Classic Butter Biscuit", inspected: 66200, passed: 65000, rejected: 1200, passRate: 98.2 },
    { productName: "Marie Biscuit", inspected: 56100, passed: 55000, rejected: 1100, passRate: 98.0 },
    { productName: "Coconut Biscuit", inspected: 30800, passed: 30000, rejected: 800, passRate: 97.4 },
    { productName: "Cream Biscuit", inspected: 28900, passed: 28000, rejected: 900, passRate: 96.9 },
    { productName: "Salted Biscuit", inspected: 25600, passed: 25000, rejected: 600, passRate: 97.7 },
    { productName: "Chocolate Biscuit", inspected: 44200, passed: 42000, rejected: 2200, passRate: 95.0 },
  ],
  trend: [
    { date: "Sep 05", passRate: 95.4, defectRate: 1.8 },
    { date: "Sep 12", passRate: 95.8, defectRate: 1.6 },
    { date: "Sep 19", passRate: 96.0, defectRate: 1.5 },
    { date: "Sep 26", passRate: 96.4, defectRate: 1.4 },
    { date: "Oct 01", passRate: 96.2, defectRate: 1.5 },
  ],
};

// 7. Inventory Intelligence
// Available Stock = Quantity On Hand (38,400) - Quantity Reserved (6,800) = 31,600
export const INITIAL_INVENTORY_INTELLIGENCE: InventoryIntelligenceData = {
  inventoryValue: 4850000,
  totalOnHand: 38400,
  totalReserved: 6800,
  availableStock: 31600,
  lowStockItems: 3,
  criticalStockItems: 1,
  overstockItems: 2,
  healthCategories: [
    { category: "Healthy", count: 42, percentage: 82.0, color: "#10b981" },
    { category: "Low Stock", count: 5, percentage: 10.0, color: "#f59e0b" },
    { category: "Critical", count: 2, percentage: 4.0, color: "#ef4444" },
    { category: "Overstock", count: 2, percentage: 4.0, color: "#3b82f6" },
  ],
  trend: [
    { month: "Jun", received: 18500, consumed: 17200, onHand: 34200 },
    { month: "Jul", received: 21000, consumed: 19800, onHand: 35400 },
    { month: "Aug", received: 19500, consumed: 18900, onHand: 36000 },
    { month: "Sep", received: 22400, consumed: 21100, onHand: 37300 },
    { month: "Oct", received: 23200, consumed: 22100, onHand: 38400 },
  ],
};

// 8. Procurement Intelligence
export const INITIAL_PROCUREMENT_INTELLIGENCE: ProcurementIntelligenceData = {
  procurementSpend: 1850000,
  activePurchaseOrders: 16,
  pendingRequests: 4,
  overdueOrders: 1,
  onTimeDelivery: 91.8,
  supplierCount: 4,
  spendCategories: [
    { category: "Raw Materials", amount: 980000, percentage: 53.0, color: "#06b6d4" },
    { category: "Packaging", amount: 460000, percentage: 25.0, color: "#a855f7" },
    { category: "Spare Parts", amount: 185000, percentage: 10.0, color: "#f59e0b" },
    { category: "Maintenance", amount: 130000, percentage: 7.0, color: "#10b981" },
    { category: "Operations", amount: 95000, percentage: 5.0, color: "#64748b" },
  ],
  spendTrend: [
    { month: "Jun", spend: 1620000, posCount: 12 },
    { month: "Jul", spend: 1750000, posCount: 15 },
    { month: "Aug", spend: 1680000, posCount: 14 },
    { month: "Sep", spend: 1820000, posCount: 17 },
    { month: "Oct", spend: 1850000, posCount: 16 },
  ],
};

// 9. Workforce Intelligence
export const INITIAL_WORKFORCE_INTELLIGENCE: WorkforceIntelligenceData = {
  totalEmployees: 86,
  attendanceRate: 86.0,
  workforceProductivity: 88.4,
  overtimeHours: 126,
  workforceUtilization: 90.7,
  openWorkforceGaps: 3,
  departmentProductivity: [
    { department: "Quality", productivity: 95.8, headcount: 10, color: "#06b6d4" },
    { department: "Maintenance", productivity: 94.0, headcount: 8, color: "#f59e0b" },
    { department: "Procurement", productivity: 93.4, headcount: 4, color: "#ec4899" },
    { department: "Production", productivity: 91.4, headcount: 30, color: "#10b981" },
    { department: "Warehouse", productivity: 91.0, headcount: 8, color: "#3b82f6" },
    { department: "Packaging", productivity: 88.6, headcount: 20, color: "#a855f7" },
  ],
};

// 10. Finance Intelligence
export const INITIAL_FINANCE_INTELLIGENCE: FinanceIntelligenceData = {
  revenue: 8500000,
  totalExpenses: 6870000,
  productionCost: 4200000,
  procurementCost: 1850000,
  grossProfit: 1630000,
  profitMargin: 19.1,
  pendingPayments: 650000,
  trend: [
    { month: "May 26", revenue: 8100000, expenses: 6450000, profit: 1650000 },
    { month: "Jun 26", revenue: 7800000, expenses: 6300000, profit: 1500000 },
    { month: "Jul 26", revenue: 8300000, expenses: 6600000, profit: 1700000 },
    { month: "Aug 26", revenue: 8050000, expenses: 6520000, profit: 1530000 },
    { month: "Sep 26", revenue: 8400000, expenses: 6780000, profit: 1620000 },
    { month: "Oct 26", revenue: 8500000, expenses: 6870000, profit: 1630000 },
  ],
  costBreakdown: [
    { category: "Raw Materials", amount: 2450000, percentage: 35.7, color: "#06b6d4" },
    { category: "Labor Cost", amount: 1450000, percentage: 21.1, color: "#10b981" },
    { category: "Packaging Materials", amount: 980000, percentage: 14.3, color: "#a855f7" },
    { category: "Machine Maintenance", amount: 680000, percentage: 9.9, color: "#f59e0b" },
    { category: "Utilities", amount: 560000, percentage: 8.2, color: "#3b82f6" },
    { category: "Logistics", amount: 430000, percentage: 6.3, color: "#ec4899" },
    { category: "Other Overheads", amount: 320000, percentage: 4.5, color: "#64748b" },
  ],
};

// 11. Cross-Module Analysis Linkages (6 Core Inter-Module Dynamics)
export const INITIAL_CROSS_MODULE_ANALYSIS: CrossModuleAnalysisItem[] = [
  {
    id: "cma_001",
    relationship: "Production → Inventory",
    sourceModule: "Production",
    targetModule: "Inventory",
    title: "Raw Material Consumption Acceleration",
    description: "Raw material consumption increased 8% this period due to high-speed batch runs on Line-01.",
    impactLevel: "Warning",
    metricImpact: "+8.2% Flour & Sugar draw rate",
  },
  {
    id: "cma_002",
    relationship: "Production → Quality",
    sourceModule: "Production",
    targetModule: "Quality",
    title: "Chocolate Biscuit High-Volume Rejection",
    description: "Chocolate Biscuit rejection rate increased after higher production volume throughput caused dough nozzle clogging.",
    impactLevel: "Warning",
    metricImpact: "4.2% rejection vs 2.1% baseline",
  },
  {
    id: "cma_003",
    relationship: "Machines → Production",
    sourceModule: "Machines",
    targetModule: "Production",
    title: "Baking Oven 2 Thermal Downtime Loss",
    description: "Baking Oven 2 thermocouple downtime contributed to 3.4% overall production volume loss on Line-02.",
    impactLevel: "Critical",
    metricImpact: "14.8 downtime hours logged",
  },
  {
    id: "cma_004",
    relationship: "Procurement → Inventory",
    sourceModule: "Procurement",
    targetModule: "Inventory",
    title: "Packaging Wrapper Replenishment Delay",
    description: "Wrapper stock replenishment from Eastern Packaging is delayed by 3 days, risking secondary flow wrapping buffer.",
    impactLevel: "Warning",
    metricImpact: "1 overdue supplier PO pending",
  },
  {
    id: "cma_005",
    relationship: "Workforce → Production",
    sourceModule: "Workforce",
    targetModule: "Production",
    title: "Line-02 Manning Shortage Output Dip",
    description: "Line-02 productivity decreased during understaffed shifts (11 operators assigned vs 13 required standard).",
    impactLevel: "Warning",
    metricImpact: "-15.4% shift volume variance",
  },
  {
    id: "cma_006",
    relationship: "Finance → Operations",
    sourceModule: "Finance",
    targetModule: "Operations",
    title: "Emergency Maintenance Expense Spike",
    description: "Maintenance expenses increased 12% compared with the previous period due to emergency thermal sensors and suction belts.",
    impactLevel: "Neutral",
    metricImpact: "₹6.8L vs ₹6.0L monthly budget",
  },
];

// 12. Business Insights (8 Simulated Analytical Findings)
export const INITIAL_BUSINESS_INSIGHTS: BusinessInsightItem[] = [
  {
    id: "bi_001",
    category: "Production Efficiency",
    severity: "Info",
    description: "Production efficiency improved compared with the previous period, reaching 95.0% on continuous tunnel baking lines.",
    relatedModule: "Production",
    recommendedAction: "Standardize pre-heating ramp routines across secondary baking deck.",
    timestamp: "1 hour ago",
  },
  {
    id: "bi_002",
    category: "Equipment Reliability",
    severity: "High",
    description: "Packaging Machine 2 shows higher downtime (16.2h) than other packaging equipment due to carton flap jamming.",
    relatedModule: "Machines",
    recommendedAction: "Schedule mechanical blade alignment and pneumatic suction cup replacement.",
    timestamp: "2 hours ago",
  },
  {
    id: "bi_003",
    category: "Material Consumption",
    severity: "Medium",
    description: "Packaging material consumption is increasing with production volume, with printed BOPP roll inventory approaching safety thresholds.",
    relatedModule: "Inventory",
    recommendedAction: "Trigger early vendor delivery release with Eastern Packaging Solutions.",
    timestamp: "3 hours ago",
  },
  {
    id: "bi_004",
    category: "Quality Defect Pareto",
    severity: "Medium",
    description: "Quality defects are concentrated in a small number of defect categories (Burnt Product and Broken Biscuits account for 66% of all defects).",
    relatedModule: "Quality",
    recommendedAction: "Adjust Zone 3 radiant burner temperature offsets and conveyor transfer radius.",
    timestamp: "4 hours ago",
  },
  {
    id: "bi_005",
    category: "Procurement Lead Time",
    severity: "Medium",
    description: "Procurement delays may affect selected packaging materials if freight transit times increase over weekend cycles.",
    relatedModule: "Procurement",
    recommendedAction: "Maintain a minimum 7-day safety buffer on 250g Master Cartons.",
    timestamp: "5 hours ago",
  },
  {
    id: "bi_006",
    category: "Labor Overhead",
    severity: "Low",
    description: "Overtime increased in production operations (126 total hours logged) across Maintenance and Line-01 changeovers.",
    relatedModule: "Workforce",
    recommendedAction: "Optimize changeover cleaning SOP to reduce post-shift extension hours.",
    timestamp: "6 hours ago",
  },
  {
    id: "bi_007",
    category: "Cost Anomaly",
    severity: "Medium",
    description: "Maintenance costs increased during the current period (+12% MoM) following unexpected thermal sensor replacements.",
    relatedModule: "Finance",
    recommendedAction: "Incorporate vibration & thermal telemetry audit before purchasing non-standard replacement parts.",
    timestamp: "1 day ago",
  },
  {
    id: "bi_008",
    category: "Product Quality Variance",
    severity: "High",
    description: "Chocolate Biscuit production shows higher rejection (4.2%) compared with selected products like Classic Butter (1.8%).",
    relatedModule: "Production & Quality",
    recommendedAction: "Audit cocoa batter viscosity and dough cooling tunnel humidity parameters.",
    timestamp: "1 day ago",
  },
];

// 13. AI Intelligence Capability Preview Cards (Explicitly Prototype AI Capabilities)
export const INITIAL_AI_PREVIEWS: AiIntelligencePreviewCard[] = [
  {
    id: "ai_001",
    title: "Predictive Maintenance",
    status: "Prototype AI Capability",
    description: "Machine failure risk can be evaluated using sensor trends, vibration spectrograms, and thermal telemetry.",
    potentialValue: "Estimated 35% reduction in unplanned line halts",
    forecastType: "Remaining Useful Life (RUL) Modeling",
    iconName: "Activity",
  },
  {
    id: "ai_002",
    title: "Quality Anomaly Detection",
    status: "Prototype AI Capability",
    description: "Future AI can detect unusual rejection patterns, visual surface imperfections, and color variances in real-time.",
    potentialValue: "99.2% automated AQL detection accuracy",
    forecastType: "Vision & Statistical Process Control (SPC)",
    iconName: "ShieldCheck",
  },
  {
    id: "ai_003",
    title: "Production Forecast",
    status: "Prototype AI Capability",
    description: "Machine learning algorithms can forecast batch completion times and dynamic bottleneck shifting across shifts.",
    potentialValue: "+4.5% line scheduling throughput gain",
    forecastType: "Time-Series Batch Optimization",
    iconName: "TrendingUp",
  },
  {
    id: "ai_004",
    title: "Inventory Demand Forecast",
    status: "Prototype AI Capability",
    description: "Future forecasting models can estimate upcoming raw material requirements based on seasonal sales velocity.",
    potentialValue: "22% reduction in safety stock holding costs",
    forecastType: "ARIMA & Transformer Demand Forecasting",
    iconName: "Package",
  },
  {
    id: "ai_005",
    title: "Cost Anomaly Detection",
    status: "Prototype AI Capability",
    description: "Machine learning models can identify abnormal utility spikes, tariff variances, and scrap cost outliers.",
    potentialValue: "Immediate notification of cost leaks > ₹25,000",
    forecastType: "Fiscal Unsupervised Clustering",
    iconName: "IndianRupee",
  },
  {
    id: "ai_006",
    title: "Workforce Forecast",
    status: "Prototype AI Capability",
    description: "Predict upcoming staffing shortages, absenteeism trends, and optimum shift distribution schedules.",
    potentialValue: "Zero unstaffed machine shifts",
    forecastType: "Heuristic Roster Optimization",
    iconName: "Users",
  },
];

// 14. Management Alerts
export const INITIAL_MANAGEMENT_ALERTS: ManagementAlertItem[] = [
  {
    id: "ma_001",
    severity: "High",
    module: "Machines",
    description: "Baking Oven 2 maintenance risk requires immediate review due to thermal sensor deviations.",
    recommendedAction: "Conduct emergency thermal inspection during scheduled oven cool-down window.",
    targetSection: "machines",
    timestamp: "25 mins ago",
  },
  {
    id: "ma_002",
    severity: "Medium",
    module: "Procurement",
    description: "Packaging material replenishment from Eastern Packaging is delayed by 3 business days.",
    recommendedAction: "Re-route master carton buffer from Secondary Storage bay.",
    targetSection: "procurement",
    timestamp: "1 hour ago",
  },
  {
    id: "ma_003",
    severity: "Medium",
    module: "Quality",
    description: "Chocolate Biscuit production rejection rate increased to 4.2% on Line-02.",
    recommendedAction: "Calibrate dough extrusion pressure and inspect cutter blade clearance.",
    targetSection: "quality",
    timestamp: "2 hours ago",
  },
  {
    id: "ma_004",
    severity: "Low",
    module: "Workforce",
    description: "Workforce overtime increased across Maintenance & Line-01 changeover crews (126h).",
    recommendedAction: "Rotate next changeover roster with General Shift technician pool.",
    targetSection: "workforce",
    timestamp: "4 hours ago",
  },
];
