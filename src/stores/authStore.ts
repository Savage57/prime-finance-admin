import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin } from '../types/api';

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  setAuth: (admin: Admin, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateAdmin: (admin: Partial<Admin>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      
      setAuth: (admin, token, refreshToken) => {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_refresh_token', refreshToken);
        set({ admin, token, refreshToken, isAuthenticated: true });
      },
      
      clearAuth: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        set({ admin: null, token: null, refreshToken: null, isAuthenticated: false });
      },
      
      updateAdmin: (adminUpdate) => {
        const currentAdmin = get().admin;
        if (currentAdmin) {
          set({ admin: { ...currentAdmin, ...adminUpdate } });
        }
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);