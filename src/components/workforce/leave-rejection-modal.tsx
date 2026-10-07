"use client";

import React, { useState } from "react";
import { LeaveRequestRecord } from "@/types/workforce";
import { X, AlertTriangle } from "lucide-react";

interface LeaveRejectionModalProps {
  request: LeaveRequestRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (requestId: string, reason: string) => void;
}

export function LeaveRejectionModal({
  request,
  isOpen,
  onClose,
  onConfirmReject,
}: LeaveRejectionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a valid operational reason for rejection.");
      return;
    }
    onConfirmReject(request.id, reason.trim());
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Reject Leave Request</h3>
            <p className="text-xs text-slate-400">Request: <span className="font-mono text-cyan-400">{request.requestId}</span></p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Employee:</span>
            <span className="font-semibold text-slate-200">{request.employeeName} ({request.employeeId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duration:</span>
            <span className="text-slate-200">{request.startDate} to {request.endDate} ({request.daysCount} days)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Type & Reason:</span>
            <span className="text-slate-300 italic">{request.leaveType} — "{request.reason}"</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Rejection Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Critical maintenance overhaul scheduled on Baking Oven during this window."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-900/30 transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
