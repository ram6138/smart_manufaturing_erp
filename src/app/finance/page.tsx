"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import {
  INITIAL_12M_FINANCIAL_TREND,
  INITIAL_COST_BREAKDOWN,
  INITIAL_MONTHLY_COST_POINTS,
  INITIAL_PRODUCT_COSTS,
  INITIAL_PRODUCT_PROFITABILITY,
  INITIAL_EXPENSES,
  INITIAL_SUPPLIER_SPENDING,
  INITIAL_DEPARTMENT_BUDGETS,
  INITIAL_CASH_FLOW,
  INITIAL_INVOICES,
  INITIAL_FINANCE_ALERTS,
} from "@/lib/mock-data/finance";
import {
  ExpenseRecord,
  ProductCostAnalysis,
  ProductProfitability,
  DepartmentBudget,
  SupplierSpending,
  InvoiceRecord,
  MonthlyFinancialTrend,
  CostCategoryBreakdown,
  MonthlyCostPoint,
  CashFlowPoint,
  FinanceAlert,
  FinanceFilterState,
  PaymentStatus,
  InvoiceStatus,
} from "@/types/finance";

// Components
import { FinanceKpiCards } from "@/components/finance/finance-kpi-cards";
import { FinancialOverview } from "@/components/finance/financial-overview";
import { RevenueExpenseChart } from "@/components/finance/revenue-expense-chart";
import { CostAnalysisChart } from "@/components/finance/cost-analysis-chart";
import { ProductionCostTable } from "@/components/finance/production-cost-table";
import { ExpenseTable } from "@/components/finance/expense-table";
import { AddExpenseModal } from "@/components/finance/add-expense-modal";
import { ProcurementSpending } from "@/components/finance/procurement-spending";
import { BudgetManagement } from "@/components/finance/budget-management";
import { CashFlowChart } from "@/components/finance/cash-flow-chart";
import { InvoiceTable } from "@/components/finance/invoice-table";
import { ProfitabilityAnalysis } from "@/components/finance/profitability-analysis";
import { FinanceAlerts } from "@/components/finance/finance-alerts";
import { FinanceFilters } from "@/components/finance/finance-filters";

import {
  DollarSign,
  TrendingUp,
  Receipt,
  Factory,
  Layers,
  ShoppingBag,
  Wallet,
  Plus,
  CheckCircle2,
  Calendar,
} from "lucide-react";

type ActiveTab = "expenses_invoices" | "product_costing" | "cost_budgets" | "procurement_vendors" | "cashflow_trends";

