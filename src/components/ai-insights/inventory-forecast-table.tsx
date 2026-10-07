"use client";

import React from "react";
import { InventoryForecastItem } from "@/types/ai-insights";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface InventoryForecastTableProps {
  items: InventoryForecastItem[];
  onReorderClick?: (item: InventoryForecastItem) => void;
}

export function InventoryForecastTable({
  items,
  onReorderClick,
}: InventoryForecastTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Urgent Reorder":
        return {
          bg: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          icon: AlertOctagon,
        };
      case "High Consumption":
        return {
          bg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icon: TrendingUp,
        };
      case "Reorder Soon":
        return {
          bg: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
          icon: AlertTriangle,
        };
      case "Healthy":
      default:
        return {
          bg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              AI Inventory Forecast
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Predictive stock-out analysis, run-rate velocity & replenishment recommendations
            </p>
          </div>
        </div>

        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Inventory Warehouse</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Material</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Forecast Usage</th>
              <th className="py-3 px-4">Days Remaining</th>
              <th className="py-3 px-4">AI Recommendation</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {items.map((item) => {
              const badge = getStatusBadge(item.status);
              const BadgeIcon = badge.icon;
              const isUrgent = item.daysRemaining <= 5;
              const isWarning = item.daysRemaining <= 7 && item.daysRemaining > 5;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {item.material}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                    {item.currentStock}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {item.forecastUsage}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 font-mono font-bold text-xs border border-slate-800">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          isUrgent
                            ? "text-rose-400"
                            : isWarning
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      />
                      <span
                        className={
                          isUrgent
                            ? "text-rose-300"
                            : isWarning
                            ? "text-amber-300"
                            : "text-emerald-300"
                        }
                      >
                        {item.daysRemaining} days
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-cyan-200">
                    "{item.aiRecommendation}"
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
