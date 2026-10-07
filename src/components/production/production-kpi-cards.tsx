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
} from "lucide-react";

interface ProductionKpiCardsProps {
  kpi: ProductionKPIData;
}

export function ProductionKpiCards({ kpi }: ProductionKpiCardsProps) {
  const safeKpi = kpi || {
    plannedProduction: 22500,
    plannedChangePercent: 8.4,
    actualProduction: 18450,
    actualChangePercent: 5.2,
    productionEfficiency: 96.5,
    efficiencyChangePercent: 2.1,
    rejectedQuantity: 260,
    rejectedChangePercent: -0.4,
    downtimeHours: 0.9,
    downtimeChangePercent: -12.5,
    completedOrders: 2,
    completedChangePercent: 15.0,
  };

  const cards = [
    {
      id: "planned",
      title: "Planned Production",
      value: `${Number(safeKpi.plannedProduction || 22500).toLocaleString()}`,
      unit: "units",
      change: `+${safeKpi.plannedChangePercent || 8.4}%`,
      isUp: true,
      isGood: true,
      label: "Target for current cycle",
      icon: Factory,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "actual",
      title: "Actual Production",
      value: `${Number(safeKpi.actualProduction || 18450).toLocaleString()}`,
      unit: "units",
      change: `+${safeKpi.actualChangePercent || 5.2}%`,
      isUp: true,
      isGood: true,
      label: "95.0% fulfillment rate",
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "efficiency",
      title: "Production Efficiency",
      value: `${safeKpi.productionEfficiency || 96.5}%`,
      unit: "",
      change: `+${safeKpi.efficiencyChangePercent || 2.1}%`,
      isUp: true,
      isGood: true,
      label: "Target: ≥ 92.0%",
      icon: Gauge,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "rejected",
      title: "Rejected Quantity",
      value: `${Number(safeKpi.rejectedQuantity || 260).toLocaleString()}`,
      unit: "units",
      change: `${safeKpi.rejectedChangePercent || -0.4}%`,
      isUp: false,
      isGood: true, // down in rejection is good
      label: "2.2% scrap threshold",
      icon: ShieldAlert,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "downtime",
      title: "Downtime",
      value: `${safeKpi.downtimeHours || 0.9}`,
      unit: "hours",
      change: `${safeKpi.downtimeChangePercent || -12.5}%`,
      isUp: false,
      isGood: true, // down in downtime is good
      label: "Across 5 plant lines",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "completed",
      title: "Completed Orders",
      value: `${safeKpi.completedOrders || 2}`,
      unit: "jobs",
      change: `+${safeKpi.completedChangePercent || 15}%`,
      isUp: true,
      isGood: true,
      label: "Batches closed on time",
      icon: ClipboardCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${card.bg} shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs text-slate-400 font-medium">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold font-mono ${
                  card.isGood
                    ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/60"
                    : "bg-rose-950/70 text-rose-400 border border-rose-800/60"
                }`}
              >
                {card.isUp ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                <span>{card.change}</span>
              </span>

              <span className="text-[10px] text-slate-400 truncate text-right">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
