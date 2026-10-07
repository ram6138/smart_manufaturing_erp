"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart as PieIcon,
  ShieldCheck,
} from "lucide-react";
import { CostCategoryBreakdown } from "@/types/finance";

interface FinancialOverviewProps {
  revenue?: number;
  expenses?: number;
  profit?: number;
  cashPosition?: number;
  pendingReceivables?: number;
  costBreakdown: CostCategoryBreakdown[];
}

export function FinancialOverview({
  revenue = 8500000,
  expenses = 6870000,
  profit = 1630000,
  cashPosition = 3450000,
  pendingReceivables = 2850000,
  costBreakdown,
}: FinancialOverviewProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const netMargin = ((profit / (revenue || 1)) * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Financial Overview & Fiscal Health Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Current monthly liquidity, cost distribution, profitability margin & working capital position
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audited Real-Time Ledger</span>
        </div>
      </div>

      {/* Grid of Key Financial Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Inflow vs Outflow */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Total Billed Revenue</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-white">{formatCurrency(revenue)}</div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +19.1% Net Operating Profit Margin
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Expenses</span>
              <span className="font-semibold text-rose-400">{formatCurrency(expenses)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Net Profit</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(profit)}</span>
            </div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Cash Position & Liquidity</span>
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-cyan-400">{formatCurrency(cashPosition)}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Working capital reserve & liquid bank balances
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Cash Runway:</span>
            <span className="text-slate-200 font-semibold">2.8 Months Operating Burn</span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Pending Receivables</span>
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ArrowDownLeft className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-purple-400">{formatCurrency(pendingReceivables)}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Billed customer invoices within 30-day payment term
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Expected Inflow:</span>
            <span className="text-emerald-400 font-semibold">₹19,50,000 by Oct 15</span>
          </div>
        </div>
      </div>

      {/* Mini Cost Breakdown Progress Matrix */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2.5">
          <span className="flex items-center gap-1.5">
            <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
            Manufacturing Cost Breakdown Summary
          </span>
          <span className="text-slate-400">Total Operating Expenses: {formatCurrency(expenses)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {costBreakdown.slice(0, 4).map((cost, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium truncate">{cost.category}</span>
                <span className="text-slate-200 font-bold">{cost.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${cost.percentage}%`, backgroundColor: cost.color }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{formatCurrency(cost.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
