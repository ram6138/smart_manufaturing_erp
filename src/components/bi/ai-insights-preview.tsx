"use client";

import React from "react";
import { AiIntelligencePreviewCard } from "@/types/bi";
import {
  Sparkles,
  Activity,
  ShieldCheck,
  TrendingUp,
  Package,
  IndianRupee,
  Users,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

interface AiInsightsPreviewProps {
  cards: AiIntelligencePreviewCard[];
}

export function AiInsightsPreview({ cards }: AiInsightsPreviewProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case "Activity":
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "TrendingUp":
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case "Package":
        return <Package className="w-4 h-4 text-blue-400" />;
      case "IndianRupee":
        return <IndianRupee className="w-4 h-4 text-amber-400" />;
      case "Users":
      default:
        return <Users className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/15 to-slate-900/90 p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Intelligence & Predictive Capabilities Preview
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Roadmap Preview
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Future machine learning layers for predictive machine health, automated vision SPC, dynamic demand sensing & workforce optimization
            </p>
          </div>
        </div>

        <div className="text-xs text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-800/50 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Architecture Ready for Model Ingestion</span>
        </div>
      </div>

      {/* Grid of 6 Prototype Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {getIcon(card.iconName)}
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  {card.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Algorithm Class:</span>
                <span className="font-mono text-slate-200 text-[11px]">{card.forecastType}</span>
              </div>
              <div className="p-2 rounded bg-purple-950/30 border border-purple-900/40 text-[11px] text-purple-300 flex items-center justify-between">
                <span>Value: {card.potentialValue}</span>
                <ArrowUpRight className="w-3 h-3 text-purple-400 shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
