"use client";

import React from "react";
import { PriorityRecommendation } from "@/types/ai-insights";
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Wrench,
  Package,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface PriorityRecommendationsProps {
  recommendations: PriorityRecommendation[];
  onSelectRecommendation: (item: PriorityRecommendation) => void;
  onActionClick: (title: string, actionName: string) => void;
}

export function PriorityRecommendations({
  recommendations,
  onSelectRecommendation,
  onActionClick,
}: PriorityRecommendationsProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
      case "Critical":
        return {
          badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          icon: AlertOctagon,
          indicator: "bg-rose-500",
        };
      case "Medium":
        return {
          badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icon: AlertTriangle,
          indicator: "bg-amber-500",
        };
      default:
        return {
          badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          icon: Info,
          indicator: "bg-cyan-500",
        };
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Predictive Maintenance":
        return Wrench;
      case "Inventory":
        return Package;
      case "Quality":
        return ShieldCheck;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Priority Recommendations
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {recommendations.length} Urgent Actions
          </span>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Ranked by operational impact & breakdown probability
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendations.map((rec) => {
          const pConfig = getPriorityBadge(rec.priority);
          const PIcon = pConfig.icon;
          const ModIcon = getModuleIcon(rec.module);

          return (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition-all hover:shadow-md relative overflow-hidden group"
            >
              {/* Top priority strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${pConfig.indicator}`}
              />

              <div className="space-y-4">
                {/* Header: Priority & Category */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${pConfig.badge}`}
                  >
                    <PIcon className="w-3 h-3" />
                    {rec.priority} PRIORITY
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <ModIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{rec.module}</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectRecommendation(rec)}
                  className="text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer flex items-start gap-1.5"
                >
                  <span>{rec.title}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-cyan-400 mt-0.5" />
                </h3>

                {/* AI Finding */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI Finding
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{rec.aiFinding}"
                  </p>
                </div>

                {/* Recommended Action */}
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/30 space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                    Recommended Action
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {rec.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-slate-800 flex items-center gap-2">
                {rec.routeTarget ? (
                  <Link
                    href={rec.routeTarget}
                    className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{rec.secondaryButtonLabel}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onActionClick(rec.title, rec.secondaryButtonLabel)
                    }
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {rec.secondaryButtonLabel}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    onActionClick(rec.title, rec.primaryButtonLabel)
                  }
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-900/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{rec.primaryButtonLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
