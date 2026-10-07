"use client";

import React from "react";
import { AiFilterState } from "@/types/ai-insights";
import {
  Filter,
  Calendar,
  Layers,
  AlertTriangle,
  Tag,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface AiFiltersProps {
  filters: AiFilterState;
  onChange: (filters: AiFilterState) => void;
  onReset: () => void;
  resultCount: number;
}

export function AiFilters({
  filters,
  onChange,
  onReset,
  resultCount,
}: AiFiltersProps) {
  const handleSelectChange = (
    key: keyof AiFilterState,
    value: string
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const isFiltered =
    filters.dateRange !== "This Month" ||
    filters.module !== "All" ||
    filters.priority !== "All" ||
    filters.insightType !== "All" ||
    filters.status !== "All";

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            Filter AI Recommendations & Predictions
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {resultCount} active findings
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Filter Select Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Date Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleSelectChange("dateRange", e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Quarter">This Quarter</option>
          </select>
        </div>

        {/* Module */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            Module
          </label>
          <select
            value={filters.module}
            onChange={(e) => handleSelectChange("module", e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="All">All Modules</option>
            <option value="Predictive Maintenance">Predictive Maintenance</option>
            <option value="Quality">Quality Control</option>
            <option value="Production">Production</option>
            <option value="Inventory">Inventory</option>
            <option value="Finance">Finance</option>
            <option value="Workforce">Workforce</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleSelectChange("priority", e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Insight Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-purple-400" />
            Insight Type
          </label>
          <select
            value={filters.insightType}
            onChange={(e) => handleSelectChange("insightType", e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="All">All Types</option>
            <option value="Predictive Maintenance">Predictive Maintenance</option>
            <option value="Quality">Quality Anomalies</option>
            <option value="Production">Production Forecast</option>
            <option value="Inventory">Inventory Forecast</option>
            <option value="Finance">Cost Intelligence</option>
            <option value="Workforce">Workforce Forecasting</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleSelectChange("status", e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
