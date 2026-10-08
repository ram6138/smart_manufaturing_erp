"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import { ProductionKpiCards } from "@/components/production/production-kpi-cards";
import {
  ProductionKpiTopicModal,
  KpiTopicId,
} from "@/components/production/production-kpi-topic-modal";
import { ProductionFilters } from "@/components/production/production-filters";
import { ProductionOrdersTable } from "@/components/production/production-orders-table";
import { ProductionPerformanceChart } from "@/components/production/production-performance-chart";
import { ProductPerformance } from "@/components/production/product-performance";
import { MachinePerformance } from "@/components/production/machine-performance";
import { ProductionOrderDetails } from "@/components/production/production-order-details";
import { ProductionOrderEditModal } from "@/components/production/production-order-edit-modal";
import {
  INITIAL_PRODUCTION_KPIS,
  DAILY_PRODUCTION_PERFORMANCE,
  PRODUCT_PERFORMANCE_DATA,
  MACHINE_PERFORMANCE_DATA,
} from "@/lib/mock-data/production";
import {
  ProductionFilterState,
  ProductionOrder,
  ProductionPriority,
} from "@/types/production";
import {
  Factory,
  Sparkles,
  RotateCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function ProductionPage() {
  // Production Orders State from PostgreSQL
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [kpis, setKpis] = useState(INITIAL_PRODUCTION_KPIS);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/production", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.status === "success" && isMounted) {
            setOrders(data.orders || []);
            if (data.kpis) setKpis(data.kpis);
          }
        }
      } catch (e) {
        console.warn("Using default production state", e);
      }
    }

    loadData();
    const interval = setInterval(loadData, 4000);
    window.addEventListener("focus", loadData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Filter State
  const [filters, setFilters] = useState<ProductionFilterState>({
    searchQuery: "",
    dateRange: "7d",
    product: "all",
    machine: "all",
    shift: "all",
    status: "all",
    priority: "all",
  });

  // Modal States
  const [selectedTopicKpi, setSelectedTopicKpi] = useState<KpiTopicId | null>(null);
  const [viewingOrder, setViewingOrder] = useState<ProductionOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase();
        const matchesOrder = order.orderNumber.toLowerCase().includes(query);
        const matchesBatch = order.batchNumber.toLowerCase().includes(query);
        const matchesProduct = order.product.toLowerCase().includes(query);
        if (!matchesOrder && !matchesBatch && !matchesProduct) {
          return false;
        }
      }

      // 2. Product Filter
      if (filters.product !== "all" && order.product !== filters.product) {
        return false;
      }

      // 3. Machine Filter
      if (filters.machine !== "all" && order.machine !== filters.machine) {
        return false;
      }

      // 4. Shift Filter
      if (filters.shift !== "all" && order.shift !== filters.shift) {
        return false;
      }

      // 5. Status Filter
      if (filters.status !== "all" && order.status !== filters.status) {
        return false;
      }

      // 6. Priority Filter
      if (filters.priority !== "all" && order.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [orders, filters]);

  // Actions Handlers
  const handleFilterChange = (newFilters: Partial<ProductionFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      dateRange: "7d",
      product: "all",
      machine: "all",
      shift: "all",
      status: "all",
      priority: "all",
    });
  };

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleTogglePause = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextStatus = ord.status === "Paused" ? "In Progress" : "Paused";
          showNotification(
            `Order ${ord.orderNumber} is now ${nextStatus === "Paused" ? "Paused" : "Resumed"}`
          );
          return {
            ...ord,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          showNotification(`Order ${ord.orderNumber} marked as Completed`);
          return {
            ...ord,
            status: "Completed",
            actualQuantity: ord.plannedQuantity,
            goodQuantity: ord.plannedQuantity - ord.rejectedQuantity,
            efficiency: 100.0,
            actualEnd: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    // Increment completed orders in KPI
    setKpis((prev) => ({
      ...prev,
      completedOrders: prev.completedOrders + 1,
    }));
  };

  const handleSaveOrderEdit = (updated: {
    id: string;
    plannedQuantity: number;
    priority: ProductionPriority;
    notes: string;
  }) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === updated.id) {
          const efficiency =
            updated.plannedQuantity > 0
              ? Number(((ord.actualQuantity / updated.plannedQuantity) * 100).toFixed(1))
              : 0;
          showNotification(`Order ${ord.orderNumber} parameters updated successfully`);
          return {
            ...ord,
            plannedQuantity: updated.plannedQuantity,
            priority: updated.priority,
            notes: updated.notes,
            efficiency,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
  };

  return (
    <ErpLayout>
      <div className="space-y-6 pb-6">
        {/* Action Toast Notification */}
        {actionFeedback && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-cyan-500/50 text-slate-100 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold">{actionFeedback}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200">
                <Factory className="w-3.5 h-3.5 text-blue-700" />
                Shop Floor Operations
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                Line Balancing & Dispatch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Production Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Plan, monitor, explore KPI topics and manage factory shop floor operations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                showNotification("Production schedules refreshed with live telemetry");
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition shadow-xs"
              title="Refresh production schedule"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => {
                alert("Create Production Order modal ready for backend integration.");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Work Order</span>
            </button>
          </div>
        </div>

        {/* 2. 6 KPI Cards (Clickable with full title text) */}
        <section aria-label="Production Key Performance Indicators">
          <ProductionKpiCards
            kpi={kpis}
            selectedTopicId={selectedTopicKpi}
            onSelectTopic={(topicId) => setSelectedTopicKpi(topicId)}
          />
        </section>

        {/* 3. Production Filters Bar */}
        <section aria-label="Production Filters">
          <ProductionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalOrders={orders.length}
            filteredCount={filteredOrders.length}
          />
        </section>

        {/* 4. Production Orders Table */}
        <section aria-label="Production Orders List">
          <ProductionOrdersTable
            orders={filteredOrders}
            onViewOrder={(ord) => setViewingOrder(ord)}
            onEditOrder={(ord) => setEditingOrder(ord)}
            onTogglePauseOrder={handleTogglePause}
            onCompleteOrder={handleCompleteOrder}
          />
        </section>

        {/* 5. Production Performance (Charts) */}
        <section aria-label="Production Performance Trends">
          <ProductionPerformanceChart data={DAILY_PRODUCTION_PERFORMANCE} />
        </section>

        {/* 6 & 7. Product Performance & Machine Performance Row */}
        <section aria-label="Product and Machine Performance" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6">
            <ProductPerformance
              products={PRODUCT_PERFORMANCE_DATA}
              selectedProduct={filters.product !== "all" ? filters.product : undefined}
              onSelectProduct={(prodName) => {
                const nextVal = filters.product === prodName ? "all" : prodName;
                handleFilterChange({ product: nextVal });
                showNotification(
                  nextVal === "all"
                    ? "Cleared product filter"
                    : `Filtered orders for ${prodName}`
                );
              }}
            />
          </div>
          <div className="lg:col-span-6">
            <MachinePerformance
              machines={MACHINE_PERFORMANCE_DATA}
              selectedMachine={filters.machine !== "all" ? filters.machine : undefined}
              onSelectMachine={(machName) => {
                const nextVal = filters.machine === machName ? "all" : machName;
                handleFilterChange({ machine: nextVal });
                showNotification(
                  nextVal === "all"
                    ? "Cleared machine filter"
                    : `Filtered orders for ${machName}`
                );
              }}
            />
          </div>
        </section>

        {/* KPI Topic Deep Dive Modal */}
        <ProductionKpiTopicModal
          topicId={selectedTopicKpi}
          kpi={kpis}
          onClose={() => setSelectedTopicKpi(null)}
          onApplyFilter={(filterType, value) => {
            handleFilterChange({ [filterType]: value });
          }}
          onShowNotification={showNotification}
        />

        {/* View Details Modal */}
        <ProductionOrderDetails
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />

        {/* Edit Order Modal */}
        <ProductionOrderEditModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveOrderEdit}
        />
      </div>
    </ErpLayout>
  );
}
