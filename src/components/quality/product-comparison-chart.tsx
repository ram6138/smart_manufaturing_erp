"use client";

import React, { useState } from "react";
import { ProductQualityComparison } from "@/types/quality";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, Award, Layers } from "lucide-react";

interface ProductComparisonChartProps {
  data: ProductQualityComparison[];
}

export function ProductComparisonChart({ data }: ProductComparisonChartProps) {
  const [activeMetric, setActiveMetric] = useState<"rates" | "defectCount">("rates");

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Product Quality Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Benchmark pass rate, rejection percentage, and defect volumes across SKU families
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMetric("rates")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeMetric === "rates"
                ? "bg-blue-500 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pass vs Rejection %
          </button>
          <button
            onClick={() => setActiveMetric("defectCount")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeMetric === "defectCount"
                ? "bg-blue-500 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Defect Units
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "rates" ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="product"
                stroke="#64748b"
                fontSize={11}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={45}
              />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                formatter={(val: any, name: any) => [
                  `${val}%`,
                  name === "passRate" ? "Pass Rate" : "Rejection Rate",
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-300">
                    {value === "passRate" ? "Pass Rate (%)" : "Rejection Rate (%)"}
                  </span>
                )}
              />
              <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Bar dataKey="rejectionRate" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={38} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="product"
                stroke="#64748b"
                fontSize={11}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={45}
              />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`${Number(val).toLocaleString()} units`, "Defects"]}
              />
              <Bar dataKey="defectCount" name="Defect Units" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Banner */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>Top Performer: <strong className="text-emerald-400">Classic Butter Biscuit (98.6% Pass Rate)</strong></span>
        </span>
        <span className="text-slate-400">
          Focus SKU: <strong className="text-rose-400">Chocolate Biscuit (5.8% Rejection Rate)</strong>
        </span>
      </div>
    </div>
  );
}
