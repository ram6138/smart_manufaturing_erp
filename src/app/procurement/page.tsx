"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import {
  SupplierItem,
  PurchaseRequest,
  PurchaseOrderItem,
  MaterialProcurementRow,
  ProcurementAlert,
  PurchaseRequestFilterState,
  PurchaseOrderFilterState,
  POStatus,
  PODeliveryStatus,
} from "@/types/procurement";
import {
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_MATERIAL_STATUSES,
  INITIAL_PROCUREMENT_ALERTS,
  PROCUREMENT_SPEND_6_MONTHS,
  CATEGORY_SPEND_DISTRIBUTION,
} from "@/lib/mock-data/procurement";
import { ProcurementKpiCards } from "@/components/procurement/procurement-kpi-cards";
import { ProcurementOverview } from "@/components/procurement/procurement-overview";
import { ProcurementSpendChart } from "@/components/procurement/procurement-spend-chart";
import { PurchaseRequestTable } from "@/components/procurement/purchase-request-table";
import { PurchaseRequestFilters } from "@/components/procurement/purchase-request-filters";
import { NewPurchaseRequestModal } from "@/components/procurement/new-purchase-request-modal";
import { SupplierTable } from "@/components/procurement/supplier-table";
import { SupplierPerformance } from "@/components/procurement/supplier-performance";
import { PurchaseOrderTable } from "@/components/procurement/purchase-order-table";
import { PurchaseOrderFilters } from "@/components/procurement/purchase-order-filters";
import { PurchaseOrderDetails } from "@/components/procurement/purchase-order-details";
import { CreatePurchaseOrderModal } from "@/components/procurement/create-purchase-order-modal";
import { ProcurementApprovalModal } from "@/components/procurement/procurement-approval-modal";
import { ReceivePurchaseOrderModal } from "@/components/procurement/receive-purchase-order-modal";
import { ProcurementAlerts } from "@/components/procurement/procurement-alerts";
import { MaterialProcurementStatus } from "@/components/procurement/material-procurement-status";
import { ProcurementAnalytics } from "@/components/procurement/procurement-analytics";
import {
  Plus,
  RefreshCw,
  CheckCircle2,
  FilePlus,
  ShoppingCart,
  Layers,
  Truck,
  Users,
  Search,
} from "lucide-react";

