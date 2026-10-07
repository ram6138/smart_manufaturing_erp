"use client";

import React from "react";
import {
  PurchaseOrderFilterState,
  POStatus,
  PODeliveryStatus,
  POPaymentStatus,
  SupplierItem,
} from "@/types/procurement";
import { Search, RotateCcw } from "lucide-react";

interface PurchaseOrderFiltersProps {
  filters: PurchaseOrderFilterState;
  onFilterChange: (newFilters: Partial<PurchaseOrderFilterState>) => void;
  onResetFilters: () => void;
  totalOrders: number;
  filteredCount: number;
  suppliers: SupplierItem[];
}

const PO_STATUSES: POStatus[] = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Ordered",
  "Partially Received",
  "Received",
  "Cancelled",
];

const DELIVERY_STATUSES: PODeliveryStatus[] = [
  "Not Shipped",
  "In Transit",
  "Delivered",
  "Delayed",
];

const PAYMENT_STATUSES: POPaymentStatus[] = ["Pending", "Partially Paid", "Paid"];

export function PurchaseOrderFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalOrders,
  filteredCount,
  suppliers,
}: PurchaseOrderFiltersProps) {
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.supplier !== "all" ||
    filters.poStatus !== "all" ||
    filters.deliveryStatus !== "all" ||
    filters.paymentStatus !== "all";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm shadow-md space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO #, supplier name, buyer, or line item..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Supplier Filter */}
          <div className="relative">
            <select
              value={filters.supplier}
              onChange={(e) => onFilterChange({ supplier: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.supplierName}>
                  {s.supplierName}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* PO Status */}
          <div className="relative">
            <select
              value={filters.poStatus}
              onChange={(e) => onFilterChange({ poStatus: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All PO Statuses</option>
              {PO_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Delivery Status */}
          <div className="relative">
            <select
              value={filters.deliveryStatus}
              onChange={(e) => onFilterChange({ deliveryStatus: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Delivery Statuses</option>
              {DELIVERY_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Payment Status */}
          <div className="relative">
            <select
              value={filters.paymentStatus}
              onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Payment Statuses</option>
              {PAYMENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Filter status row & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <div className="text-slate-400 flex items-center gap-2">
          <span>
            Showing <strong className="text-white">{filteredCount}</strong> of{" "}
            <strong className="text-white">{totalOrders}</strong> purchase orders
          </span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 text-[11px]">
              Filters Active
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
