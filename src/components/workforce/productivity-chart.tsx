"use client";

import React from "react";
import { DepartmentProductivityItem } from "@/types/workforce";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Zap, TrendingUp, Package, Clock, Timer } from "lucide-react";

interface ProductivityChartProps {
  data: DepartmentProductivityItem[];
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  // Aggregate stats
  const avgProductivity = (data.reduce((sum, d) => sum + d.productivity, 0) / (data.length || 1)).toFixed(1);
  const totalOtHours = data.reduce((sum, d) => sum + d.overtimeHours, 0);
  const avgWorkingHours = (data.reduce((sum, d) => sum + d.avgHours, 0) / (data.length || 1)).toFixed(1);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Workforce Productivity</h3>
              <p className="text-xs text-slate-400">Departmental efficiency index & output performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Avg Index: {avgProductivity}%
            </span>
          </div>
        </div>

        {/* Highlight Micro-metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Avg Productivity</div>
              <div className="text-sm font-bold text-slate-100">{avgProductivity}%</div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Units/Worker</div>
              <div className="text-sm font-bold text-cyan-400">1,250 u/shift</div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Avg Work Time</div>
              <div className="text-sm font-bold text-amber-300">{avgWorkingHours} hrs</div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Total Dept OT</div>
              <div className="text-sm font-bold text-purple-300">{totalOtHours} hrs</div>
            </div>
          </div>
        </div>

        {/* Department Productivity Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="department"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#475569" }}
              />
              <YAxis
                domain={[70, 100]}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#475569" }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DepartmentProductivityItem;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-200">{item.department}</p>
                        <p className="text-emerald-400">
                          Productivity: <span className="font-bold">{item.productivity}%</span>
                        </p>
                        {item.unitsPerWorker > 0 && (
                          <p className="text-cyan-400">
                            Units per worker: <span className="font-bold">{item.unitsPerWorker}</span>
                          </p>
                        )}
                        <p className="text-slate-400">
                          Avg Work Hours: <span className="text-slate-200">{item.avgHours}h</span>
                        </p>
                        <p className="text-amber-400">
                          Overtime Logged: <span className="font-bold">{item.overtimeHours}h</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="productivity"
                radius={[6, 6, 0, 0]}
                name="Productivity %"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <span>Target Efficiency Standard: <strong>88.0%</strong></span>
        <span className="text-emerald-400 font-medium">All 5 Departments Operational</span>
      </div>
    </div>
  );
}
