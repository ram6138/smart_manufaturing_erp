"use client";

import React from "react";
import { ManagementAlertItem } from "@/types/bi";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface ManagementAlertsProps {
  alerts: ManagementAlertItem[];
  onViewSection?: (targetSection: string) => void;
}

export function ManagementAlerts({ alerts, onViewSection }: ManagementAlertsProps) {
  const getSeverityBadge = (severity: ManagementAlertItem["severity"]) => {
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
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Executive Management Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {alerts.length} Active Escalations
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-plant risk triggers requiring executive attention and supervisor escalation
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Plant-Wide Exception Monitor Active
        </div>
      </div>

      {/* Grid of Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alerts.map((alert) => {
          const config = getSeverityBadge(alert.severity);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${config.cardBorder} flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${config.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {alert.severity} Priority
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {alert.module}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                </div>

                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {alert.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-0.5">
                    Recommended Executive Action:
                  </span>
                  <span className="text-slate-300">{alert.recommendedAction}</span>
                </div>
              </div>

              {onViewSection && (
                <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onViewSection(alert.targetSection)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                  >
                    <span>View In Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
