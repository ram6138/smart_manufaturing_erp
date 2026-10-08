"use client";

import React from "react";
import { MonthlyFinancialTrend } from "@/types/finance";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, IndianRupee, ArrowUpRight } from "lucide-react";

interface RevenueExpenseChartProps {
  data: MonthlyFinancialTrend[];
}

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentMonth = data[data.length - 1];
  const prevMonth = data[data.length - 2];
  const revenueGrowth = currentMonth && prevMonth
    ? (((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
    : "1.2";

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Revenue vs Expenses Trend</h3>
              <p className="text-xs text-slate-400">12-Month historical fiscal turnover, operating burn & net margin performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{revenueGrowth}% MoM Revenue
            </span>
          </div>
        </div>

        {/* 12-Month Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as MonthlyFinancialTrend;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[200px]">
                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.month}</p>
                        <div className="flex justify-between text-emerald-400">
                          <span>Revenue:</span>
                          <span className="font-bold">{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-rose-400">
                          <span>Expenses:</span>
                          <span className="font-bold">{formatCurrency(item.expenses)}</span>
                        </div>
                        <div className="flex justify-between text-cyan-400 border-t border-slate-800/80 pt-1">
                          <span>Net Profit:</span>
                          <span className="font-bold">{formatCurrency(item.profit)} ({item.margin}%)</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Total Revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Operational Expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Profit"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <span>Target Annual Profitability: <strong>20.0% Net Margin</strong></span>
        <span className="text-emerald-400 font-medium">12-Month Average Margin: 19.8%</span>
      </div>
    </div>
  );
}
