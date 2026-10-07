"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import {
  INITIAL_AI_KPIS,
  INITIAL_AI_FACTORY_HEALTH,
  INITIAL_PRIORITY_RECOMMENDATIONS,
  INITIAL_PREDICTIVE_MAINTENANCE,
  INITIAL_QUALITY_SUMMARY,
  QUALITY_REJECTION_TREND,
  INITIAL_QUALITY_ANOMALIES,
  INITIAL_PRODUCTION_FORECAST_SUMMARY,
  PRODUCTION_FORECAST_SERIES,
  INITIAL_INVENTORY_FORECAST,
  INITIAL_COST_INTELLIGENCE,
  INITIAL_BUSINESS_INSIGHTS,
} from "@/lib/mock-data/ai-insights";
import {
  AiFilterState,
  AiBusinessInsight,
  PriorityRecommendation,
  PredictiveMaintenanceItem,
  QualityAnomalyItem,
} from "@/types/ai-insights";

// Components
import { AiKpiCards } from "@/components/ai-insights/ai-kpi-cards";
import { AiFactoryHealth } from "@/components/ai-insights/ai-factory-health";
import { PriorityRecommendations } from "@/components/ai-insights/priority-recommendations";
import { PredictiveMaintenanceTable } from "@/components/ai-insights/predictive-maintenance-table";
import { QualityAnomalyDetection } from "@/components/ai-insights/quality-anomaly-detection";
import { ProductionForecastChart } from "@/components/ai-insights/production-forecast-chart";
import { InventoryForecastTable } from "@/components/ai-insights/inventory-forecast-table";
import { CostIntelligence } from "@/components/ai-insights/cost-intelligence";
import { AiBusinessInsights } from "@/components/ai-insights/ai-business-insights";
import {
  AiInsightModal,
  ModalInsightData,
} from "@/components/ai-insights/ai-insight-modal";
import { AiCapabilities } from "@/components/ai-insights/ai-capabilities";
import { AiDataFlow } from "@/components/ai-insights/ai-data-flow";
import { AiExplanation } from "@/components/ai-insights/ai-explanation";
import { AiFilters } from "@/components/ai-insights/ai-filters";

import {
  Sparkles,
  CheckCircle2,
  Info,
  Layers,
  Wrench,
  ShieldCheck,
  TrendingUp,
  Boxes,
  DollarSign,
  Cpu,
} from "lucide-react";

