"use client";

import React from "react";
import {
  Layers,
  Database,
  Cpu,
  Sparkles,
  Brain,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

export function AiDataFlow() {
  const steps = [
    {
      step: 1,
      title: "ERP Data",
      subtitle: "Shop floor & orders",
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
    },
    {
      step: 2,
      title: "Operational Database",
      subtitle: "Transactional tables",
      icon: Database,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      step: 3,
      title: "Data Processing",
      subtitle: "Normalization & ETL",
      icon: Cpu,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
    },
    {
      step: 4,
      title: "AI / ML Models",
      subtitle: "Inference & patterns",
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      step: 5,
      title: "AI Insights",
      subtitle: "Correlated findings",
      icon: Brain,
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-500/30",
    },
    {
      step: 6,
      title: "Recommendations",
      subtitle: "Actionable advice",
      icon: Lightbulb,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
    },
    {
      step: 7,
      title: "Manager Action",
      subtitle: "Human decision loop",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              AI End-to-End Data Flow
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How operational telemetry translates into prioritized executive actions
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Deterministic ETL &rarr; Neural Reasoning Pipeline
        </span>
      </div>

      {/* Horizontal Flow for Desktop / Vertical for Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={item.step}>
              <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 relative group hover:border-slate-700 transition-all w-full">
                <div
                  className={`p-2.5 rounded-xl border ${item.bg} transition-transform group-hover:scale-105`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Step {item.step}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
