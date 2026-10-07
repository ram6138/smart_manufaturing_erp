"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { MAIN_NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/config/navigation";
import {
  Cpu,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";

interface SidebarProps {
  onNavClick?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onNavClick, collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const currentRole = user?.role || "Admin";

  // Filter Main navigation items based on active role authorization
  const visibleNavItems = useMemo(() => {
    return MAIN_NAV_ITEMS.filter((item) => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(currentRole);
    });
  }, [currentRole]);

  // Filter Bottom navigation items (e.g. Settings) based on active role authorization
  const visibleBottomNavItems = useMemo(() => {
    return BOTTOM_NAV_ITEMS.filter((item) => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(currentRole);
    });
  }, [currentRole]);

  const isRouteActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-white border-r border-slate-200 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-slate-50/60">
        <Link
          href="/dashboard"
          onClick={onNavClick}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-600/20 shrink-0 group-hover:scale-105 transition">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold tracking-tight text-slate-900 truncate group-hover:text-cyan-600 transition">
              Smart Mfg ERP
            </span>
            <span className="text-[10px] text-cyan-700 font-mono tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Enterprise v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Authorized Operations</span>
        </div>

        {visibleNavItems.map((item) => {
          const active = isRouteActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                active
                  ? "bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active
                      ? "text-cyan-600"
                      : "text-slate-500 group-hover:text-slate-800"
                  }`}
                />
                <span className="truncate">{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase border ${
                    item.badgeColor || "bg-cyan-100 text-cyan-800 border-cyan-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section: Settings & User Profile & Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60 space-y-2">
        {/* Settings link (Visible only for Admin & Factory Manager) */}
        {visibleBottomNavItems.map((item) => {
          const active = isRouteActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                active
                  ? "bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 text-slate-500" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* User profile card & Logout */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {user?.name || "Logged User"}
              </span>
              <span className="text-[10px] text-cyan-700 font-medium truncate">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout("/login")}
            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
