"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { ShieldAlert, ArrowLeft, LogOut, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      {/* Glow background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(244,63,94,0.08),rgba(255,255,255,0))] z-0" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 mb-3">
          403 Access Denied
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Unauthorized Access
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          You do not have the required role permissions to access this restricted manufacturing module.
        </p>

        {/* User Identity Info */}
        {user && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Current User:</span>
              <span className="font-semibold text-slate-200">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="font-semibold text-rose-400">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="text-slate-300">{user.department}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <button
            onClick={() => logout("/login")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account / Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
