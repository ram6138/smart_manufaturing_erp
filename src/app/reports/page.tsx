"use client";

import React, { useState, useMemo } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import {
  INITIAL_EXECUTIVE_KPIS,
  INITIAL_FACTORY_HEALTH,
  INITIAL_OEE_FACTORS,
  INITIAL_PRODUCTION_INTELLIGENCE,
  INITIAL_MACHINE_INTELLIGENCE,
  INITIAL_QUALITY_INTELLIGENCE,
  INITIAL_INVENTORY_INTELLIGENCE,
  INITIAL_PROCUREMENT_INTELLIGENCE,
  INITIAL_WORKFORCE_INTELLIGENCE,
  INITIAL_FINANCE_INTELLIGENCE,
  INITIAL_CROSS_MODULE_ANALYSIS,
  INITIAL_BUSINESS_INSIGHTS,
  INITIAL_AI_PREVIEWS,
  INITIAL_MANAGEMENT_ALERTS,
} from "@/lib/mock-data/bi";
import { PeriodType } from "@/types/bi";

// Components
import { ExecutiveKpiCards } from "@/components/bi/executive-kpi-cards";
import { FactoryHealthOverview } from "@/components/bi/factory-health-overview";
import { ProductionIntelligence } from "@/components/bi/production-intelligence";
import { OeeAnalysis } from "@/components/bi/oee-analysis";
import { MachineIntelligence } from "@/components/bi/machine-intelligence";
import { QualityIntelligence } from "@/components/bi/quality-intelligence";
import { InventoryIntelligence } from "@/components/bi/inventory-intelligence";
import { ProcurementIntelligence } from "@/components/bi/procurement-intelligence";
import { WorkforceIntelligence } from "@/components/bi/workforce-intelligence";
import { FinanceIntelligence } from "@/components/bi/finance-intelligence";
import { CrossModuleAnalysis } from "@/components/bi/cross-module-analysis";
import { BusinessInsights } from "@/components/bi/business-insights";
import { AiInsightsPreview } from "@/components/bi/ai-insights-preview";
import { ManagementAlerts } from "@/components/bi/management-alerts";
import { PeriodSelector } from "@/components/bi/period-selector";

import {
  BarChart3,
  CheckCircle2,
  Sparkles,
  Factory,
  ShieldCheck,
  Package,
  ShoppingBag,
  IndianRupee,
  Layers,
  Search,
} from "lucide-react";

type BiTab = "all_overview" | "production_oee" | "quality_inventory" | "supply_workforce" | "finance_margins" | "ai_insights";

