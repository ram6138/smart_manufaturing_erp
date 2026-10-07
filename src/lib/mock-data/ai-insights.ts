import {
  AiKpiSummary,
  AiFactoryHealthData,
  PriorityRecommendation,
  PredictiveMaintenanceItem,
  QualityAnomalyItem,
  ProductionForecastPoint,
  InventoryForecastItem,
  CostIntelligenceData,
  AiBusinessInsight,
} from "@/types/ai-insights";

// 1. Top KPI Summary Metrics
export const INITIAL_AI_KPIS: AiKpiSummary = {
  aiInsightsCount: 24,
  criticalAlertsCount: 3,
  predictedFailuresCount: 2,
  qualityAnomaliesCount: 8,
  costOpportunities: "₹1.8L",
  forecastAccuracy: "91.4%",
};

// 2. AI Factory Health Score
export const INITIAL_AI_FACTORY_HEALTH: AiFactoryHealthData = {
  overallScore: 87,
  status: "Healthy",
  breakdown: {
    production: 91,
    inventory: 86,
    machines: 82,
    quality: 94,
    workforce: 88,
    finance: 79,
  },
  summary:
    "Overall factory performance is healthy, but machine downtime and operating costs require attention.",
};

// 3. Priority Recommendations
export const INITIAL_PRIORITY_RECOMMENDATIONS: PriorityRecommendation[] = [
  {
    id: "rec-001",
    title: "Schedule maintenance for Packaging Machine 2",
    priority: "High",
    module: "Predictive Maintenance",
    aiFinding:
      "Temperature increased 15% over the last 5 days and the machine has shown a similar pattern before a previous breakdown.",
    recommendedAction:
      "Schedule preventive maintenance during the next planned downtime.",
    riskLevel: "High",
    expectedImpact: "Prevents an estimated 4.5 hours of unscheduled line stoppage and ₹65,000 in scrap.",
    confidence: 87,
    dataUsed: [
      "Thermal sensor readings (Line 2)",
      "Bearing vibration spectrum (100Hz)",
      "Historical breakdown logs (Aug - Sep)",
      "Continuous runtime telemetry (428 hrs)",
    ],
    primaryButtonLabel: "Schedule Maintenance",
    secondaryButtonLabel: "View Machine",
    routeTarget: "/machines",
  },
  {
    id: "rec-002",
    title: "Packaging material consumption is increasing",
    priority: "Medium",
    module: "Inventory",
    aiFinding:
      "Packaging material usage is 8% above the expected production requirement.",
    recommendedAction: "Review packaging waste and machine settings.",
    riskLevel: "Medium",
    expectedImpact: "Potential material recovery of ₹38,000 per month and reduction in sealing scrap.",
    confidence: 82,
    dataUsed: [
      "ERP BoM consumption logs",
      "Rotary seal tension telemetry",
      "Shift-wise packaging scrap tallies",
      "Lot tracking SKU-WRAP-09",
    ],
    primaryButtonLabel: "Analyze Usage",
    secondaryButtonLabel: "View Inventory",
    routeTarget: "/inventory",
  },
  {
    id: "rec-003",
    title: "Chocolate Biscuit rejection rate increased",
    priority: "Medium",
    module: "Quality",
    aiFinding:
      "Recent batches show an increase in rejected products.",
    recommendedAction:
      "Review quality inspection results and production parameters.",
    riskLevel: "Medium",
    expectedImpact: "Averts batch downgrade and stabilizes direct yield above 97.5%.",
    confidence: 79,
    dataUsed: [
      "Vision QA inspection defect records",
      "Oven Zone 3 baking temperature curve",
      "Batter viscosity and moisture tests",
      "Batch runs B-2026-881 to B-2026-887",
    ],
    primaryButtonLabel: "Analyze Batch",
    secondaryButtonLabel: "View Quality",
    routeTarget: "/quality",
  },
];

// 4. Predictive Maintenance Machine Table
export const INITIAL_PREDICTIVE_MAINTENANCE: PredictiveMaintenanceItem[] = [
  {
    id: "pm-01",
    machine: "Baking Oven 1",
    riskScore: 18,
    prediction: "Low Risk",
    mainSignal: "Normal temperature",
    recommendedAction: "Continue monitoring",
    telemetrySource: "Zones 1-4 Thermal Array",
    confidence: 94,
  },
  {
    id: "pm-02",
    machine: "Baking Oven 2",
    riskScore: 42,
    prediction: "Medium Risk",
    mainSignal: "Temperature variation",
    recommendedAction: "Inspect during next downtime",
    telemetrySource: "Zone 3 Thermocouple ΔT = 7.2°C",
    confidence: 88,
  },
  {
    id: "pm-03",
    machine: "Packaging Machine 1",
    riskScore: 31,
    prediction: "Medium Risk",
    mainSignal: "Increased vibration",
    recommendedAction: "Schedule inspection",
    telemetrySource: "Drive Shaft Accelerometer (1.8g)",
    confidence: 85,
  },
  {
    id: "pm-04",
    machine: "Packaging Machine 2",
    riskScore: 78,
    prediction: "High Risk",
    mainSignal: "High temperature + vibration",
    recommendedAction: "Schedule maintenance",
    telemetrySource: "Gearbox Bearing (82°C / 3.4g RMS)",
    confidence: 91,
  },
  {
    id: "pm-05",
    machine: "Mixer 1",
    riskScore: 12,
    prediction: "Low Risk",
    mainSignal: "Normal",
    recommendedAction: "Continue monitoring",
    telemetrySource: "Motor Current Load (24.1 A)",
    confidence: 96,
  },
];

