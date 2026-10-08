"use client";

import React from "react";
import { MachineItem } from "@/types/machines";
import {
  Cpu,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface MachineKpiCardsProps {
  machines: MachineItem[];
  activeCardId?: string;
  onCardClick?: (cardId: string) => void;
}

export function normalizeMachineStatus(status?: string): "Running" | "Idle" | "Maintenance" | "Warning" {
  const s = (status || "").toLowerCase().trim();
  if (s === "warning" || s === "alert" || s === "degraded") return "Warning";
  if (s === "maintenance" || s === "under maintenance" || s === "repair" || s === "offline") return "Maintenance";
  if (s === "idle" || s === "standby" || s === "ready") return "Idle";
  return "Running"; // Running, Active, Operational, In Use
}

export function MachineKpiCards({ machines, activeCardId = "total", onCardClick }: MachineKpiCardsProps) {
  const totalCount = machines.length;
  const runningCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Running").length;
  const idleCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Idle").length;
  const maintenanceCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Maintenance").length;
  const warningCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Warning").length;
  const highRiskCount = machines.filter(
    (m) => m.riskLevel === "High" || m.riskLevel === "Critical" || normalizeMachineStatus(m.status) === "Warning" || normalizeMachineStatus(m.status) === "Maintenance"
  ).length;

  const cards = [
    {
      id: "total",
      title: "Total Machines",
      value: `${totalCount}`,
      unit: "Assets",
      label: totalCount > 0 ? `${totalCount} plant asset${totalCount === 1 ? '' : 's'}` : "No assets",
      icon: Cpu,
      color: "text-cyan-400",
      activeBorder: "border-cyan-500 ring-2 ring-cyan-500/30 bg-slate-900",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "running",
      title: "Running",
      value: `${runningCount}`,
      unit: "Online",
      label: totalCount > 0 ? `${((runningCount / totalCount) * 100).toFixed(0)}% line utilization` : "0% utilization",
      icon: CheckCircle2,
      color: "text-emerald-400",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-900",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "idle",
      title: "Idle",
      value: `${idleCount}`,
      unit: "Standby",
      label: idleCount > 0 ? `${idleCount} standby queue${idleCount === 1 ? '' : 's'}` : "Zero standby queues",
      icon: Clock,
      color: "text-slate-400",
      activeBorder: "border-slate-400 ring-2 ring-slate-400/30 bg-slate-900",
      bg: "bg-slate-800/60 border-slate-700",
    },
    {
      id: "maintenance",
      title: "Maintenance",
      value: `${maintenanceCount}`,
      unit: "Offline",
      label: maintenanceCount > 0 ? `${maintenanceCount} in active overhaul` : "Zero active overhauls",
      icon: Wrench,
      color: "text-rose-400",
      activeBorder: "border-rose-500 ring-2 ring-rose-500/30 bg-slate-900",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "warning",
      title: "Warning",
      value: `${warningCount}`,
      unit: "Attention",
      label: warningCount > 0 ? `${warningCount} sensor drift flagged` : "Zero sensor drift",
      icon: AlertTriangle,
      color: "text-amber-400",
      activeBorder: "border-amber-500 ring-2 ring-amber-500/30 bg-slate-900",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "high_risk",
      title: "High Risk",
      value: `${highRiskCount}`,
      unit: "Critical/High",
      label: highRiskCount > 0 ? `${highRiskCount} predictive AI alerts` : "All systems nominal",
      icon: ShieldAlert,
      color: "text-orange-400",
      activeBorder: "border-orange-500 ring-2 ring-orange-500/30 bg-slate-900",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeCardId === card.id;

        return (
          <div
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={() => onCardClick?.(card.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick?.(card.id);
              }
            }}
            title={`Click to view ${card.title} machines`}
            className={`p-4 rounded-2xl border shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer select-none text-left outline-none group ${
              isActive
                ? `${card.activeBorder} shadow-lg scale-[1.02]`
                : "bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/70 hover:scale-[1.01]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${card.bg} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs text-slate-400 font-medium">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 truncate">
              <span className="truncate">{card.label}</span>
              {isActive ? (
                <span className={`font-mono text-[9px] font-bold ${card.color} uppercase tracking-wider ml-1`}>
                  Active
                </span>
              ) : (
                <ArrowRight className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-slate-400 transition-all shrink-0 ml-1" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
