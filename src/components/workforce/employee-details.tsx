"use client";

import React from "react";
import { EmployeeItem } from "@/types/workforce";
import { EmployeeStatusBadge, AttendanceStatusBadge } from "./employee-directory";
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
} from "lucide-react";

interface EmployeeDetailsProps {
  employee: EmployeeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetails({
  employee,
  isOpen,
  onClose,
}: EmployeeDetailsProps) {
  if (!isOpen || !employee) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{employee.name}</h2>
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {employee.employeeId}
                </span>
                <EmployeeStatusBadge status={employee.status} />
                <AttendanceStatusBadge status={employee.todayAttendance} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {employee.designation} • {employee.department} Department
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Shift Schedule</span>
              <span className="text-sm font-semibold text-white block truncate">
                {employee.shift}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Joining Date</span>
              <span className="text-sm font-semibold text-slate-200 block">
                {formatDate(employee.joiningDate)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Phone Number</span>
              <span className="text-sm font-mono font-medium text-slate-200 block truncate">
                {employee.phone}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Email Address</span>
              <span className="text-sm font-medium text-cyan-300 block truncate">
                {employee.email}
              </span>
            </div>
          </div>

          {/* 1. Attendance Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Monthly Attendance Summary (Last 24 Days)</span>
              </h3>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-800/40">
                {employee.attendanceRate}% Attendance Rate
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-3 bg-slate-900 rounded-lg border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">Present Days</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  {employee.presentDaysCount}
                </span>
                <span className="text-[10px] text-slate-500 block">shifts worked</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-rose-500/30">
                <span className="text-[10px] text-rose-400 block">Absent Days</span>
                <span className="font-mono font-bold text-rose-400 text-lg">
                  {employee.absentDaysCount}
                </span>
                <span className="text-[10px] text-slate-500 block">unplanned</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block">Leave Days</span>
                <span className="font-mono font-bold text-amber-400 text-lg">
                  {employee.leaveDaysCount}
                </span>
                <span className="text-[10px] text-slate-500 block">approved</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-yellow-400 block">Late Clock-Ins</span>
                <span className="font-mono font-bold text-yellow-400 text-lg">
                  {employee.lateArrivalsCount}
                </span>
                <span className="text-[10px] text-slate-500 block">&gt;15 min delay</span>
              </div>
            </div>
          </div>

          {/* 2. Performance Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Plant Floor Performance & Skill Output</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Productivity Score</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  {employee.productivityScore}%
                </span>
                <span className="text-[10px] text-slate-500 block">AQL Level</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Today Units</span>
                <span className="font-mono font-bold text-white text-lg">
                  {employee.unitsProducedToday.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">output units</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Quality Pass Rate</span>
                <span className="font-mono font-bold text-cyan-400 text-lg">
                  {employee.qualityPassRate}%
                </span>
                <span className="text-[10px] text-slate-500 block">inspection index</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-purple-500/30">
                <span className="text-[10px] text-purple-400 block">Monthly Overtime</span>
                <span className="font-mono font-bold text-purple-400 text-lg">
                  {employee.overtimeHoursMonth}h
                </span>
                <span className="text-[10px] text-slate-500 block">logged hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Database schema target: <code className="text-cyan-400">employees</code> & <code className="text-cyan-400">attendance</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
