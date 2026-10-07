"use client";

import React from "react";
import { CrossModuleAnalysisItem } from "@/types/bi";
import { Network, ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert, Layers } from "lucide-react";

interface CrossModuleAnalysisProps {
  items: CrossModuleAnalysisItem[];
}

export function CrossModuleAnalysis({ items }: CrossModuleAnalysisProps) {
  const getImpactBadge = (level: CrossModuleAnalysisItem["impactLevel"]) => {
    switch (level) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <ShieldAlert className="w-3 h-3" /> Critical Linkage
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Actionable Impact
          </span>
        );
      case "Positive":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Optimal Flow
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            Neutral Correlation
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Cross-Module Operational Correlation Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Inter-module dependency matrix: how production speed, machine health, staffing & procurement directly influence inventory, quality & fiscal balance
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multi-Domain ERP Correlation Active</span>
        </div>
      </div>

      {/* Grid of 6 Cross-Module Correlation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
                  <span>{item.sourceModule}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{item.targetModule}</span>
                </div>
                {getImpactBadge(item.impactLevel)}
              </div>

              <h4 className="text-sm font-semibold text-slate-100 mt-2 mb-1">
                {item.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Observed Variance:</span>
              <span className="font-mono font-bold text-amber-400">{item.metricImpact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
