export type UserRole =
  | "Admin"
  | "Factory Manager"
  | "Production Manager"
  | "Inventory Manager"
  | "Maintenance Manager"
  | "Quality Manager"
  | "Procurement Manager"
  | "HR Manager"
  | "Finance Manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: AuthSession;
}
