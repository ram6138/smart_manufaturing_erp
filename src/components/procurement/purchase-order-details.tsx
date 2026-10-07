"use client";

import React from "react";
import { PurchaseOrderItem } from "@/types/procurement";
import {
  POStatusBadge,
  DeliveryStatusBadge,
  PaymentStatusBadge,
} from "./purchase-order-table";
import {
  X,
  ShoppingCart,
  Building,
  Calendar,
  User,
  CreditCard,
  Truck,
  PackageCheck,
  Receipt,
  FileText,
} from "lucide-react";

interface PurchaseOrderDetailsProps {
  order: PurchaseOrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReceive?: (order: PurchaseOrderItem) => void;
  onApprove?: (order: PurchaseOrderItem) => void;
  onReject?: (order: PurchaseOrderItem) => void;
}

export function PurchaseOrderDetails({
  order,
  isOpen,
  onClose,
  onReceive,
  onApprove,
  onReject,
}: PurchaseOrderDetailsProps) {
  if (!isOpen || !order) return null;

  const formatDate = (dateStr: string) => {
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

  const totalOrderedQty = (order.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0);
  const totalReceivedQty = (order.items || []).reduce((sum, it) => sum + (it.receivedQuantity || 0), 0);
  const totalPendingQty = Math.max(0, totalOrderedQty - totalReceivedQty);
  const pendingAmount = Math.max(0, (order.totalAmount || 0) - (order.paidAmount || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{order.poNumber}</h2>
                <POStatusBadge status={order.poStatus} />
                <DeliveryStatusBadge status={order.deliveryStatus} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Binding Commercial Purchase Agreement & Material Delivery Schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.poStatus === "Pending Approval" && onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove(order);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Approve PO
              </button>
            )}
            {order.poStatus === "Pending Approval" && onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(order);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition-colors"
              >
                Reject PO
              </button>
            )}
            {(order.poStatus === "Approved" ||
              order.poStatus === "Confirmed" ||
              order.poStatus === "Ordered" ||
              order.poStatus === "Partially Received") &&
              onReceive && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReceive(order);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Receive PO</span>
                </button>
              )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Contracted Supplier</span>
              <span className="text-sm font-bold text-white block truncate">
                {order.supplierName}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Purchase Order Date</span>
              <span className="text-sm font-semibold text-slate-200 block">
                {formatDate(order.orderDate)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Expected Delivery</span>
              <span className="text-sm font-semibold text-cyan-300 block">
                {formatDate(order.expectedDelivery)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Payment Terms</span>
              <span className="text-sm font-semibold text-emerald-400 block truncate">
                {order.paymentTerms}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              Procurement Officer: <strong className="text-white">{order.buyer}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-500" />
              Contracted Total: <strong className="text-emerald-400 font-mono">₹{(order.totalAmount ?? 0).toLocaleString()}</strong>
            </span>
          </div>

          {/* 1. Order Items Table */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>Order Line Items</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Material / Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Tax (%)</th>
                    <th className="py-3 px-4 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {(order.items || []).map((it) => (
                    <tr key={it.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{it.material}</td>
                      <td className="py-3 px-4 text-slate-400">{it.category}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                        {(it.quantity ?? 0).toLocaleString()} {it.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        ₹{(it.unitPrice ?? 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {it.taxPercent ?? 0}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        ₹{(it.totalPrice ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Delivery & Fulfillment Information */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Delivery & Receiving Fulfillment Status</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Ordered Qty</span>
                <span className="font-mono font-bold text-slate-100 text-sm">
                  {(totalOrderedQty ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">Received Qty</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {(totalReceivedQty ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block">Pending Qty</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {(totalPendingQty ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Expected Date</span>
                <span className="font-semibold text-slate-200 text-xs">
                  {formatDate(order.expectedDelivery)}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block mb-1">Status</span>
                <DeliveryStatusBadge status={order.deliveryStatus} />
              </div>
            </div>

            {/* Visual Delivery Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Receipt Completion</span>
                <span className="font-mono font-bold text-white">
                  {totalOrderedQty > 0
                    ? ((totalReceivedQty / totalOrderedQty) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
                  style={{
                    width: `${totalOrderedQty > 0 ? (totalReceivedQty / totalOrderedQty) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Information */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Payment & Invoice Reconciliation</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">PO Total Value</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{(order.totalAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">Paid Amount</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₹{(order.paidAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-purple-500/30">
                <span className="text-[10px] text-purple-400 block">Pending Balance</span>
                <span className="font-mono font-bold text-purple-400 text-sm">
                  ₹{(pendingAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-1">Payment Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Commercial Dispatch & Freight Notes</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Database schema target: <code className="text-cyan-400">purchase_orders</code> & <code className="text-cyan-400">goods_receipts</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close PO
          </button>
        </div>
      </div>
    </div>
  );
}
