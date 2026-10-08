"use client";

import React from "react";
import { ProductPerformanceItem } from "@/types/production";
import { Layers, ShieldAlert, CheckCircle2, Filter } from "lucide-react";

interface ProductPerformanceProps {
  products: ProductPerformanceItem[];
  onSelectProduct?: (productName: string) => void;
  selectedProduct?: string;
}

export function ProductPerformance({
  products,
  onSelectProduct,
  selectedProduct,
}: ProductPerformanceProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Product Performance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Throughput, fulfillment efficiency & scrap metrics across 6 SKU lines (Click to filter)
          </p>
        </div>
        <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
          6 SKUs Monitored
        </span>
      </div>

      {/* Product Breakdown Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Product SKU</th>
              <th className="pb-3 font-semibold text-right">Planned Qty</th>
              <th className="pb-3 font-semibold text-right">Actual Qty</th>
              <th className="pb-3 font-semibold text-center">Fulfillment</th>
              <th className="pb-3 font-semibold text-center">Efficiency</th>
              <th className="pb-3 font-semibold text-right">Rejected Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item) => {
              const fulfillmentRate = (
                (item.actualQuantity / item.plannedQuantity) *
                100
              ).toFixed(1);
              const isSelected = selectedProduct === item.product;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectProduct && onSelectProduct(item.product)}
                  title={`Click to filter orders for ${item.product}`}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-blue-50/70 text-blue-900 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <td className="py-3.5 pr-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.fillColor }}
                      />
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition">
                          {item.product}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                    {item.plannedQuantity.toLocaleString()} {item.unit}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {item.actualQuantity.toLocaleString()} {item.unit}
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono text-slate-700 font-semibold">
                        {fulfillmentRate}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
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
                          ? "text-emerald-700"
                          : item.efficiency >= 90
                          ? "text-blue-700"
                          : "text-amber-700"
                      }`}
                    >
                      {item.efficiency}%
                    </span>
                  </td>

                  <td className="py-3.5 pl-3 text-right whitespace-nowrap font-mono text-rose-600 font-semibold">
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
