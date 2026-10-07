"use client";

import React from "react";
import { EmployeeItem } from "@/types/workforce";
import {
  Users,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";

interface WorkforceOverviewProps {
  employees: EmployeeItem[];
}

export function WorkforceOverview({ employees }: WorkforceOverviewProps) {
  const totalEmployees = 86;
  const present = 74;
  const absent = 5;
  const onLeave = 7;
  const lateArrivals = 4;
  const overtimeEmployees = 14;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Workforce Overview & Today&apos;s Plant Floor Staffing
          </h3>
          <p className="text-xs text-slate-400">
            Real-time shift clock-in, attendance deviations, and operator availability
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Biometric Access Terminal Synced</span>
        </div>
      </div>

      {/* Grid of Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Employees */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Total Staff</span>
          </div>
          <div className="text-lg font-bold text-white">{totalEmployees}</div>
          <span className="text-[10px] text-slate-500 font-mono">100% Registered</span>
        </div>

        {/* Present Today */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Present Today</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">{present}</div>
          <span className="text-[10px] text-slate-400 font-mono">86.0% Floor Rate</span>
        </div>

        {/* Absent */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-500/30">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Absent</span>
          </div>
          <div className="text-lg font-bold text-rose-400">{absent}</div>
          <span className="text-[10px] text-slate-400 font-mono">5.8% Unplanned</span>
        </div>

        {/* On Leave */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>On Leave</span>
          </div>
          <div className="text-lg font-bold text-amber-400">{onLeave}</div>
          <span className="text-[10px] text-slate-400 font-mono">8.2% Approved</span>
        </div>

        {/* Late Arrivals */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Late Arrivals</span>
          </div>
          <div className="text-lg font-bold text-yellow-400">{lateArrivals}</div>
          <span className="text-[10px] text-slate-500 font-mono">&gt;15 min grace</span>
        </div>

        {/* Overtime Employees */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/30">
          <div className="flex items-center gap-1.5 text-xs text-purple-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>On Overtime</span>
          </div>
          <div className="text-lg font-bold text-purple-400">{overtimeEmployees}</div>
          <span className="text-[10px] text-slate-400 font-mono">Extended Shift</span>
        </div>
      </div>
    </div>
  );
}
