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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            Live Factory Telemetry
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Plant Alpha • Shift 1 (06:00 - 14:00)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Manufacturing Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Real-time overview of your factory shop floor and equipment operations
        </p>
      </div>

      {/* Date Range Selector & Actions */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Date Range Dropdown */}
        <div className="flex items-center rounded-xl bg-white border border-slate-200 p-1 text-xs shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1.5 shrink-0" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-slate-700 focus:outline-none pr-3 py-1 cursor-pointer font-medium"
            aria-label="Select date range"
          >
            <option value="today">Today (Shift 1)</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">This Month (Sep/Oct)</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition active:scale-95 disabled:opacity-70 shadow-xs"
          title="Refresh dashboard telemetry"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-blue-600 ${
              isRefreshing ? "animate-spin" : ""
            }`}
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
