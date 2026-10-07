"use client";

import React from "react";
import {
  EmployeeItem,
  EmployeeStatus,
  AttendanceStatus,
} from "@/types/workforce";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  AlertCircle,
  Eye,
  TrendingUp,
  Building,
} from "lucide-react";

interface EmployeeDirectoryProps {
  employees: EmployeeItem[];
  onViewEmployee: (employee: EmployeeItem) => void;
}

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  switch (status) {
    case "Active":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Active
        </span>
      );
    case "On Leave":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <CalendarDays className="w-3 h-3" />
          On Leave
        </span>
      );
    case "Inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
          <AlertCircle className="w-3 h-3" />
          Inactive
        </span>
      );
  }
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  switch (status) {
    case "Present":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Present
        </span>
      );
    case "Late":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
          <Clock className="w-3 h-3" />
          Late
        </span>
      );
    case "Leave":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <CalendarDays className="w-3 h-3" />
          On Leave
        </span>
      );
    case "Half Day":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
          Half Day
        </span>
      );
    case "Absent":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3" />
          Absent
        </span>
      );
  }
}

export function EmployeeDirectory({
  employees,
  onViewEmployee,
}: EmployeeDirectoryProps) {
  if (employees.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
        <Users className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-white">No employees found</h3>
        <p className="text-xs text-slate-400">Try clearing filters or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Employee Directory</h3>
            <p className="text-xs text-slate-400">
              Plant personnel roster, shift assignments, real-time floor attendance, and productivity scores
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-800/40">
          {employees.length} Personnel
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">Employee ID</th>
              <th className="py-3.5 px-4">Full Name</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Designation</th>
              <th className="py-3.5 px-4">Shift</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Today Attendance</th>
              <th className="py-3.5 px-4 text-right">Productivity</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                  {e.employeeId}
                </td>
                <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                  {e.name}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {e.department}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{e.designation}</td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-950 border border-slate-800 text-slate-300">
                    {e.shift}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <EmployeeStatusBadge status={e.status} />
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <AttendanceStatusBadge status={e.todayAttendance} />
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                  {e.productivityScore}%
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewEmployee(e)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {employees.map((e) => (
          <div
            key={e.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400 block">
                  {e.employeeId}
                </span>
                <span className="font-semibold text-white text-sm">{e.name}</span>
                <span className="text-slate-400 text-[11px] block">
                  {e.designation} • {e.department}
                </span>
              </div>
              <EmployeeStatusBadge status={e.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block">Shift</span>
                <span className="text-slate-300 font-medium">{e.shift}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Today Status</span>
                <AttendanceStatusBadge status={e.todayAttendance} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">
                Productivity: <strong className="text-emerald-400 font-mono">{e.productivityScore}%</strong>
              </span>
              <button
                type="button"
                onClick={() => onViewEmployee(e)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
