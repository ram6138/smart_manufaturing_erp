"use client";

import React, { useState } from "react";
import { X, Factory, Plus } from "lucide-react";

interface NewProductionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    productId: number;
    machineId: number;
    shiftId: number;
    plannedQuantity: number;
    plannedHours: number;
  }) => Promise<void>;
  products?: { id: number; code: string; name: string }[];
  machines?: { id: number; code: string; name: string }[];
  shifts?: { id: number; name: string }[];
}

export function NewProductionOrderModal({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  machines = [],
  shifts = [],
}: NewProductionOrderModalProps) {
  const [productId, setProductId] = useState<number>(1);
  const [machineId, setMachineId] = useState<number>(1);
  const [shiftId, setShiftId] = useState<number>(1);
  const [plannedQuantity, setPlannedQuantity] = useState<number>(5000);
  const [plannedHours, setPlannedHours] = useState<number>(8);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        productId,
        machineId,
        shiftId,
        plannedQuantity: Math.max(1, plannedQuantity),
        plannedHours: Math.max(1, plannedHours),
      });
      onClose();
    } catch (err: any) {
      alert("Failed to schedule work order: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultProducts = products.length > 0 ? products : [
    { id: 1, code: "FG-001", name: "Biscuit - Coconut" },
    { id: 2, code: "FG-002", name: "Biscuit - Chocolate" },
    { id: 3, code: "FG-003", name: "Biscuit - Butter" },
  ];

  const defaultMachines = machines.length > 0 ? machines : [
    { id: 1, code: "MCH-001", name: "Continuous Tunnel Baking Oven 1" },
    { id: 2, code: "MCH-002", name: "Rotary Deck Baking Oven 2" },
    { id: 3, code: "MCH-003", name: "High-Speed Dough Mixer 1" },
  ];

  const defaultShifts = shifts.length > 0 ? shifts : [
    { id: 1, name: "Morning Shift A" },
    { id: 2, name: "Afternoon Shift B" },
    { id: 3, name: "Night Shift C" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Production Work Order</h3>
              <p className="text-xs text-slate-400">Schedule factory batch run on shop floor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Select Product SKU</label>
            <select
              value={productId}
              onChange={(e) => setProductId(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {defaultProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Machine Line</label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {defaultMachines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Production Shift</label>
              <select
                value={shiftId}
                onChange={(e) => setShiftId(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {defaultShifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Planned Target (Packets)</label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={plannedQuantity}
                onChange={(e) => setPlannedQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Planned Runtime (Hours)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={plannedHours}
                onChange={(e) => setPlannedHours(parseFloat(e.target.value) || 8)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Scheduling..." : "Schedule Work Order"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