// 5. Quality Anomaly Detection Data
export const INITIAL_QUALITY_SUMMARY = {
  overallQualityScore: 96.2,
  detectedAnomalies: 8,
};

export const QUALITY_REJECTION_TREND = [
  { date: "Sep 25", rejectionRate: 1.8, baseline: 2.0, upperThreshold: 3.5 },
  { date: "Sep 26", rejectionRate: 2.1, baseline: 2.0, upperThreshold: 3.5 },
  { date: "Sep 27", rejectionRate: 1.9, baseline: 2.0, upperThreshold: 3.5 },
  { date: "Sep 28", rejectionRate: 2.4, baseline: 2.0, upperThreshold: 3.5 },
  { date: "Sep 29", rejectionRate: 3.1, baseline: 2.0, upperThreshold: 3.5 },
  { date: "Sep 30", rejectionRate: 4.6, baseline: 2.0, upperThreshold: 3.5 }, // Anomaly spike
  { date: "Oct 01", rejectionRate: 3.8, baseline: 2.0, upperThreshold: 3.5 },
  { date: "Oct 02", rejectionRate: 2.9, baseline: 2.0, upperThreshold: 3.5 },
];

export const INITIAL_QUALITY_ANOMALIES: QualityAnomalyItem[] = [
  {
    id: "qa-01",
    title: "Chocolate Biscuit — Increased rejection",
    severity: "High",
    detectedDate: "Oct 01, 2026",
    affectedBatches: "Batch #CB-2026-884, #CB-2026-885",
    aiRecommendation:
      "Calibrate Oven Zone 3 conveyor speed and verify top baking burner flame uniformity.",
    rootCauseProbability: "84% Thermal gradient drift in baking stage",
    defectMetric: "Rejection peaked at 4.6% (Target < 2.0%)",
  },
  {
    id: "qa-02",
    title: "Packaging Defects — Rising trend",
    severity: "Medium",
    detectedDate: "Sep 30, 2026",
    affectedBatches: "Batch #PK-2026-419 to #PK-2026-422",
    aiRecommendation:
      "Inspect rotary sealing jaw alignment and check thermal seal temperature PID controller.",
    rootCauseProbability: "78% Sealing jaw pressure inconsistency",
    defectMetric: "Micro-perforation defect rate +1.4%",
  },
  {
    id: "qa-03",
    title: "Incorrect Weight — Abnormal pattern",
    severity: "Medium",
    detectedDate: "Sep 29, 2026",
    affectedBatches: "Batch #WG-2026-102",
    aiRecommendation:
      "Perform multi-head weigh scale auto-zero calibration and review dough hopper feeder speed.",
    rootCauseProbability: "71% Dough feeding hopper variance",
    defectMetric: "Std dev weight shifted by +3.2g beyond tolerance",
  },
];

// 6. Production Forecast Data
export const INITIAL_PRODUCTION_FORECAST_SUMMARY = {
  next7DaysForecast: "42,500 units",
  expectedDemand: "40,800 units",
  forecastStatus: "Capacity Available",
  explanation:
    "Current production capacity is sufficient to meet the expected short-term demand.",
};

export const PRODUCTION_FORECAST_SERIES: ProductionForecastPoint[] = [
  // Historical (Past 6 days)
  { period: "Sep 26", historical: 5800, demandTarget: 5600 },
  { period: "Sep 27", historical: 6100, demandTarget: 5700 },
  { period: "Sep 28", historical: 5950, demandTarget: 5800 },
  { period: "Sep 29", historical: 6250, demandTarget: 5900 },
  { period: "Sep 30", historical: 6400, demandTarget: 6000 },
  { period: "Oct 01", historical: 6150, demandTarget: 5850 },
  // Transition
  { period: "Oct 02 (Today)", historical: 6300, forecast: 6300, confidenceLower: 6150, confidenceUpper: 6450, demandTarget: 5900 },
  // AI Forecast (Next 7 days)
  { period: "Oct 03", forecast: 6200, confidenceLower: 5950, confidenceUpper: 6450, demandTarget: 5800 },
  { period: "Oct 04", forecast: 6100, confidenceLower: 5800, confidenceUpper: 6400, demandTarget: 5750 },
  { period: "Oct 05", forecast: 5900, confidenceLower: 5600, confidenceUpper: 6200, demandTarget: 5600 },
  { period: "Oct 06", forecast: 6350, confidenceLower: 6000, confidenceUpper: 6700, demandTarget: 6100 },
  { period: "Oct 07", forecast: 6050, confidenceLower: 5700, confidenceUpper: 6400, demandTarget: 5800 },
  { period: "Oct 08", forecast: 5950, confidenceLower: 5600, confidenceUpper: 6300, demandTarget: 5850 },
  { period: "Oct 09", forecast: 6050, confidenceLower: 5650, confidenceUpper: 6450, demandTarget: 6000 },
];

