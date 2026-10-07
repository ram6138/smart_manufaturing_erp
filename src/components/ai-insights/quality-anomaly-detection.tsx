"use client";

import React from "react";
import { QualityAnomalyItem } from "@/types/ai-insights";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface QualityAnomalyDetectionProps {
  overallQualityScore: number;
  detectedAnomaliesCount: number;
  rejectionTrend: Array<{
    date: string;
    rejectionRate: number;
    baseline: number;
    upperThreshold: number;
  }>;
  anomalies: QualityAnomalyItem[];
  onSelectAnomaly?: (item: QualityAnomalyItem) => void;
}

export function QualityAnomalyDetection({
  overallQualityScore,
  detectedAnomaliesCount,
  rejectionTrend,
  anomalies,
  onSelectAnomaly,
}: QualityAnomalyDetectionProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return {
          badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          icon: AlertOctagon,
        };
      case "Medium":
        return {
          badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icon: AlertTriangle,
        };
      default:
        return {
          badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          icon: Sparkles,
        };
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header & High-level Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              AI Quality Anomaly Detection
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous vision inspection stream, scrap spike analysis & root-cause detection
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">
              Overall Quality Score:
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {overallQualityScore}%
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">
              Detected Anomalies:
            </span>
            <span className="text-sm font-bold text-rose-400 font-mono">
              {detectedAnomaliesCount}
            </span>
          </div>

          <Link
            href="/quality"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1"
          >
            <span>Quality Module</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Rejection Rate Trend Chart */}
      <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Plant Rejection Rate Trend (%) vs. Statistical Thresholds
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Spike detected on Sep 30 (4.6%) exceeding upper control limit (3.5%)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300 font-medium">Rejection Rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border-t border-dashed" />
              <span className="text-slate-400">Upper Threshold (3.5%)</span>
            </div>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={rejectionTrend}
              margin={{ top: 10, right: 20, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="rejectionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                domain={[0, 6]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                formatter={(val: any) => [`${val}%`, "Rejection Rate"]}
              />
              <ReferenceLine
                y={3.5}
                stroke="#fbbf24"
                strokeDasharray="4 4"
                label={{
                  value: "Upper Limit (3.5%)",
                  fill: "#fbbf24",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
              <Area
                type="monotone"
                dataKey="rejectionRate"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rejectionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Anomaly Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Identified Quality Anomalies ({anomalies.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {anomalies.map((anomaly) => {
            const sev = getSeverityBadge(anomaly.severity);
            const SevIcon = sev.icon;

            return (
              <div
                key={anomaly.id}
                onClick={() => onSelectAnomaly && onSelectAnomaly(anomaly)}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${sev.badge}`}
                    >
                      <SevIcon className="w-3 h-3" />
                      {anomaly.severity} Severity
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{anomaly.detectedDate}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {anomaly.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-medium text-slate-300">
                      {anomaly.affectedBatches}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-0.5">
                      AI Recommendation:
                    </span>
                    {anomaly.aiRecommendation}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Probability: {anomaly.rootCauseProbability.split(" ")[0]}</span>
                  <span className="text-cyan-400 group-hover:underline">View Root Cause →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
