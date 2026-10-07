"use client";

import React from "react";
import { ProductionForecastPoint } from "@/types/ai-insights";
import {
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

interface ProductionForecastChartProps {
  summary: {
    next7DaysForecast: string;
    expectedDemand: string;
    forecastStatus: string;
    explanation: string;
  };
  series: ProductionForecastPoint[];
}

export function ProductionForecastChart({
  summary,
  series,
}: ProductionForecastChartProps) {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                AI Production Forecast
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                <Sparkles className="w-2.5 h-2.5" />
                7-Day ML Horizon
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Trained on shop-floor throughput, SKU changeovers & seasonal demand curves
            </p>
          </div>
        </div>

        <Link
          href="/production"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Production Schedule</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">
            Next 7 Days Forecast:
          </span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono mt-1 block">
            {summary.next7DaysForecast}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Aggregated SKU output projection
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">
            Expected Demand:
          </span>
          <span className="text-2xl font-extrabold text-slate-100 font-mono mt-1 block">
            {summary.expectedDemand}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Committed sales order backlog
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">
              Forecast Status:
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              {summary.forecastStatus}
            </span>
          </div>
          <span className="text-[10px] text-emerald-300/80 font-medium">
            Buffer: +1,700 units surplus (+4.1%)
          </span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Daily Production (Actual vs. Forecast) & Demand Target
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Solid line indicates verified shop floor tally; dashed cyan line indicates AI neural projection
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-400" />
              <span className="text-slate-300">Historical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-cyan-400 border-t-2 border-dashed border-cyan-400" />
              <span className="text-cyan-300 font-semibold">AI Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-400" />
              <span className="text-slate-400">Demand Target</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={series}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                domain={[5000, 7000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value).toLocaleString()} units`,
                  name === "historical"
                    ? "Actual Production"
                    : name === "forecast"
                    ? "AI Forecast"
                    : "Demand Target",
                ]}
              />
              {/* Historical actuals */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#38bdf8" }}
                connectNulls={false}
              />
              {/* AI Forecast (Dashed) */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#22d3ee"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#22d3ee" }}
                connectNulls={false}
              />
              {/* Target demand baseline */}
              <Line
                type="monotone"
                dataKey="demandTarget"
                stroke="#a855f7"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            <strong>AI Intelligence Assessment:</strong> "{summary.explanation}"
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
          Confidence Interval: 94.2%
        </span>
      </div>
    </div>
  );
}
