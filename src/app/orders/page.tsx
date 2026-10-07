"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import { useAuth } from "@/context/auth-context";
import { getOrderPermissions } from "@/lib/auth/order-permissions";
import {
  ClipboardList,
  PackageCheck,
  Plus,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Database,
  ShoppingBag,
  TrendingUp,
  Clock,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  Info,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

interface OrderItem {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CustomerOrder {
  id: number;
  orderNumber: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customerId: number;
  customerName: string;
  customerEmail?: string;
  customerCity?: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  // Get active role permissions
  const permissions = getOrderPermissions(user?.role || "Admin");

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbLive, setIsDbLive] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // New Order Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("1");
  const [selectedProductId, setSelectedProductId] = useState<string>("1"); // Biscuit - Coconut
  const [orderQuantity, setOrderQuantity] = useState<number>(1000); // 1000 packets
  const [unitPrice, setUnitPrice] = useState<number>(25.0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete Order State
  const [deletingOrder, setDeletingOrder] = useState<CustomerOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // RBAC Legend Matrix Modal State
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  const fetchOrders = useCallback(async (isMounted?: () => boolean) => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      if ((!isMounted || isMounted()) && data.status === "success") {
        setOrders(data.orders || []);
        setCustomers(data.customers || []);
        setProducts(data.products || []);
        setIsDbLive(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isMounted || isMounted()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchOrders(() => mounted);
    const interval = setInterval(() => fetchOrders(() => mounted), 4000);
    const handleFocus = () => fetchOrders(() => mounted);
    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchOrders]);

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4500);
  };

  // 1. Place New Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canCreate) {
      alert("Permission Denied: Your role is not authorized to register customer orders.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: parseInt(selectedCustomerId),
        items: [
          {
            productId: parseInt(selectedProductId),
            quantity: orderQuantity,
            unitPrice: unitPrice,
          },
        ],
        expectedDays: 5,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setIsModalOpen(false);
        showNotification(
          `Success! Order ${data.order.orderNumber} for ${orderQuantity.toLocaleString()} packets saved to PostgreSQL database!`
        );
        fetchOrders();
      } else {
        throw new Error(data.message || "Failed to place order");
      }
    } catch (err: any) {
      alert("Error saving order: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Delete Order
  const handleConfirmDelete = async () => {
    if (!deletingOrder) return;
    if (!permissions.canDelete) {
      alert("Permission Denied: Only Admin and Factory Manager can delete customer orders.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/orders?id=${deletingOrder.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        showNotification(`Order ${deletingOrder.orderNumber} deleted from PostgreSQL successfully.`);
        setDeletingOrder(null);
        fetchOrders();
      } else {
        throw new Error(data.error || "Failed to delete order");
      }
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. Update Order Status
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (!permissions.canUpdateStatus) {
      alert("Permission Denied: Your role is not authorized to modify order lifecycle status.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        showNotification(`Order status updated to "${newStatus}" in PostgreSQL!`);
        fetchOrders();
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (err: any) {
      alert("Status update failed: " + err.message);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrderedUnits = orders.reduce(
    (acc, o) => acc + o.items.reduce((sum, it) => sum + (it.quantity || 0), 0),
    0
  );

  return (
    <ErpLayout>
      <div className="space-y-6 pb-6">
        {/* Toast Notification */}
        {actionFeedback && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500 text-slate-100 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{actionFeedback}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <ClipboardList className="w-3.5 h-3.5" />
                Sales & Customer Fulfillment
              </span>
              {isDbLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Database className="w-3 h-3 text-emerald-400" />
                  PostgreSQL Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Customer Orders Intake & Management
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Role-authorized customer order registration, status progression, financial audits, and deletion.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Order</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Customer Orders</p>
              <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
              <span className="text-[11px] text-cyan-400 font-mono">customer_orders table</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Packets Ordered</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {totalOrderedUnits.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Packets</span>
              </p>
              <span className="text-[11px] text-emerald-400 font-mono">order_items table</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Cumulative Order Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[11px] text-purple-400 font-mono">
                Real-time DB aggregate
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 4. Orders Table */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                Live Customer Orders Records
              </h2>
              <p className="text-xs text-slate-400">
                Directly reading from <code className="text-cyan-400">customer_orders</code> and <code className="text-cyan-400">order_items</code>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product & Packets</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  {permissions.canDelete && (
                    <th className="py-3 px-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ord.customerName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-1.5 font-medium">
                          <span className="text-slate-200">{it.productName}</span>
                          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                            {it.quantity.toLocaleString()} {it.unit || "Packs"}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(ord.orderDate || ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {ord.expectedDeliveryDate ? new Date(ord.expectedDeliveryDate).toLocaleDateString() : "TBD"}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${ord.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      {permissions.canUpdateStatus ? (
                        <div className="relative inline-block">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="appearance-none bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 py-1 pl-2.5 pr-6 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Production">In Production</option>
                            <option value="Completed">Completed</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          {ord.status}
                        </span>
                      )}
                    </td>
                    {permissions.canDelete && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setDeletingOrder(ord)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition active:scale-95"
                          title={`Delete Order ${ord.orderNumber} from database`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Registering Customer Order */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Register New Customer Order</h3>
                    <p className="text-xs text-slate-400">Directly writes records to your PostgreSQL database</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Customer</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city || "Factory Client"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Biscuit Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      if (e.target.value === "2") setUnitPrice(30.0);
                      else setUnitPrice(25.0);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1">Biscuit - Coconut (FG-BIS-001) - $25.00/pack</option>
                    <option value="2">Biscuit - Chocolate (FG-BIS-002) - $30.00/pack</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Ordered Quantity (Packets)</label>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Price ($ / pack)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">Total Calculated Order Value:</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">
                      ${(orderQuantity * unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-cyan-400 font-mono">Authorized by {user?.role || "Admin"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting ? "Writing to PostgreSQL..." : "Confirm & Save Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Order {deletingOrder.orderNumber}?</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    This will permanently delete this order and its {deletingOrder.items.length} line item(s) from the <code className="text-rose-300 font-mono">customer_orders</code> table in PostgreSQL.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Customer:</span>
                  <span className="font-semibold text-white">{deletingOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Order Total:</span>
                  <span className="font-mono font-bold text-rose-400">
                    ${deletingOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingOrder(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting from PostgreSQL..." : "Confirm & Delete Order"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full RBAC Authorization Matrix Modal */}
        {showMatrixModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Full Orders Authorization Matrix (RBAC)</h3>
                </div>
                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400">
                This table defines what each of the 9 corporate ERP roles is authorized to perform in the Order Management module:
              </p>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3 text-center">See Orders</th>
                      <th className="py-2.5 px-3 text-center">Register Order</th>
                      <th className="py-2.5 px-3 text-center">Update Status</th>
                      <th className="py-2.5 px-3 text-center">Delete Order</th>
                      <th className="py-2.5 px-3 text-center">Financials</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-sans">
                    <tr className="bg-slate-900/40">
                      <td className="py-2 px-3 font-bold text-rose-400">🛡️ Admin</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-rose-400 font-bold">✅ Full Purge</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Full</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-amber-400">🏢 Factory Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-amber-400 font-bold">✅ Cancel/Void</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Full</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td className="py-2 px-3 font-bold text-blue-400">🏭 Production Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ Masked</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-teal-400">💲 Finance Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Full Audit</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td className="py-2 px-3 font-bold text-emerald-400">📦 Inventory Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ Masked</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-cyan-400">🚚 Procurement Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ Masked</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td className="py-2 px-3 font-bold text-purple-400">✅ Quality Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ Masked</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-orange-400">🔧 Maintenance Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ Masked</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td className="py-2 px-3 font-bold text-indigo-400">👥 HR Manager</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">✅ Yes</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ No</td>
                      <td className="py-2 px-3 text-center text-slate-500">❌ Masked</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowMatrixModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                >
                  Close Matrix
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
