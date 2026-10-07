"use client";

import React from "react";
import { PredictiveMaintenanceItem } from "@/types/ai-insights";
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface PredictiveMaintenanceTableProps {
  items: PredictiveMaintenanceItem[];
  onRowClick?: (item: PredictiveMaintenanceItem) => void;
}

export function PredictiveMaintenanceTable({
  items,
  onRowClick,
}: PredictiveMaintenanceTableProps) {
  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case "High Risk":
        return {
          bg: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          icon: AlertOctagon,
        };
      case "Medium Risk":
        return {
          bg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icon: AlertTriangle,
        };
      case "Low Risk":
      default:
        return {
          bg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          icon: CheckCircle2,
        };
    }
  };

  const getRiskBarColor = (score: number) => {
    if (score >= 70) return "bg-rose-500";
    if (score >= 30) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                Predictive Maintenance
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                AI Prediction
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Machine health telemetry, failure risk scoring & recommended maintenance actions
            </p>
          </div>
        </div>

        <Link
          href="/machines"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Open Machines Telemetry</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Machine</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Prediction</th>
              <th className="py-3 px-4">Main Signal</th>
              <th className="py-3 px-4">Recommended Action</th>
              <th className="py-3 px-4 text-right">Telemetry Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {items.map((item) => {
              const predBadge = getPredictionBadge(item.prediction);
              const PredIcon = predBadge.icon;
              const barColor = getRiskBarColor(item.riskScore);

              return (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <span>{item.machine}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 min-w-[120px]">
                      <span className="font-bold text-slate-100 font-mono w-8">
                        {item.riskScore}%
                      </span>
                      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${item.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${predBadge.bg}`}
                    >
                      <PredIcon className="w-3 h-3" />
                      {item.prediction}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {item.mainSignal}
                  </td>

                  <td className="py-3.5 px-4 text-slate-200">
                    <span className="font-medium text-cyan-200">
                      {item.recommendedAction}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {item.telemetrySource}
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
