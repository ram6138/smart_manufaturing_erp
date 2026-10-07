"use client";

import React from "react";
import { Users, AlertTriangle, CheckCircle2, TrendingUp, Layers } from "lucide-react";

interface WorkforceCapacityProps {
  requiredWorkforce?: number;
  availableWorkforce?: number;
  allocatedWorkforce?: number;
}

export function WorkforceCapacity({
  requiredWorkforce = 84,
  availableWorkforce = 74,
  allocatedWorkforce = 74,
}: WorkforceCapacityProps) {
  const capacityGap = requiredWorkforce - availableWorkforce;
  const capacityRate = Math.min(100, Math.round((availableWorkforce / requiredWorkforce) * 100));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Workforce Capacity & Manning Ratio
            </h3>
            <p className="text-xs text-slate-400">
              Plant headcount demand vs actual floor availability with automated capacity gap computation
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
          Capacity Index: {capacityRate}%
        </span>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        {/* Required */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Required Workforce</span>
          <div className="text-2xl font-bold font-mono text-white">
            {requiredWorkforce} <span className="text-xs text-slate-400 font-sans">staff</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Full shift quota</span>
        </div>

        {/* Available */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 block mb-1">Available Workforce</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {availableWorkforce} <span className="text-xs text-emerald-300 font-sans">present</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Present on shift</span>
        </div>

        {/* Allocated */}
        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30">
          <span className="text-xs text-blue-400 block mb-1">Allocated to Lines</span>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {allocatedWorkforce} <span className="text-xs text-blue-300 font-sans">assigned</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">100% Manning Rate</span>
        </div>

        {/* Capacity Gap */}
        <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
          <span className="text-xs text-rose-400 block mb-1">Capacity Gap</span>
          <div className="text-2xl font-bold font-mono text-rose-400">
            -{capacityGap} <span className="text-xs text-rose-300 font-sans">shortage</span>
          </div>
          <span className="text-[10px] text-rose-400/80 block mt-1">
            Requires cross-deployment
          </span>
        </div>
      </div>

      {/* Visual Capacity Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Overall Plant Staffing Fulfillment</span>
          <span className="font-mono font-bold text-white">{capacityRate}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${capacityRate}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
          <span>0 Staff</span>
          <span>Target Threshold: &gt;95%</span>
          <span>{requiredWorkforce} Staff (100%)</span>
        </div>
      </div>
    </div>
  );
}
