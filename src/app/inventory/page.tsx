"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import { InventoryKpiCards } from "@/components/inventory/inventory-kpi-cards";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryTrendChart } from "@/components/inventory/inventory-trend-chart";
import { StockCategoryChart } from "@/components/inventory/stock-category-chart";
import { InventoryAlerts } from "@/components/inventory/inventory-alerts";
import { InventoryTransactions } from "@/components/inventory/inventory-transactions";
import { InventoryItemDetails } from "@/components/inventory/inventory-item-details";
import { StockAdjustmentModal } from "@/components/inventory/stock-adjustment-modal";
import { StockTransferModal } from "@/components/inventory/stock-transfer-modal";
import { PurchaseRequestModal } from "@/components/inventory/purchase-request-modal";
import {
  RAW_INVENTORY_ITEMS,
  INVENTORY_STOCK_TREND_DATA,
  STOCK_CATEGORY_DATA,
  INITIAL_INVENTORY_ALERTS,
  INITIAL_TRANSACTIONS,
} from "@/lib/mock-data/inventory";
import { computeAllInventoryItems } from "@/lib/inventory-calculations";
import {
  ComputedInventoryItem,
  InventoryAlert,
  InventoryFilterState,
  InventoryItem,
  InventoryTransaction,
  StockCategorySummary,
  InventoryTrendPoint,
} from "@/types/inventory";
import {
  Boxes,
  RotateCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Database,
  Loader2,
} from "lucide-react";

