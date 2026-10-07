"use client";

import React from "react";
import { InventoryAlert } from "@/types/inventory";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  ArrowRight,
  ShoppingCart,
  Boxes,
} from "lucide-react";

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
  onActionClick: (alert: InventoryAlert) => void;
}

export function InventoryAlerts({ alerts, onActionClick }: InventoryAlertsProps) {
  const getSeverityBadge = (severity: InventoryAlert["severity"]) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Critical Stock
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Low Stock Warning
          </span>
        );
      case "Info":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Info className="w-3 h-3 text-blue-400" />
            Overstock Info
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Inventory Operational Alerts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated threshold triggers, stockout prevention & reorder recommendations
          </p>
        </div>
        <span className="text-xs font-mono text-amber-400 font-semibold">
          {alerts.length} Action Items
        </span>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {alert.itemCode}
                </span>
                {getSeverityBadge(alert.severity)}
              </div>

              <h3 className="text-sm font-semibold text-white">
                {alert.itemName}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.message}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Available:</span>
                  <span className="font-mono font-bold text-white">
                    {alert.availableQuantity.toLocaleString()} {alert.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reorder Point:</span>
                  <span className="font-mono text-slate-300">
                    {alert.reorderLevel.toLocaleString()} {alert.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Action: <strong className="text-slate-200">{alert.recommendedAction}</strong>
              </span>

              <button
                onClick={() => onActionClick(alert)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 font-semibold text-xs transition"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
