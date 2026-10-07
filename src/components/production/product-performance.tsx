"use client";

import React from "react";
import { ProductPerformanceItem } from "@/types/production";
import { Layers, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ProductPerformanceProps {
  products: ProductPerformanceItem[];
}

export function ProductPerformance({ products }: ProductPerformanceProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Product Performance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Throughput, fulfillment efficiency & scrap metrics across 6 SKU lines
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400/80">6 SKUs Monitored</span>
      </div>

      {/* Product Breakdown Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Product SKU</th>
              <th className="pb-3 font-semibold text-right">Planned Qty</th>
              <th className="pb-3 font-semibold text-right">Actual Qty</th>
              <th className="pb-3 font-semibold text-center">Fulfillment</th>
              <th className="pb-3 font-semibold text-center">Efficiency</th>
              <th className="pb-3 font-semibold text-right">Rejected Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((item) => {
              const fulfillmentRate = ((item.actualQuantity / item.plannedQuantity) * 100).toFixed(1);

              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pr-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.fillColor }}
                      />
                      <div>
                        <div className="font-semibold text-white">{item.product}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-400 whitespace-nowrap">
                    {item.plannedQuantity.toLocaleString()} {item.unit}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                    {item.actualQuantity.toLocaleString()} {item.unit}
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono text-slate-300 font-medium">
                        {fulfillmentRate}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(Number(fulfillmentRate), 100)}%`,
                            backgroundColor: item.fillColor,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-xs ${
                        item.efficiency >= 95
                          ? "text-emerald-400"
                          : item.efficiency >= 90
                          ? "text-blue-400"
                          : "text-amber-400"
                      }`}
                    >
                      {item.efficiency}%
                    </span>
                  </td>

                  <td className="py-3.5 pl-3 text-right whitespace-nowrap font-mono text-rose-400 font-semibold">
                    {item.rejectedQuantity.toLocaleString()} {item.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
