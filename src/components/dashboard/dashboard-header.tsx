"use client";

import React, { useState } from "react";
import {
  Calendar,
  RotateCw,
  Clock,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function DashboardHeader({
  onRefresh,
  lastUpdated = "Just now",
}: DashboardHeaderProps) {
  const [dateRange, setDateRange] = useState<string>("7d");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3 h-3" />
            Live Factory Telemetry
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Plant Alpha • Shift 1 (06:00 - 14:00)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Manufacturing Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Real-time overview of your factory operations
        </p>
      </div>

      {/* Date Range Selector & Actions */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Date Range Dropdown */}
        <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1.5 shrink-0" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none pr-3 py-1 cursor-pointer font-medium"
            aria-label="Select date range"
          >
            <option value="today" className="bg-slate-900 text-slate-200">
              Today (Shift 1)
            </option>
            <option value="24h" className="bg-slate-900 text-slate-200">
              Last 24 Hours
            </option>
            <option value="7d" className="bg-slate-900 text-slate-200">
              Last 7 Days
            </option>
            <option value="30d" className="bg-slate-900 text-slate-200">
              This Month (Sep/Oct)
            </option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition active:scale-95 disabled:opacity-70"
          title="Refresh dashboard telemetry"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>{isRefreshing ? "Updating..." : "Refresh"}</span>
        </button>

        {/* Last synced text */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono pl-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Synced {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
