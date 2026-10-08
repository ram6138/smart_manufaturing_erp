"use client";

import React from "react";
import { AI_CAPABILITIES_LIST } from "@/lib/mock-data/ai-insights";
import {
  Wrench,
  ShieldCheck,
  TrendingUp,
  Boxes,
  IndianRupee,
  Users,
  Sparkles,
  Layers,
} from "lucide-react";

export function AiCapabilities() {
  const getIcon = (id: string) => {
    switch (id) {
      case "cap-01":
        return Wrench;
      case "cap-02":
        return ShieldCheck;
      case "cap-03":
        return TrendingUp;
      case "cap-04":
        return Boxes;
      case "cap-05":
        return IndianRupee;
      case "cap-06":
        return Users;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              AI Capabilities & Modular Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specialized neural sub-models trained on manufacturing datasets
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
          6 Autonomous Engine Domains
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_CAPABILITIES_LIST.map((cap) => {
          const Icon = getIcon(cap.id);
          return (
            <div
              key={cap.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  {cap.tag}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
