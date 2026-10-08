"use client";

import React from "react";
import { SupplierItem, PurchaseRequest, PurchaseOrderItem } from "@/types/procurement";
import {
  Users,
  FileText,
  Clock,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface ProcurementKpiCardsProps {
  suppliers: SupplierItem[];
  requests: PurchaseRequest[];
  orders: PurchaseOrderItem[];
  onSelectTab?: (tab: "orders" | "requests" | "suppliers" | "materials" | "analytics") => void;
}

export function ProcurementKpiCards({
  suppliers,
  requests,
  orders,
  onSelectTab,
}: ProcurementKpiCardsProps) {
  const totalSuppliers = suppliers.length;
  const totalRequests = requests.length;
  const pendingApprovals =
    requests.filter((r) => r.status === "Pending").length +
    orders.filter((o) => o.poStatus === "Pending Approval").length;

  const activeOrders = orders.filter(
    (o) =>
      o.poStatus === "Approved" ||
      o.poStatus === "Ordered" ||
      o.poStatus === "Partially Received"
  ).length;

  const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const overdueOrders = orders.filter((o) => o.deliveryStatus === "Delayed").length;

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const cards: Array<{
    title: string;
    value: string;
    subtext: string;
    icon: any;
    iconColor: string;
    iconBg: string;
    trend: string;
    trendUp: boolean;
    tab: "orders" | "requests" | "suppliers" | "materials" | "analytics";
  }> = [
    {
      title: "Total Suppliers",
      value: totalSuppliers.toString(),
      subtext: `${suppliers.filter((s) => s.status === "Active").length} active vendors`,
      icon: Users,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      trend: "5 key categories",
      trendUp: true,
      tab: "suppliers",
    },
    {
      title: "Purchase Requests",
      value: totalRequests.toString(),
      subtext: "Requisitions logged",
      icon: FileText,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "+8 new this week",
      trendUp: true,
      tab: "requests",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      subtext: `${requests.filter((r) => r.status === "Pending").length} PRs + ${orders.filter((o) => o.poStatus === "Pending Approval").length} POs`,
      icon: Clock,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      trend: "Requires sign-off",
      trendUp: false,
      tab: "requests",
    },
    {
      title: "Active Purchase Orders",
      value: activeOrders.toString(),
      subtext: "In procurement pipeline",
      icon: ShoppingCart,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "94.2% fulfillment",
      trendUp: true,
      tab: "orders",
    },
    {
      title: "Procurement Spend",
      value: formatCurrency(totalSpend),
      subtext: "Total committed value",
      icon: IndianRupee,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      trend: "+6.4% vs last month",
      trendUp: true,
      tab: "analytics",
    },
    {
      title: "Overdue Orders",
      value: overdueOrders.toString(),
      subtext: "Delayed delivery dock",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      trend: "Action required",
      trendUp: false,
      tab: "orders",
    },
  ];

  const handleCardClick = (tab: "orders" | "requests" | "suppliers" | "materials" | "analytics") => {
    if (onSelectTab) {
      onSelectTab(tab);
      const section = document.getElementById("procurement-tabs-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => handleCardClick(card.tab)}
            title={`Click to view ${card.title}`}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-850 hover:shadow-cyan-500/10 transition-all duration-200 shadow-md flex flex-col justify-between cursor-pointer active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.iconBg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {card.subtext}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              {card.trendUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
