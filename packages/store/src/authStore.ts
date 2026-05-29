import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser | null, token: string | null) => void;
  patchUser: (patch: Partial<AuthUser>) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setSession: (user, token) => set({ user, accessToken: token }),
  patchUser: (patch) =>
    set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
  clear: () => set({ user: null, accessToken: null }),
}));
