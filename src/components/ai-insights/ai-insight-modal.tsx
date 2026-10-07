"use client";

import React from "react";
import { AiBusinessInsight, PriorityRecommendation } from "@/types/ai-insights";
import {
  X,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Database,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sliders,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export type ModalInsightData = (AiBusinessInsight | PriorityRecommendation) & {
  category?: string;
  module?: string;
  finding?: string;
  aiFinding?: string;
};

interface AiInsightModalProps {
  insight: ModalInsightData | null;
  isOpen: boolean;
  onClose: () => void;
  onTakeAction: (insightTitle: string) => void;
  onDismiss: (insightId: string) => void;
}

export function AiInsightModal({
  insight,
  isOpen,
  onClose,
  onTakeAction,
  onDismiss,
}: AiInsightModalProps) {
  if (!isOpen || !insight) return null;

  const findingText = insight.finding || insight.aiFinding || "";
  const categoryName = insight.category || insight.module || "Operational AI";

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {categoryName}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getRiskBadge(
                    insight.riskLevel
                  )}`}
                >
                  Risk: {insight.riskLevel}
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  Confidence: {insight.confidence}%
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                {insight.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs">
          {/* AI Finding */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Finding & Root Signal
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              "{findingText}"
            </p>
          </div>

          {/* Expected Impact & Recommended Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-800/30 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Expected Operational Impact
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                {insight.expectedImpact}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recommended Action
              </div>
              <p className="text-slate-200 leading-relaxed font-semibold">
                {insight.recommendedAction}
              </p>
            </div>
          </div>

          {/* Data Used */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Data Used for AI Synthesis
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {insight.dataUsed?.length || 0} Data Pipelines
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              {insight.dataUsed?.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Model Confidence & Disclaimer */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>
                Algorithmic Confidence: <strong className="text-purple-300 font-mono">{insight.confidence}%</strong> (Standard error &plusmn;2.4%)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Human In The Loop
            </span>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDismiss(insight.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Dismiss
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              View Data
            </button>

            <button
              type="button"
              onClick={() => onTakeAction(insight.title)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30 transition-colors flex items-center gap-1.5"
            >
              <span>Take Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