export default function BusinessIntelligencePage() {
  // Global States
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("This Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<BiTab>("all_overview");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Period multiplier to adjust numbers dynamically based on period
  const periodMultiplier = useMemo(() => {
    switch (selectedPeriod) {
      case "Today":
        return 0.035;
      case "This Week":
        return 0.25;
      case "This Month":
      case "Last 30 Days":
        return 1.0;
      case "Last 90 Days":
        return 3.0;
      case "This Year":
        return 12.0;
      default:
        return 1.0;
    }
  }, [selectedPeriod]);

  // Scaled / Dynamic Mock Data
  const executiveKpis = useMemo(() => {
    return {
      ...INITIAL_EXECUTIVE_KPIS,
      productionEfficiency: Number(
        (INITIAL_EXECUTIVE_KPIS.productionEfficiency + (selectedPeriod === "Today" ? 0.6 : 0)).toFixed(1)
      ),
      oee: Number(
        (INITIAL_EXECUTIVE_KPIS.oee + (selectedPeriod === "This Week" ? 0.4 : 0)).toFixed(1)
      ),
    };
  }, [selectedPeriod]);

  const productionData = useMemo(() => {
    return {
      ...INITIAL_PRODUCTION_INTELLIGENCE,
      plannedProduction: Math.round(INITIAL_PRODUCTION_INTELLIGENCE.plannedProduction * periodMultiplier),
      actualProduction: Math.round(INITIAL_PRODUCTION_INTELLIGENCE.actualProduction * periodMultiplier),
    };
  }, [periodMultiplier]);

  const financeData = useMemo(() => {
    return {
      ...INITIAL_FINANCE_INTELLIGENCE,
      revenue: Math.round(INITIAL_FINANCE_INTELLIGENCE.revenue * periodMultiplier),
      totalExpenses: Math.round(INITIAL_FINANCE_INTELLIGENCE.totalExpenses * periodMultiplier),
      grossProfit: Math.round(INITIAL_FINANCE_INTELLIGENCE.grossProfit * periodMultiplier),
      productionCost: Math.round(INITIAL_FINANCE_INTELLIGENCE.productionCost * periodMultiplier),
      procurementCost: Math.round(INITIAL_FINANCE_INTELLIGENCE.procurementCost * periodMultiplier),
    };
  }, [periodMultiplier]);

  // Filtered Insights based on Search Query
  const filteredInsights = useMemo(() => {
    if (!searchQuery.trim()) return INITIAL_BUSINESS_INSIGHTS;
    const q = searchQuery.toLowerCase().trim();
    return INITIAL_BUSINESS_INSIGHTS.filter(
      (item) =>
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.relatedModule.toLowerCase().includes(q) ||
        item.recommendedAction.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showNotification("BI report prepared successfully.");
    }, 800);
  };

  const handleSectionJump = (targetSection: string) => {
    if (targetSection === "machines" || targetSection === "production") {
      setActiveTab("production_oee");
    } else if (targetSection === "quality") {
      setActiveTab("quality_inventory");
    } else if (targetSection === "procurement" || targetSection === "workforce") {
      setActiveTab("supply_workforce");
    } else {
      setActiveTab("all_overview");
    }
  };

  return (
    <ErpLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Business Intelligence</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unified operational intelligence for production, finance, quality, inventory and workforce.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {notificationMsg && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {notificationMsg}
              </div>
            )}

            <div className="text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50 hidden sm:flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Enterprise Data Mesh Synchronized
            </div>
          </div>
        </div>

        {/* Global Period Selector, Search & Export Bar */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExportReport={handleExportReport}
          isExporting={isExporting}
        />

        {/* 1. Eight Executive KPI Cards */}
        <ExecutiveKpiCards data={executiveKpis} />

        {/* 2. Factory Health Overview */}
        <FactoryHealthOverview scores={INITIAL_FACTORY_HEALTH} />

        {/* 3. Cross-Module Analysis Linkages */}
        <CrossModuleAnalysis items={INITIAL_CROSS_MODULE_ANALYSIS} />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("all_overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all_overview"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Unified BI Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("production_oee")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "production_oee"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Factory className="w-4 h-4" />
            Production & OEE Analytics
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quality_inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "quality_inventory"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Quality & Inventory Health
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("supply_workforce")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "supply_workforce"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Procurement & Workforce
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("finance_margins")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "finance_margins"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            Finance & Cost Intelligence
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai_insights")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ai_insights"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                : "bg-slate-800/80 text-purple-300 hover:text-purple-200 hover:bg-slate-750 border border-purple-500/30"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Intelligence & Insights ({filteredInsights.length})
          </button>
        </div>

        {/* Tab 1: Unified BI Overview */}
        {activeTab === "all_overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductionIntelligence data={productionData} />
              <OeeAnalysis data={INITIAL_OEE_FACTORS} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QualityIntelligence data={INITIAL_QUALITY_INTELLIGENCE} />
              <InventoryIntelligence data={INITIAL_INVENTORY_INTELLIGENCE} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProcurementIntelligence data={INITIAL_PROCUREMENT_INTELLIGENCE} />
              <WorkforceIntelligence data={INITIAL_WORKFORCE_INTELLIGENCE} />
            </div>

            <FinanceIntelligence data={financeData} />
            <ManagementAlerts alerts={INITIAL_MANAGEMENT_ALERTS} onViewSection={handleSectionJump} />
          </div>
        )}

        {/* Tab 2: Production & OEE */}
        {activeTab === "production_oee" && (
          <div className="space-y-6">
            <ProductionIntelligence data={productionData} />
            <OeeAnalysis data={INITIAL_OEE_FACTORS} />
            <MachineIntelligence machines={INITIAL_MACHINE_INTELLIGENCE} />
          </div>
        )}

        {/* Tab 3: Quality & Inventory */}
        {activeTab === "quality_inventory" && (
          <div className="space-y-6">
            <QualityIntelligence data={INITIAL_QUALITY_INTELLIGENCE} />
            <InventoryIntelligence data={INITIAL_INVENTORY_INTELLIGENCE} />
          </div>
        )}

        {/* Tab 4: Procurement & Workforce */}
        {activeTab === "supply_workforce" && (
          <div className="space-y-6">
            <ProcurementIntelligence data={INITIAL_PROCUREMENT_INTELLIGENCE} />
            <WorkforceIntelligence data={INITIAL_WORKFORCE_INTELLIGENCE} />
          </div>
        )}

        {/* Tab 5: Finance & Cost Intelligence */}
        {activeTab === "finance_margins" && (
          <div className="space-y-6">
            <FinanceIntelligence data={financeData} />
          </div>
        )}

        {/* Tab 6: AI Insights & Roadmap Preview */}
        {activeTab === "ai_insights" && (
          <div className="space-y-6">
            {/* Search Filter Status */}
            {searchQuery.trim() && (
              <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Filtering BI insights for: <strong className="text-cyan-400 font-mono">"{searchQuery}"</strong></span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Clear search
                </button>
              </div>
            )}

            {filteredInsights.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No matching insights found</h3>
                <p className="text-xs text-slate-400">Try searching for a different machine, department, or operational keyword.</p>
              </div>
            ) : (
              <BusinessInsights insights={filteredInsights} />
            )}

            <AiInsightsPreview cards={INITIAL_AI_PREVIEWS} />
            <ManagementAlerts alerts={INITIAL_MANAGEMENT_ALERTS} onViewSection={handleSectionJump} />
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
