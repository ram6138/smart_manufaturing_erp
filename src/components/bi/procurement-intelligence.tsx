"use client";

import React from "react";
import { ProcurementIntelligenceData } from "@/types/bi";
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
import { ShoppingBag, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ProcurementIntelligenceProps {
  data: ProcurementIntelligenceData;
}

export function ProcurementIntelligence({ data }: ProcurementIntelligenceProps) {
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
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Procurement Intelligence & Supply Velocity</h3>
            <p className="text-xs text-slate-400">Supplier order spend, purchase requisition status, on-time inbound deliveries & PO cycles</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Total Spend: <strong className="text-white">{formatCurrency(data.procurementSpend)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">On-Time Rate: <strong className="text-emerald-400">{data.onTimeDelivery}%</strong></span>
        </div>
      </div>

      {/* Spend Categories Distribution & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Progress */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-200 mb-3">
              Procurement Category Spend Share
            </h4>

            <div className="space-y-3">
              {data.spendCategories.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{c.category}</span>
                    <span className="text-slate-200 font-mono font-semibold">{formatCurrency(c.amount)} ({c.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${c.percentage}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Active Suppliers: <strong>{data.supplierCount} Vendors</strong></span>
            <span>Active POs: <strong className="text-cyan-400">{data.activePurchaseOrders}</strong></span>
          </div>
        </div>

        {/* 5-Month Spend Trend Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Monthly Procurement Spend Velocity (₹ Lakhs)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Last 5 Months</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.spendTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                          <p className="text-purple-400">Procurement Spend: <strong>{formatCurrency(item.spend)}</strong></p>
                          <p className="text-cyan-400">Purchase Orders Issued: <strong>{item.posCount} POs</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="spend" name="Spend Amount" fill="#a855f7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
