'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'

/**
 * 认证相关 Hook
 * 封装用户认证状态和操作
 */
export function useAuth() {
    const router = useRouter()
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        permissions,
        menus,
        setAuth,
        setPermissions,
        setMenus,
        logout: logoutStore,
        setLoading,
    } = useAuthStore()

    /**
     * 登出
     */
    const logout = useCallback(async () => {
        try {
            // 调用登出 API
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (error) {
            console.error('登出失败:', error)
        } finally {
            // 清除本地状态
            logoutStore()
            // 跳转登录页
            router.push('/login')
        }
    }, [logoutStore, router])

    /**
     * 检查是否有指定权限
     */
    const hasPermission = useCallback(
        (permission: string): boolean => {
            if (!permission) return true
            // 超级管理员拥有所有权限
            if (permissions.includes('*:*:*')) return true
            return permissions.includes(permission)
        },
        [permissions]
    )

    /**
     * 检查是否有任一权限
     */
    const hasAnyPermission = useCallback(
        (perms: string[]): boolean => {
            if (!perms || perms.length === 0) return true
            return perms.some((p) => hasPermission(p))
        },
        [hasPermission]
    )

    /**
     * 检查是否有所有权限
     */
    const hasAllPermissions = useCallback(
        (perms: string[]): boolean => {
            if (!perms || perms.length === 0) return true
            return perms.every((p) => hasPermission(p))
        },
        [hasPermission]
    )

    /**
     * 用户显示名称
     */
    const displayName = useMemo(() => {
        return user?.displayName || user?.loginName || '未知用户'
    }, [user])

    /**
     * 用户头像URL（默认头像）
     */
    const avatarUrl = useMemo(() => {
        return user?.avatarUrl || '/default-avatar.png'
    }, [user])

    return {
        // 状态
        user,
        token,
        isAuthenticated,
        isLoading,
        permissions,
        menus,
        displayName,
        avatarUrl,

        // 操作
        setAuth,
        setPermissions,
        setMenus,
        setLoading,
        logout,

        // 权限检查
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    }
}
