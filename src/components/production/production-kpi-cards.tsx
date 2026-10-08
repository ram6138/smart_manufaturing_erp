"use client";

import React from "react";
import { ProductionKPIData } from "@/types/production";
import {
  Factory,
  CheckCircle2,
  Gauge,
  ShieldAlert,
  Clock,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { KpiTopicId } from "./production-kpi-topic-modal";

interface ProductionKpiCardsProps {
  kpi: ProductionKPIData;
  onSelectTopic?: (topicId: KpiTopicId) => void;
  selectedTopicId?: KpiTopicId | null;
}

export function ProductionKpiCards({
  kpi,
  onSelectTopic,
  selectedTopicId,
}: ProductionKpiCardsProps) {
  const safeKpi = kpi || {
    plannedProduction: 150000,
    plannedChangePercent: 5.2,
    actualProduction: 142500,
    actualChangePercent: 4.8,
    productionEfficiency: 94.2,
    efficiencyChangePercent: 1.4,
    rejectedQuantity: 3250,
    rejectedChangePercent: -0.8,
    downtimeHours: 186,
    downtimeChangePercent: -12.5,
    completedOrders: 42,
    completedChangePercent: 14.3,
  };

  const cards: {
    id: KpiTopicId;
    title: string;
    value: string;
    unit: string;
    change: string;
    isUp: boolean;
    isGood: boolean;
    label: string;
    icon: any;
    color: string;
    bg: string;
    hoverBorder: string;
  }[] = [
    {
      id: "planned",
      title: "Planned Production",
      value: `${Number(safeKpi.plannedProduction || 150000).toLocaleString()}`,
      unit: "units",
      change: `+${safeKpi.plannedChangePercent || 5.2}%`,
      isUp: true,
      isGood: true,
      label: "Target for current cycle",
      icon: Factory,
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-200",
      hoverBorder: "hover:border-cyan-400 focus:ring-cyan-500",
    },
    {
      id: "actual",
      title: "Actual Production",
      value: `${Number(safeKpi.actualProduction || 142500).toLocaleString()}`,
      unit: "units",
      change: `+${safeKpi.actualChangePercent || 4.8}%`,
      isUp: true,
      isGood: true,
      label: "95.0% fulfillment rate",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      hoverBorder: "hover:border-blue-400 focus:ring-blue-500",
    },
    {
      id: "efficiency",
      title: "Production Efficiency",
      value: `${safeKpi.productionEfficiency || 94.2}%`,
      unit: "",
      change: `+${safeKpi.efficiencyChangePercent || 1.4}%`,
      isUp: true,
      isGood: true,
      label: "Target: ≥ 92.0%",
      icon: Gauge,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      hoverBorder: "hover:border-emerald-400 focus:ring-emerald-500",
    },
    {
      id: "rejected",
      title: "Rejected Quantity",
      value: `${Number(safeKpi.rejectedQuantity || 3250).toLocaleString()}`,
      unit: "units",
      change: `${safeKpi.rejectedChangePercent || -0.8}%`,
      isUp: false,
      isGood: true, // down in rejection is good
      label: "2.2% scrap threshold",
      icon: ShieldAlert,
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200",
      hoverBorder: "hover:border-rose-400 focus:ring-rose-500",
    },
    {
      id: "downtime",
      title: "Downtime",
      value: `${safeKpi.downtimeHours || 186}`,
      unit: "hours",
      change: `${safeKpi.downtimeChangePercent || -12.5}%`,
      isUp: false,
      isGood: true, // down in downtime is good
      label: "Across 5 plant lines",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      hoverBorder: "hover:border-amber-400 focus:ring-amber-500",
    },
    {
      id: "completed",
      title: "Completed Orders",
      value: `${safeKpi.completedOrders || 42}`,
      unit: "jobs",
      change: `+${safeKpi.completedChangePercent || 14.3}%`,
      isUp: true,
      isGood: true,
      label: "Batches closed on time",
      icon: ClipboardCheck,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
      hoverBorder: "hover:border-purple-400 focus:ring-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedTopicId === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectTopic && onSelectTopic(card.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTopic && onSelectTopic(card.id);
              }
            }}
            title={`Click to explore related topics & deep dive for ${card.title}`}
            className={`p-4 rounded-2xl bg-white border shadow-xs text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSelected
                ? "border-blue-500 ring-2 ring-blue-500/30 shadow-md bg-blue-50/20"
                : `border-slate-200/90 ${card.hoverBorder}`
            }`}
          >
            <div>
              {/* Header: Complete Heading Text (No Truncation) + Icon */}
              <div className="flex items-start justify-between gap-2 mb-2 min-h-[34px]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 leading-snug break-words">
                  {card.title}
                </span>
                <div
                  className={`p-1.5 rounded-xl border ${card.bg} shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-mono">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs text-slate-500 font-medium">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Row: Change Percentage & Complete Label Text */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-1 text-xs">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10.5px] font-bold font-mono shrink-0 ${
                    card.isGood
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {card.isUp ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  <span>{card.change}</span>
                </span>

                <span className="text-[10.5px] text-slate-500 font-medium leading-tight text-right">
                  {card.label}
                </span>
              </div>

              {/* Interactive Cue Hint */}
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  Related Topics
                </span>
                <ChevronRight className="w-3 h-3 text-blue-600" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
