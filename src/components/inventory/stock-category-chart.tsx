"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { StockCategorySummary } from "@/types/inventory";
import { Layers, DollarSign, Boxes } from "lucide-react";

interface StockCategoryChartProps {
  categories: StockCategorySummary[];
}

export function StockCategoryChart({ categories }: StockCategoryChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: StockCategorySummary = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-sans min-w-[160px]">
          <p className="font-bold text-white border-b border-slate-800 pb-1">{item.category}</p>
          <div className="flex justify-between items-center text-slate-300">
            <span>Total Units:</span>
            <span className="font-mono font-bold text-cyan-400">{item.totalQuantity.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Total Valuation:</span>
            <span className="font-mono font-bold text-emerald-400">
              ${item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[10px] pt-1 border-t border-slate-800">
            <span>Catalog Items:</span>
            <span className="font-mono">{item.itemCount} SKUs</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const grandTotalValue = categories.reduce((acc, c) => acc + c.totalValue, 0);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Stock by Category
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inventory asset valuation & unit share
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-semibold">
          ${grandTotalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Total
        </span>
      </div>

      {/* Donut Chart and Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
        {/* Donut Chart */}
        <div className="sm:col-span-5 h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={categories}
                dataKey="totalValue"
                nameKey="category"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={4}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Details */}
        <div className="sm:col-span-7 space-y-3">
          {categories.map((cat) => {
            const valueShare = ((cat.totalValue / grandTotalValue) * 100).toFixed(1);

            return (
              <div
                key={cat.category}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    ${cat.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{cat.totalQuantity.toLocaleString()} on-hand units</span>
                  <span className="font-mono">{valueShare}% of total value</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${valueShare}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
