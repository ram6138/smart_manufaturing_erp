"use client";

import React from "react";
import { QualityAnomaly, DefectSeverity } from "@/types/quality";
import { DefectSeverityBadge } from "./defect-table";
import {
  Sparkles,
  AlertTriangle,
  Cpu,
  Package,
  Calendar,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface QualityAnomaliesProps {
  anomalies: QualityAnomaly[];
  onInvestigateProduct?: (productName: string) => void;
}

export function QualityAnomalies({
  anomalies,
  onInvestigateProduct,
}: QualityAnomaliesProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Quality Anomalies
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                AI Pattern Engine (Prototype)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Statistical deviation triggers and automated defect clustering alerts across manufacturing bays
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Continuous Anomaly Surveillance</span>
        </div>
      </div>

      {/* Anomalies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <DefectSeverityBadge severity={anom.severity} />
                  <span className="font-semibold text-white text-sm">
                    {anom.product}
                  </span>
                </div>
                {anom.machineName && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-slate-500" />
                      {anom.machineName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {anom.detectedAt}
                    </span>
                  </div>
                )}
              </div>

              {anom.confidenceScore && (
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {anom.confidenceScore}% Conf
                </span>
              )}
            </div>

            {/* Reason */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/90 text-xs">
              <span className="text-slate-400 block font-medium mb-1">
                Detected Pattern / Anomaly:
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {anom.reason}
              </p>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-cyan-400 block font-semibold mb-0.5">
                  Recommended Action:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {anom.recommendedAction}
                </p>
              </div>

              {onInvestigateProduct && (
                <button
                  type="button"
                  onClick={() => onInvestigateProduct(anom.product)}
                  className="self-end sm:self-center shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                >
                  <span>Filter SKU</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prototype AI Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>
          Prototype ML inference layer. Simulated unsupervised clustering and multivariate SPC thresholding.
        </span>
        <span className="text-cyan-400 font-mono">Service: qa_anomaly_detector_v1</span>
      </div>
    </div>
  );
}
