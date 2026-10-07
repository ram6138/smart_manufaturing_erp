"use client";

import React from "react";
import { SupplierItem } from "@/types/procurement";
import {
  Activity,
  Award,
  Truck,
  Clock,
  IndianRupee,
  Package,
} from "lucide-react";

interface SupplierPerformanceProps {
  suppliers: SupplierItem[];
}

export function SupplierPerformance({ suppliers }: SupplierPerformanceProps) {
  const formatCurrency = (val?: number) => {
    const num = typeof val === "number" && !isNaN(val) ? val : 0;
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Supplier Performance
            </h3>
            <p className="text-xs text-slate-400">
              Operational KPIs, batch quality conformance, and on-time fulfillment tracking
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Vendor Service Level Agreements (SLA)
        </span>
      </div>

      {/* Supplier Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-white text-sm tracking-tight">{s.supplierName}</h4>
                <span className="text-xs text-slate-400 font-mono">
                  {s.supplierCode} • {s.category}
                </span>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {s.totalOrders} Orders
              </span>
            </div>

            {/* Quality Score Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Quality Score
                </span>
                <span className="font-mono font-bold text-emerald-400">{s.qualityScore}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${s.qualityScore}%` }}
                />
              </div>
            </div>

            {/* On-Time Delivery Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  On-Time Delivery
                </span>
                <span className="font-mono font-bold text-blue-400">{s.onTimeDeliveryRate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${s.onTimeDeliveryRate}%` }}
                />
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Lead Time: <strong className="text-white">{s.averageLeadTimeDays} days</strong></span>
              </div>
              <div className="text-right text-slate-400">
                <span>Spend: <strong className="text-emerald-400 font-mono">{formatCurrency(s.totalSpend)}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
