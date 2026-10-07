"use client";

import React, { useState } from "react";
import { ExpenseRecord, PaymentStatus } from "@/types/finance";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit2,
  Building,
  Check,
  X,
} from "lucide-react";

interface ExpenseTableProps {
  expenses: ExpenseRecord[];
  onDeleteExpense?: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: PaymentStatus) => void;
}

export function ExpenseTable({
  expenses,
  onDeleteExpense,
  onUpdateStatus,
}: ExpenseTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Maintenance":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Maintenance</span>;
      case "Electricity":
      case "Utilities":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">{category}</span>;
      case "Salary":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Salary</span>;
      case "Logistics":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-pink-500/10 text-pink-400 border border-pink-500/20 font-medium">Logistics</span>;
      case "Software":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">Software</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">{category}</span>;
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Operational Expenses Log</h3>
              <p className="text-xs text-slate-400">Plant floor recurring liabilities, service contracts & utility bills</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <span>Filtered Expenses: <strong className="text-white">{expenses.length} records</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3">Expense ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No expense records match the current filter.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {e.expenseId}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {e.date}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">{getCategoryBadge(e.category)}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-500" />
                        {e.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate" title={e.description}>
                      {e.description}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">{getStatusBadge(e.paymentStatus)}</td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedExpense(e)}
                          title="View Expense Details"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onUpdateStatus && e.paymentStatus !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(e.id, "Paid")}
                            title="Mark as Paid"
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteExpense && (
                          <button
                            type="button"
                            onClick={() => onDeleteExpense(e.id)}
                            title="Delete Record"
                            className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-100">Expense Record Details</h3>
              <span className="font-mono text-xs text-cyan-400 font-bold">{selectedExpense.expenseId}</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Date Logged:</span>
                <span className="font-mono text-slate-200">{selectedExpense.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Category & Department:</span>
                <span className="text-slate-200">{selectedExpense.category} • {selectedExpense.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Amount:</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{formatCurrency(selectedExpense.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Payment Status:</span>
                <div>{getStatusBadge(selectedExpense.paymentStatus)}</div>
              </div>
              {selectedExpense.paymentMethod && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Payment Mode:</span>
                  <span className="text-slate-200">{selectedExpense.paymentMethod}</span>
                </div>
              )}
              {selectedExpense.invoiceRef && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Invoice Ref:</span>
                  <span className="font-mono text-cyan-400">{selectedExpense.invoiceRef}</span>
                </div>
              )}
              <div className="pt-1">
                <span className="text-slate-400 block mb-1">Operational Justification:</span>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed">
                  {selectedExpense.description}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setSelectedExpense(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
