"use client";

import React from "react";
import { ActivityEventType, RecentActivityItem } from "@/types/dashboard";
import {
  Activity,
  Factory,
  ShieldAlert,
  Boxes,
  Wrench,
  Truck,
  Clock,
} from "lucide-react";

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityEventType) => {
    switch (type) {
      case "production":
        return <Factory className="w-4 h-4 text-blue-400" />;
      case "quality":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "inventory":
        return <Boxes className="w-4 h-4 text-emerald-400" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case "procurement":
        return <Truck className="w-4 h-4 text-cyan-400" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getActivityBg = (type: ActivityEventType) => {
    switch (type) {
      case "production":
        return "bg-blue-500/10 border-blue-500/20";
      case "quality":
        return "bg-rose-500/10 border-rose-500/20";
      case "inventory":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "maintenance":
        return "bg-amber-500/10 border-amber-500/20";
      case "procurement":
        return "bg-cyan-500/10 border-cyan-500/20";
      default:
        return "bg-cyan-500/10 border-cyan-500/20";
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Recent Activity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational event log across factory lines & warehouse
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500">Live Feed</span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3.5">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition"
          >
            <div
              className={`p-2 rounded-xl border shrink-0 mt-0.5 ${getActivityBg(
                item.type
              )}`}
            >
              {getActivityIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-white truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                {item.description}
              </p>
            </div>

            {item.badgeText && (
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 text-slate-300 border border-slate-800 shrink-0">
                {item.badgeText}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
