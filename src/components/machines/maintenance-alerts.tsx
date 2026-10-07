"use client";

import React from "react";
import { MaintenanceAlert } from "@/types/machines";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ArrowRight,
  Wrench,
  Sparkles,
} from "lucide-react";

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
  onViewMachine: (machineId: string) => void;
  onScheduleMaintenance?: (machineId: string) => void;
}

export function MaintenanceAlerts({
  alerts,
  onViewMachine,
  onScheduleMaintenance,
}: MaintenanceAlertsProps) {
  const getSeverityBadge = (severity: MaintenanceAlert["severity"]) => {
    switch (severity) {
      case "Critical":
        return {
          icon: AlertOctagon,
          badgeClass: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
          cardBorder: "border-rose-500/40 hover:border-rose-500/60 bg-rose-950/10",
        };
      case "High":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
          cardBorder: "border-amber-500/40 hover:border-amber-500/60 bg-amber-950/10",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
          cardBorder: "border-yellow-500/30 hover:border-yellow-500/50 bg-yellow-950/5",
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Maintenance Alerts</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated anomaly detection triggers and impending PM service intervals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time ML Telemetry Monitor</span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {alerts.map((alert) => {
          const config = getSeverityBadge(alert.severity);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 transition-all duration-200 ${config.cardBorder}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left side: Severity, Machine info, Reason */}
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
                      <span className="font-semibold text-white text-sm">
                        {alert.machineName}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {alert.machineCode}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                      {alert.reason}
                    </p>

                    <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-md border border-slate-800/70 text-xs">
                      <span className="text-slate-400 font-medium shrink-0">Action:</span>
                      <span className="text-slate-200">{alert.recommendedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                  {onScheduleMaintenance && (
                    <button
                      type="button"
                      onClick={() => onScheduleMaintenance(alert.machineId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-colors shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Schedule</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewMachine(alert.machineId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-all shadow-xs"
                  >
                    <span>View Machine</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
