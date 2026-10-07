"use client";

import React from "react";
import { AiBusinessInsight } from "@/types/ai-insights";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Boxes,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface AiBusinessInsightsProps {
  insights: AiBusinessInsight[];
  onSelectInsight: (insight: AiBusinessInsight) => void;
}

export function AiBusinessInsights({
  insights,
  onSelectInsight,
}: AiBusinessInsightsProps) {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "Production":
        return {
          icon: TrendingUp,
          badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          iconColor: "text-cyan-400",
        };
      case "Predictive Maintenance":
        return {
          icon: AlertTriangle,
          badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          iconColor: "text-rose-400",
        };
      case "Quality":
        return {
          icon: ShieldCheck,
          badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
          iconColor: "text-purple-400",
        };
      case "Inventory":
        return {
          icon: Boxes,
          badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          iconColor: "text-amber-400",
        };
      default:
        return {
          icon: Sparkles,
          badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
          iconColor: "text-blue-400",
        };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-rose-400 font-bold";
      case "Medium":
        return "text-amber-400 font-bold";
      default:
        return "text-emerald-400 font-medium";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Business Insights
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {insights.length} Correlated Findings
          </span>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Click any card to open full diagnostic panel & data lineage
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const config = getCategoryConfig(item.category);
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              onClick={() => onSelectInsight(item)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Category & Timestamp */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${config.badgeColor}`}
                  >
                    <Icon className="w-3 h-3" />
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  "{item.title}"
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Finding Callout */}
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                  <span>
                    <strong className="text-purple-300">Finding:</strong> {item.finding}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    Risk: <span className={getRiskColor(item.riskLevel)}>{item.riskLevel}</span>
                  </span>
                  <span>•</span>
                  <span>
                    Confidence: <span className="text-slate-200 font-mono">{item.confidence}%</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
