"use client";

import React from "react";
import { QualityDefect, DefectSeverity, DefectStatus } from "@/types/quality";
import { DEFECT_COLORS } from "@/lib/mock-data/quality";
import {
  AlertTriangle,
  AlertOctagon,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Eye,
  FileEdit,
} from "lucide-react";

interface DefectTableProps {
  defects: QualityDefect[];
  onViewDefect: (defect: QualityDefect) => void;
  onInvestigateDefect: (defect: QualityDefect) => void;
  onResolveDefect: (defect: QualityDefect) => void;
  onUpdateIssueModal: (defect: QualityDefect) => void;
}

export function DefectSeverityBadge({ severity }: { severity: DefectSeverity }) {
  switch (severity) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
          <AlertOctagon className="w-3 h-3" />
          Critical
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertTriangle className="w-3 h-3" />
          High
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" />
          Medium
        </span>
      );
    case "Low":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          Low
        </span>
      );
  }
}

export function DefectStatusBadge({ status }: { status: DefectStatus }) {
  switch (status) {
    case "Open":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          <Clock className="w-3 h-3" />
          Open
        </span>
      );
    case "Investigating":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Search className="w-3 h-3" />
          Investigating
        </span>
      );
    case "Resolved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
          <Wrench className="w-3 h-3" />
          Resolved
        </span>
      );
    case "Closed":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Closed
        </span>
      );
  }
}

export function DefectTable({
  defects,
  onViewDefect,
  onInvestigateDefect,
  onResolveDefect,
  onUpdateIssueModal,
}: DefectTableProps) {
  if (defects.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
        <h3 className="text-sm font-semibold text-white">No active defect records found</h3>
        <p className="text-xs text-slate-400">All non-conformance issues are resolved.</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Quality Defects</h3>
            <p className="text-xs text-slate-400">
              Non-conformance root cause records, quarantine actions, and CAPA resolution tracking
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-800/40">
          {defects.length} Issues Logged
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">Defect ID</th>
              <th className="py-3.5 px-4">Inspection</th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Batch</th>
              <th className="py-3.5 px-4">Defect Mode</th>
              <th className="py-3.5 px-4 text-right">Quantity</th>
              <th className="py-3.5 px-4 text-center">Severity</th>
              <th className="py-3.5 px-4 max-w-xs">Root Cause</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {defects.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                  {d.qualityDefectId}
                </td>
                <td className="py-3.5 px-4 font-mono text-cyan-400 whitespace-nowrap">
                  {d.inspectionNumber}
                </td>
                <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                  {d.product}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                  {d.batchNumber}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className="px-2 py-0.5 rounded font-medium text-[11px]"
                    style={{
                      color: DEFECT_COLORS[d.defectType],
                      backgroundColor: `${DEFECT_COLORS[d.defectType]}15`,
                    }}
                  >
                    {d.defectType}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                  {d.defectQuantity.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <DefectSeverityBadge severity={d.severity} />
                </td>
                <td className="py-3.5 px-4 max-w-xs text-slate-300 truncate" title={d.rootCause}>
                  {d.rootCause}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <DefectStatusBadge status={d.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateIssueModal(d)}
                      title="Update Root Cause & Corrective Action"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                    {d.status === "Open" && (
                      <button
                        type="button"
                        onClick={() => onInvestigateDefect(d)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                      >
                        Investigate
                      </button>
                    )}
                    {(d.status === "Open" || d.status === "Investigating") && (
                      <button
                        type="button"
                        onClick={() => onResolveDefect(d)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewDefect(d)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="View Full Defect Audit"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {defects.map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-rose-400 block">
                  {d.qualityDefectId}
                </span>
                <span className="font-semibold text-white text-sm">{d.product}</span>
                <span className="text-xs text-slate-500 font-mono block">
                  {d.defectType} • {d.defectQuantity} units
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <DefectSeverityBadge severity={d.severity} />
                <DefectStatusBadge status={d.status} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
              <span className="text-slate-400 font-medium block mb-0.5">Root Cause:</span>
              <p className="text-slate-300 line-clamp-2">{d.rootCause}</p>
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              <button
                type="button"
                onClick={() => onUpdateIssueModal(d)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-cyan-400 border border-slate-700"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Update CAPA</span>
              </button>
              <div className="flex items-center gap-1.5">
                {d.status === "Open" && (
                  <button
                    type="button"
                    onClick={() => onInvestigateDefect(d)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  >
                    Investigate
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onResolveDefect(d)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
