"use client";

import React from "react";
import { CostCategoryBreakdown, MonthlyCostPoint } from "@/types/finance";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieIcon, BarChart3, Layers } from "lucide-react";

interface CostAnalysisChartProps {
  distribution: CostCategoryBreakdown[];
  monthlyPoints: MonthlyCostPoint[];
}

export function CostAnalysisChart({ distribution, monthlyPoints }: CostAnalysisChartProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalCost = distribution.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Cost Analysis & Overhead Breakdown</h3>
            <p className="text-xs text-slate-400">Direct material inputs, labor wages, machine upkeep, utilities & distribution expenses</p>
          </div>
        </div>
        <div className="text-xs text-cyan-400 font-semibold bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/40">
          Total Overhead: {formatCurrency(totalCost)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Cost Distribution Donut Chart */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
              Cost Distribution Share (%)
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Current Month</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cost-cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as CostCategoryBreakdown;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-200">{item.category}</p>
                          <p className="text-cyan-400 font-bold">{formatCurrency(item.amount)}</p>
                          <p className="text-slate-400">{item.percentage}% of overall costs</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
            {distribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.category} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Monthly Cost Comparison Multi-Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              Monthly Cost Category Comparison (₹ Lakhs)
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Last 5 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPoints} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as MonthlyCostPoint;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1 min-w-[180px]">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.month} 2026</p>
                          <p className="text-cyan-400">Raw Materials: <strong>{formatCurrency(item.rawMaterials)}</strong></p>
                          <p className="text-emerald-400">Labor: <strong>{formatCurrency(item.labor)}</strong></p>
                          <p className="text-amber-400">Maintenance: <strong>{formatCurrency(item.maintenance)}</strong></p>
                          <p className="text-blue-400">Utilities: <strong>{formatCurrency(item.utilities)}</strong></p>
                          <p className="text-pink-400">Logistics: <strong>{formatCurrency(item.logistics)}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="rawMaterials" name="Raw Materials" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                <Bar dataKey="labor" name="Labor" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="maintenance" name="Maintenance" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="utilities" name="Utilities" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="logistics" name="Logistics" fill="#ec4899" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Largest Cost Driver: <strong>Raw Materials (35.7%)</strong></span>
            <span className="text-emerald-400">Labor Cost Efficiency: 92.4% Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
