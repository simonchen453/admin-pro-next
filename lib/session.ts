import { prisma } from '@/lib/prisma'
import { LRUCache } from 'lru-cache'
import type { JWTPayload } from './token'

// 配置内存缓存
// 缓存最近使用的 5000 个 Token 状态
// TTL 设置为 60 秒，意味着每分钟至少验证一次数据库
const sessionCache = new LRUCache<string, boolean>({
    max: 5000,
    ttl: 60 * 1000,
})

/**
 * 创建会话
 * 将 Token 写入数据库并缓存状态
 */
export async function createSession(token: string, payload: JWTPayload, device = 'unknown') {
    // 1. 写入数据库
    await prisma.sysUserToken.create({
        data: {
            token,
            userDomain: payload.userDomain,
            userId: payload.userId,
            loginName: payload.loginName,
            device,
            expireTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
            status: 'active',
        },
    })

    // 2. 写入内存缓存
    sessionCache.set(token, true)
}

/**
 * 验证会话有效性
 * 优先查内存缓存，未命中则查数据库
 */
export async function verifySession(token: string): Promise<boolean> {
    // 1. 检查内存缓存
    if (sessionCache.has(token)) {
        return sessionCache.get(token)!
    }

    // 2. 检查数据库
    try {
        const session = await prisma.sysUserToken.findUnique({
            where: { token },
            select: { status: true, expireTime: true },
        })

        if (!session) {
            return false
        }

        // 检查状态和过期时间
        const isValid =
            session.status === 'active' &&
            (session.expireTime ? session.expireTime > new Date() : true)

        // 3. 更新缓存（仅当会话有效时）
        if (isValid) {
            sessionCache.set(token, true)
        }

        return isValid
    } catch (error) {
        console.error('Session Verification Error:', error)
        return false
    }
}

/**
 * 销毁会话（登出）
 */
export async function revokeSession(token: string) {
    // 1. 清除内存缓存
    sessionCache.delete(token)

    // 2. 删除数据库记录
    try {
        await prisma.sysUserToken.deleteMany({
            where: { token },
        })
    } catch (error) {
        console.error('Revoke Session Error:', error)
    }
}

/**
 * 强制下线用户所有会话
 */
export async function revokeUserSessions(userDomain: string, userId: string) {
    // 1. 数据库标记为无效或删除
    // 这里我们选择直接删除
    await prisma.sysUserToken.deleteMany({
        where: { userDomain, userId },
    })

    // 2. 内存缓存无法通过 UserId 清理特定 Token（因为 Key 是 Token）
    // 这意味着被强制下线的用户在 Cache TTL (1分钟) 内可能仍然有效
    // 这是为了性能做的折衷。如果需要立即生效，可以清空整个缓存：
    // sessionCache.clear() 
    // 或者在 LRU 中建立反向索引（增加复杂度）
}
