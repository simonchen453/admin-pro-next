import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  userDomain: string
  userId: string
  loginName: string
  displayName: string
  avatarUrl?: string
  email?: string
  mobileNo?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: string[]
  menus: any[]

  // Actions
  setAuth: (user: User, token: string) => void
  setPermissions: (permissions: string[]) => void
  setMenus: (menus: any[]) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      permissions: [],
      menus: [],

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      setPermissions: (permissions) => set({ permissions }),

      setMenus: (menus) => set({ menus }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
          menus: [],
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
