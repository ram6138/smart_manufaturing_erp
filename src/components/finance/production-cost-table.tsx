"use client";

import React from "react";
import { ProductCostAnalysis } from "@/types/finance";
import { Factory, Package, Calculator, ArrowUpRight } from "lucide-react";

interface ProductionCostTableProps {
  products: ProductCostAnalysis[];
}

export function ProductionCostTable({ products }: ProductionCostTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalUnits = products.reduce((sum, p) => sum + p.unitsProduced, 0);
  const totalCost = products.reduce((sum, p) => sum + p.totalCost, 0);
  const avgCostPerUnit = (totalCost / (totalUnits || 1)).toFixed(2);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Production Cost Breakdown</h3>
              <p className="text-xs text-slate-400">Direct material inputs, labor wages, machine amortization & unit production economics</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs">
            <span className="text-slate-400">Total Units: <strong className="text-white">{totalUnits.toLocaleString()}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Avg Cost/Unit: <strong className="text-cyan-400">₹{avgCostPerUnit}</strong></span>
          </div>
        </div>

        {/* Product Cost Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-3.5">Product SKU</th>
                <th className="py-3 px-3 text-right">Units Produced</th>
                <th className="py-3 px-3 text-right">Material Cost</th>
                <th className="py-3 px-3 text-right">Labor Cost</th>
                <th className="py-3 px-3 text-right">Machine Cost</th>
                <th className="py-3 px-3 text-right">Total Production Cost</th>
                <th className="py-3 px-3.5 text-right">Cost Per Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => {
                const calculatedUnitCost = (p.totalCost / (p.unitsProduced || 1)).toFixed(2);
                return (
                  <tr key={p.id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="py-3.5 px-3.5 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="font-semibold text-white">{p.productName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      {p.unitsProduced.toLocaleString()} pkts
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-cyan-400">
                      {formatCurrency(p.materialCost)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-400">
                      {formatCurrency(p.laborCost)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-amber-400">
                      {formatCurrency(p.machineCost)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                      {formatCurrency(p.totalCost)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20 text-xs">
                        ₹{calculatedUnitCost}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-900/90 text-xs font-semibold text-slate-200 border-t border-slate-700/60">
              <tr>
                <td className="py-3 px-3.5">Total Batch Production</td>
                <td className="py-3 px-3 text-right font-mono">{totalUnits.toLocaleString()} pkts</td>
                <td className="py-3 px-3 text-right font-mono text-cyan-400">
                  {formatCurrency(products.reduce((s, p) => s + p.materialCost, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-400">
                  {formatCurrency(products.reduce((s, p) => s + p.laborCost, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-amber-400">
                  {formatCurrency(products.reduce((s, p) => s + p.machineCost, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-white">
                  {formatCurrency(totalCost)}
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-cyan-400">₹{avgCostPerUnit} / unit</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-slate-500" />
          Formula: <code>Cost Per Unit = (Material + Labor + Machine) / Units Produced</code>
        </span>
        <span className="text-emerald-400 font-medium">Standard Costing Tolerances within ±2.5%</span>
      </div>
    </div>
  );
}
