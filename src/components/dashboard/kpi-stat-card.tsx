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
  IndianRupee,
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
      case "IndianRupee":
        return <IndianRupee className="w-4 h-4 text-emerald-600" />;
      case "Boxes":
        return <Boxes className="w-4 h-4 text-cyan-600" />;
      case "ClipboardList":
        return <ClipboardList className="w-4 h-4 text-purple-600" />;
      case "Gauge":
        return <Gauge className="w-4 h-4 text-blue-600" />;
      case "Layers":
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      case "Cpu":
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Factory className="w-4 h-4 text-cyan-600" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case "DollarSign":
      case "IndianRupee":
        return "bg-emerald-50 border-emerald-200";
      case "Boxes":
        return "bg-cyan-50 border-cyan-200";
      case "ClipboardList":
        return "bg-purple-50 border-purple-200";
      case "Gauge":
        return "bg-blue-50 border-blue-200";
      case "Layers":
        return "bg-indigo-50 border-indigo-200";
      case "CheckCircle2":
        return "bg-emerald-50 border-emerald-200";
      case "ShieldAlert":
        return "bg-emerald-50 border-emerald-200";
      case "Cpu":
        return "bg-purple-50 border-purple-200";
      case "AlertTriangle":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-cyan-50 border-cyan-200";
    }
  };

  const resolveHref = () => {
    if (data.href) return data.href;
    if (
      data.id.includes("inventory") ||
      data.id.includes("stock") ||
      data.id.includes("sku")
    )
      return "/inventory";
    if (data.id.includes("order")) return "/orders";
    if (data.id.includes("oee") || data.id.includes("production"))
      return "/production";
    if (data.id.includes("quality")) return "/quality";
    return "/dashboard";
  };

  const href = resolveHref();

  const isTrendGood =
    (data.trend === "up" && data.isPositive) ||
    (data.trend === "down" && data.isPositive);

  const cardContent = (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-4.5 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full cursor-pointer">
      <div>
        {/* Title & Icon Header */}
        <div className="flex items-start justify-between gap-2 mb-2 min-h-[34px]">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-700 transition-colors leading-snug break-words">
            {data.title}
          </span>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <div
              className={`p-1.5 rounded-xl border ${getIconBg(
                data.iconName
              )} group-hover:scale-105 transition-transform`}
            >
              {getIcon(data.iconName)}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Big Metric Value */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-slate-900 font-mono group-hover:text-blue-700 transition-colors">
            {data.value}
          </span>
          {data.unit && (
            <span className="text-xs text-slate-500 font-medium">
              {data.unit}
            </span>
          )}
        </div>
      </div>

      {/* Comparison & High-Contrast Trend Pill */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold font-mono ${
              isTrendGood
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
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
              {data.changePercent > 0
                ? `+${data.changePercent}%`
                : `${data.changePercent}%`}
            </span>
          </span>
        </div>

        <span className="text-[10px] sm:text-[10.5px] text-slate-500 text-right font-medium leading-tight">
          {data.periodLabel}
        </span>
      </div>
    </div>
  );

  return (
    <Link
      href={href}
      className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-2xl"
    >
      {cardContent}
    </Link>
  );
}
