"use client";

import React from "react";
import { ProductionFilterState } from "@/types/production";
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  Layers,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface ProductionFiltersProps {
  filters: ProductionFilterState;
  onFilterChange: (newFilters: Partial<ProductionFilterState>) => void;
  onResetFilters: () => void;
  totalOrders: number;
  filteredCount: number;
  availableProducts?: string[];
  availableMachines?: string[];
  availableShifts?: string[];
  availableStatuses?: string[];
  availablePriorities?: string[];
}

const DEFAULT_PRODUCTS = [
  "Classic Butter Biscuit",
  "Chocolate Biscuit",
  "Coconut Biscuit",
  "Cream Biscuit",
  "Marie Biscuit",
  "Salted Biscuit",
];

const DEFAULT_MACHINES = [
  "Baking Oven 1",
  "Baking Oven 2",
  "Mixer 1",
  "Packaging Machine 1",
  "Packaging Machine 2",
];

const DEFAULT_SHIFTS = ["Morning", "Evening", "Night"];

const DEFAULT_STATUSES = [
  "Scheduled",
  "Released",
  "In Progress",
  "Paused",
  "Completed",
  "Cancelled",
];

const DEFAULT_PRIORITIES = ["Low", "Normal", "High", "Urgent"];

export function ProductionFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalOrders,
  filteredCount,
  availableProducts = [],
  availableMachines = [],
  availableShifts = [],
  availableStatuses = [],
  availablePriorities = [],
}: ProductionFiltersProps) {
  const products = availableProducts.length > 0 ? availableProducts : DEFAULT_PRODUCTS;
  const machines = availableMachines.length > 0 ? availableMachines : DEFAULT_MACHINES;
  const shifts = availableShifts.length > 0 ? availableShifts : DEFAULT_SHIFTS;
  const statuses = availableStatuses.length > 0 ? availableStatuses : DEFAULT_STATUSES;
  const priorities = availablePriorities.length > 0 ? availablePriorities : DEFAULT_PRIORITIES;
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.product !== "all" ||
    filters.machine !== "all" ||
    filters.shift !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.dateRange !== "7d";

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-3">
      {/* Top row: Search Bar and Quick Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by Order # (e.g. PROD-00001), Batch #, or Product..."
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

        {/* Results counter & Reset button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Showing <strong className="text-cyan-400 font-bold">{filteredCount}</strong> of {totalOrders} orders
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 border-t border-slate-800/80">
        {/* Date Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ dateRange: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer font-medium"
          >
            <option value="today">Today (Shift 1)</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">This Month</option>
            <option value="all">All Records</option>
          </select>
        </div>

        {/* Product Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-400" />
            Product
          </label>
          <select
            value={filters.product}
            onChange={(e) => onFilterChange({ product: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Products</option>
            {products.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        {/* Machine Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Wrench className="w-3 h-3 text-orange-400" />
            Machine
          </label>
          <select
            value={filters.machine}
            onChange={(e) => onFilterChange({ machine: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Machines</option>
            {machines.map((mach) => (
              <option key={mach} value={mach}>
                {mach}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" />
            Shift
          </label>
          <select
            value={filters.shift}
            onChange={(e) => onFilterChange({ shift: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Shifts</option>
            {shifts.map((s) => (
              <option key={s} value={s}>
                {s} Shift
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Status
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

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
