"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Factory,
  Briefcase,
  Clock,
  CalendarDays,
  Percent,
  CreditCard,
} from "lucide-react";

interface FinanceKpiCardsProps {
  totalRevenue?: number;
  productionCost?: number;
  procurementCost?: number;
  operationalExpenses?: number;
  grossProfit?: number;
  profitMargin?: number;
  pendingPayments?: number;
  monthlyExpenses?: number;
}

export function FinanceKpiCards({
  totalRevenue = 8500000,
  productionCost = 4200000,
  procurementCost = 1850000,
  operationalExpenses = 820000,
  grossProfit = 1630000,
  profitMargin = 19.1,
  pendingPayments = 650000,
  monthlyExpenses = 1240000,
}: FinanceKpiCardsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtext: "Current fiscal month turnover",
      icon: DollarSign,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "+4.2% vs last month",
      trendUp: true,
    },
    {
      title: "Production Cost",
      value: formatCurrency(productionCost),
      subtext: "Direct manufacturing & batch run",
      icon: Factory,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "49.4% of total revenue",
      trendUp: false,
    },
    {
      title: "Procurement Cost",
      value: formatCurrency(procurementCost),
      subtext: "Raw materials & packaging input",
      icon: ShoppingBag,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      trend: "Across 4 active suppliers",
      trendUp: true,
    },
    {
      title: "Operational Expenses",
      value: formatCurrency(operationalExpenses),
      subtext: "Plant utilities, logistics & tech",
      icon: Briefcase,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      trend: "Within approved limits",
      trendUp: true,
    },
    {
      title: "Gross Profit",
      value: formatCurrency(grossProfit),
      subtext: "Revenue minus direct costs",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "+₹1,80,000 above target",
      trendUp: true,
    },
    {
      title: "Profit Margin",
      value: `${profitMargin}%`,
      subtext: "Net operational margin",
      icon: Percent,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "Benchmark: 18.0%",
      trendUp: true,
    },
    {
      title: "Pending Payments",
      value: formatCurrency(pendingPayments),
      subtext: "Payables awaiting disbursement",
      icon: Clock,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      trend: "2 invoices overdue",
      trendUp: false,
    },
    {
      title: "Monthly Expenses",
      value: formatCurrency(monthlyExpenses),
      subtext: "Cumulative overheads logged",
      icon: CreditCard,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      trend: "Current billing cycle",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm hover:border-slate-700 transition-all shadow-md flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
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
