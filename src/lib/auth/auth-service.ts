import { AuthResponse, AuthSession, LoginCredentials, User } from "@/types/auth";
import { DEMO_USERS } from "@/lib/mock-data/users";

export const SESSION_COOKIE_NAME = "mfg_erp_session";
export const SESSION_STORAGE_KEY = "mfg_erp_session_data";

// Helper to write cookie in client side
export function setClientSessionCookie(session: AuthSession, rememberMe: boolean = false): void {
  if (typeof document === "undefined") return;
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1; // 30 days or 1 day
  const encoded = encodeURIComponent(JSON.stringify({
    token: session.token,
    userId: session.user.id,
    role: session.user.role,
    expiresAt: session.expiresAt,
  }));
  document.cookie = `${SESSION_COOKIE_NAME}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

// Helper to clear cookie and storage
export function clearClientSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// Helper to read initial session from localStorage or cookie
export function getClientSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    
    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      clearClientSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

// Mock login authentication function
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate realistic network delay (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const trimmedEmail = credentials.email.trim().toLowerCase();
  const matchedDemo = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === trimmedEmail && u.password === credentials.password
  );

  if (!matchedDemo) {
    return {
      success: false,
      message: "Invalid email or password. Please verify your credentials or select a demo account.",
    };
  }

  const now = new Date();
  const expiryDays = credentials.rememberMe ? 30 : 1;
  const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  const session: AuthSession = {
    token: `mfg_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    user: matchedDemo.user,
    createdAt: now.toISOString(),
    expiresAt,
  };

  setClientSessionCookie(session, credentials.rememberMe);

  return {
    success: true,
    session,
  };
}
