import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMe } from '../api/user/user';
import type { Me200 } from '../api/endpoints.schemas';
import { useEffect } from 'react';

type AuthState = {
  token: string | null;
  user: Me200 | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: Me200 | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setToken: (token) => set({ token, isAuthenticated: Boolean(token) }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth',
      // Ensure token is stored in localStorage
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export function useAuthSync() {
  const { setToken, setUser, setLoading } = useAuthStore();
  const me = useMe<Me200>();

  useEffect(() => {
    if (me.isLoading !== undefined) {
      setLoading(me.isLoading);
    }
  }, [me.isLoading, setLoading]);

  useEffect(() => {
    if (me.data) {
      setUser({
        id: me.data.id,
        email: me.data.email,
        createdAt: me.data.createdAt,
        updatedAt: me.data.updatedAt,
        isDeleted: me.data.isDeleted,
      });
    }
  }, [me.data, setUser]);

  return { setToken, setLoading };
}