// 7. Inventory Forecast Data
export const INITIAL_INVENTORY_FORECAST: InventoryForecastItem[] = [
  {
    id: "inv-01",
    material: "Flour",
    currentStock: "204,382 kg",
    forecastUsage: "32,000/week",
    daysRemaining: 6,
    aiRecommendation: "Reorder soon",
    status: "Reorder Soon",
  },
  {
    id: "inv-02",
    material: "Sugar",
    currentStock: "40,876 kg",
    forecastUsage: "6,500/week",
    daysRemaining: 6,
    aiRecommendation: "Reorder soon",
    status: "Reorder Soon",
  },
  {
    id: "inv-03",
    material: "Cocoa",
    currentStock: "3,198 kg",
    forecastUsage: "1,200/week",
    daysRemaining: 19,
    aiRecommendation: "Healthy",
    status: "Healthy",
  },
  {
    id: "inv-04",
    material: "Packaging Wrapper",
    currentStock: "408,763 units",
    forecastUsage: "65,000/week",
    daysRemaining: 6,
    aiRecommendation: "High consumption",
    status: "High Consumption",
  },
  {
    id: "inv-05",
    material: "Packaging Box",
    currentStock: "40,876 units",
    forecastUsage: "7,500/week",
    daysRemaining: 5,
    aiRecommendation: "Urgent reorder",
    status: "Urgent Reorder",
  },
];

// 8. Cost Anomaly Detection (AI Cost Intelligence)
export const INITIAL_COST_INTELLIGENCE: CostIntelligenceData = {
  materialCostIncrease: "+8%",
  machineDowntimeCost: 42500,
  productionWasteCost: 28600,
  potentialSavings: 180000,
  aiFinding:
    "AI detected higher material consumption and machine downtime as the major contributors to increased production cost.",
};

// 9. AI Business Insights (4 Cards & Detailed Modals)
export const INITIAL_BUSINESS_INSIGHTS: AiBusinessInsight[] = [
  {
    id: "bi-01",
    title: "Production efficiency improved by 3.2%.",
    category: "Production",
    priority: "Low",
    description: "Shift balance and reduced micro-stoppages on Line 1 drove throughput gains across the morning shift.",
    finding: "Line 1 overall cycle time decreased from 42s to 38.5s per tray with optimized batch scheduling.",
    dataUsed: [
      "Line 1 PLC cycle timers",
      "Shift-wise output reports",
      "Work order completion stamps",
      "OEE telemetry logs",
    ],
    riskLevel: "Low",
    expectedImpact: "Incremental revenue upside of ₹1.1L per operational week with maintained consistency.",
    recommendedAction: "Standardize Line 1 feed settings across afternoon and night shifts.",
    confidence: 93,
    timestamp: "2 hours ago",
    status: "Active",
  },
  {
    id: "bi-02",
    title: "Machine downtime is concentrated around packaging operations.",
    category: "Predictive Maintenance",
    priority: "High",
    description: "Packaging Machine 2 accounts for 68% of total unplanned downtime over the last 14 days.",
    finding: "Packaging Machine 2 shows abnormal temperature and vibration patterns in drive mechanics.",
    dataUsed: [
      "Thermal sensor array (Line 2)",
      "Bearing vibration spectrum (100Hz)",
      "Downtime event logs",
      "Maintenance history records",
    ],
    riskLevel: "High",
    expectedImpact: "Possible production interruption of 4+ hours if bearing fails during peak shift.",
    recommendedAction: "Schedule preventive maintenance and bearing replacement during upcoming changeover.",
    confidence: 87,
    timestamp: "3 hours ago",
    status: "Active",
  },
  {
    id: "bi-03",
    title: "Quality performance remains strong, but Chocolate Biscuit rejection requires investigation.",
    category: "Quality",
    priority: "Medium",
    description: "While plant-wide pass rate is 96.2%, Chocolate Biscuit line experienced a 2.6% defect uptick.",
    finding: "Oven Zone 3 baking temperature fluctuates by ±4.5°C causing intermittent edge overbaking.",
    dataUsed: [
      "Quality inspection defect logs",
      "Thermal camera profiling",
      "Flour batch moisture records",
      "Operator shift QA check sheets",
    ],
    riskLevel: "Medium",
    expectedImpact: "Potential scrap cost of ₹28,600 if burner nozzle calibration is delayed.",
    recommendedAction: "Review quality inspection results and calibrate Zone 3 gas solenoid regulator.",
    confidence: 85,
    timestamp: "5 hours ago",
    status: "In Review",
  },
  {
    id: "bi-04",
    title: "Inventory consumption indicates upcoming packaging material replenishment requirements.",
    category: "Inventory",
    priority: "Medium",
    description: "Packaging Boxes will reach safety stock threshold in 5 days at current production velocity.",
    finding: "Box stock stands at 40,876 units with scheduled production consuming 7,500 units per week.",
    dataUsed: [
      "Current stock inventory database",
      "Production plan for next 14 days",
      "Supplier lead time history (4 days)",
      "Safety stock policy limits",
    ],
    riskLevel: "Medium",
    expectedImpact: "Risk of packaging bottlenecks next Monday if purchase order is not issued by tomorrow.",
    recommendedAction: "Issue replenishment Purchase Order of 50,000 units to avoid line starvation.",
    confidence: 91,
    timestamp: "6 hours ago",
    status: "Active",
  },
];

