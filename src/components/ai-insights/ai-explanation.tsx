"use client";

import React from "react";
import { HOW_AI_WORKS_STEPS } from "@/lib/mock-data/ai-insights";
import {
  HelpCircle,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Info,
} from "lucide-react";

export function AiExplanation() {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              How AI Makes Recommendations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent heuristic & neural reasoning workflow
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5" />
          Human-in-the-Loop Governance
        </span>
      </div>

      {/* 6 Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HOW_AI_WORKS_STEPS.map((step) => (
          <div
            key={step.num}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono flex items-center justify-center">
                {step.num}
              </span>
              <h4 className="text-xs font-bold text-slate-200">
                {step.title}
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-8">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Important Human Governance Note */}
      <div className="p-4 rounded-xl bg-blue-950/25 border border-blue-800/40 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-blue-300 text-xs block font-bold">
            Decision Support Policy & Safety Principle:
          </strong>
          <p className="text-slate-300 leading-relaxed">
            AI recommendations are engineered to empower and accelerate human decision-making. The system synthesizes vast telemetry patterns and surfaces high-confidence suggestions, but never executes critical business decisions, financial commitments, or machine shutdowns without manager review and explicit authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
