"use client";

import React from "react";
import { WorkforceAllocationItem } from "@/types/workforce";
import { Users, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

interface WorkforceAllocationProps {
  allocations: WorkforceAllocationItem[];
}

export function WorkforceAllocation({ allocations }: WorkforceAllocationProps) {
  const totalRequired = allocations.reduce((sum, a) => sum + a.requiredEmployees, 0);
  const totalAssigned = allocations.reduce((sum, a) => sum + a.assignedEmployees, 0);
  const totalAvailable = allocations.reduce((sum, a) => sum + a.availableEmployees, 0);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Workforce Allocation</h3>
              <p className="text-xs text-slate-400">Headcount distribution & floor staffing requirements</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Req: <strong className="text-slate-200">{totalRequired}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Assigned: <strong className="text-cyan-400">{totalAssigned}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Available: <strong className="text-emerald-400">{totalAvailable}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {allocations.map((item) => {
          const shortageDiff = item.requiredEmployees - item.availableEmployees;
          const isShortage = shortageDiff > 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between ${
                isShortage
                  ? "bg-slate-900/60 border-amber-500/30 hover:border-amber-500/50 shadow-sm shadow-amber-950/20"
                  : "bg-slate-900/40 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.department}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 mt-1.5 line-clamp-1" title={item.category}>
                      {item.category}
                    </h4>
                  </div>
                  {isShortage ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                      <AlertTriangle className="w-3 h-3" />
                      Shortage (-{shortageDiff})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Staffed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded bg-slate-950/50 border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Required</span>
                    <span className="text-sm font-bold text-slate-200">{item.requiredEmployees}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assigned</span>
                    <span className="text-sm font-bold text-cyan-400">{item.assignedEmployees}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Available</span>
                    <span className={`text-sm font-bold ${isShortage ? "text-amber-400" : "text-emerald-400"}`}>
                      {item.availableEmployees}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Utilization Rate</span>
                  <span className={`font-semibold ${item.utilizationRate >= 95 ? "text-emerald-400" : "text-slate-300"}`}>
                    {item.utilizationRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      item.utilizationRate >= 95
                        ? "bg-emerald-500"
                        : item.utilizationRate >= 85
                        ? "bg-cyan-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(item.utilizationRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
