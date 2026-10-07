"use client";

import React from "react";
import { MaterialProcurementRow, MaterialProcurementState } from "@/types/procurement";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  AlertOctagon,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

interface MaterialProcurementStatusProps {
  materials: MaterialProcurementRow[];
  onCreatePrForMaterial?: (materialName: string) => void;
}

export function MaterialStateBadge({ status }: { status: MaterialProcurementState }) {
  switch (status) {
    case "Sufficient":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Sufficient
        </span>
      );
    case "On Order":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <Truck className="w-3 h-3" />
          On Order
        </span>
      );
    case "Reorder Required":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Clock className="w-3 h-3" />
          Reorder Required
        </span>
      );
    case "Delayed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertTriangle className="w-3 h-3" />
          Delayed
        </span>
      );
    case "Critical":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
          <AlertOctagon className="w-3 h-3" />
          Critical Buffer
        </span>
      );
  }
}

export function MaterialProcurementStatus({
  materials,
  onCreatePrForMaterial,
}: MaterialProcurementStatusProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Material Procurement Status
            </h3>
            <p className="text-xs text-slate-400">
              Cross-module bridge syncing warehouse raw material stock with scheduled batch consumption
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
          Inventory & Production Sync
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">Material / SKU</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">Current Stock</th>
              <th className="py-3.5 px-4 text-right">Production Demand</th>
              <th className="py-3.5 px-4 text-right">On Order</th>
              <th className="py-3.5 px-4 text-right">Pending Inflow</th>
              <th className="py-3.5 px-4">Expected Delivery</th>
              <th className="py-3.5 px-4 text-center">Procurement Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white text-sm">{m.materialName}</div>
                  <div className="text-[11px] text-slate-500">{m.primarySupplier}</div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">{m.category}</td>
                <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-100">
                  {(m.currentStock ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                  {(m.requiredQuantity ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-400">
                  {(m.onOrderQuantity ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                  {(m.pendingQuantity ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-300">
                  {m.expectedDelivery || "—"}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <MaterialStateBadge status={m.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {onCreatePrForMaterial && (
                    <button
                      type="button"
                      onClick={() => onCreatePrForMaterial(m.materialName)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {materials.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-white text-sm block">{m.materialName}</span>
                <span className="text-slate-500 text-[11px]">{m.primarySupplier}</span>
              </div>
              <MaterialStateBadge status={m.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Stock</span>
                <span className="font-mono font-bold text-slate-200">
                  {(m.currentStock ?? 0).toLocaleString()} {m.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 block">On Order</span>
                <span className="font-mono font-bold text-cyan-400">
                  {(m.onOrderQuantity ?? 0).toLocaleString()} {m.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 block">Pending</span>
                <span className="font-mono font-bold text-amber-400">
                  {(m.pendingQuantity ?? 0).toLocaleString()} {m.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 text-[11px]">Exp: {m.expectedDelivery}</span>
              {onCreatePrForMaterial && (
                <button
                  type="button"
                  onClick={() => onCreatePrForMaterial(m.materialName)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Reorder PR</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
