"use client";

import React from "react";
import { DepartmentBudget } from "@/types/finance";
import { PieChart, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";

interface BudgetManagementProps {
  budgets: DepartmentBudget[];
}

export function BudgetManagement({ budgets }: BudgetManagementProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedBudget, 0);
  const totalUsed = budgets.reduce((sum, b) => sum + b.usedAmount, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remainingBudget, 0);
  const overallUtilization = ((totalUsed / (totalAllocated || 1)) * 100).toFixed(1);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Department Budget Management</h3>
              <p className="text-xs text-slate-400">Monthly fiscal expenditure quotas, utilized allocations & burn thresholds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Allocated: <strong className="text-white">{formatCurrency(totalAllocated)}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Used: <strong className="text-cyan-400">{formatCurrency(totalUsed)}</strong> ({overallUtilization}%)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Remaining: <strong className="text-emerald-400">{formatCurrency(totalRemaining)}</strong></span>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {budgets.map((b) => {
            const isNearLimit = b.utilizationRate >= 90;
            const isExceeded = b.utilizationRate > 100;

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isExceeded
                    ? "bg-rose-950/20 border-rose-500/40"
                    : isNearLimit
                    ? "bg-amber-950/20 border-amber-500/40"
                    : "bg-slate-900/50 border-slate-700/60 hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-100">{b.department}</span>
                    {isExceeded ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                        <ShieldAlert className="w-3 h-3" /> Exceeded
                      </span>
                    ) : isNearLimit ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" /> Near Limit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Normal
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 my-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Allocated:</span>
                      <span className="font-mono text-slate-200">{formatCurrency(b.allocatedBudget)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Used Amount:</span>
                      <span className="font-mono font-bold text-cyan-400">{formatCurrency(b.usedAmount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-1">
                      <span>Remaining:</span>
                      <span className="font-mono font-semibold text-emerald-400">{formatCurrency(b.remainingBudget)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Budget Consumed</span>
                    <span className={`font-bold font-mono ${isNearLimit ? "text-amber-400" : "text-emerald-400"}`}>
                      {b.utilizationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isExceeded
                          ? "bg-rose-500"
                          : isNearLimit
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(b.utilizationRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <span>Fiscal Cycle: <strong>Monthly Operational Budget (Oct 2026)</strong></span>
        <span className="text-cyan-400 font-medium">Auto-reconciliation with POs & Payroll active</span>
      </div>
    </div>
  );
}
