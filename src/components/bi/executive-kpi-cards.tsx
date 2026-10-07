"use client";

import React from "react";
import { ExecutiveKpiData } from "@/types/bi";
import {
  Factory,
  Cpu,
  ShieldCheck,
  Package,
  Activity,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface ExecutiveKpiCardsProps {
  data: ExecutiveKpiData;
}

export function ExecutiveKpiCards({ data }: ExecutiveKpiCardsProps) {
  const cards = [
    {
      title: "Production Efficiency",
      value: `${data.productionEfficiency.toFixed(1)}%`,
      subtext: "Actual vs Planned Volume",
      icon: Factory,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "+3.2% vs baseline",
      trendUp: true,
    },
    {
      title: "Overall OEE Index",
      value: `${data.oee.toFixed(1)}%`,
      subtext: "Avail × Perf × Quality",
      icon: Cpu,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "+1.8% efficiency gain",
      trendUp: true,
    },
    {
      title: "Quality Pass Rate",
      value: `${data.qualityPassRate.toFixed(1)}%`,
      subtext: "First-Pass Inspection Yield",
      icon: ShieldCheck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "+2.8% above tolerance",
      trendUp: true,
    },
    {
      title: "Inventory Health",
      value: `${data.inventoryHealth.toFixed(1)}%`,
      subtext: "Stock availability & turns",
      icon: Package,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      trend: "+1.5% buffer safety",
      trendUp: true,
    },
    {
      title: "Machine Availability",
      value: `${data.machineAvailability.toFixed(1)}%`,
      subtext: "Fleet active operating ratio",
      icon: Activity,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      trend: "+0.8% uptime reliability",
      trendUp: true,
    },
    {
      title: "On-Time Delivery",
      value: `${data.onTimeDelivery.toFixed(1)}%`,
      subtext: "Customer order fulfillment",
      icon: Truck,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      trend: "-1.4% freight delay",
      trendUp: false,
    },
    {
      title: "Workforce Productivity",
      value: `${data.workforceProductivity.toFixed(1)}%`,
      subtext: "Labor output standard index",
      icon: Users,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "+2.1% shift efficiency",
      trendUp: true,
    },
    {
      title: "Profit Margin",
      value: `${data.profitMargin.toFixed(1)}%`,
      subtext: "Operating gross margin",
      icon: DollarSign,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "+1.2% net expansion",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm hover:border-slate-700 transition-all shadow-md flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {card.subtext}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              {card.trendUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
