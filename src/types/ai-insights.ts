// Domain interfaces for AI Insights & Intelligence Module

export type AiInsightPriority = "High" | "Medium" | "Low" | "Critical";

export type AiModuleCategory =
  | "Predictive Maintenance"
  | "Quality"
  | "Production"
  | "Inventory"
  | "Finance"
  | "Workforce"
  | "All";

export type AiInsightStatus = "Active" | "In Review" | "Resolved" | "Dismissed";

// Top KPI Metrics
export interface AiKpiSummary {
  aiInsightsCount: number;
  criticalAlertsCount: number;
  predictedFailuresCount: number;
  qualityAnomaliesCount: number;
  costOpportunities: string;
  forecastAccuracy: string;
}

// AI Factory Health Score
export interface AiFactoryHealthData {
  overallScore: number; // e.g. 87
  status: "Healthy" | "Watch" | "Critical";
  breakdown: {
    production: number; // 91%
    inventory: number; // 86%
    machines: number; // 82%
    quality: number; // 94%
    workforce: number; // 88%
    finance: number; // 79%
  };
  summary: string;
}

// Priority AI Recommendation
export interface PriorityRecommendation {
  id: string;
  title: string;
  priority: AiInsightPriority;
  module: AiModuleCategory;
  aiFinding: string;
  recommendedAction: string;
  riskLevel: "High" | "Medium" | "Low";
  expectedImpact: string;
  confidence: number; // e.g. 87%
  dataUsed: string[];
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  routeTarget?: string;
}

// Predictive Maintenance Row
export interface PredictiveMaintenanceItem {
  id: string;
  machine: string;
  riskScore: number; // %
  prediction: "Low Risk" | "Medium Risk" | "High Risk";
  mainSignal: string;
  recommendedAction: string;
  telemetrySource: string;
  confidence: number;
}

// Quality Anomaly Item
export interface QualityAnomalyItem {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  detectedDate: string;
  affectedBatches: string;
  aiRecommendation: string;
  rootCauseProbability: string;
  defectMetric: string;
}

// Production Forecast Data
export interface ProductionForecastPoint {
  period: string;
  historical?: number;
  forecast?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
  demandTarget: number;
}

// Inventory Forecast Item
export interface InventoryForecastItem {
  id: string;
  material: string;
  currentStock: string;
  forecastUsage: string;
  daysRemaining: number;
  aiRecommendation: string;
  status: "Healthy" | "Reorder Soon" | "High Consumption" | "Urgent Reorder";
}

// Cost Intelligence Summary
export interface CostIntelligenceData {
  materialCostIncrease: string; // "+8%"
  machineDowntimeCost: number; // 42500
  productionWasteCost: number; // 28600
  potentialSavings: number; // 180000
  aiFinding: string;
}

// AI Business Insight Item
export interface AiBusinessInsight {
  id: string;
  title: string;
  category: AiModuleCategory;
  priority: AiInsightPriority;
  description: string;
  finding: string;
  dataUsed: string[];
  riskLevel: "High" | "Medium" | "Low";
  expectedImpact: string;
  recommendedAction: string;
  confidence: number;
  timestamp: string;
  status: AiInsightStatus;
}

// AI Filter State
export interface AiFilterState {
  dateRange: string;
  module: string;
  priority: string;
  insightType: string;
  status: string;
}
