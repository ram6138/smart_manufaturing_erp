"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ProductionTrendPoint } from "@/types/dashboard";
import { TrendingUp, Layers, Info } from "lucide-react";

interface ProductionTrendChartProps {
  data: ProductionTrendPoint[];
}

export function ProductionTrendChart({ data }: ProductionTrendChartProps) {
  // Custom tooltip for clean enterprise dark styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const planned = payload.find((p: any) => p.dataKey === "planned")?.value || 0;
      const actual = payload.find((p: any) => p.dataKey === "actual")?.value || 0;
      const variance = actual - planned;
      const efficiency = ((actual / planned) * 100).toFixed(1);

      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs space-y-1.5 font-sans min-w-[180px]">
          <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
          <div className="flex justify-between items-center text-cyan-400">
            <span>Actual Production:</span>
            <span className="font-mono font-bold">{actual.toLocaleString()} u</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Planned Production:</span>
            <span className="font-mono">{planned.toLocaleString()} u</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
            <span className="text-slate-400">Yield Efficiency:</span>
            <span
              className={`font-mono font-bold ${
                Number(efficiency) >= 95 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {efficiency}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalActual = data.reduce((acc, curr) => acc + curr.actual, 0);
  const totalPlanned = data.reduce((acc, curr) => acc + curr.planned, 0);
  const avgEfficiency = ((totalActual / totalPlanned) * 100).toFixed(1);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Production Trend
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Planned vs. actual units produced across all biscuit production lines
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 text-xs bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span className="text-slate-300 font-medium">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-400 border-dashed" />
            <span className="text-slate-400 font-medium">Planned</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <span className="text-emerald-400 font-mono font-bold">
            {avgEfficiency}% Avg Yield
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />

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

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="planned"
              name="Planned Production"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#plannedGradient)"
            />

            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Production"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#actualGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
