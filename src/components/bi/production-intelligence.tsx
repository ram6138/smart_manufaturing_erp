"use client";

import React from "react";
import { ProductionIntelligenceData } from "@/types/bi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Factory, Package, CheckCircle2, Clock, ShieldAlert, TrendingUp } from "lucide-react";

interface ProductionIntelligenceProps {
  data: ProductionIntelligenceData;
}

export function ProductionIntelligence({ data }: ProductionIntelligenceProps) {
  const formatThousands = (val: number) => `${(val / 1000).toFixed(0)}k`;

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Production Intelligence & Fulfillment</h3>
            <p className="text-xs text-slate-400">Batch output volume, planned vs actual variance, line efficiency & product run yield</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Planned: <strong className="text-white">{data.plannedProduction.toLocaleString()}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Actual: <strong className="text-emerald-400">{data.actualProduction.toLocaleString()}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Efficiency: <strong className="text-cyan-400">{data.productionEfficiency}%</strong></span>
        </div>
      </div>

      {/* Summary Micro-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Planned Run</span>
          <span className="text-base font-bold text-slate-100 font-mono">{data.plannedProduction.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block">Total Target</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 uppercase block">Actual Output</span>
          <span className="text-base font-bold text-emerald-400 font-mono">{data.actualProduction.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-500/80 block">95.0% Realization</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-cyan-500/30">
          <span className="text-[10px] text-cyan-400 uppercase block">Efficiency</span>
          <span className="text-base font-bold text-cyan-400 font-mono">{data.productionEfficiency}%</span>
          <span className="text-[10px] text-cyan-500/80 block">Standard &gt;90%</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-rose-500/30">
          <span className="text-[10px] text-rose-400 uppercase block">Rejection Rate</span>
          <span className="text-base font-bold text-rose-400 font-mono">{data.rejectionRate}%</span>
          <span className="text-[10px] text-slate-400 block">3,250 pkts scrap</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/30">
          <span className="text-[10px] text-amber-400 uppercase block">Line Downtime</span>
          <span className="text-base font-bold text-amber-400 font-mono">{data.downtimeHours}h</span>
          <span className="text-[10px] text-slate-400 block">Across 2 Lines</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-purple-500/30">
          <span className="text-[10px] text-purple-400 uppercase block">Completed POs</span>
          <span className="text-base font-bold text-purple-400 font-mono">{data.completedOrdersCount}</span>
          <span className="text-[10px] text-slate-400 block">100% Dispatched</span>
        </div>
      </div>

      {/* Dual Charts: Trend & Product Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planned vs Actual Weekly Output */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Weekly Planned vs Actual Output
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Current Month</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatThousands} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.period}</p>
                          <p className="text-slate-400">Planned: <strong>{item.planned.toLocaleString()}</strong></p>
                          <p className="text-emerald-400">Actual: <strong>{item.actual.toLocaleString()}</strong></p>
                          <p className="text-cyan-400">Efficiency: <strong>{item.efficiency}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="planned" name="Planned Target" fill="#475569" radius={[3, 3, 0, 0]} />
                <Bar dataKey="actual" name="Actual Production" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product SKU Breakdown Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Product-Wise Batch Output & Scrap Rate
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">6 Biscuit SKUs</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.productBreakdown.map((p) => ({
                  name: p.productName.replace(" Biscuit", ""),
                  fullName: p.productName,
                  actual: p.actual,
                  rejectionRate: p.rejectionRate,
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={formatThousands} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.fullName}</p>
                          <p className="text-emerald-400">Actual Units: <strong>{item.actual.toLocaleString()}</strong></p>
                          <p className="text-rose-400">Rejection Rate: <strong>{item.rejectionRate}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="actual" name="Produced Volume (pkts)" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