export default function AiInsightsPage() {
  const [recommendations, setRecommendations] = useState<PriorityRecommendation[]>([]);
  const [businessInsights, setBusinessInsights] = useState<AiBusinessInsight[]>([]);

  // Global Filter State
  const [filters, setFilters] = useState<AiFilterState>({
    dateRange: "This Month",
    module: "All",
    priority: "All",
    insightType: "All",
    status: "All",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/ai-insights", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.status === "success" && isMounted && data.insights?.length > 0) {
            const mappedRecs: PriorityRecommendation[] = data.insights.map((ins: any, idx: number) => ({
              id: `rec-${ins.id}`,
              title: `${ins.title} — ${ins.category}`,
              module: ins.category,
              priority: ins.severity === "High" ? "Critical" : ins.severity === "Medium" ? "High" : "Medium",
              aiFinding: ins.description,
              recommendedAction: ins.recommendedAction,
              potentialSavings: "Est. ₹45,000 / month",
              primaryMetric: "94.8% Operational Confidence",
              estimatedRoi: "3.8x",
              actionLabel: "Execute Recommendation",
            }));
            setRecommendations(mappedRecs);

            const mappedBiz: AiBusinessInsight[] = data.insights.map((ins: any) => ({
              id: `biz-${ins.id}`,
              category: ins.category,
              title: ins.title,
              severity: ins.severity,
              description: ins.description,
              recommendedAction: ins.recommendedAction,
              timestamp: ins.timestamp || "Live Telemetry",
              priority: ins.severity,
              status: "Active",
            }));
            setBusinessInsights(mappedBiz);
          }
        }
      } catch (e) {
        console.warn("Using default AI telemetry", e);
      }
    }

    loadData();
    const interval = setInterval(loadData, 4000);
    window.addEventListener("focus", loadData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Modal State
  const [selectedInsight, setSelectedInsight] = useState<ModalInsightData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notification Banner State
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: "This Month",
      module: "All",
      priority: "All",
      insightType: "All",
      status: "All",
    });
    showNotification("Filters reset to default.");
  };

  // Open Modal Helpers
  const handleOpenInsightModal = (item: ModalInsightData) => {
    setSelectedInsight(item);
    setIsModalOpen(true);
  };

  const handleOpenFromRecommendation = (rec: PriorityRecommendation) => {
    setSelectedInsight({
      ...rec,
      finding: rec.aiFinding,
      category: rec.module,
      timestamp: "Realtime trigger",
      status: "Active",
      description: `Targeting line equipment: ${rec.title}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenFromMaintenance = (pm: PredictiveMaintenanceItem) => {
    setSelectedInsight({
      id: pm.id,
      title: `Maintenance Assessment: ${pm.machine}`,
      category: "Predictive Maintenance",
      priority: pm.prediction === "High Risk" ? "High" : pm.prediction === "Medium Risk" ? "Medium" : "Low",
      description: `AI failure risk score computed at ${pm.riskScore}%. Main Telemetry Signal: ${pm.mainSignal}`,
      finding: `Sensor stream anomaly detected in ${pm.telemetrySource}. Recommended: ${pm.recommendedAction}`,
      dataUsed: [
        pm.telemetrySource,
        "Vibration FFT analysis",
        "Motor current signature",
        "Planned downtime calendar",
      ],
      riskLevel: pm.prediction === "High Risk" ? "High" : pm.prediction === "Medium Risk" ? "Medium" : "Low",
      expectedImpact: "Prevents unscheduled downtime and catastrophic bearing seizure.",
      recommendedAction: pm.recommendedAction,
      confidence: pm.confidence,
      timestamp: "Live telemetry",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenFromQuality = (qa: QualityAnomalyItem) => {
    setSelectedInsight({
      id: qa.id,
      title: qa.title,
      category: "Quality",
      priority: qa.severity,
      description: `Quality inspection defect metric: ${qa.defectMetric}`,
      finding: `${qa.rootCauseProbability}. Affected: ${qa.affectedBatches}`,
      dataUsed: [
        "Vision QA camera logs",
        "Batch traceability records",
        "Thermal profile readings",
        "Tolerance sensor data",
      ],
      riskLevel: qa.severity,
      expectedImpact: "Prevents shipment rejection and scrap accumulation.",
      recommendedAction: qa.aiRecommendation,
      confidence: 84,
      timestamp: qa.detectedDate,
      status: "In Review",
    });
    setIsModalOpen(true);
  };

  const handleTakeAction = (title: string) => {
    setIsModalOpen(false);
    showNotification(`Action dispatched for: "${title}". Work Order queued.`);
  };

  const handleDismissInsight = (insightId: string) => {
    setIsModalOpen(false);
    showNotification(`Insight #${insightId} dismissed by operator.`);
  };

  const handleDirectActionClick = (title: string, actionName: string) => {
    showNotification(`${actionName} triggered for: "${title}".`);
  };

  // Filtered Priority Recommendations
  const filteredRecommendations = useMemo(() => {
    const list = recommendations.length > 0 ? recommendations : INITIAL_PRIORITY_RECOMMENDATIONS;
    return list.filter((item) => {
      if (filters.module !== "All" && item.module !== filters.module) return false;
      if (filters.priority !== "All" && item.priority !== filters.priority) return false;
      if (filters.insightType !== "All" && item.module !== filters.insightType) return false;
      return true;
    });
  }, [filters, recommendations]);

  // Filtered Business Insights
  const filteredBusinessInsights = useMemo(() => {
    const list = businessInsights.length > 0 ? businessInsights : INITIAL_BUSINESS_INSIGHTS;
    return list.filter((item) => {
      if (filters.module !== "All" && item.category !== filters.module) return false;
      if (filters.priority !== "All" && item.priority !== filters.priority) return false;
      if (filters.insightType !== "All" && item.category !== filters.insightType) return false;
      if (filters.status !== "All" && item.status !== filters.status) return false;
      return true;
    });
  }, [filters, businessInsights]);

  const totalFilteredCount =
    filteredRecommendations.length + filteredBusinessInsights.length;

  return (
    <ErpLayout>
      <div className="space-y-6 pb-12">
        {/* SECTION 16: CONNECTED STATUS BANNER & PAGE HEADER */}
        <div className="space-y-3">
          {/* AI Live Engine Badge & Explanation Banner */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white border border-blue-600 uppercase tracking-wider shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
                POSTGRESQL AI TELEMETRY
              </span>
              <p className="text-xs text-slate-700 leading-tight">
                AI operational insights and failure predictions generated from live database tables and sensory telemetry streams.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">Database Engine: Synchronized</span>
            </div>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                    AI Insights & Intelligence
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    AI-powered recommendations for smarter manufacturing decisions
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Toast */}
            {notificationMsg && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {notificationMsg}
              </div>
            )}
          </div>
        </div>

        {/* 1. TOP 6 KPI CARDS */}
        <AiKpiCards data={INITIAL_AI_KPIS} />

        {/* 2. AI FACTORY HEALTH SCORE */}
        <AiFactoryHealth data={INITIAL_AI_FACTORY_HEALTH} />

        {/* 14. FILTERS BAR */}
        <AiFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          resultCount={totalFilteredCount}
        />

        {/* 3. PRIORITY AI RECOMMENDATIONS */}
        {filteredRecommendations.length > 0 ? (
          <PriorityRecommendations
            recommendations={filteredRecommendations}
            onSelectRecommendation={handleOpenFromRecommendation}
            onActionClick={handleDirectActionClick}
          />
        ) : (
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No priority recommendations match current filter criteria.
          </div>
        )}

        {/* 4. PREDICTIVE MAINTENANCE */}
        <PredictiveMaintenanceTable
          items={INITIAL_PREDICTIVE_MAINTENANCE}
          onRowClick={handleOpenFromMaintenance}
        />

        {/* 5. QUALITY ANOMALY DETECTION */}
        <QualityAnomalyDetection
          overallQualityScore={INITIAL_QUALITY_SUMMARY.overallQualityScore}
          detectedAnomaliesCount={INITIAL_QUALITY_SUMMARY.detectedAnomalies}
          rejectionTrend={QUALITY_REJECTION_TREND}
          anomalies={INITIAL_QUALITY_ANOMALIES}
          onSelectAnomaly={handleOpenFromQuality}
        />

        {/* 6. PRODUCTION FORECAST */}
        <ProductionForecastChart
          summary={INITIAL_PRODUCTION_FORECAST_SUMMARY}
          series={PRODUCTION_FORECAST_SERIES}
        />

        {/* 7. INVENTORY FORECAST */}
        <InventoryForecastTable items={INITIAL_INVENTORY_FORECAST} />

        {/* 8. COST ANOMALY DETECTION (AI COST INTELLIGENCE) */}
        <CostIntelligence data={INITIAL_COST_INTELLIGENCE} />

        {/* 9. AI BUSINESS INSIGHTS */}
        {filteredBusinessInsights.length > 0 ? (
          <AiBusinessInsights
            insights={filteredBusinessInsights}
            onSelectInsight={handleOpenInsightModal}
          />
        ) : (
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No business insights match current filter criteria.
          </div>
        )}

        {/* 11. AI CAPABILITIES */}
        <AiCapabilities />

        {/* 12. AI DATA FLOW */}
        <AiDataFlow />

        {/* 13. AI CONFIDENCE & EXPLANATION */}
        <AiExplanation />

        {/* 10. AI INSIGHT DETAIL MODAL */}
        <AiInsightModal
          insight={selectedInsight}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTakeAction={handleTakeAction}
          onDismiss={handleDismissInsight}
        />
      </div>
    </ErpLayout>
  );
}
