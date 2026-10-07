"use client";

import React from "react";
import { AttendanceRecord } from "@/types/workforce";
import { AttendanceStatusBadge } from "./employee-directory";
import { Calendar, Clock, Building, UserCheck } from "lucide-react";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (records.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
        <UserCheck className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-white">No attendance records found</h3>
        <p className="text-xs text-slate-400">
          Try adjusting your search criteria or mark attendance.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Attendance Logs</h3>
            <p className="text-xs text-slate-400">
              Shift punch logs, working duration, overtime calculations, and absence records
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/40">
          {records.length} Logs
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Shift</th>
              <th className="py-3.5 px-4">Check In</th>
              <th className="py-3.5 px-4">Check Out</th>
              <th className="py-3.5 px-4 text-right">Working Hours</th>
              <th className="py-3.5 px-4 text-right">Overtime</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                  {formatDate(r.date)}
                </td>
                <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                  <div>{r.employeeName}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{r.employeeId}</div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {r.department}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-950 border border-slate-800 text-slate-300">
                    {r.shift}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-medium text-slate-200 whitespace-nowrap">
                  {r.checkIn}
                </td>
                <td className="py-3.5 px-4 font-mono font-medium text-slate-200 whitespace-nowrap">
                  {r.checkOut}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                  {r.workingHours > 0 ? `${r.workingHours} hrs` : "--"}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-400 whitespace-nowrap">
                  {r.overtimeHours > 0 ? `+${r.overtimeHours} hrs` : "0.0"}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <AttendanceStatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {records.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-white text-sm block">{r.employeeName}</span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {r.employeeId} • {r.department}
                </span>
              </div>
              <AttendanceStatusBadge status={r.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800/80 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 font-sans block">In / Out</span>
                <span className="text-slate-200 font-medium">
                  {r.checkIn} → {r.checkOut}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-sans block">Duration</span>
                <span className="text-white font-bold">{r.workingHours}h</span>
                {r.overtimeHours > 0 && (
                  <span className="text-purple-400 text-[11px] block">
                    (+{r.overtimeHours}h OT)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>{formatDate(r.date)}</span>
              <span>{r.shift}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
