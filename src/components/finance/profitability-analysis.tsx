"use client";

import React from "react";
import { ProductProfitability } from "@/types/finance";
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
import { TrendingUp, Award, DollarSign, Percent } from "lucide-react";

interface ProfitabilityAnalysisProps {
  products: ProductProfitability[];
}

export function ProfitabilityAnalysis({ products }: ProfitabilityAnalysisProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = products.reduce((sum, p) => sum + p.profit, 0);
  const avgMargin = ((totalProfit / (totalRevenue || 1)) * 100).toFixed(1);

  const chartData = products.map((p) => ({
    name: p.productName.replace(" Biscuit", ""),
    fullName: p.productName,
    revenue: p.revenue,
    cost: p.productionCost,
    profit: p.profit,
    margin: p.profitMargin,
  }));

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Product Profitability Analysis</h3>
            <p className="text-xs text-slate-400">SKU-level gross realization, direct margin contributions & return on production</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Batch Revenue: <strong className="text-white">{formatCurrency(totalRevenue)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Gross Margin: <strong className="text-emerald-400">{avgMargin}%</strong></span>
        </div>
      </div>

      {/* Grid of Product Cards and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Revenue vs Production Cost & Net Profit (₹ Lakhs)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">By Biscuit Product Line</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={formatLakhs} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1 min-w-[190px]">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.fullName}</p>
                          <p className="text-emerald-400">Revenue: <strong>{formatCurrency(item.revenue)}</strong></p>
                          <p className="text-rose-400">Prod Cost: <strong>{formatCurrency(item.cost)}</strong></p>
                          <p className="text-cyan-400">Net Profit: <strong>{formatCurrency(item.profit)}</strong> ({item.margin}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cost" name="Production Cost" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Profitability Matrix Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {products.map((p, idx) => (
            <div
              key={p.id}
              className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-white">{p.productName}</span>
                  {idx === 0 && (
                    <span className="p-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]" title="Top Margin Performer">
                      ⭐
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Rev: {formatCurrency(p.revenue)}</span>
                  <span>•</span>
                  <span>Cost: {formatCurrency(p.productionCost)}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-xs text-emerald-400">+{formatCurrency(p.profit)}</div>
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold text-[10px] border border-emerald-500/20">
                  {p.profitMargin}% Margin
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
