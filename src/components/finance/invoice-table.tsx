"use client";

import React, { useState } from "react";
import { InvoiceRecord, InvoiceStatus, InvoiceType } from "@/types/finance";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Check,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

interface InvoiceTableProps {
  invoices: InvoiceRecord[];
  onUpdateStatus?: (id: string, newStatus: InvoiceStatus) => void;
}

export function InvoiceTable({ invoices, onUpdateStatus }: InvoiceTableProps) {
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filterType !== "All" && inv.type !== filterType) return false;
    if (filterStatus !== "All" && inv.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getTypeBadge = (type: InvoiceType) => {
    if (type === "Customer Invoice") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          <ArrowDownLeft className="w-3 h-3" /> Receivable
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
        <ArrowUpRight className="w-3 h-3" /> Payable
      </span>
    );
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Invoice & Payment Tracking</h3>
              <p className="text-xs text-slate-400">Customer billing receivables and vendor supplier payables ledger</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="Customer Invoice">Customer Invoices (AR)</option>
              <option value="Supplier Invoice">Supplier Invoices (AP)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3">Invoice Number</th>
                <th className="py-3 px-3">Customer / Supplier</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No invoices match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-200">
                      <div className="font-semibold text-white">{inv.entityName}</div>
                      {inv.notes && (
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{inv.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">{getTypeBadge(inv.type)}</td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">{inv.date}</td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">{getStatusBadge(inv.status)}</td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          title="View Invoice Details"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onUpdateStatus && inv.status !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(inv.id, "Paid")}
                            title="Mark as Settled / Paid"
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
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

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-100">Invoice Specification</h3>
              <span className="font-mono text-xs text-cyan-400 font-bold">{selectedInvoice.invoiceNumber}</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Entity / Counterparty:</span>
                <span className="font-semibold text-slate-200">{selectedInvoice.entityName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Classification:</span>
                <span>{selectedInvoice.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Billed Amount:</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{formatCurrency(selectedInvoice.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Issued Date:</span>
                <span className="font-mono text-slate-200">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Settlement Due Date:</span>
                <span className="font-mono text-slate-200">{selectedInvoice.dueDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Payment Status:</span>
                <div>{getStatusBadge(selectedInvoice.status)}</div>
              </div>
              {selectedInvoice.notes && (
                <div className="pt-1">
                  <span className="text-slate-400 block mb-1">Billing Reference / Description:</span>
                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
                    {selectedInvoice.notes}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
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
