"use client";

import React from "react";
import { ProductionOrderStatus, ProductionPriority } from "@/types/production";
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Share2,
  AlertTriangle,
  Flame,
} from "lucide-react";

export function ProductionStatusBadge({ status }: { status: ProductionOrderStatus }) {
  switch (status) {
    case "In Progress":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          In Progress
        </span>
      );
    case "Completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      );
    case "Paused":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
          <Pause className="w-3 h-3" />
          Paused
        </span>
      );
    case "Released":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
          <Share2 className="w-3 h-3" />
          Released
        </span>
      );
    case "Scheduled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          <Clock className="w-3 h-3" />
          Scheduled
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
}

export function ProductionPriorityBadge({ priority }: { priority: ProductionPriority }) {
  switch (priority) {
    case "Urgent":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
          <Flame className="w-3 h-3 text-rose-400" />
          Urgent
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          High
        </span>
      );
    case "Normal":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
          Normal
        </span>
      );
    case "Low":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-800/50 text-slate-400 border border-slate-800">
          Low
        </span>
      );
    default:
      return null;
  }
}
