"use client";

import React, { useState } from "react";
import { LeaveRequestRecord, LeaveStatus } from "@/types/workforce";
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Eye, Check, X } from "lucide-react";
import { LeaveRejectionModal } from "./leave-rejection-modal";

interface LeaveRequestsProps {
  requests: LeaveRequestRecord[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export function LeaveRequests({ requests, onApprove, onReject }: LeaveRequestsProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<LeaveRequestRecord | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<LeaveRequestRecord | null>(null);

  const filtered = requests.filter((r) => {
    if (filterStatus === "All") return true;
    return r.status === filterStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const getStatusBadge = (status: LeaveStatus) => {
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

  const getLeaveTypeBadge = (type: LeaveRequestRecord["leaveType"]) => {
    switch (type) {
      case "Sick":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">Sick</span>;
      case "Casual":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">Casual</span>;
      case "Earned":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Earned</span>;
      case "Emergency":
        return <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Emergency</span>;
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Leave Requests</h3>
              <p className="text-xs text-slate-400">Employee leave applications, schedule coverage & approval workflows</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {pendingCount > 0 && (
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {pendingCount} Awaiting Decision
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

        {/* Requests Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Leave Type</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-3 text-center">Days</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No leave requests match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{item.requestId}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      <div>{item.employeeName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.employeeId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-700">
                        {item.department}
                      </span>
                    </td>
                    <td className="py-3 px-3">{getLeaveTypeBadge(item.leaveType)}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      <div>{item.startDate}</div>
                      <div className="text-[10px] text-slate-500">to {item.endDate}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-200">{item.daysCount} d</td>
                    <td className="py-3 px-3 max-w-xs text-slate-300 text-[11px] leading-relaxed">
                      <div className="line-clamp-2" title={item.reason}>{item.reason}</div>
                      {item.rejectionReason && (
                        <div className="mt-1 text-[10px] text-rose-400/90 italic line-clamp-1" title={item.rejectionReason}>
                          Rejection: {item.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRequestForDetails(item)}
                          title="View Request Details"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.status === "Pending" && (
                          <>
                            <button
                              onClick={() => onApprove(item.id)}
                              title="Approve Leave"
                              className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRejectingRequest(item)}
                              title="Reject Leave"
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedRequestForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-100">Leave Request Details</h3>
              <span className="font-mono text-xs text-cyan-400 font-bold">{selectedRequestForDetails.requestId}</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Employee:</span>
                <span className="font-semibold text-slate-200">{selectedRequestForDetails.employeeName} ({selectedRequestForDetails.employeeId})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-200">{selectedRequestForDetails.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Leave Type:</span>
                <span className="text-slate-200">{selectedRequestForDetails.leaveType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-200">{selectedRequestForDetails.startDate} to {selectedRequestForDetails.endDate} ({selectedRequestForDetails.daysCount} days)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Applied On:</span>
                <span className="text-slate-200">{selectedRequestForDetails.appliedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <div>{getStatusBadge(selectedRequestForDetails.status)}</div>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block mb-1">Employee Reason:</span>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-200 italic">
                  "{selectedRequestForDetails.reason}"
                </div>
              </div>
              {selectedRequestForDetails.rejectionReason && (
                <div className="pt-1">
                  <span className="text-rose-400 block mb-1">Rejection Reason:</span>
                  <div className="p-2.5 rounded bg-rose-950/20 border border-rose-900/40 text-rose-300">
                    "{selectedRequestForDetails.rejectionReason}"
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedRequestForDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <LeaveRejectionModal
        request={rejectingRequest}
        isOpen={!!rejectingRequest}
        onClose={() => setRejectingRequest(null)}
        onConfirmReject={onReject}
      />
    </div>
  );
}
