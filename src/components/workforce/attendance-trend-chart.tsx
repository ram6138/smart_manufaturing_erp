"use client";

import React, { useState } from "react";
import { AttendanceTrendPoint } from "@/types/workforce";
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
import { Calendar, TrendingUp } from "lucide-react";

interface AttendanceTrendChartProps {
  data: AttendanceTrendPoint[];
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<"headcount" | "rate">("headcount");

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Attendance Trend (Last 30 Days)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily floor presence, unplanned absenteeism, and planned leave variations
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMetric("headcount")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeMetric === "headcount"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Staff Headcount
          </button>
          <button
            onClick={() => setActiveMetric("rate")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeMetric === "rate"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Attendance Rate %
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "headcount" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="leaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 90]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                formatter={(val: any, name: any) => [
                  `${val} staff`,
                  name === "present"
                    ? "Present Today"
                    : name === "absent"
                    ? "Absent (Unplanned)"
                    : "On Leave (Approved)",
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-300">
                    {value === "present"
                      ? "Present"
                      : value === "absent"
                      ? "Absent"
                      : "Leave"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="present"
                name="present"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#presentGrad)"
              />
              <Area
                type="monotone"
                dataKey="leave"
                name="leave"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#leaveGrad)"
              />
              <Area
                type="monotone"
                dataKey="absent"
                name="absent"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#absentGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attRateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis stroke="#64748b" fontSize={11} domain={[75, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`${val}%`, "Attendance Rate"]}
              />
              <Area
                type="monotone"
                dataKey="attendanceRate"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#attRateGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Last 30 Days Plant Log</span>
        </span>
        <span className="text-slate-300">
          Monthly Conformance: <strong className="text-emerald-400 font-mono">90.4%</strong>
        </span>
      </div>
    </div>
  );
}
