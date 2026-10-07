"use client";

import React from "react";
import { WorkforceIntelligenceData } from "@/types/bi";
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
import { Users, CheckCircle2, Clock, Zap, AlertTriangle, TrendingUp } from "lucide-react";

interface WorkforceIntelligenceProps {
  data: WorkforceIntelligenceData;
}

export function WorkforceIntelligence({ data }: WorkforceIntelligenceProps) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Workforce Intelligence & Labor Output</h3>
            <p className="text-xs text-slate-400">Headcount attendance, labor productivity scores, overtime tracking & shift manning gaps</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span className="text-slate-400">Headcount: <strong className="text-white">{data.totalEmployees}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Attendance: <strong className="text-emerald-400">{data.attendanceRate}%</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Productivity: <strong className="text-cyan-400">{data.workforceProductivity}%</strong></span>
        </div>
      </div>

      {/* Summary Micro-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Total Staff</span>
          <span className="text-base font-bold text-slate-100 font-mono">{data.totalEmployees}</span>
          <span className="text-[10px] text-slate-500 block">Active Roster</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 uppercase block">Attendance Rate</span>
          <span className="text-base font-bold text-emerald-400 font-mono">{data.attendanceRate}%</span>
          <span className="text-[10px] text-emerald-500/80 block">74 Present Today</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-cyan-500/30">
          <span className="text-[10px] text-cyan-400 uppercase block">Productivity</span>
          <span className="text-base font-bold text-cyan-400 font-mono">{data.workforceProductivity}%</span>
          <span className="text-[10px] text-cyan-500/80 block">+2.1% Target</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-purple-500/30">
          <span className="text-[10px] text-purple-400 uppercase block">Overtime Hours</span>
          <span className="text-base font-bold text-purple-400 font-mono">{data.overtimeHours}h</span>
          <span className="text-[10px] text-slate-400 block">Logged This Month</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-blue-500/30">
          <span className="text-[10px] text-blue-400 uppercase block">Shift Utilization</span>
          <span className="text-base font-bold text-blue-400 font-mono">{data.workforceUtilization}%</span>
          <span className="text-[10px] text-slate-400 block">4 Shifts Active</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/30">
          <span className="text-[10px] text-amber-400 uppercase block">Staffing Gaps</span>
          <span className="text-base font-bold text-amber-400 font-mono">{data.openWorkforceGaps}</span>
          <span className="text-[10px] text-amber-400/80 block">Understaffed Lines</span>
        </div>
      </div>

      {/* Department Productivity Bar Chart */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-200">
            Departmental Labor Productivity Comparison (%)
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">6 Factory Departments</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.departmentProductivity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[75, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{item.department} Department</p>
                        <p className="text-emerald-400">Productivity: <strong>{item.productivity}%</strong></p>
                        <p className="text-slate-400">Headcount Assigned: <strong>{item.headcount} Staff</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="productivity" radius={[4, 4, 0, 0]}>
                {data.departmentProductivity.map((entry, index) => (
                  <Cell key={`dept-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
