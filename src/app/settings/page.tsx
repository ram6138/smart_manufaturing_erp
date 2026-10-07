"use client";

import React from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import { useAuth } from "@/context/auth-context";
import {
  Settings,
  Shield,
  Building2,
  Bell,
  KeyRound,
  Database,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <ErpLayout>
      <div className="space-y-6">
        {/* Settings Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 shrink-0">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                System Administration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                ERP Configuration & Preferences
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage factory parameters, plant locations, security policies, and user account
                preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* User Account Profile */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>User Profile Settings</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Name</span>
                <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Email</span>
                <span className="font-mono text-slate-300">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Role</span>
                <span className="font-semibold text-cyan-400">{user?.role}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Department</span>
                <span className="text-slate-300">{user?.department}</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Session Authorized
              </span>
            </div>
          </div>

          {/* Plant & Facility Settings */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Facility & Shift Hours</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure primary plant location (Plant Alpha), shift start/end times (3-shift rotation),
              and local timezone preferences.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              Status: Module coming in Phase 2
            </div>
          </div>

          {/* Security & Access Roles */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Role Permissions Matrix</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detailed granular CRUD permissions for all 9 defined manufacturing roles.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              Status: Module coming in Phase 2
            </div>
          </div>

          {/* Notification & Telemetry Alerts */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Bell className="w-4 h-4 text-rose-400" />
              <span>Notification Channels</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Email, SMS, and webhook triggers for machine downtime alerts and inventory thresholds.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              Status: Module coming in Phase 2
            </div>
          </div>

          {/* Database & Integrations */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Database & Edge Gateways</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              PostgreSQL connection, OPC-UA machine gateways, and REST API connector endpoints.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              Status: Module coming in Phase 2
            </div>
          </div>

          {/* ERP System Preferences */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>General Preferences</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Theme settings, unit of measure defaults (Metric/Imperial), and currency formatting.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              Status: Module coming in Phase 2
            </div>
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
