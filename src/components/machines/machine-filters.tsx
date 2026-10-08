"use client";

import React from "react";
import { MachineFilterState } from "@/types/machines";
import {
  Search,
  RotateCcw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

interface MachineFiltersProps {
  filters: MachineFilterState;
  onFilterChange: (newFilters: Partial<MachineFilterState>) => void;
  onResetFilters: () => void;
  totalMachines: number;
  filteredCount: number;
  availableMachineTypes?: string[];
  availableStatuses?: string[];
  availableRiskLevels?: string[];
}

const DEFAULT_MACHINE_TYPES = [
  "Baking Oven",
  "Mixing Machine",
  "Packaging Machine",
  "Production Line",
];

const DEFAULT_STATUSES = ["Running", "Idle", "Maintenance", "Warning"];

const DEFAULT_RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

export function MachineFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalMachines,
  filteredCount,
  availableMachineTypes = [],
  availableStatuses = [],
  availableRiskLevels = [],
}: MachineFiltersProps) {
  const machineTypes = availableMachineTypes.length > 0 ? availableMachineTypes : DEFAULT_MACHINE_TYPES;
  const statuses = availableStatuses.length > 0 ? availableStatuses : DEFAULT_STATUSES;
  const riskLevels = availableRiskLevels.length > 0 ? availableRiskLevels : DEFAULT_RISK_LEVELS;

  const isFiltered =
    filters.searchQuery !== "" ||
    filters.machineType !== "all" ||
    filters.status !== "all" ||
    filters.riskLevel !== "all";

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-3">
      {/* Top row: Search input and count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search equipment by code (e.g. MCH-001, PACK-01) or machine name..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Showing <strong className="text-cyan-400 font-bold">{filteredCount}</strong> of {totalMachines} assets
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-800/80">
        {/* Machine Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            Machine Type
          </label>
          <select
            value={filters.machineType}
            onChange={(e) => onFilterChange({ machineType: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Machine Types ({machineTypes.length})</option>
            {machineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Operational Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            Failure Risk Level
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => onFilterChange({ riskLevel: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            {riskLevels.map((rl) => (
              <option key={rl} value={rl}>
                {rl} Risk
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
