"use client";

import React from "react";
import { MachinePerformanceItem } from "@/types/production";
import { Wrench, CheckCircle2, AlertTriangle, Clock, Activity } from "lucide-react";

interface MachinePerformanceProps {
  machines: MachinePerformanceItem[];
}

export function MachinePerformance({ machines }: MachinePerformanceProps) {
  const getStatusBadge = (status: MachinePerformanceItem["status"]) => {
    switch (status) {
      case "Running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Running
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Warning
          </span>
        );
      case "Idle":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Idle
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-400" />
            Machine Performance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production output, uptime utilization & operational health per plant asset
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400/80">5 Equipment Units</span>
      </div>

      {/* Machine Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Machine Asset</th>
              <th className="pb-3 font-semibold text-right">Output Quantity</th>
              <th className="pb-3 font-semibold text-center">Utilization</th>
              <th className="pb-3 font-semibold text-center">Downtime</th>
              <th className="pb-3 font-semibold text-center">Efficiency</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {machines.map((mach) => (
              <tr key={mach.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 pr-3 whitespace-nowrap">
                  <div className="font-semibold text-white">{mach.machine}</div>
                  <div className="text-[11px] text-slate-400">
                    {mach.type} • <span className="font-mono text-cyan-400">{mach.currentBatch}</span>
                  </div>
                </td>

                <td className="py-3.5 px-3 text-right font-mono font-bold text-white whitespace-nowrap">
                  {mach.productionQuantity.toLocaleString()} units
                </td>

                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-mono font-semibold text-slate-200">
                      {mach.utilization}%
                    </span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          mach.utilization >= 90
                            ? "bg-cyan-400"
                            : mach.utilization >= 70
                            ? "bg-blue-400"
                            : "bg-rose-400"
                        }`}
                        style={{ width: `${mach.utilization}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono text-slate-300">
                  <span
                    className={
                      mach.downtimeHours > 10
                        ? "text-amber-400 font-bold"
                        : "text-slate-300"
                    }
                  >
                    {mach.downtimeHours} hrs
                  </span>
                </td>

                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span
                    className={`font-mono font-bold text-xs ${
                      mach.efficiency >= 95
                        ? "text-emerald-400"
                        : mach.efficiency >= 90
                        ? "text-blue-400"
                        : "text-rose-400"
                    }`}
                  >
                    {mach.efficiency}%
                  </span>
                </td>

                <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                  {getStatusBadge(mach.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