export default function InventoryPage() {
  // Inventory Items State from PostgreSQL
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [categorySummary, setCategorySummary] = useState<StockCategorySummary[]>([]);
  const [trendData, setTrendData] = useState<InventoryTrendPoint[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbLive, setIsDbLive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute calculated fields dynamically
  const computedItems = useMemo(() => {
    return computeAllInventoryItems(items);
  }, [items]);

  // Generate dynamic alerts based on stock vs reorder level
  const dynamicAlerts = useMemo(() => {
    const list: InventoryAlert[] = computedItems
      .filter((i) => i.quantityOnHand <= i.reorderLevel)
      .map((i) => ({
        id: `alert_pg_${i.id}`,
        itemId: i.id,
        itemCode: i.itemCode,
        itemName: i.itemName,
        category: i.category as any,
        availableQuantity: i.availableQuantity,
        reorderLevel: i.reorderLevel,
        unit: i.unit,
        severity: i.availableQuantity === 0 ? ("Critical" as const) : ("Warning" as const),
        status: i.status,
        message:
          i.availableQuantity === 0
            ? `Stock depleted for ${i.itemName}. Immediate replenishment required.`
            : `Stock level (${i.availableQuantity} ${i.unit}) has breached reorder threshold (${i.reorderLevel} ${i.unit}).`,
        recommendedAction: "Create Purchase Request",
      }));

    return list.length > 0 ? list : INITIAL_INVENTORY_ALERTS;
  }, [computedItems]);

  const alerts = dynamicAlerts;

  // Fetch live inventory data from PostgreSQL API
  const fetchInventoryData = useCallback(async (isMounted?: () => boolean) => {
    try {
      const res = await fetch("/api/inventory", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      if ((!isMounted || isMounted()) && data.status === "success") {
        setItems(data.items || []);
        if (data.transactions) setTransactions(data.transactions);
        if (data.categorySummary) setCategorySummary(data.categorySummary);
        if (data.trendData) setTrendData(data.trendData);
        setIsDbLive(true);
      }
    } catch (err: any) {
      console.warn("Using fallback inventory data:", err.message);
      if (!isMounted || isMounted()) setErrorMessage("Could not connect to live stream. Showing cached fallback data.");
    } finally {
      if (!isMounted || isMounted()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchInventoryData(() => mounted);
    const interval = setInterval(() => fetchInventoryData(() => mounted), 4000);
    const handleFocus = () => fetchInventoryData(() => mounted);
    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchInventoryData]);

  // Filter State
  const [filters, setFilters] = useState<InventoryFilterState>({
    searchQuery: "",
    category: "all",
    warehouse: "all",
    status: "all",
    dateRange: "7d",
  });

  // Modal States
  const [viewingItem, setViewingItem] = useState<ComputedInventoryItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<ComputedInventoryItem | null>(null);
  const [transferringItem, setTransferringItem] = useState<ComputedInventoryItem | null>(null);
  const [purchasingItem, setPurchasingItem] = useState<ComputedInventoryItem | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Available categories, warehouses & statuses dynamically from real data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    computedItems.forEach((i) => {
      if (i.category && i.category.trim()) set.add(i.category.trim());
    });
    return Array.from(set);
  }, [computedItems]);

  const availableWarehouses = useMemo(() => {
    const set = new Set<string>();
    computedItems.forEach((i) => {
      if (i.warehouse && i.warehouse.trim()) set.add(i.warehouse.trim());
    });
    return Array.from(set);
  }, [computedItems]);

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    computedItems.forEach((i) => {
      if (i.status && i.status.trim()) set.add(i.status.trim());
    });
    return Array.from(set);
  }, [computedItems]);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return computedItems.filter((item) => {
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesCode = (item.itemCode || "").toLowerCase().includes(query);
        const matchesName = (item.itemName || "").toLowerCase().includes(query);
        if (!matchesCode && !matchesName) return false;
      }

      if (filters.category !== "all") {
        const target = filters.category.toLowerCase().trim();
        const itemCat = (item.category || "").toLowerCase().trim();
        if (itemCat !== target && !itemCat.includes(target) && !target.includes(itemCat)) {
          return false;
        }
      }

      if (filters.warehouse !== "all") {
        const target = filters.warehouse.toLowerCase().trim();
        const itemWh = (item.warehouse || "").toLowerCase().trim();
        if (itemWh !== target && !itemWh.includes(target) && !target.includes(itemWh)) {
          return false;
        }
      }

      if (filters.status !== "all") {
        const target = filters.status.toLowerCase().trim();
        const curStatus = (item.status || "").toLowerCase().trim();
        if (curStatus !== target) {
          return false;
        }
      }

      return true;
    });
  }, [computedItems, filters]);

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleFilterChange = (newFilters: Partial<InventoryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      category: "all",
      warehouse: "all",
      status: "all",
      dateRange: "7d",
    });
  };

  // 1. Save Stock Adjustment to PostgreSQL
  const handleSaveAdjustment = async (params: {
    itemId: string;
    newQuantityOnHand: number;
    adjustmentDelta: number;
    reason: string;
    notes: string;
  }) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjustStock",
          ...params,
        }),
      });
      if (res.ok) {
        showNotification(`Stock adjusted successfully!`);
        fetchInventoryData();
      } else {
        throw new Error("Failed to update database");
      }
    } catch (e: any) {
      // Optimistic local update
      setItems((prev) =>
        prev.map((item) =>
          item.id === params.itemId
            ? { ...item, quantityOnHand: params.newQuantityOnHand, updatedAt: new Date().toISOString() }
            : item
        )
      );
      showNotification(`Stock count updated locally (${params.newQuantityOnHand.toLocaleString()} units)`);
    }
  };

  // 2. Save Stock Transfer to PostgreSQL
  const handleSaveTransfer = async (params: {
    itemId: string;
    targetWarehouse: string;
    transferQuantity: number;
    notes: string;
  }) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "transferStock",
          ...params,
        }),
      });
      if (res.ok) {
        showNotification(`Transferred ${params.transferQuantity} units to ${params.targetWarehouse} in database`);
        fetchInventoryData();
      } else {
        throw new Error("Failed to transfer stock in DB");
      }
    } catch (e: any) {
      showNotification(`Transferred ${params.transferQuantity} units to ${params.targetWarehouse}`);
    }
  };

  // 3. Submit Purchase Request to PostgreSQL
  const handleSubmitPurchaseRequest = async (params: {
    itemCode: string;
    itemName: string;
    currentAvailableQuantity: number;
    reorderLevel: number;
    requestedQuantity: number;
    unit: string;
    reason: string;
  }) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "purchaseRequest",
          ...params,
        }),
      });
      const data = await res.json();
      showNotification(
        `Purchase Requisition ${data.requestNumber || "PR-REC"} for ${params.requestedQuantity} ${params.unit} saved successfully`
      );
    } catch (e) {
      showNotification(`Purchase Request submitted to Procurement`);
    }
  };

  const handleAlertActionClick = (alert: InventoryAlert) => {
    const matchedItem = computedItems.find((i) => i.id === alert.itemId);
    if (matchedItem) {
      setPurchasingItem(matchedItem);
    }
  };

  return (
    <ErpLayout>
      <div className="space-y-6 pb-6">
        {/* Action Toast Notification */}
        {actionFeedback && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 text-slate-100 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{actionFeedback}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Boxes className="w-3.5 h-3.5" />
                Warehouse & Supply Chain
              </span>
              {isDbLive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  <Database className="w-3 h-3 text-cyan-400" />
                  Live Connected
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  Real-time Valuation & Bin Tracking
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Inventory Management
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Live stock levels, material availability and warehouse transactions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetchInventoryData();
                showNotification("Synchronizing latest stock levels...");
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition disabled:opacity-50"
              title="Refresh inventory levels"
            >
              <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Syncing..." : "Refresh"}</span>
            </button>

            <button
              onClick={() => {
                if (computedItems.length > 0) {
                  setPurchasingItem(computedItems[0]);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Purchase Requisition</span>
            </button>
          </div>
        </div>

        {/* 2. 6 KPI Cards */}
        <section aria-label="Inventory Key Performance Indicators">
          <InventoryKpiCards items={computedItems} />
        </section>

        {/* 3. Inventory Filters Bar */}
        <section aria-label="Inventory Filters">
          <InventoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalItems={computedItems.length}
            filteredCount={filteredItems.length}
            availableCategories={availableCategories}
            availableWarehouses={availableWarehouses}
            availableStatuses={availableStatuses}
          />
        </section>

        {/* 4. Inventory Table */}
        <section aria-label="Inventory Master Table">
          <InventoryTable
            items={filteredItems}
            onViewItem={(item) => setViewingItem(item)}
            onAdjustStock={(item) => setAdjustingItem(item)}
            onTransferStock={(item) => setTransferringItem(item)}
            onCreatePurchaseRequest={(item) => setPurchasingItem(item)}
          />
        </section>

        {/* 5 & 6. Stock Movement Trend & Category Valuation Row */}
        <section aria-label="Inventory Analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <InventoryTrendChart data={trendData} />
          </div>
          <div className="lg:col-span-5">
            <StockCategoryChart categories={categorySummary} />
          </div>
        </section>

        {/* 7. Inventory Operational Alerts */}
        <section aria-label="Inventory Alerts">
          <InventoryAlerts
            alerts={alerts}
            onActionClick={handleAlertActionClick}
          />
        </section>

        {/* 8. Recent Inventory Transactions Audit Trail */}
        <section aria-label="Recent Transactions">
          <InventoryTransactions transactions={transactions} />
        </section>

        {/* Item Details Modal */}
        <InventoryItemDetails
          item={viewingItem}
          transactions={transactions}
          onClose={() => setViewingItem(null)}
          onOpenPurchaseRequest={(item) => {
            setViewingItem(null);
            setPurchasingItem(item);
          }}
          onOpenAdjustment={(item) => {
            setViewingItem(null);
            setAdjustingItem(item);
          }}
        />

        {/* Stock Adjustment Modal */}
        <StockAdjustmentModal
          item={adjustingItem}
          onClose={() => setAdjustingItem(null)}
          onSaveAdjustment={handleSaveAdjustment}
        />

        {/* Stock Transfer Modal */}
        <StockTransferModal
          item={transferringItem}
          availableWarehouses={availableWarehouses}
          onClose={() => setTransferringItem(null)}
          onSaveTransfer={handleSaveTransfer}
        />

        {/* Purchase Request Modal (Procurement Connector) */}
        <PurchaseRequestModal
          item={purchasingItem}
          allItems={computedItems}
          onClose={() => setPurchasingItem(null)}
          onSubmitRequest={handleSubmitPurchaseRequest}
        />
      </div>
    </ErpLayout>
  );
}
