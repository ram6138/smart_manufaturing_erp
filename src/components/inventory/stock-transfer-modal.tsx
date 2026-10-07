"use client";

import React, { useState } from "react";
import { ComputedInventoryItem } from "@/types/inventory";
import { WAREHOUSES } from "@/lib/mock-data/inventory";
import { X, ArrowLeftRight, Save, Building2 } from "lucide-react";

interface StockTransferModalProps {
  item: ComputedInventoryItem | null;
  onClose: () => void;
  onSaveTransfer: (params: {
    itemId: string;
    targetWarehouse: string;
    transferQuantity: number;
    notes: string;
  }) => void;
}

export function StockTransferModal({
  item,
  onClose,
  onSaveTransfer,
}: StockTransferModalProps) {
  const [targetWarehouse, setTargetWarehouse] = useState<string>(
    WAREHOUSES.find((w) => w !== item?.warehouse) || WAREHOUSES[0]
  );
  const [transferQuantity, setTransferQuantity] = useState<number>(100);
  const [notes, setNotes] = useState<string>("");

  if (!item) return null;

  const maxTransferable = item.availableQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferQuantity > maxTransferable) {
      alert(`Cannot transfer more than available unreserved stock (${maxTransferable} ${item.unit}).`);
      return;
    }
    onSaveTransfer({
      itemId: item.id,
      targetWarehouse,
      transferQuantity,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Transfer Inventory</h3>
              <p className="text-xs text-slate-400 font-mono">
                {item.itemCode} • {item.itemName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Source vs Target */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Source Warehouse:</span>
              <span className="font-semibold text-white">{item.warehouse}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Available to Move:</span>
              <span className="font-mono font-bold text-cyan-400">
                {maxTransferable.toLocaleString()} {item.unit}
              </span>
            </div>
          </div>

          {/* Destination Warehouse */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Destination Warehouse
            </label>
            <select
              value={targetWarehouse}
              onChange={(e) => setTargetWarehouse(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {WAREHOUSES.filter((w) => w !== item.warehouse).map((wh) => (
                <option key={wh} value={wh}>
                  {wh}
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Quantity */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Transfer Quantity ({item.unit})
            </label>
            <input
              type="number"
              min={1}
              max={maxTransferable}
              required
              value={transferQuantity}
              onChange={(e) => setTransferQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Transfer Manifest Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Relocating stock to buffer production bay..."
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
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
