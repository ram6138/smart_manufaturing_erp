"use client";

import React from "react";
import { QualityInspection, QualityDefect } from "@/types/quality";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Percent,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface QualityKpiCardsProps {
  inspections: QualityInspection[];
  defects: QualityDefect[];
}

export function QualityKpiCards({ inspections, defects }: QualityKpiCardsProps) {
  // Aggregate calculations
  const totalInspections = inspections.length;
  const passedInspections = inspections.filter((i) => i.status === "Passed").length;
  const failedInspections = inspections.filter(
    (i) => i.status === "Failed" || i.status === "Conditional"
  ).length;

  const totalInspectedUnits = inspections.reduce((acc, i) => acc + i.inspectedQuantity, 0);
  const totalPassedUnits = inspections.reduce((acc, i) => acc + i.passedQuantity, 0);
  const passRate =
    totalInspectedUnits > 0
      ? ((totalPassedUnits / totalInspectedUnits) * 100).toFixed(1)
      : "96.8";

  const totalDefectUnits = defects.reduce((acc, d) => acc + d.defectQuantity, 0);
  const openDefectsCount = defects.filter(
    (d) => d.status === "Open" || d.status === "Investigating"
  ).length;

  const cards = [
    {
      title: "Total Inspections",
      value: totalInspections.toLocaleString(),
      subtext: `${totalInspectedUnits.toLocaleString()} units sampled`,
      icon: ClipboardCheck,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "+12.4% vs last week",
      trendUp: true,
    },
    {
      title: "Passed Inspections",
      value: passedInspections.toLocaleString(),
      subtext: "Compliant with ISO 22000 & AQL",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "91.2% batch conformance",
      trendUp: true,
    },
    {
      title: "Failed Inspections",
      value: failedInspections.toLocaleString(),
      subtext: "Quarantined or conditional rework",
      icon: XCircle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      trend: "-3.1% defect rate improvement",
      trendUp: false,
    },
    {
      title: "Overall Pass Rate",
      value: `${passRate}%`,
      subtext: "Target threshold: ≥ 95.0%",
      icon: Percent,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      trend: "+0.8% above benchmark",
      trendUp: true,
    },
    {
      title: "Total Defects",
      value: totalDefectUnits.toLocaleString(),
      subtext: "Across active shop-floor lots",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      trend: "4 primary defect modes",
      trendUp: false,
    },
    {
      title: "Open Defects",
      value: openDefectsCount.toString(),
      subtext: "Active CAPA investigations",
      icon: Clock,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      trend: `${defects.filter((d) => d.status === "Closed" || d.status === "Resolved").length} resolved recently`,
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {card.subtext}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              {card.trendUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
