"use client";

import React, { useState } from "react";
import { ComputedInventoryItem } from "@/types/inventory";
import { X, Sliders, Save, AlertCircle } from "lucide-react";

interface StockAdjustmentModalProps {
  item: ComputedInventoryItem | null;
  onClose: () => void;
  onSaveAdjustment: (params: {
    itemId: string;
    newQuantityOnHand: number;
    adjustmentDelta: number;
    reason: string;
    notes: string;
  }) => void;
}

export function StockAdjustmentModal({
  item,
  onClose,
  onSaveAdjustment,
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract" | "set">("set");
  const [value, setValue] = useState<number>(item?.quantityOnHand || 0);
  const [reason, setReason] = useState<string>("Cycle Count Discrepancy");
  const [notes, setNotes] = useState<string>("");

  if (!item) return null;

  const currentOnHand = item.quantityOnHand;

  let calculatedNewOnHand = currentOnHand;
  let delta = 0;

  if (adjustmentType === "set") {
    calculatedNewOnHand = Math.max(0, value);
    delta = calculatedNewOnHand - currentOnHand;
  } else if (adjustmentType === "add") {
    calculatedNewOnHand = currentOnHand + Math.max(0, value);
    delta = Math.max(0, value);
  } else if (adjustmentType === "subtract") {
    calculatedNewOnHand = Math.max(0, currentOnHand - Math.max(0, value));
    delta = -Math.max(0, value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAdjustment({
      itemId: item.id,
      newQuantityOnHand: calculatedNewOnHand,
      adjustmentDelta: delta,
      reason,
      notes,
    });
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Adjust Physical Stock</h3>
              <p className="text-xs text-slate-400 font-mono">
                {item.itemCode} • {item.itemName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Current vs New Quantity Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Current On-Hand</span>
              <span className="font-mono text-sm font-bold text-slate-200">
                {currentOnHand.toLocaleString()} {item.unit}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Adjusted On-Hand</span>
              <span className="font-mono text-sm font-bold text-cyan-400">
                {calculatedNewOnHand.toLocaleString()} {item.unit}
              </span>
            </div>
          </div>

          {/* Adjustment Mode */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Adjustment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType("set");
                  setValue(item.quantityOnHand);
                }}
                className={`py-1.5 rounded-lg border text-xs font-semibold transition ${
                  adjustmentType === "set"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Set Exact Count
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType("add");
                  setValue(100);
                }}
                className={`py-1.5 rounded-lg border text-xs font-semibold transition ${
                  adjustmentType === "add"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                + Add Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType("subtract");
                  setValue(50);
                }}
                className={`py-1.5 rounded-lg border text-xs font-semibold transition ${
                  adjustmentType === "subtract"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                - Reduce Stock
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              {adjustmentType === "set" ? "New Physical Count" : "Quantity to Adjust"} ({item.unit})
            </label>
            <input
              type="number"
              min={0}
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Adjustment Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="Cycle Count Discrepancy">Cycle Count Discrepancy</option>
              <option value="Physical Audit Recount">Physical Audit Recount</option>
              <option value="Damaged / Scrap Write-off">Damaged / Scrap Write-off</option>
              <option value="Moisture Evaporation Loss">Moisture Evaporation Loss</option>
              <option value="Found Unrecorded Stock">Found Unrecorded Stock</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Audit Log Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Discrepancy verified by warehouse team..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white shadow-md transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Confirm Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
