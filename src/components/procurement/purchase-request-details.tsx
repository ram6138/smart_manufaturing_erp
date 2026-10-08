"use client";

import React from "react";
import { PurchaseRequest } from "@/types/procurement";
import {
  RequestStatusBadge,
  RequestPriorityBadge,
} from "./purchase-request-table";
import {
  X,
  FileText,
  Building,
  Calendar,
  User,
  IndianRupee,
  Layers,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Send,
  Truck,
} from "lucide-react";

interface PurchaseRequestDetailsProps {
  request: PurchaseRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (request: PurchaseRequest) => void;
  onReject?: (request: PurchaseRequest) => void;
  onConvertToPo?: (request: PurchaseRequest) => void;
  onSubmitPending?: (request: PurchaseRequest) => void;
}

export function PurchaseRequestDetails({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onConvertToPo,
  onSubmitPending,
}: PurchaseRequestDetailsProps) {
  if (!isOpen || !request) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {request.requestId}
                </h2>
                <RequestStatusBadge status={request.status} />
                <RequestPriorityBadge priority={request.priority} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Internal Material Requisition & Shop Floor Demand
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Requested Quantity
              </span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {(request.quantity ?? 0).toLocaleString()} {request.unit}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Estimated Total Cost
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ₹{(request.estimatedTotalCost ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Unit Est. Cost
              </span>
              <span className="text-lg font-bold font-mono text-slate-200">
                ₹{(request.estimatedUnitCost ?? 25).toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Category
              </span>
              <span className="text-sm font-semibold text-purple-400 truncate block">
                {request.category || "Raw Materials"}
              </span>
            </div>
          </div>

          {/* Material & Request Info */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Requisition Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Material Item:</span>
                <span className="font-bold text-white text-sm">{request.material}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Requesting Department:</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {request.department}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Requested By:</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {request.requestedBy}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Required By Date:</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(request.requiredDate)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Preferred Supplier:</span>
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  {request.supplierPreference || "Direct Qualified Supplier"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Request Date:</span>
                <span className="font-semibold text-slate-300">
                  {formatDate(request.requestedDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Reason & Notes */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2 text-xs">
            <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[10px]">
              Business Justification & Notes:
            </span>
            <p className="text-slate-200 leading-relaxed">
              {request.reason || "Scheduled shop floor production buffer replenishment."}
            </p>
            {request.rejectionReason && (
              <div className="mt-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
                <strong>Rejection Reason:</strong> {request.rejectionReason}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {request.status === "Draft" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onReject) onReject(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSubmitPending) onSubmitPending(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit for Approval</span>
                </button>
              </>
            )}

            {request.status === "Pending" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onReject) onReject(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onApprove) onApprove(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Request</span>
                </button>
              </>
            )}

            {request.status === "Approved" && (
              <button
                type="button"
                onClick={() => {
                  if (onConvertToPo) onConvertToPo(request);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Convert to Purchase Order</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
