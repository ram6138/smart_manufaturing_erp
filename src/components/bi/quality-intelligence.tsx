"use client";

import React from "react";
import { QualityIntelligenceData } from "@/types/bi";
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
import { ShieldCheck, CheckCircle2, AlertCircle, PieChart as PieIcon, Award } from "lucide-react";

interface QualityIntelligenceProps {
  data: QualityIntelligenceData;
}

export function QualityIntelligence({ data }: QualityIntelligenceProps) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Quality Intelligence & Defect Pareto</h3>
            <p className="text-xs text-slate-400">First-pass yield, defect typology distribution & product pass rate variance</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Pass Rate: <strong className="text-emerald-400">{data.passRate}%</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Scrap Rate: <strong className="text-rose-400">{data.rejectionRate}%</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Quality Index: <strong className="text-cyan-400">{data.qualityScore} / 100</strong></span>
        </div>
      </div>

      {/* Grid with Donut Defect Distribution and Product Pass Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Defect Distribution Donut Chart */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-rose-400" />
              Defect Distribution Typology (%)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">126 Total Defect Logged</span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.defectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {data.defectDistribution.map((entry, index) => (
                    <Cell key={`defect-cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-200">{item.defectType}</p>
                          <p className="text-rose-400">Count: <strong>{item.count} defects</strong></p>
                          <p className="text-slate-400">{item.percentage}% of overall scrap</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
            {data.defectDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.defectType} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Quality Comparison Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Product-Wise Inspection Pass Rate (%)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">6 Biscuit SKUs</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.productQuality.map((p) => ({
                  name: p.productName.replace(" Biscuit", ""),
                  fullName: p.productName,
                  passRate: p.passRate,
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.fullName}</p>
                          <p className="text-emerald-400">Pass Rate: <strong>{item.passRate}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
