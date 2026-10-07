"use client";

import React from "react";
import {
  AttendanceFilterState,
  DepartmentName,
  ShiftName,
  AttendanceStatus,
} from "@/types/workforce";
import { Search, RotateCcw, Calendar } from "lucide-react";

interface AttendanceFiltersProps {
  filters: AttendanceFilterState;
  onFilterChange: (newFilters: Partial<AttendanceFilterState>) => void;
  onResetFilters: () => void;
  totalRecords: number;
  filteredCount: number;
}

const DEPARTMENTS: DepartmentName[] = [
  "Production",
  "Packaging",
  "Quality",
  "Maintenance",
  "Inventory",
  "Procurement",
  "Finance",
  "HR",
];

const SHIFTS: ShiftName[] = [
  "Morning Shift",
  "General Shift",
  "Evening Shift",
  "Night Shift",
];

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Half Day", "Leave"];

export function AttendanceFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalRecords,
  filteredCount,
}: AttendanceFiltersProps) {
  const isFiltered =
    filters.date !== "all" ||
    filters.department !== "all" ||
    filters.shift !== "all" ||
    filters.status !== "all";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm shadow-md space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {/* Date Filter */}
        <div className="relative">
          <select
            value={filters.date}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Dates</option>
            <option value="today">Today (Oct 01)</option>
            <option value="yesterday">Yesterday (Sep 30)</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Shift Filter */}
        <div className="relative">
          <select
            value={filters.shift}
            onChange={(e) => onFilterChange({ shift: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Shifts</option>
            {SHIFTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Attendance Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Filter status row & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <div className="text-slate-400 flex items-center gap-2">
          <span>
            Showing <strong className="text-white">{filteredCount}</strong> of{" "}
            <strong className="text-white">{totalRecords}</strong> attendance punch records
          </span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 text-[11px]">
              Filters Active
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
