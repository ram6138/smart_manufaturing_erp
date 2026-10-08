"use client";

import React from "react";
import { AiFactoryHealthData } from "@/types/ai-insights";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Factory,
  Boxes,
  Wrench,
  ShieldCheck,
  Users,
  IndianRupee,
} from "lucide-react";

interface AiFactoryHealthProps {
  data: AiFactoryHealthData;
}

export function AiFactoryHealth({ data }: AiFactoryHealthProps) {
  const breakdownItems = [
    {
      label: "Production",
      score: data.breakdown.production,
      icon: Factory,
      color: "bg-cyan-500",
      textColor: "text-cyan-400",
      status: "Optimal",
    },
    {
      label: "Inventory",
      score: data.breakdown.inventory,
      icon: Boxes,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      status: "Stable",
    },
    {
      label: "Machines",
      score: data.breakdown.machines,
      icon: Wrench,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      status: "Attention",
    },
    {
      label: "Quality",
      score: data.breakdown.quality,
      icon: ShieldCheck,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      status: "Excellent",
    },
    {
      label: "Workforce",
      score: data.breakdown.workforce,
      icon: Users,
      color: "bg-indigo-500",
      textColor: "text-indigo-400",
      status: "Balanced",
    },
    {
      label: "Finance",
      score: data.breakdown.finance,
      icon: IndianRupee,
      color: "bg-purple-500",
      textColor: "text-purple-400",
      status: "Variance",
    },
  ];

  // SVG circular gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (data.overallScore / 100) * circumference;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                AI Factory Health Score
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite intelligence rating across all plant manufacturing domains
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Status: {data.status}
          </span>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 font-mono">
            Updated: Realtime
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        {/* Circular Progress Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
          <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Foreground animated progress */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-cyan-500 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {data.overallScore}
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mt-0.5">
                {data.status}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-300 font-medium max-w-xs leading-relaxed">
              "{data.summary}"
            </p>
          </div>
        </div>

        {/* Breakdown of 6 Sub-Scores */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {breakdownItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.textColor}`} />
                      <span className="text-xs font-semibold text-slate-200">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 text-[10px]">
                        {item.status}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        {item.score}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>AI Diagnostic Notice:</strong> Machine reliability index (82%) and Finance variance (79%) have dropped below the 85% target threshold. Prioritize Packaging Line 2 preventative service to avoid spillover effects into order fulfillment.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
