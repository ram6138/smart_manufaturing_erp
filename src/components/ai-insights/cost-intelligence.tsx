"use client";

import React from "react";
import { CostIntelligenceData } from "@/types/ai-insights";
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Flame,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface CostIntelligenceProps {
  data: CostIntelligenceData;
}

export function CostIntelligence({ data }: CostIntelligenceProps) {
  const cards = [
    {
      label: "Material Cost Increase",
      value: data.materialCostIncrease,
      desc: "Above standard baseline",
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "from-amber-950/20 to-slate-900",
      border: "border-amber-800/40",
      badge: "Consumption Variance",
    },
    {
      label: "Machine Downtime Cost",
      value: `₹${data.machineDowntimeCost.toLocaleString()}`,
      desc: "Unplanned stoppage impact",
      icon: Flame,
      color: "text-rose-400",
      bg: "from-rose-950/20 to-slate-900",
      border: "border-rose-800/40",
      badge: "Packaging Line 2",
    },
    {
      label: "Production Waste Cost",
      value: `₹${data.productionWasteCost.toLocaleString()}`,
      desc: "Scrap & defect loss",
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "from-orange-950/20 to-slate-900",
      border: "border-orange-800/40",
      badge: "Quality Scrap",
    },
    {
      label: "Potential Savings",
      value: `₹${data.potentialSavings.toLocaleString()}`,
      desc: "Recoverable via AI actions",
      icon: PiggyBank,
      color: "text-emerald-400",
      bg: "from-emerald-950/20 to-slate-900",
      border: "border-emerald-800/40",
      badge: "Identified Opportunity",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              AI Cost Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated unit cost variance detection, leak pinpointing & yield recovery
            </p>
          </div>
        </div>

        <Link
          href="/finance"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Finance & Costing</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Cost Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-gradient-to-br ${card.bg} border ${card.border} space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>

              <div className="text-2xl font-extrabold text-white font-mono">
                {card.value}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{card.desc}</span>
                <span className="font-medium text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight Highlight Banner */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            AI Cost Variance Synthesis
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            "{data.aiFinding}"
          </p>
        </div>
      </div>
    </div>
  );
}
