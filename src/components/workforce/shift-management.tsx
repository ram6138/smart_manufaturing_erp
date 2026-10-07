"use client";

import React from "react";
import { ShiftItem } from "@/types/workforce";
import { Clock, Users, Sun, Sunset, Moon, Shield, CheckCircle2 } from "lucide-react";

interface ShiftManagementProps {
  shifts: ShiftItem[];
}

export function ShiftManagement({ shifts }: ShiftManagementProps) {
  const getShiftIcon = (name: string) => {
    if (name.includes("Morning")) return Sun;
    if (name.includes("Evening")) return Sunset;
    if (name.includes("Night")) return Moon;
    return Clock;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Shift Management</h3>
            <p className="text-xs text-slate-400">
              Rotational shift schedules, active floor manning, and roster utilization rates
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
          4 Rotational Rosters
        </span>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map((s) => {
          const Icon = getShiftIcon(s.shiftName);

          return (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{s.shiftName}</h4>
                      <span className="text-xs font-mono text-slate-400">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-500" />
                  <span>Supervisor: <strong className="text-slate-200">{s.leadSupervisor}</strong></span>
                </div>

                {/* Headcount breakdown */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total</span>
                    <span className="font-mono font-bold text-white">{s.totalAssigned}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block">Present</span>
                    <span className="font-mono font-bold text-emerald-400">{s.presentCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-400 block">Absent</span>
                    <span className="font-mono font-bold text-rose-400">{s.absentCount}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 text-xs pt-1 border-t border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Shift Utilization:</span>
                  <span className="font-mono font-bold text-cyan-300">{s.utilizationRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.utilizationRate >= 90
                        ? "bg-emerald-500"
                        : s.utilizationRate >= 80
                        ? "bg-cyan-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${s.utilizationRate}%` }}
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
