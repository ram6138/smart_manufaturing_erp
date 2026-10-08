"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DEMO_USERS } from "@/lib/mock-data/users";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Cpu,
  KeyRound,
  CheckCircle2,
  Factory,
  Boxes,
  ShieldAlert,
  Sparkles,
  Building2,
  Wrench,
  Truck,
  Users,
  IndianRupee,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState<string>("admin@factory.com");
  const [password, setPassword] = useState<string>("Admin@123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your corporate email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your security password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ email, password, rememberMe });
      if (result.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(result.message || "Invalid email or password.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "Admin":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case "Factory Manager":
        return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      case "Production Manager":
        return <Factory className="w-3.5 h-3.5 text-blue-400" />;
      case "Inventory Manager":
        return <Boxes className="w-3.5 h-3.5 text-emerald-400" />;
      case "Maintenance Manager":
        return <Wrench className="w-3.5 h-3.5 text-orange-400" />;
      case "Quality Manager":
        return <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />;
      case "Procurement Manager":
        return <Truck className="w-3.5 h-3.5 text-cyan-400" />;
      case "HR Manager":
        return <Users className="w-3.5 h-3.5 text-indigo-400" />;
      case "Finance Manager":
        return <IndianRupee className="w-3.5 h-3.5 text-teal-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Login Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header inside card */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
              <Sparkles className="w-3 h-3 text-cyan-600" />
              Secure Enterprise Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign In to ERP</h2>
          <p className="text-sm text-slate-500 mt-1">
            Access your manufacturing control center and operations hub.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Work Email
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@factory.com"
                className="w-full rounded-lg bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-cyan-700 hover:text-cyan-800 transition font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative rounded-lg shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-50 border border-slate-200 pl-9 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 bg-white text-cyan-600 focus:ring-cyan-500/20 cursor-pointer"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-800 select-none transition">
                Keep me signed in for 30 days
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-cyan-600/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting || authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts Section */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              ⚡ 1-Click Demo Accounts
            </span>
            <span className="text-[11px] text-cyan-700 font-mono font-medium">Auto-Fill</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_USERS.map((demo) => {
              const isSelected = email === demo.email;
              return (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleSelectDemo(demo.email, demo.password)}
                  className={`flex flex-col items-start p-2 sm:p-2.5 rounded-lg border text-left transition ${
                    isSelected
                      ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    {getRoleIcon(demo.user.role)}
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">
                      {demo.user.role.replace(" Manager", "")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono truncate w-full mt-0.5">
                    {demo.email.split("@")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Placeholder */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Password Recovery</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              In this authentication environment, you can use any of the preset demo credentials
              below:
            </p>
            <div className="my-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
              <p>
                <strong className="text-cyan-700">Admin:</strong> Admin@123
              </p>
              <p>
                <strong className="text-blue-700">Production:</strong> Production@123
              </p>
              <p>
                <strong className="text-emerald-700">Inventory:</strong> Inventory@123
              </p>
              <p>
                <strong className="text-purple-700">Quality:</strong> Quality@123
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition"
            >
              Close & Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
