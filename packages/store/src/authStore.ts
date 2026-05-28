import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser | null, token: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setSession: (user, token) => set({ user, accessToken: token }),
  clear: () => set({ user: null, accessToken: null }),
}));
