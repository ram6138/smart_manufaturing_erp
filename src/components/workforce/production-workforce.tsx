"use client";

import React from "react";
import { ProductionLineWorkforce } from "@/types/workforce";
import { Factory, Users, ShieldAlert, CheckCircle, Clock, ArrowUpRight } from "lucide-react";

interface ProductionWorkforceProps {
  lines: ProductionLineWorkforce[];
}

export function ProductionWorkforce({ lines }: ProductionWorkforceProps) {
  const getStatusBadge = (status: ProductionLineWorkforce["status"]) => {
    switch (status) {
      case "Fully Staffed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Fully Staffed
          </span>
        );
      case "Understaffed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <ShieldAlert className="w-3 h-3" />
            Understaffed
          </span>
        );
      case "Overstaffed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            Overstaffed
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Production Workforce</h3>
            <p className="text-xs text-slate-400">Shop-floor line manning, supervisor assignments & shift distribution</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Production Sync Ready
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lines.map((line) => (
          <div
            key={line.id}
            className="bg-slate-900/50 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {line.lineId}
                </span>
                {getStatusBadge(line.status)}
              </div>

              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 mb-3" title={line.lineName}>
                {line.lineName}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Current Shift
                  </span>
                  <span className="font-medium text-slate-200">{line.currentShift}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> Shift Lead
                  </span>
                  <span className="font-medium text-slate-200">{line.leadSupervisor}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assigned</span>
                  <span className="text-sm font-bold text-slate-100">{line.assignedEmployees}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Operators</span>
                  <span className="text-sm font-bold text-cyan-400">{line.operatorsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Supv</span>
                  <span className="text-sm font-bold text-amber-400">{line.supervisorsCount}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Line Staffing Rate</span>
                <span className={`font-semibold ${line.workforceUtilization >= 95 ? "text-emerald-400" : "text-amber-400"}`}>
                  {line.workforceUtilization}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    line.workforceUtilization >= 95
                      ? "bg-emerald-500"
                      : line.workforceUtilization >= 80
                      ? "bg-cyan-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.min(line.workforceUtilization, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
