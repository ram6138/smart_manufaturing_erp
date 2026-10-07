"use client";

import React from "react";
import { SupplierSpending } from "@/types/finance";
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
import { ShoppingBag, Building2, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

interface ProcurementSpendingProps {
  suppliers: SupplierSpending[];
}

export function ProcurementSpending({ suppliers }: ProcurementSpendingProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalProcurementSpend = suppliers.reduce((sum, s) => sum + s.totalSpend, 0);
  const totalPaid = suppliers.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalPending = suppliers.reduce((sum, s) => sum + s.pendingAmount, 0);

  const chartData = suppliers.map((s) => ({
    name: s.supplier.split(" ")[0] + " " + (s.supplier.split(" ")[1] || ""),
    fullName: s.supplier,
    paid: s.paidAmount,
    pending: s.pendingAmount,
    total: s.totalSpend,
  }));

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Procurement Spending & Vendor Payables</h3>
            <p className="text-xs text-slate-400">Direct integration with Vendor Purchase Orders & material deliveries</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Total Spend: <strong className="text-white">{formatCurrency(totalProcurementSpend)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Settled: <strong className="text-emerald-400">{formatCurrency(totalPaid)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Pending: <strong className="text-amber-400">{formatCurrency(totalPending)}</strong></span>
        </div>
      </div>

      {/* Supplier Spend Summary Table & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table View */}
        <div className="lg:col-span-6 overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-2 text-center">POs</th>
                <th className="py-3 px-3 text-right">Total Spend</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-750/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-200">
                    <div className="font-semibold text-white">{s.supplier}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{s.category}</div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-cyan-400">
                    {s.purchaseOrdersCount}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                    {formatCurrency(s.totalSpend)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold">
                    {formatCurrency(s.paidAmount)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-400 font-semibold">
                    {formatCurrency(s.pendingAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar Chart View */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Vendor Spending & Disbursement Status
            </h4>
            <span className="text-[10px] text-slate-400">Paid vs Pending Balance</span>
          </div>

          <div className="h-56 w-full">
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
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-200">{item.fullName}</p>
                          <p className="text-emerald-400">Paid Amount: <strong>{formatCurrency(item.paid)}</strong></p>
                          <p className="text-amber-400">Pending Amount: <strong>{formatCurrency(item.pending)}</strong></p>
                          <p className="text-slate-300">Total Spend: <strong>{formatCurrency(item.total)}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="paid" name="Settled Payout" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name="Pending Invoice" fill="#f59e0b" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
