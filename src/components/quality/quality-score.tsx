"use client";

import React from "react";
import { QualityInspection, QualityDefect } from "@/types/quality";
import {
  Award,
  CheckCircle2,
  AlertOctagon,
  Percent,
  Layers,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";

interface QualityScoreProps {
  inspections: QualityInspection[];
  defects: QualityDefect[];
}

export function QualityScore({ inspections, defects }: QualityScoreProps) {
  const totalInspected = inspections.reduce((acc, i) => acc + i.inspectedQuantity, 0);
  const totalPassed = inspections.reduce((acc, i) => acc + i.passedQuantity, 0);
  const totalFailed = inspections.reduce((acc, i) => acc + i.failedQuantity, 0);

  const passRateNum = totalInspected > 0 ? (totalPassed / totalInspected) * 100 : 96.5;
  const rejectionRateNum = totalInspected > 0 ? (totalFailed / totalInspected) * 100 : 3.5;
  const totalDefectUnits = defects.reduce((acc, d) => acc + d.defectQuantity, 0);
  const defectRateNum =
    totalInspected > 0 ? (totalDefectUnits / totalInspected) * 100 : 1.8;

  const openIssuesCount = defects.filter(
    (d) => d.status === "Open" || d.status === "Investigating"
  ).length;

  // Compute weighted Quality Score (0-100)
  // 70% based on pass rate (relative to target 98%), 20% on low open defect penalty, 10% on inspection completion
  const passRateScore = Math.min(100, (passRateNum / 98) * 70);
  const defectPenalty = Math.max(0, 20 - openIssuesCount * 3);
  const inspectionFactor = 10;
  const computedScore = Math.min(100, Math.round(passRateScore + defectPenalty + inspectionFactor));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left column: Overall Quality Score Gauge / Radial preview */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-gradient-to-br from-slate-950/80 to-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
            <Award className="w-3.5 h-3.5" />
            <span>ISO 9001:2015</span>
          </div>

          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Overall Quality Score
          </span>

          <div className="relative my-2 flex items-center justify-center">
            {/* Circular score display */}
            <div className="w-28 h-28 rounded-full border-4 border-slate-800 flex items-center justify-center relative shadow-inner">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeDasharray={`${(computedScore / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {computedScore}
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs mt-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Quality Index</span>
              <span className="font-semibold text-emerald-400">Class A Standard</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${computedScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right column: Quality Overview Metric Tiles */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">
                Quality Overview & Process Health
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Live Plant Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive statistical process control (SPC) benchmarks and defect metrics across all lines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            {/* Pass Rate */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pass Rate</span>
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {passRateNum.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Target: &gt;95%</span>
            </div>

            {/* Rejection Rate */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>Rejection Rate</span>
              </div>
              <div className="text-lg font-bold text-rose-400">
                {rejectionRateNum.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Tolerance: &lt;4.0%</span>
            </div>

            {/* Defect Rate */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Defect Rate</span>
              </div>
              <div className="text-lg font-bold text-amber-400">
                {defectRateNum.toFixed(2)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">AQL 1.5</span>
            </div>

            {/* Inspections Completed */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Completed</span>
              </div>
              <div className="text-lg font-bold text-white">
                {inspections.length}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">100% On-Time</span>
            </div>

            {/* Open Issues */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Open Issues</span>
              </div>
              <div className="text-lg font-bold text-purple-400">
                {openIssuesCount}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">In Investigation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
