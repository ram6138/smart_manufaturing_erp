"use client";

import React from "react";
import { AiKpiSummary } from "@/types/ai-insights";
import {
  Sparkles,
  AlertTriangle,
  Flame,
  ShieldAlert,
  TrendingUp,
  Target,
} from "lucide-react";

interface AiKpiCardsProps {
  data: AiKpiSummary;
}

export function AiKpiCards({ data }: AiKpiCardsProps) {
  const cards = [
    {
      title: "AI Insights",
      value: data.aiInsightsCount.toString(),
      subtitle: "Generated this month",
      icon: Sparkles,
      iconColor: "text-purple-400",
      bgGradient: "from-purple-950/30 to-purple-900/10",
      borderColor: "border-purple-800/40",
      badge: "+6 new",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    },
    {
      title: "Critical Alerts",
      value: data.criticalAlertsCount.toString(),
      subtitle: "Require attention",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      bgGradient: "from-rose-950/30 to-rose-900/10",
      borderColor: "border-rose-800/40",
      badge: "High Risk",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    },
    {
      title: "Predicted Failures",
      value: data.predictedFailuresCount.toString(),
      subtitle: "Next 7 days",
      icon: Flame,
      iconColor: "text-amber-400",
      bgGradient: "from-amber-950/30 to-amber-900/10",
      borderColor: "border-amber-800/40",
      badge: "Maintenance",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    },
    {
      title: "Quality Anomalies",
      value: data.qualityAnomaliesCount.toString(),
      subtitle: "Detected recently",
      icon: ShieldAlert,
      iconColor: "text-cyan-400",
      bgGradient: "from-cyan-950/30 to-cyan-900/10",
      borderColor: "border-cyan-800/40",
      badge: "Inspection",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    },
    {
      title: "Cost Opportunities",
      value: data.costOpportunities,
      subtitle: "Potential savings",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      bgGradient: "from-emerald-950/30 to-emerald-900/10",
      borderColor: "border-emerald-800/40",
      badge: "Recoverable",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    },
    {
      title: "Forecast Accuracy",
      value: data.forecastAccuracy,
      subtitle: "Production forecast",
      icon: Target,
      iconColor: "text-blue-400",
      bgGradient: "from-blue-950/30 to-blue-900/10",
      borderColor: "border-blue-800/40",
      badge: "Validated",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.bgGradient} bg-slate-900/90 border ${card.borderColor} p-4 shadow-sm transition-all hover:border-slate-600`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-slate-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
