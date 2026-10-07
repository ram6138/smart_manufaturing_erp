"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DailyProductionPerformance } from "@/types/production";
import { Activity, Gauge, TrendingUp } from "lucide-react";

interface ProductionPerformanceChartProps {
  data: DailyProductionPerformance[];
}

export function ProductionPerformanceChart({ data }: ProductionPerformanceChartProps) {
  const CustomOutputTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const planned = payload.find((p: any) => p.dataKey === "planned")?.value || 0;
      const actual = payload.find((p: any) => p.dataKey === "actual")?.value || 0;
      const diff = actual - planned;

      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-sans min-w-[170px]">
          <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
          <div className="flex justify-between items-center text-cyan-400">
            <span>Actual Output:</span>
            <span className="font-mono font-bold">{actual.toLocaleString()} u</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Planned Target:</span>
            <span className="font-mono">{planned.toLocaleString()} u</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
            <span>Variance:</span>
            <span
              className={`font-mono font-semibold ${
                diff >= 0 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {diff >= 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()} u
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomEfficiencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const eff = payload.find((p: any) => p.dataKey === "efficiency")?.value || 0;
      const target = payload.find((p: any) => p.dataKey === "targetEfficiency")?.value || 92;

      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-sans min-w-[170px]">
          <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
          <div className="flex justify-between items-center text-emerald-400">
            <span>Daily Yield:</span>
            <span className="font-mono font-bold">{eff}%</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Plant Target:</span>
            <span className="font-mono">{target}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Production Performance
        </h2>
        <span className="text-xs font-mono text-cyan-400/80">7-Day Telemetry</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Planned vs Actual Production (7 days) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Planned vs. Actual Production Volume
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily unit throughput across all manufacturing lines
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Actual
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Planned
              </span>
            </div>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="prodActualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="prodPlanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />

                <XAxis
                  dataKey="dayLabel"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />

                <Tooltip content={<CustomOutputTooltip />} />

                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#prodPlanGrad)"
                />

                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fill="url(#prodActualGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Production Efficiency % (7 days) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                Production Efficiency
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily line efficiency percentage vs. target
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Target: 92%
            </span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />

                <XAxis
                  dataKey="dayLabel"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                  tickFormatter={(v) => v.split(" ")[0]}
                />

                <YAxis
                  domain={[80, 100]}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                  tickFormatter={(v) => `${v}%`}
                />

                <Tooltip content={<CustomEfficiencyTooltip />} />

                <Line
                  type="monotone"
                  dataKey="targetEfficiency"
                  name="Plant Target"
                  stroke="#eab308"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name="Actual Efficiency"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6, fill: "#34d399" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