export default function FinancePage() {
  // Primary State from PostgreSQL
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [budgets] = useState<DepartmentBudget[]>(INITIAL_DEPARTMENT_BUDGETS);
  const [productCosts] = useState<ProductCostAnalysis[]>(INITIAL_PRODUCT_COSTS);
  const [productProfitability] = useState<ProductProfitability[]>(INITIAL_PRODUCT_PROFITABILITY);
  const [supplierSpending] = useState<SupplierSpending[]>(INITIAL_SUPPLIER_SPENDING);
  const [financialTrend] = useState<MonthlyFinancialTrend[]>(INITIAL_12M_FINANCIAL_TREND);
  const [costBreakdown] = useState<CostCategoryBreakdown[]>(INITIAL_COST_BREAKDOWN);
  const [monthlyCostPoints] = useState<MonthlyCostPoint[]>(INITIAL_MONTHLY_COST_POINTS);
  const [cashFlow] = useState<CashFlowPoint[]>(INITIAL_CASH_FLOW);
  const [alerts] = useState<FinanceAlert[]>(INITIAL_FINANCE_ALERTS);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/finance", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.status === "success" && isMounted && data.costs?.length > 0) {
            const liveExpenses = data.costs.map((c: any) => ({
              id: `exp_${c.id}`,
              expenseId: `EXP-2026-${String(c.id).padStart(3, '0')}`,
              category: c.category || 'Utilities',
              description: c.description || 'Operational expense',
              amount: c.amount || 0,
              department: c.department || 'Production',
              incurredDate: c.date ? c.date.split('T')[0] : new Date().toISOString().split('T')[0],
              status: 'Approved',
              paidAmount: c.amount || 0,
              paymentMethod: 'Bank Transfer',
              approvalStatus: 'Approved',
              approvedBy: 'Financial Controller',
            }));
            setExpenses(liveExpenses);
          }
        }
      } catch (e) {
        console.warn("Using default finance state", e);
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

  // Tab & Modal States
  const [activeTab, setActiveTab] = useState<ActiveTab>("expenses_invoices");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FinanceFilterState>({
    searchQuery: "",
    dateRange: "all",
    category: "all",
    department: "all",
    paymentStatus: "all",
  });

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      // Search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesId = e.expenseId.toLowerCase().includes(query);
        const matchesDesc = e.description.toLowerCase().includes(query);
        const matchesCat = e.category.toLowerCase().includes(query);
        const matchesDept = e.department.toLowerCase().includes(query);
        if (!matchesId && !matchesDesc && !matchesCat && !matchesDept) {
          return false;
        }
      }

      if (filters.category !== "all" && e.category !== filters.category) {
        return false;
      }
      if (filters.department !== "all" && e.department !== filters.department) {
        return false;
      }
      if (filters.paymentStatus !== "all" && e.paymentStatus !== filters.paymentStatus) {
        return false;
      }
      if (filters.dateRange !== "all") {
        if (filters.dateRange === "current_month" && !e.date.startsWith("2026-10")) return false;
        if (filters.dateRange === "last_month" && !e.date.startsWith("2026-09")) return false;
      }

      return true;
    });
  }, [expenses, filters]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(query);
        const matchesEntity = inv.entityName.toLowerCase().includes(query);
        if (!matchesNum && !matchesEntity) {
          return false;
        }
      }
      if (filters.paymentStatus !== "all" && inv.status !== filters.paymentStatus) {
        return false;
      }
      return true;
    });
  }, [invoices, filters]);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  // Handlers
  const handleAddExpense = (newExpense: ExpenseRecord) => {
    setExpenses((prev) => [newExpense, ...prev]);
    showNotification(`Expense ${newExpense.expenseId} (₹${newExpense.amount.toLocaleString()}) successfully logged.`);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showNotification("Expense entry deleted.");
  };

  const handleUpdateExpenseStatus = (id: string, newStatus: PaymentStatus) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, paymentStatus: newStatus } : e))
    );
    showNotification(`Expense marked as ${newStatus}.`);
  };

  const handleUpdateInvoiceStatus = (id: string, newStatus: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
    showNotification(`Invoice status updated to ${newStatus}.`);
  };

  const handleAlertAction = (alert: FinanceAlert) => {
    if (alert.category === "Production Cost") {
      setActiveTab("product_costing");
    } else if (alert.category === "Overdue Payment") {
      setActiveTab("expenses_invoices");
    } else if (alert.category === "Budget Overrun" || alert.category === "Maintenance Expense") {
      setActiveTab("cost_budgets");
    } else {
      setActiveTab("cashflow_trends");
    }
  };

  const handleFilterChange = (newFilters: Partial<FinanceFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      dateRange: "all",
      category: "all",
      department: "all",
      paymentStatus: "all",
    });
  };

  // Dynamic KPI Metrics
  const calculatedOperationalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = 8500000;
  const productionCost = 4200000;
  const procurementCost = 1850000;
  const grossProfit = totalRevenue - productionCost - (calculatedOperationalExpenses - 820000);
  const profitMargin = Number(((grossProfit / totalRevenue) * 100).toFixed(1));
  const pendingPayments = invoices
    .filter((inv) => inv.type === "Supplier Invoice" && inv.status !== "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0) || 650000;

  return (
    <ErpLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Finance Management</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitor costs, expenses, budgets, payments and financial performance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {notificationMsg && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {notificationMsg}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              + Add Expense
            </button>
          </div>
        </div>

        {/* 1. Eight Finance KPI Cards */}
        <FinanceKpiCards
          totalRevenue={totalRevenue}
          productionCost={productionCost}
          procurementCost={procurementCost}
          operationalExpenses={calculatedOperationalExpenses}
          grossProfit={grossProfit}
          profitMargin={profitMargin}
          pendingPayments={pendingPayments}
          monthlyExpenses={1240000}
        />

        {/* 2. Financial Overview Matrix */}
        <FinancialOverview
          revenue={totalRevenue}
          expenses={6870000}
          profit={grossProfit}
          cashPosition={3450000}
          pendingReceivables={2850000}
          costBreakdown={costBreakdown}
        />

        {/* 3. Operational Finance & Cost Alerts */}
        <FinanceAlerts alerts={alerts} onViewAlert={handleAlertAction} />

        {/* Module Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("expenses_invoices")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "expenses_invoices"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Operational Expenses & Invoices ({expenses.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("product_costing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "product_costing"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Factory className="w-4 h-4" />
            Production Cost & SKU Profitability
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cost_budgets")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cost_budgets"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Cost Analysis & Department Budgets
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("procurement_vendors")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "procurement_vendors"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Procurement Spending & Payables
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cashflow_trends")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cashflow_trends"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Cash Flow & 12M Financial Trends
          </button>
        </div>

        {/* Tab 1: Expenses & Invoices */}
        {activeTab === "expenses_invoices" && (
          <div className="space-y-6">
            <FinanceFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalRecords={expenses.length}
              filteredCount={filteredExpenses.length}
            />

            <ExpenseTable
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
              onUpdateStatus={handleUpdateExpenseStatus}
            />

            <InvoiceTable
              invoices={filteredInvoices}
              onUpdateStatus={handleUpdateInvoiceStatus}
            />
          </div>
        )}

        {/* Tab 2: Production Cost & Profitability */}
        {activeTab === "product_costing" && (
          <div className="space-y-6">
            <ProductionCostTable products={productCosts} />
            <ProfitabilityAnalysis products={productProfitability} />
          </div>
        )}

        {/* Tab 3: Cost Analysis & Budgets */}
        {activeTab === "cost_budgets" && (
          <div className="space-y-6">
            <CostAnalysisChart
              distribution={costBreakdown}
              monthlyPoints={monthlyCostPoints}
            />
            <BudgetManagement budgets={budgets} />
          </div>
        )}

        {/* Tab 4: Procurement & Vendors */}
        {activeTab === "procurement_vendors" && (
          <div className="space-y-6">
            <ProcurementSpending suppliers={supplierSpending} />
          </div>
        )}

        {/* Tab 5: Cash Flow & Trends */}
        {activeTab === "cashflow_trends" && (
          <div className="space-y-6">
            <RevenueExpenseChart data={financialTrend} />
            <CashFlowChart data={cashFlow} />
          </div>
        )}

        {/* Add Expense Modal */}
        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          onAddExpense={handleAddExpense}
          existingCount={expenses.length}
        />
      </div>
    </ErpLayout>
  );
}
