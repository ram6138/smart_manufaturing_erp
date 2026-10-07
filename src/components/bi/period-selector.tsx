"use client";

import React from "react";
import { PeriodType } from "@/types/bi";
import { Calendar, Download, Search, RefreshCw, FileSpreadsheet } from "lucide-react";

interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExportReport: () => void;
  isExporting?: boolean;
}

const PERIODS: PeriodType[] = [
  "Today",
  "This Week",
  "This Month",
  "Last 30 Days",
  "Last 90 Days",
  "This Year",
];

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  searchQuery,
  onSearchChange,
  onExportReport,
  isExporting = false,
}: PeriodSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-sm shadow-md space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search BI insights, machines, products, departments, suppliers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Period Selector Buttons & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Button Pill Group */}
          <div className="flex flex-wrap items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800">
            {PERIODS.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onPeriodChange(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPeriod === period
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Export Report Action */}
          <button
            type="button"
            onClick={onExportReport}
            disabled={isExporting}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-650 border border-slate-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
