"use client";

import React from "react";
import { MachineIntelligenceItem } from "@/types/bi";
import { Activity, ShieldAlert, CheckCircle2, Clock, AlertTriangle, Cpu } from "lucide-react";

interface MachineIntelligenceProps {
  machines: MachineIntelligenceItem[];
}

export function MachineIntelligence({ machines }: MachineIntelligenceProps) {
  const avgAvailability = (machines.reduce((sum, m) => sum + m.availability, 0) / (machines.length || 1)).toFixed(1);
  const totalDowntime = machines.reduce((sum, m) => sum + m.downtime, 0).toFixed(1);
  const highRiskCount = machines.filter((m) => m.risk === "High").length;
  const maintenanceDueCount = machines.filter((m) => m.maintenanceStatus !== "Operational").length;

  const getRiskBadge = (risk: MachineIntelligenceItem["risk"]) => {
    switch (risk) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <ShieldAlert className="w-3 h-3" /> High Risk
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Medium
          </span>
        );
      case "Low":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: MachineIntelligenceItem["maintenanceStatus"]) => {
    switch (status) {
      case "Operational":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Operational</span>;
      case "Warning":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">Warning (Overheating)</span>;
      case "Scheduled":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">Scheduled Servicing</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Machine Fleet Intelligence</h3>
              <p className="text-xs text-slate-400">Critical equipment availability, telemetry failure risks & maintenance intervals</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Availability: <strong className="text-emerald-400">{avgAvailability}%</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Downtime: <strong className="text-amber-400">{totalDowntime}h</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">High Risk: <strong className="text-rose-400">{highRiskCount}</strong></span>
          </div>
        </div>

        {/* Machine Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3.5">Machine Equipment</th>
                <th className="py-3 px-3 text-right">Availability</th>
                <th className="py-3 px-3 text-right">Utilization</th>
                <th className="py-3 px-3 text-right">Downtime</th>
                <th className="py-3 px-3 text-center">Failure Risk</th>
                <th className="py-3 px-3.5 text-right">Maintenance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {machines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-750/30 transition-colors">
                  <td className="py-3.5 px-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span>{m.machine}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                    {m.availability}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-cyan-400">
                    {m.utilization}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400">
                    {m.downtime} hrs
                  </td>
                  <td className="py-3.5 px-3 text-center">{getRiskBadge(m.risk)}</td>
                  <td className="py-3.5 px-3.5 text-right">{getStatusBadge(m.maintenanceStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <span>Active Connected Telemetry: <strong>5 / 5 Machines Live</strong></span>
        <span className="text-amber-400 font-medium">Baking Oven 2 Maintenance Overhaul Scheduled</span>
      </div>
    </div>
  );
}
