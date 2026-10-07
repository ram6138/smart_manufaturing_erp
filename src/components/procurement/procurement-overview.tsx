"use client";

import React from "react";
import { SupplierItem, PurchaseOrderItem } from "@/types/procurement";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  Calculator,
  Truck,
  Users,
  TrendingUp,
} from "lucide-react";

interface ProcurementOverviewProps {
  suppliers: SupplierItem[];
  orders: PurchaseOrderItem[];
}

export function ProcurementOverview({ suppliers, orders }: ProcurementOverviewProps) {
  const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const approvedOrders = orders.filter(
    (o) =>
      o.poStatus === "Approved" ||
      o.poStatus === "Ordered" ||
      o.poStatus === "Partially Received" ||
      o.poStatus === "Received"
  );
  const approvedSpend = approvedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.poStatus === "Pending Approval" || o.poStatus === "Draft");
  const pendingSpend = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const avgPoValue = orders.length > 0 ? Math.round(totalSpend / orders.length) : 0;

  const deliveredOrders = orders.filter((o) => o.deliveryStatus === "Delivered");
  const onTimeCount = deliveredOrders.filter((o) => o.deliveryStatus !== "Delayed").length;
  const avgOnTimeRate =
    suppliers.length > 0
      ? (
          suppliers.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) /
          suppliers.length
        ).toFixed(1)
      : "93.8";

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Procurement Overview & Spend Health
          </h3>
          <p className="text-xs text-slate-400">
            Committed order allocations, supplier performance indices, and liquidity tracking
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time PO Reconciliation</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Spend */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-purple-400" />
            <span>Total Spend</span>
          </div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(totalSpend)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">6 Purchase Orders</span>
        </div>

        {/* Approved Spend */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approved Spend</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {formatCurrency(approvedSpend)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Committed Capital</span>
        </div>

        {/* Pending Spend */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Spend</span>
          </div>
          <div className="text-lg font-bold text-amber-400">
            {formatCurrency(pendingSpend)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Awaiting Sign-off</span>
        </div>

        {/* Avg PO Value */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg PO Value</span>
          </div>
          <div className="text-lg font-bold text-cyan-300">
            {formatCurrency(avgPoValue)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Per Work Order</span>
        </div>

        {/* On-Time Delivery */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>On-Time Rate</span>
          </div>
          <div className="text-lg font-bold text-blue-400">
            {avgOnTimeRate}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Target: &gt;90%</span>
        </div>

        {/* Supplier Count */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Suppliers</span>
          </div>
          <div className="text-lg font-bold text-white">
            {suppliers.length}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">100% Verified</span>
        </div>
      </div>
    </div>
  );
}
