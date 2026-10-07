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
  Activity,
} from "lucide-react";

interface MachineKpiCardsProps {
  machines: MachineItem[];
  activeCardId?: string;
  onCardClick?: (cardId: string) => void;
}

export function MachineKpiCards({ machines, activeCardId = "total", onCardClick }: MachineKpiCardsProps) {
  const totalCount = machines.length;
  const runningCount = machines.filter((m) => m.status === "Running").length;
  const idleCount = machines.filter((m) => m.status === "Idle").length;
  const maintenanceCount = machines.filter((m) => m.status === "Maintenance").length;
  const warningCount = machines.filter((m) => m.status === "Warning").length;
  const highRiskCount = machines.filter(
    (m) => m.riskLevel === "High" || m.riskLevel === "Critical"
  ).length;

  const cards = [
    {
      id: "total",
      title: "Total Machines",
      value: `${totalCount}`,
      unit: "Assets",
      label: "Plant 1 equipment",
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
      label: `${((runningCount / (totalCount || 1)) * 100).toFixed(0)}% line utilization`,
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
      label: "Zero standby queues",
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
      label: "1 in active overhaul",
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
      label: "Sensor drift detected",
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
      label: "Predictive AI failure alert",
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
            className={`p-4 rounded-2xl border shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer select-none text-left outline-none ${
              isActive
                ? `${card.activeBorder} shadow-lg scale-[1.02]`
                : "bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/60 hover:scale-[1.01]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${card.bg} shrink-0`}>
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
              {isActive && (
                <span className={`font-mono text-[9px] font-bold ${card.color} uppercase tracking-wider ml-1`}>
                  Active
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
