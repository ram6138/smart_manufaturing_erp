"use client";

import React from "react";
import Link from "next/link";
import { KPICardData } from "@/types/dashboard";
import {
  Factory,
  Gauge,
  ShieldAlert,
  ClipboardList,
  Cpu,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Boxes,
  Layers,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

interface KPIStatCardProps {
  data: KPICardData;
}

export function KPIStatCard({ data }: KPIStatCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "DollarSign":
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case "Boxes":
        return <Boxes className="w-4 h-4 text-cyan-400" />;
      case "ClipboardList":
        return <ClipboardList className="w-4 h-4 text-indigo-400" />;
      case "Gauge":
        return <Gauge className="w-4 h-4 text-blue-400" />;
      case "Layers":
        return <Layers className="w-4 h-4 text-purple-400" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
      case "Cpu":
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Factory className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case "DollarSign":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "Boxes":
        return "bg-cyan-500/10 border-cyan-500/20";
      case "ClipboardList":
        return "bg-indigo-500/10 border-indigo-500/20";
      case "Gauge":
        return "bg-blue-500/10 border-blue-500/20";
      case "Layers":
        return "bg-purple-500/10 border-purple-500/20";
      case "CheckCircle2":
        return "bg-emerald-500/10 border-emerald-500/20";
      default:
        return "bg-cyan-500/10 border-cyan-500/20";
    }
  };

  const resolveHref = () => {
    if (data.href) return data.href;
    if (data.id.includes("inventory") || data.id.includes("stock") || data.id.includes("sku")) return "/inventory";
    if (data.id.includes("order")) return "/orders";
    if (data.id.includes("oee") || data.id.includes("production")) return "/production";
    if (data.id.includes("quality")) return "/quality";
    return "/dashboard";
  };

  const href = resolveHref();

  const isTrendGood =
    (data.trend === "up" && data.isPositive) ||
    (data.trend === "down" && data.isPositive);

  const cardContent = (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 sm:p-4.5 shadow-md hover:border-cyan-500/40 hover:bg-slate-900/95 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200 flex flex-col justify-between h-full cursor-pointer">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors line-clamp-1">
            {data.title}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className={`p-1.5 rounded-xl border ${getIconBg(data.iconName)}`}>
              {getIcon(data.iconName)}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Big Value */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-white font-mono group-hover:text-cyan-200 transition-colors">
            {data.value}
          </span>
          {data.unit && (
            <span className="text-xs text-slate-400 font-medium">{data.unit}</span>
          )}
        </div>
      </div>

      {/* Comparison & Trend pill */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold font-mono ${
              isTrendGood
                ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/60"
                : "bg-rose-950/70 text-rose-400 border border-rose-800/60"
            }`}
          >
            {data.trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : data.trend === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>
              {data.changePercent > 0 ? `+${data.changePercent}%` : `${data.changePercent}%`}
            </span>
          </span>
        </div>

        <span className="text-[10px] sm:text-[11px] text-slate-400 truncate text-right font-medium">
          {data.periodLabel}
        </span>
      </div>
    </div>
  );

  return (
    <Link href={href} className="block h-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-2xl">
      {cardContent}
    </Link>
  );
}
