"use client";

import React from "react";
import {
  CategorySpendPoint,
  PurchaseOrderItem,
  SupplierItem,
} from "@/types/procurement";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Layers,
  Award,
} from "lucide-react";

interface ProcurementAnalyticsProps {
  categories: CategorySpendPoint[];
  orders: PurchaseOrderItem[];
  suppliers: SupplierItem[];
}

export function ProcurementAnalytics({
  categories,
  orders,
  suppliers,
}: ProcurementAnalyticsProps) {
  // 1. POs by Status breakdown
  const statusCounts: Record<string, number> = {
    Received: 0,
    "In Transit / Ordered": 0,
    "Pending Approval": 0,
    Draft: 0,
  };

  orders.forEach((o) => {
    if (o.poStatus === "Received") {
      statusCounts["Received"] += 1;
    } else if (o.poStatus === "Ordered" || o.poStatus === "Partially Received" || o.poStatus === "Approved") {
      statusCounts["In Transit / Ordered"] += 1;
    } else if (o.poStatus === "Pending Approval") {
      statusCounts["Pending Approval"] += 1;
    } else {
      statusCounts["Draft"] += 1;
    }
  });

  const poStatusData = [
    { name: "Received", count: statusCounts["Received"], color: "#10b981" },
    { name: "Ordered / In Transit", count: statusCounts["In Transit / Ordered"], color: "#06b6d4" },
    { name: "Pending Approval", count: statusCounts["Pending Approval"], color: "#f59e0b" },
    { name: "Draft", count: statusCounts["Draft"], color: "#64748b" },
  ];

  // 2. Supplier Delivery & Quality SLA comparison
  const supplierSlaData = suppliers.map((s) => ({
    name: s.supplierName.replace(" Pvt Ltd", "").replace(" Solutions", ""),
    onTimeRate: s.onTimeDeliveryRate,
    qualityScore: s.qualityScore,
  }));

  const totalCategorySpend = categories.reduce((sum, c) => sum + c.spend, 0);

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Spend Donut */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Spend by Category
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
              ₹{(totalCategorySpend / 100000).toFixed(1)}L Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
            <div className="sm:col-span-6 h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${(Number(val) / 100000).toFixed(2)}L`,
                      name,
                    ]}
                  />
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="spend"
                    nameKey="category"
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={`cat-cell-${index}`}
                        fill={entry.color}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Top Spend</span>
                <span className="text-sm font-bold text-white">Raw Materials</span>
              </div>
            </div>

            <div className="sm:col-span-6 space-y-2">
              {categories.map((c) => (
                <div
                  key={c.category}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-slate-300 truncate">{c.category}</span>
                  </div>
                  <span className="font-mono font-semibold text-emerald-400">
                    ₹{(c.spend / 100000).toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Primary Allocation: <strong>Raw Materials (58.4%)</strong></span>
            <span>Packaging: <strong>21.6%</strong></span>
          </div>
        </div>

        {/* Supplier Delivery & Quality SLA Bar Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Supplier Fulfillment Performance
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              SLA Benchmark
            </span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierSlaData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === "onTimeRate" ? "On-Time Delivery" : "Quality Score",
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "5px" }}
                  formatter={(value) => (
                    <span className="text-slate-300">
                      {value === "onTimeRate" ? "On-Time Rate %" : "Quality Score %"}
                    </span>
                  )}
                />
                <Bar dataKey="onTimeRate" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="qualityScore" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Highest Quality: <strong>Odisha Agro Foods (98%)</strong></span>
            </span>
            <span>Target SLA: &gt;90%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
