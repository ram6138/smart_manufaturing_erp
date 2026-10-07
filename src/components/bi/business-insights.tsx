"use client";

import React from "react";
import { BusinessInsightItem } from "@/types/bi";
import {
  Lightbulb,
  AlertOctagon,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface BusinessInsightsProps {
  insights: BusinessInsightItem[];
}

export function BusinessInsights({ insights }: BusinessInsightsProps) {
  const getSeverityBadge = (severity: BusinessInsightItem["severity"]) => {
    switch (severity) {
      case "High":
        return {
          icon: AlertOctagon,
          badgeClass: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
          cardBorder: "border-rose-500/30 hover:border-rose-500/50",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
          cardBorder: "border-amber-500/30 hover:border-amber-500/50",
        };
      case "Low":
        return {
          icon: Info,
          badgeClass: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
          cardBorder: "border-cyan-500/30 hover:border-cyan-500/50",
        };
      case "Info":
      default:
        return {
          icon: Sparkles,
          badgeClass: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
          cardBorder: "border-emerald-500/30 hover:border-emerald-500/50",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Business & Operational Insights
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {insights.length} Actionable Findings
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Executive business heuristics, cost driver analyses, bottleneck identifications & prescriptive operational actions
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Continuous KPI Synthesis Engine
        </div>
      </div>

      {/* Grid of 8 Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const config = getSeverityBadge(item.severity);
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl bg-slate-950/60 border ${config.cardBorder} transition-all flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${config.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.severity} Priority
                    </span>
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {item.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-0.5">
                    Recommended Operational Action:
                  </span>
                  <span className="text-slate-300">{item.recommendedAction}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Related ERP Module: <strong className="text-cyan-400">{item.relatedModule}</strong></span>
                <span className="text-slate-500 font-mono">{item.id.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