export default function ProcurementPage() {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [orders, setOrders] = useState<PurchaseOrderItem[]>([]);
  const [materials, setMaterials] = useState<MaterialProcurementRow[]>([]);
  const [alerts, setAlerts] = useState<ProcurementAlert[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/procurement", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.status === "success" && isMounted) {
            setSuppliers(data.suppliers || []);
            setOrders(data.purchaseOrders || []);
            setRequests(data.purchaseRequests || []);
            setMaterials(data.materials || []);
            setAlerts(data.alerts || []);
          }
        }
      } catch (e) {
        console.warn("Using default procurement state", e);
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

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"orders" | "requests" | "suppliers" | "materials" | "analytics">(
    "orders"
  );

  // Filter states
  const [prFilters, setPrFilters] = useState<PurchaseRequestFilterState>({
    searchQuery: "",
    department: "all",
    status: "all",
    priority: "all",
    material: "all",
  });

  const [poFilters, setPoFilters] = useState<PurchaseOrderFilterState>({
    searchQuery: "",
    supplier: "all",
    poStatus: "all",
    deliveryStatus: "all",
    paymentStatus: "all",
  });

  // Modals state
  const [isNewPrModalOpen, setIsNewPrModalOpen] = useState(false);
  const [isCreatePoModalOpen, setIsCreatePoModalOpen] = useState(false);
  const [prToConvert, setPrToConvert] = useState<PurchaseRequest | null>(null);

  const [selectedPoForDetails, setSelectedPoForDetails] = useState<PurchaseOrderItem | null>(null);
  const [isPoDetailsOpen, setIsPoDetailsOpen] = useState(false);

  const [selectedPoForReceive, setSelectedPoForReceive] = useState<PurchaseOrderItem | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  // Rejection Modal
  const [rejectModalState, setRejectModalState] = useState<{
    isOpen: boolean;
    entityId: string;
    entityType: "PR" | "PO";
    targetId: string;
  }>({
    isOpen: false,
    entityId: "",
    entityType: "PR",
    targetId: "",
  });

  // Detail Drawer for PR
  const [selectedPrForDetails, setSelectedPrForDetails] = useState<PurchaseRequest | null>(null);

  // Toast / Refresh state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered PRs
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (prFilters.searchQuery) {
        const q = prFilters.searchQuery.toLowerCase();
        const matchesId = r.requestId.toLowerCase().includes(q);
        const matchesReq = r.requestedBy.toLowerCase().includes(q);
        const matchesMat = r.material.toLowerCase().includes(q);
        const matchesDept = r.department.toLowerCase().includes(q);
        if (!matchesId && !matchesReq && !matchesMat && !matchesDept) return false;
      }
      if (prFilters.department !== "all" && r.department !== prFilters.department) return false;
      if (prFilters.status !== "all" && r.status !== prFilters.status) return false;
      if (prFilters.priority !== "all" && r.priority !== prFilters.priority) return false;
      if (prFilters.material !== "all" && !r.material.toLowerCase().includes(prFilters.material.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [requests, prFilters]);

  // Filtered POs
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (poFilters.searchQuery) {
        const q = poFilters.searchQuery.toLowerCase();
        const matchesNum = o.poNumber.toLowerCase().includes(q);
        const matchesSup = o.supplierName.toLowerCase().includes(q);
        const matchesBuyer = o.buyer.toLowerCase().includes(q);
        const matchesItem = o.items.some((it) => it.material.toLowerCase().includes(q));
        if (!matchesNum && !matchesSup && !matchesBuyer && !matchesItem) return false;
      }
      if (poFilters.supplier !== "all" && o.supplierName !== poFilters.supplier) return false;
      if (poFilters.poStatus !== "all" && o.poStatus !== poFilters.poStatus) return false;
      if (poFilters.deliveryStatus !== "all" && o.deliveryStatus !== poFilters.deliveryStatus) return false;
      if (poFilters.paymentStatus !== "all" && o.paymentStatus !== poFilters.paymentStatus) return false;
      return true;
    });
  }, [orders, poFilters]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // PR Actions
  const handleApprovePr = (request: PurchaseRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "Approved" } : r))
    );
    showToast(`Purchase Request ${request.requestId} approved for procurement`);
  };

  const handleOpenRejectPr = (request: PurchaseRequest) => {
    setRejectModalState({
      isOpen: true,
      entityId: request.requestId,
      entityType: "PR",
      targetId: request.id,
    });
  };

  const handleConvertToPo = (request: PurchaseRequest) => {
    setPrToConvert(request);
    setIsCreatePoModalOpen(true);
  };

  const handleCreatePr = (newPr: PurchaseRequest) => {
    setRequests((prev) => [newPr, ...prev]);
    showToast(`Purchase Requisition ${newPr.requestId} recorded successfully`);
  };

  // PO Actions
  const handleApprovePo = async (order: PurchaseOrderItem) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, poStatus: "Approved" } : o))
    );
    try {
      await fetch('/api/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updatePOStatus', poId: order.id, status: 'Approved' }),
      });
    } catch (e) {
      console.error('Error updating PO status:', e);
    }
    showToast(`Purchase Order ${order.poNumber} approved and dispatched to vendor`);
  };

  const handleOpenRejectPo = (order: PurchaseOrderItem) => {
    setRejectModalState({
      isOpen: true,
      entityId: order.poNumber,
      entityType: "PO",
      targetId: order.id,
    });
  };

  const handleConfirmRejection = async (reason: string) => {
    if (rejectModalState.entityType === "PR") {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === rejectModalState.targetId
            ? { ...r, status: "Rejected", rejectionReason: reason }
            : r
        )
      );
      showToast(`Purchase Request ${rejectModalState.entityId} rejected`);
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === rejectModalState.targetId
            ? { ...o, poStatus: "Cancelled", rejectionReason: reason }
            : o
        )
      );
      try {
        await fetch('/api/procurement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updatePOStatus', poId: rejectModalState.targetId, status: 'Cancelled' }),
        });
      } catch (e) {
        console.error('Error cancelling PO:', e);
      }
      showToast(`Purchase Order ${rejectModalState.entityId} cancelled`);
    }
  };

  const handleCreatePo = async (newPo: PurchaseOrderItem) => {
    setOrders((prev) => [newPo, ...prev]);
    // If converted from PR, mark PR as converted
    if (prToConvert) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === prToConvert.id
            ? { ...r, status: "Converted to PO", convertedPoId: newPo.poNumber }
            : r
        )
      );
      setPrToConvert(null);
    }

    try {
      await fetch('/api/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createPO',
          supplierId: newPo.supplierId,
          supplierName: newPo.supplierName,
          items: newPo.items,
          orderDate: newPo.orderDate,
          expectedDelivery: newPo.expectedDelivery,
          totalAmount: newPo.totalAmount,
        }),
      });
    } catch (e) {
      console.error('Error saving PO to database:', e);
    }

    showToast(`Purchase Order ${newPo.poNumber} issued successfully!`);
  };

  // Receiving PO
  const handleOpenReceive = (order: PurchaseOrderItem) => {
    setSelectedPoForReceive(order);
    setIsReceiveModalOpen(true);
  };

  const handleReceiveSuccess = async (
    poId: string,
    receivedQty: number,
    newPoStatus: POStatus,
    newDeliveryStatus: PODeliveryStatus
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === poId) {
          const updatedItems = o.items.map((it, idx) =>
            idx === 0 ? { ...it, receivedQuantity: it.receivedQuantity + receivedQty } : it
          );
          return {
            ...o,
            items: updatedItems,
            poStatus: newPoStatus,
            deliveryStatus: newDeliveryStatus,
          };
        }
        return o;
      })
    );

    try {
      await fetch('/api/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'receivePO',
          poId,
          receivedQty,
          poStatus: newPoStatus,
        }),
      });
    } catch (e) {
      console.error('Error recording PO receive:', e);
    }

    // Also update Material Procurement Status
    const targetPo = orders.find((o) => o.id === poId);
    if (targetPo && targetPo.items.length > 0) {
      const matName = targetPo.items[0].material;
      setMaterials((prev) =>
        prev.map((m) => {
          if (m.materialName.toLowerCase().includes(matName.toLowerCase()) || matName.toLowerCase().includes(m.materialName.toLowerCase())) {
            const newStock = m.currentStock + receivedQty;
            const newPending = Math.max(0, m.pendingQuantity - receivedQty);
            return {
              ...m,
              currentStock: newStock,
              pendingQuantity: newPending,
              status: newPending === 0 ? "Sufficient" : "On Order",
            };
          }
          return m;
        })
      );
    }

    showToast(`Goods Receipt Note processed: +${receivedQty.toLocaleString()} units added to inventory`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Vendor contracts, freight status, and requisition streams synchronized");
    }, 600);
  };

  const handleAlertEntityClick = (alert: ProcurementAlert) => {
    if (alert.entityType === "PO") {
      const matchedPo = orders.find((o) => o.poNumber === alert.relatedEntity);
      if (matchedPo) {
        setSelectedPoForDetails(matchedPo);
        setIsPoDetailsOpen(true);
        setActiveTab("orders");
        return;
      }
    } else if (alert.entityType === "PR") {
      setActiveTab("requests");
      setPrFilters((prev) => ({ ...prev, searchQuery: alert.relatedEntity }));
    } else {
      setActiveTab("materials");
    }
  };

  return (
    <ErpLayout>
      <div className="space-y-6 pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Procurement Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Supply Chain & SQA
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Manage suppliers, purchase requests, purchase orders and material procurement.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm"
              title="Refresh procurement feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Feeds"}</span>
            </button>

            <button
              onClick={() => setIsNewPrModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
            >
              <FilePlus className="w-4 h-4" />
              <span>+ New Request</span>
            </button>

            <button
              onClick={() => {
                setPrToConvert(null);
                setIsCreatePoModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create PO</span>
            </button>
          </div>
        </div>

        {/* 1. PROCUREMENT KPI CARDS */}
        <ProcurementKpiCards suppliers={suppliers} requests={requests} orders={orders} />

        {/* 2. PROCUREMENT OVERVIEW */}
        <ProcurementOverview suppliers={suppliers} orders={orders} />

        {/* 3. PROCUREMENT ALERTS */}
        <ProcurementAlerts alerts={alerts} onViewAlertEntity={handleAlertEntityClick} />

        {/* 4. MATERIAL PROCUREMENT STATUS (Bridge to Inventory/Production) */}
        <MaterialProcurementStatus
          materials={materials}
          onCreatePrForMaterial={(matName) => {
            setIsNewPrModalOpen(true);
          }}
        />

        {/* 5. 6-MONTH SPEND TREND */}
        <ProcurementSpendChart data={PROCUREMENT_SPEND_6_MONTHS} />

        {/* SECTION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "requests"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>Purchase Requests ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "suppliers"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Suppliers Directory ({suppliers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Procurement Analytics</span>
          </button>
        </div>

        {/* TAB 1: PURCHASE ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <PurchaseOrderFilters
              filters={poFilters}
              onFilterChange={(nf) => setPoFilters((prev) => ({ ...prev, ...nf }))}
              onResetFilters={() =>
                setPoFilters({
                  searchQuery: "",
                  supplier: "all",
                  poStatus: "all",
                  deliveryStatus: "all",
                  paymentStatus: "all",
                })
              }
              totalOrders={orders.length}
              filteredCount={filteredOrders.length}
              suppliers={suppliers}
            />
            <PurchaseOrderTable
              orders={filteredOrders}
              onViewDetails={(o) => {
                setSelectedPoForDetails(o);
                setIsPoDetailsOpen(true);
              }}
              onApprove={handleApprovePo}
              onReject={handleOpenRejectPo}
              onReceive={handleOpenReceive}
            />
          </div>
        )}

        {/* TAB 2: PURCHASE REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <PurchaseRequestFilters
              filters={prFilters}
              onFilterChange={(nf) => setPrFilters((prev) => ({ ...prev, ...nf }))}
              onResetFilters={() =>
                setPrFilters({
                  searchQuery: "",
                  department: "all",
                  status: "all",
                  priority: "all",
                  material: "all",
                })
              }
              totalRequests={requests.length}
              filteredCount={filteredRequests.length}
            />
            <PurchaseRequestTable
              requests={filteredRequests}
              onApprove={handleApprovePr}
              onReject={handleOpenRejectPr}
              onConvertToPo={handleConvertToPo}
              onViewDetails={(r) => {
                setSelectedPrForDetails(r);
              }}
            />
          </div>
        )}

        {/* TAB 3: SUPPLIERS & PERFORMANCE */}
        {activeTab === "suppliers" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <SupplierTable suppliers={suppliers} />
            <SupplierPerformance suppliers={suppliers} />
          </div>
        )}

        {/* TAB 4: PROCUREMENT ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-200">
            <ProcurementAnalytics
              categories={CATEGORY_SPEND_DISTRIBUTION}
              orders={orders}
              suppliers={suppliers}
            />
          </div>
        )}

        {/* MODALS */}
        <NewPurchaseRequestModal
          isOpen={isNewPrModalOpen}
          onClose={() => setIsNewPrModalOpen(false)}
          onSubmit={handleCreatePr}
          suppliers={suppliers}
        />

        <CreatePurchaseOrderModal
          isOpen={isCreatePoModalOpen}
          onClose={() => {
            setIsCreatePoModalOpen(false);
            setPrToConvert(null);
          }}
          onSubmit={handleCreatePo}
          suppliers={suppliers}
          prefilledFromRequest={prToConvert}
        />

        <PurchaseOrderDetails
          order={selectedPoForDetails}
          isOpen={isPoDetailsOpen}
          onClose={() => {
            setIsPoDetailsOpen(false);
            setSelectedPoForDetails(null);
          }}
          onReceive={handleOpenReceive}
          onApprove={handleApprovePo}
          onReject={handleOpenRejectPo}
        />

        <ReceivePurchaseOrderModal
          order={selectedPoForReceive}
          isOpen={isReceiveModalOpen}
          onClose={() => {
            setIsReceiveModalOpen(false);
            setSelectedPoForReceive(null);
          }}
          onReceiveSuccess={handleReceiveSuccess}
        />

        <ProcurementApprovalModal
          isOpen={rejectModalState.isOpen}
          onClose={() =>
            setRejectModalState((prev) => ({ ...prev, isOpen: false }))
          }
          entityId={rejectModalState.entityId}
          entityType={rejectModalState.entityType}
          onConfirmReject={handleConfirmRejection}
        />
      </div>
    </ErpLayout>
  );
}
