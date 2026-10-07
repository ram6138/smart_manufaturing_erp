"use client";

import React from "react";
import { ProcurementAlert } from "@/types/procurement";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface ProcurementAlertsProps {
  alerts: ProcurementAlert[];
  onViewAlertEntity?: (alert: ProcurementAlert) => void;
}

export function ProcurementAlerts({
  alerts,
  onViewAlertEntity,
}: ProcurementAlertsProps) {
  const getSeverityBadge = (severity: ProcurementAlert["severity"]) => {
    switch (severity) {
      case "Critical":
      case "High":
        return {
          icon: AlertOctagon,
          badgeClass: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
          cardBorder: "border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
          cardBorder: "border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10",
        };
      case "Low":
      default:
        return {
          icon: Info,
          badgeClass: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
          cardBorder: "border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-950/5",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Procurement Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Contract milestones, supplier delivery delays, and critical buffer inventory triggers
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Automated Supplier SLA Monitor</span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert, idx) => {
          const config = getSeverityBadge(alert.severity);
          const Icon = config.icon;

          return (
            <div
              key={alert.id || `alert_${idx}`}
              className={`rounded-xl border p-4 transition-all duration-200 ${config.cardBorder}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${config.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {alert.severity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        {alert.relatedEntity}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 mb-2 leading-relaxed font-medium">
                      {alert.reason}
                    </p>

                    <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/70 text-xs">
                      <span className="text-slate-400 font-medium shrink-0">Action:</span>
                      <span className="text-slate-300">{alert.recommendedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                {onViewAlertEntity && (
                  <div className="self-end md:self-center shrink-0 pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() => onViewAlertEntity(alert)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 transition-all shadow-sm"
                    >
                      <span>View Entity</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
