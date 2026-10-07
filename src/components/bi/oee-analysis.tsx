"use client";

import React from "react";
import { OeeFactorData } from "@/types/bi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Cpu, CheckCircle2, Calculator, ArrowUpRight, Zap } from "lucide-react";

interface OeeAnalysisProps {
  data: OeeFactorData;
}

export function OeeAnalysis({ data }: OeeAnalysisProps) {
  const availabilityPct = (data.availability * 100).toFixed(1);
  const performancePct = (data.performance * 100).toFixed(1);
  const qualityPct = (data.quality * 100).toFixed(1);
  const calculatedOee = ((data.availability * data.performance * data.quality) * 100).toFixed(1);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Overall Equipment Effectiveness (OEE)</h3>
            <p className="text-xs text-slate-400">Mathematical three-factor equipment utilization standard: Availability × Performance × Quality</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/40 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Calculated OEE: <strong className="text-white text-sm font-mono">{calculatedOee}%</strong>
          </span>
        </div>
      </div>

      {/* 3 Component Visual Mathematical Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Availability */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>1. Machine Availability</span>
              <span className="text-amber-400 font-bold">Uptime Ratio</span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{availabilityPct}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Operating Time vs Planned Production Time</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-3">
            <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${availabilityPct}%` }} />
          </div>
        </div>

        {/* Performance */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>2. Line Performance</span>
              <span className="text-cyan-400 font-bold">Speed Ratio</span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{performancePct}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Actual Cycle Speed vs Ideal Nameplate Standard</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-3">
            <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: `${performancePct}%` }} />
          </div>
        </div>

        {/* Quality */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>3. Product Quality</span>
              <span className="text-emerald-400 font-bold">Yield Ratio</span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{qualityPct}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Good Units vs Total Units Processed</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-3">
            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${qualityPct}%` }} />
          </div>
        </div>

        {/* Composite Result Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold mb-1">
              <span>Composite OEE</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{calculatedOee}%</div>
            <div className="text-[10px] text-slate-300 mt-1 font-mono">
              0.93 × 0.91 × 0.96 = 81.2%
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> World-Class Target: 85.0%
          </span>
        </div>
      </div>

      {/* 6-Month OEE Trend Multi-Line Chart */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-200">
            6-Month OEE Factor Performance Progression
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Continuous Batch Roster</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.month} 2026</p>
                        <p className="text-amber-400">Availability: <strong>{item.availability}%</strong></p>
                        <p className="text-cyan-400">Performance: <strong>{item.performance}%</strong></p>
                        <p className="text-emerald-400">Quality: <strong>{item.quality}%</strong></p>
                        <p className="text-white border-t border-slate-800/80 pt-1">OEE Index: <strong className="text-cyan-300">{item.oee}%</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
              <Line type="monotone" dataKey="availability" name="Availability" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="performance" name="Performance" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="quality" name="Quality" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="oee" name="Composite OEE" stroke="#ffffff" strokeWidth={2.5} dot={{ r: 3, fill: "#ffffff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
