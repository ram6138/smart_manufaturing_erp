"use client";

import React, { useState, useEffect } from "react";
import { ProductionOrder, ProductionPriority } from "@/types/production";
import { X, Edit2, Save, AlertCircle } from "lucide-react";

interface ProductionOrderEditModalProps {
  order: ProductionOrder | null;
  onClose: () => void;
  onSave: (updated: {
    id: string;
    plannedQuantity: number;
    priority: ProductionPriority;
    notes: string;
  }) => void;
}

export function ProductionOrderEditModal({
  order,
  onClose,
  onSave,
}: ProductionOrderEditModalProps) {
  const [plannedQuantity, setPlannedQuantity] = useState<number>(0);
  const [priority, setPriority] = useState<ProductionPriority>("Normal");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (order) {
      setPlannedQuantity(order.plannedQuantity);
      setPriority(order.priority);
      setNotes(order.notes || "");
    }
  }, [order]);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: order.id,
      plannedQuantity,
      priority,
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
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Production Order</h3>
              <p className="text-xs text-slate-400 font-mono">
                {order.orderNumber} • {order.product}
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

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Planned Quantity */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Planned Target Quantity ({order.unit})
            </label>
            <input
              type="number"
              min={100}
              step={100}
              required
              value={plannedQuantity}
              onChange={(e) => setPlannedQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Scheduling Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ProductionPriority)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Operator Instructions & Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Work Order Instructions & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add shop floor instructions..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Footer Actions */}
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