// 11. AI Capabilities (Roadmap Cards)
export const AI_CAPABILITIES_LIST = [
  {
    id: "cap-01",
    title: "Predictive Maintenance",
    description: "Predict possible machine failures before unplanned downtime occurs.",
    tag: "Sensors & Vibration",
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400",
  },
  {
    id: "cap-02",
    title: "Quality Anomaly Detection",
    description: "Detect unusual quality patterns and root causes across production lines.",
    tag: "Vision & Vision QA",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
  },
  {
    id: "cap-03",
    title: "Production Forecasting",
    description: "Forecast future production requirements and identify throughput constraints.",
    tag: "Time Series & Orders",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "cap-04",
    title: "Inventory Forecasting",
    description: "Predict material consumption and dynamic safety stock reorder triggers.",
    tag: "BoM & Lead Times",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
  },
  {
    id: "cap-05",
    title: "Cost Anomaly Detection",
    description: "Identify unusual cost increases and pinpoint potential savings.",
    tag: "Finance & Variances",
    color: "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400",
  },
  {
    id: "cap-06",
    title: "Workforce Forecasting",
    description: "Predict workforce requirements, skill gaps, and optimal shift allocations.",
    tag: "Roster & Skill Matching",
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400",
  },
];

// 12. AI Data Flow Steps
export const AI_DATA_FLOW_STEPS = [
  {
    step: 1,
    title: "ERP Data",
    subtitle: "Shop floor & orders",
    icon: "Layers",
  },
  {
    step: 2,
    title: "PostgreSQL / Operational Data",
    subtitle: "Raw tables & events",
    icon: "Database",
  },
  {
    step: 3,
    title: "Data Processing",
    subtitle: "Normalization & ETL",
    icon: "Cpu",
  },
  {
    step: 4,
    title: "AI / ML Models",
    subtitle: "Pattern & anomaly engine",
    icon: "Sparkles",
  },
  {
    step: 5,
    title: "AI Insights",
    subtitle: "Correlated findings",
    icon: "Brain",
  },
  {
    step: 6,
    title: "Recommendations",
    subtitle: "Actionable advice",
    icon: "Lightbulb",
  },
  {
    step: 7,
    title: "Manager Action",
    subtitle: "Human-in-the-loop decision",
    icon: "CheckCircle2",
  },
];

// 13. How AI Makes Recommendations Steps
export const HOW_AI_WORKS_STEPS = [
  {
    num: 1,
    title: "Collect ERP data",
    desc: "Ingests real-time telemetry, quality scores, BoM usages, and work orders across all lines.",
  },
  {
    num: 2,
    title: "Analyze historical patterns",
    desc: "Compares current production runs against historical baselines and seasonal operating envelopes.",
  },
  {
    num: 3,
    title: "Detect anomalies",
    desc: "Identifies statistical deviations in temperature, vibration, cycle time, and material consumption.",
  },
  {
    num: 4,
    title: "Predict possible outcomes",
    desc: "Projects equipment failure windows, stock depletion horizons, and yield fluctuations.",
  },
  {
    num: 5,
    title: "Generate recommendation",
    desc: "Formulates concrete, prioritized corrective steps with estimated cost and uptime impact.",
  },
  {
    num: 6,
    title: "Manager reviews and takes action",
    desc: "Provides transparency and confidence metrics for plant managers to approve or modify decisions.",
  },
];
