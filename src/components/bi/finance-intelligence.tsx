"use client";

import React from "react";
import { FinanceIntelligenceData } from "@/types/bi";
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
import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, PieChart as PieIcon } from "lucide-react";

interface FinanceIntelligenceProps {
  data: FinanceIntelligenceData;
}

export function FinanceIntelligence({ data }: FinanceIntelligenceProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Finance Intelligence & Margins</h3>
            <p className="text-xs text-slate-400">Total plant revenue, cost of goods manufactured (COGM), gross profits & margin yield</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Revenue: <strong className="text-white">{formatCurrency(data.revenue)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Gross Profit: <strong className="text-emerald-400">{formatCurrency(data.grossProfit)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Margin: <strong className="text-cyan-400">{data.profitMargin}%</strong></span>
        </div>
      </div>

      {/* Financial Trend Area Chart & Cost Breakdown Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6-Month Financial Trend */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              6-Month Revenue vs Expense & Profit Trend (₹ Lakhs)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Fiscal 2026</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="biRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="biExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.month} 2026</p>
                          <p className="text-emerald-400">Revenue: <strong>{formatCurrency(item.revenue)}</strong></p>
                          <p className="text-rose-400">Expenses: <strong>{formatCurrency(item.expenses)}</strong></p>
                          <p className="text-cyan-400">Profit: <strong>{formatCurrency(item.profit)}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#10b981" strokeWidth={2} fill="url(#biRev)" />
                <Area type="monotone" dataKey="expenses" name="Total Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#biExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Breakdown Progress Matrix */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
              Overhead Cost Category Breakdown
            </h4>

            <div className="space-y-2">
              {data.costBreakdown.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate">{c.category}</span>
                    <span className="text-slate-200 font-mono font-semibold">{formatCurrency(c.amount)} ({c.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${c.percentage}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Pending Payables: <strong className="text-amber-400">{formatCurrency(data.pendingPayments)}</strong></span>
            <span className="text-emerald-400 font-semibold">19.1% Margin Yield</span>
          </div>
        </div>
      </div>
    </div>
  );
}
