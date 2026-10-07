"use client";

import React, { useState, useEffect } from "react";
import { PurchaseOrderItem, PODeliveryStatus, POStatus } from "@/types/procurement";
import {
  X,
  PackageCheck,
  Building,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
} from "lucide-react";

interface ReceivePurchaseOrderModalProps {
  order: PurchaseOrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReceiveSuccess: (
    poId: string,
    receivedQty: number,
    newPoStatus: POStatus,
    newDeliveryStatus: PODeliveryStatus
  ) => void;
}

export function ReceivePurchaseOrderModal({
  order,
  isOpen,
  onClose,
  onReceiveSuccess,
}: ReceivePurchaseOrderModalProps) {
  const [receiveQuantity, setReceiveQuantity] = useState<number>(0);
  const [grnNumber, setGrnNumber] = useState("");
  const [receivingBay, setReceivingBay] = useState("Bay 1 — Main Raw Material Dock");
  const [qaInspectionRequired, setQaInspectionRequired] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order && order.items.length > 0) {
      const primaryItem = order.items[0];
      const remaining = Math.max(0, primaryItem.quantity - primaryItem.receivedQuantity);
      setReceiveQuantity(remaining);
      const randomGrn = Math.floor(100 + Math.random() * 900);
      setGrnNumber(`GRN-2026-0${randomGrn}`);
      setError("");
    }
  }, [order]);

  if (!isOpen || !order || order.items.length === 0) return null;

  const primaryItem = order.items[0];
  const orderedQty = primaryItem.quantity;
  const previouslyReceived = primaryItem.receivedQuantity;
  const maxReceivable = Math.max(0, orderedQty - previouslyReceived);
  const remainingAfterThis = Math.max(0, maxReceivable - (Number(receiveQuantity) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyToReceive = Number(receiveQuantity);

    if (isNaN(qtyToReceive) || qtyToReceive <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    if (qtyToReceive > maxReceivable) {
      setError(`Cannot receive more than remaining pending quantity (${maxReceivable.toLocaleString()} ${primaryItem.unit}).`);
      return;
    }

    const totalNowReceived = previouslyReceived + qtyToReceive;
    const isFullyReceived = totalNowReceived >= orderedQty;

    const newPoStatus: POStatus = isFullyReceived ? "Received" : "Partially Received";
    const newDeliveryStatus: PODeliveryStatus = isFullyReceived ? "Delivered" : "In Transit";

    onReceiveSuccess(order.id, qtyToReceive, newPoStatus, newDeliveryStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Receive Goods Receipt Note (GRN)</h3>
              <p className="text-slate-400 font-mono text-[11px]">
                {order.poNumber} • {order.supplierName}
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Material & Numbers Review Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Item Material:</span>
              <span className="font-semibold text-white text-sm">{primaryItem.material}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Ordered</span>
                <span className="font-mono font-bold text-slate-200">
                  {orderedQty.toLocaleString()} {primaryItem.unit}
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">Prev. Received</span>
                <span className="font-mono font-bold text-emerald-400">
                  {previouslyReceived.toLocaleString()} {primaryItem.unit}
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block">Remaining Pending</span>
                <span className="font-mono font-bold text-amber-400">
                  {maxReceivable.toLocaleString()} {primaryItem.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Receive Quantity Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Quantity to Receive Now ({primaryItem.unit}) *
              </label>
              <input
                type="number"
                min="1"
                max={maxReceivable}
                value={receiveQuantity}
                onChange={(e) => {
                  setReceiveQuantity(Number(e.target.value));
                  setError("");
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-cyan-500/50 rounded-xl text-cyan-300 font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                GRN Reference # *
              </label>
              <input
                type="text"
                value={grnNumber}
                onChange={(e) => setGrnNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Receiving Bay & QA Check */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Receiving Bay Dock
            </label>
            <select
              value={receivingBay}
              onChange={(e) => setReceivingBay(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Bay 1 — Main Raw Material Dock">Bay 1 — Main Raw Material Dock</option>
              <option value="Bay 2 — Packaging Storage Inflow">Bay 2 — Packaging Storage Inflow</option>
              <option value="Bay 3 — Chemical & Sanitation Inflow">Bay 3 — Chemical & Sanitation Inflow</option>
              <option value="Bay 4 — Mechanical Spares Quarantine">Bay 4 — Mechanical Spares Quarantine</option>
            </select>
          </div>

          {/* Balance Preview */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Balance Remaining After Receipt:</span>
            <span className="font-mono font-bold text-slate-200">
              {remainingAfterThis.toLocaleString()} {primaryItem.unit}{" "}
              {remainingAfterThis === 0 ? (
                <span className="text-emerald-400 text-[11px] font-semibold">(100% Fulfilled)</span>
              ) : (
                <span className="text-amber-400 text-[11px] font-semibold">(Partial Inflow)</span>
              )}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              <PackageCheck className="w-4 h-4" />
              <span>Confirm Goods Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
