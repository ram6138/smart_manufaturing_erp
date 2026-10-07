"use client";

import React, { useState } from "react";
import { OvertimeRecord, OvertimeApprovalStatus } from "@/types/workforce";
import { Timer, AlertCircle, CheckCircle2, XCircle, Clock, ShieldAlert, Check, X } from "lucide-react";

interface OvertimeTableProps {
  records: OvertimeRecord[];
  onUpdateStatus?: (recordId: string, status: OvertimeApprovalStatus) => void;
}

export function OvertimeTable({ records, onUpdateStatus }: OvertimeTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredRecords = records.filter((r) => {
    if (filterStatus === "All") return true;
    return r.approvalStatus === filterStatus;
  });

  const totalOvertime = records.reduce((sum, r) => sum + r.overtimeHours, 0);
  const highOtCount = records.filter((r) => r.isHighOvertime).length;

  const getStatusBadge = (status: OvertimeApprovalStatus) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Overtime Monitoring</h3>
              <p className="text-xs text-slate-400">Shift extensions, operational justifications & approval workflow</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {highOtCount > 0 && (
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {highOtCount} High-OT Records (&gt;4h)
              </span>
            )}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Overtime Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Regular</th>
                <th className="py-3 px-3 text-right">Overtime</th>
                <th className="py-3 px-3 text-right">Total Hours</th>
                <th className="py-3 px-3">Reason / Justification</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No overtime records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-200">
                      <div>{item.employeeName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.employeeId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-700">
                        {item.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{item.date}</td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono">{item.regularHours.toFixed(1)}h</td>
                    <td className="py-3 px-3 text-right font-mono">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`font-semibold ${item.isHighOvertime ? "text-amber-400" : "text-slate-200"}`}>
                          +{item.overtimeHours.toFixed(1)}h
                        </span>
                        {item.isHighOvertime && (
                          <span
                            title="Unusually high overtime (>4 hours)"
                            className="p-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]"
                          >
                            ⚠️
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-100 font-bold font-mono">
                      {item.totalHours.toFixed(1)}h
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-300 text-[11px] leading-relaxed line-clamp-2" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(item.approvalStatus)}</td>
                    <td className="py-3 px-3 text-right">
                      {item.approvalStatus === "Pending" && onUpdateStatus ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onUpdateStatus(item.id, "Approved")}
                            title="Approve Overtime"
                            className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(item.id, "Rejected")}
                            title="Reject Overtime"
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <span>Logged OT Period: <strong>Current Billing Cycle</strong></span>
        <span className="text-purple-400 font-semibold">Total Cumulative OT: {totalOvertime.toFixed(1)} hrs</span>
      </div>
    </div>
  );
}
