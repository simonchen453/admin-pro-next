import { prisma } from './prisma'

// 简单的内存缓存（生产环境建议使用 Redis）
const permissionCache = new Map<string, { permissions: string[], expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分钟

/**
 * 获取用户权限列表（带缓存）
 * 使用 ID 关联查询，利用 Prisma Relations
 */
export async function getUserPermissions(userDomain: string, userId: string): Promise<string[]> {
    const cacheKey = `${userDomain}:${userId}`

    // 检查缓存
    const cached = permissionCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
        return cached.permissions
    }

    try {
        // 从数据库获取用户角色（使用 include 获取关联的角色信息）
        const userRoles = await prisma.sysUserRoleAssign.findMany({
            where: { userDomain, userId },
            select: { roleId: true }
        })

        const roleIds = userRoles.map(r => r.roleId)

        if (roleIds.length === 0) {
            return []
        }

        // 获取角色关联的菜单（使用 ID 关联）
        const roleMenus = await prisma.sysRoleMenuAssign.findMany({
            where: { roleId: { in: roleIds } },
            select: { menuId: true }
        })

        const menuIds = roleMenus.map(m => m.menuId)

        if (menuIds.length === 0) {
            return []
        }

        // 获取菜单的权限标识
        const menus = await prisma.sysMenu.findMany({
            where: {
                id: { in: menuIds },
                status: 'active',
                permission: { not: null }
            },
            select: { permission: true }
        })

        const permissions = menus
            .map(m => m.permission)
            .filter((p): p is string => p !== null)

        // 缓存权限列表
        permissionCache.set(cacheKey, {
            permissions,
            expires: Date.now() + CACHE_TTL
        })

        return permissions
    } catch (error) {
        console.error('获取用户权限失败:', error)
        return []
    }
}

/**
 * 清除用户权限缓存
 */
export function clearUserPermissionCache(userDomain: string, userId: string) {
    const cacheKey = `${userDomain}:${userId}`
    permissionCache.delete(cacheKey)
}
