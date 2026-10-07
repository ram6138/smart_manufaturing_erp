"use client";

import React from "react";
import { CashFlowPoint } from "@/types/finance";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts";
import { Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalIncoming = data.reduce((sum, d) => sum + d.incoming, 0);
  const totalOutgoing = data.reduce((sum, d) => sum + d.outgoing, 0);
  const netCashFlow = totalIncoming - totalOutgoing;

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Cash Flow Overview & Realization</h3>
              <p className="text-xs text-slate-400">Monthly receivables collection velocity vs. vendor and payroll disbursements</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Net Liquidity: +{formatCurrency(netCashFlow)}
            </span>
          </div>
        </div>

        {/* Highlight Micro-metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Total Incoming Collections</div>
              <div className="text-base font-bold text-emerald-400">{formatCurrency(totalIncoming)}</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Total Outgoing Disbursements</div>
              <div className="text-base font-bold text-rose-400">{formatCurrency(totalOutgoing)}</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Cumulative Net Surplus</div>
              <div className="text-base font-bold text-cyan-400">+{formatCurrency(netCashFlow)}</div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Composed Cash Flow Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CashFlowPoint;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[190px]">
                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.month} 2026</p>
                        <div className="flex justify-between text-emerald-400">
                          <span>Incoming:</span>
                          <span className="font-bold">{formatCurrency(item.incoming)}</span>
                        </div>
                        <div className="flex justify-between text-rose-400">
                          <span>Outgoing:</span>
                          <span className="font-bold">{formatCurrency(item.outgoing)}</span>
                        </div>
                        <div className="flex justify-between text-cyan-400 border-t border-slate-800/80 pt-1">
                          <span>Net Cash Flow:</span>
                          <span className="font-bold">+{formatCurrency(item.netCashFlow)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }} />
              <Bar dataKey="incoming" name="Incoming Collections" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" name="Outgoing Outflows" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="netCashFlow"
                name="Net Cash Flow"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <span>Average Monthly Operating Cash Cushion: <strong>₹16.6 Lakhs</strong></span>
        <span className="text-emerald-400 font-semibold">Positive Cash Flow for 6 Consecutive Months</span>
      </div>
    </div>
  );
}
