"use client";

import React from "react";
import { FactoryHealthScore } from "@/types/bi";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";

interface FactoryHealthOverviewProps {
  scores: FactoryHealthScore[];
}

export function FactoryHealthOverview({ scores }: FactoryHealthOverviewProps) {
  const getStatusBadge = (status: FactoryHealthScore["status"]) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Healthy
          </span>
        );
      case "Watch":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Watch
          </span>
        );
      case "Attention Required":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            Attention Required
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-amber-400";
    return "text-rose-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Factory Health Overview & Pillar Health Scores
            </h3>
            <p className="text-xs text-slate-400">
              Composite operational indices across manufacturing throughput, product quality, floor operations & fiscal stability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Unified Enterprise Multi-Pillar Index: <strong className="text-emerald-400 font-mono">88.5 / 100</strong></span>
        </div>
      </div>

      {/* 4 Major Area Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-100">{s.area}</span>
                {getStatusBadge(s.status)}
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-extrabold font-mono ${getScoreColor(s.currentScore)}`}>
                    {s.currentScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 100</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  {s.trendUp ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {s.trend}
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {s.trend}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(s.currentScore)}`}
                  style={{ width: `${s.currentScore}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2" title={s.summary}>
                {s.summary}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Prev Period: <strong className="text-slate-300 font-mono">{s.previousScore}</strong></span>
              <span className="text-slate-500">Benchmark: 85+</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
