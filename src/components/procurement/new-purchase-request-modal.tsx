"use client";

import React, { useState } from "react";
import {
  PurchaseRequest,
  MaterialCategory,
  RequestPriority,
  SupplierItem,
} from "@/types/procurement";
import {
  X,
  FilePlus,
  Calendar,
  Building,
  AlertTriangle,
  IndianRupee,
  CheckCircle2,
  Package,
} from "lucide-react";

interface NewPurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: PurchaseRequest) => void;
  suppliers: SupplierItem[];
}

const CATEGORIES: MaterialCategory[] = [
  "Raw Materials",
  "Packaging",
  "Spare Parts",
  "Maintenance",
  "Operations",
];

const DEPARTMENTS = ["Production", "Packaging", "Maintenance", "QA/QC", "Inventory"];
const PRIORITIES: RequestPriority[] = ["Low", "Normal", "High", "Urgent"];

export function NewPurchaseRequestModal({
  isOpen,
  onClose,
  onSubmit,
  suppliers,
}: NewPurchaseRequestModalProps) {
  const [material, setMaterial] = useState("Wheat Flour (Refined)");
  const [category, setCategory] = useState<MaterialCategory>("Raw Materials");
  const [quantity, setQuantity] = useState<number>(10000);
  const [unit, setUnit] = useState("kg");
  const [requiredDate, setRequiredDate] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );
  const [department, setDepartment] = useState("Production");
  const [priority, setPriority] = useState<RequestPriority>("High");
  const [estimatedUnitCost, setEstimatedUnitCost] = useState<number>(32);
  const [supplierPreference, setSupplierPreference] = useState(
    suppliers[0]?.supplierName || "Odisha Agro Foods Pvt Ltd"
  );
  const [notes, setNotes] = useState(
    "Buffer inventory depleted due to accelerated Biscuit Line 1 schedule. Prompt procurement required."
  );

  if (!isOpen) return null;

  const estimatedTotalCost = (Number(quantity) || 0) * (Number(estimatedUnitCost) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRequest: PurchaseRequest = {
      id: `pr_${Date.now()}`,
      requestId: `PR-2026-${randomSuffix}`,
      requestedBy: "Rajesh Sharma (Procurement Head)",
      department,
      material: material.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit,
      requiredDate,
      estimatedUnitCost: Number(estimatedUnitCost) || 0,
      estimatedTotalCost,
      priority,
      status: "Pending",
      supplierPreference,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onSubmit(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Purchase Requisition</h3>
              <p className="text-xs text-slate-400">
                Log departmental material demands and trigger supplier quotation bidding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto flex-1 pr-1">
          {/* Material & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Material / Item Description *
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Wheat Flour (Refined)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Unit Cost */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Unit of Measure *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
              >
                <option value="kg">kg</option>
                <option value="boxes">boxes</option>
                <option value="rolls">rolls</option>
                <option value="liters">liters</option>
                <option value="units">units</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                Est. Unit Cost (₹) *
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={estimatedUnitCost}
                onChange={(e) => setEstimatedUnitCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-emerald-500/40 rounded-lg text-emerald-400 font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Department, Priority & Required Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RequestPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-semibold"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Required By Date *
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Supplier Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Preferred Supplier
            </label>
            <select
              value={supplierPreference}
              onChange={(e) => setSupplierPreference(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.supplierName}>
                  {s.supplierName} ({s.category} • Rating: {s.rating}★)
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Total Calculation */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Estimated Purchase Total:</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              ₹{estimatedTotalCost.toLocaleString()}
            </span>
          </div>

          {/* Reason / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Procurement Justification & Technical Specs
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State the usage purpose, batch allocation, or production urgency..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <FilePlus className="w-4 h-4" />
              <span>Create Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
