"use client";

import React from "react";
import { InventoryIntelligenceData } from "@/types/bi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Package, CheckCircle2, AlertTriangle, ShieldAlert, Layers, ArrowUpRight } from "lucide-react";

interface InventoryIntelligenceProps {
  data: InventoryIntelligenceData;
}

export function InventoryIntelligence({ data }: InventoryIntelligenceProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatThousands = (val: number) => `${(val / 1000).toFixed(0)}k`;

  // Explicit calculation rule
  const availableStock = data.totalOnHand - data.totalReserved;

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Inventory Intelligence & Stock Health</h3>
            <p className="text-xs text-slate-400">Warehouse valuation, available net floor stock, safety buffers & stockout risk levels</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Stock Valuation: <strong className="text-white">{formatCurrency(data.inventoryValue)}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Net Available: <strong className="text-emerald-400">{availableStock.toLocaleString()} units</strong></span>
        </div>
      </div>

      {/* Stock Health Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Total On-Hand</span>
          <span className="text-base font-bold text-slate-100 font-mono">{data.totalOnHand.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block">Gross Inventory</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-purple-500/30">
          <span className="text-[10px] text-purple-400 uppercase block">Reserved Stock</span>
          <span className="text-base font-bold text-purple-400 font-mono">{data.totalReserved.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block">Allocated to POs</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 uppercase block">Available Stock</span>
          <span className="text-base font-bold text-emerald-400 font-mono">{availableStock.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-500/80 block">On Hand - Reserved</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/30">
          <span className="text-[10px] text-amber-400 uppercase block">Low Stock Items</span>
          <span className="text-base font-bold text-amber-400 font-mono">{data.lowStockItems}</span>
          <span className="text-[10px] text-amber-400/80 block">Reorder Needed</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-rose-500/30">
          <span className="text-[10px] text-rose-400 uppercase block">Critical Stock</span>
          <span className="text-base font-bold text-rose-400 font-mono">{data.criticalStockItems}</span>
          <span className="text-[10px] text-rose-400/80 block">Below Safety Limit</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-blue-500/30">
          <span className="text-[10px] text-blue-400 uppercase block">Overstock Items</span>
          <span className="text-base font-bold text-blue-400 font-mono">{data.overstockItems}</span>
          <span className="text-[10px] text-slate-400 block">&gt;45 Days Buffer</span>
        </div>
      </div>

      {/* Inventory Receipts vs Consumption Trend Chart */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-200">
            5-Month Inventory Inbound Receipts vs Production Consumption Trend
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Units / kg</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="invReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="invConsumed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatThousands} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.month} 2026</p>
                        <p className="text-cyan-400">Stock Received: <strong>{item.received.toLocaleString()}</strong></p>
                        <p className="text-emerald-400">Consumed in Prod: <strong>{item.consumed.toLocaleString()}</strong></p>
                        <p className="text-white">Closing On-Hand: <strong>{item.onHand.toLocaleString()}</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
              <Area type="monotone" dataKey="received" name="Stock Inflow Received" stroke="#06b6d4" fill="url(#invReceived)" />
              <Area type="monotone" dataKey="consumed" name="Production Consumption" stroke="#10b981" fill="url(#invConsumed)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
