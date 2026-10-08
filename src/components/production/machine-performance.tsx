"use client";

import React from "react";
import { MachinePerformanceItem } from "@/types/production";
import { Wrench, CheckCircle2, AlertTriangle, Clock, Activity } from "lucide-react";

interface MachinePerformanceProps {
  machines: MachinePerformanceItem[];
  onSelectMachine?: (machineName: string) => void;
  selectedMachine?: string;
}

export function MachinePerformance({
  machines,
  onSelectMachine,
  selectedMachine,
}: MachinePerformanceProps) {
  const getStatusBadge = (status: MachinePerformanceItem["status"]) => {
    switch (status) {
      case "Running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        );
      case "Idle":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Idle
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-600" />
            Machine Performance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Production output, uptime utilization & health per plant asset (Click to filter)
          </p>
        </div>
        <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
          5 Equipment Units
        </span>
      </div>

      {/* Machine Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Machine Asset</th>
              <th className="pb-3 font-semibold text-right">Output Quantity</th>
              <th className="pb-3 font-semibold text-center">Utilization</th>
              <th className="pb-3 font-semibold text-center">Downtime</th>
              <th className="pb-3 font-semibold text-center">Efficiency</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {machines.map((mach) => {
              const isSelected = selectedMachine === mach.machine;

              return (
                <tr
                  key={mach.id}
                  onClick={() => onSelectMachine && onSelectMachine(mach.machine)}
                  title={`Click to filter orders for ${mach.machine}`}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-blue-50/70 text-blue-900 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <td className="py-3.5 pr-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition">
                      {mach.machine}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {mach.type} •{" "}
                      <span className="font-mono text-blue-600 font-medium">
                        {mach.currentBatch}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {mach.productionQuantity.toLocaleString()} units
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono font-semibold text-slate-700">
                        {mach.utilization}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            mach.utilization >= 90
                              ? "bg-cyan-500"
                              : mach.utilization >= 70
                              ? "bg-blue-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${mach.utilization}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono">
                    <span
                      className={
                        mach.downtimeHours > 10
                          ? "text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                          : "text-slate-600"
                      }
                    >
                      {mach.downtimeHours} hrs
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-xs ${
                        mach.efficiency >= 95
                          ? "text-emerald-700"
                          : mach.efficiency >= 90
                          ? "text-blue-700"
                          : "text-rose-700"
                      }`}
                    >
                      {mach.efficiency}%
                    </span>
                  </td>

                  <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                    {getStatusBadge(mach.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
