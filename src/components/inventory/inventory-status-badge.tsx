"use client";

import React from "react";
import { InventoryStatus } from "@/types/inventory";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpCircle,
} from "lucide-react";

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  switch (status) {
    case "Healthy":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Healthy
        </span>
      );
    case "Low Stock":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
          <AlertTriangle className="w-3.5 h-3.5" />
          Low Stock
        </span>
      );
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/90 text-rose-400 border border-rose-800/90 shadow-sm animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          Critical
        </span>
      );
    case "Overstock":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/80">
          <ArrowUpCircle className="w-3.5 h-3.5" />
          Overstock
        </span>
      );
    default:
      return null;
  }
}
