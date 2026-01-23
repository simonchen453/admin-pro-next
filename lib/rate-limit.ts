/**
 * 简单的速率限制实现（基于内存）
 * 生产环境建议使用 Redis 实现分布式限流
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const store = new Map<string, RateLimitEntry>()

// 每分钟清理过期记录
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
        if (entry.resetTime < now) {
            store.delete(key)
        }
    }
}, 60000)

export interface RateLimitConfig {
    maxRequests: number  // 最大请求数
    windowMs: number     // 时间窗口（毫秒）
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetTime: number
}

/**
 * 检查速率限制
 * @param identifier 唯一标识符（如 IP 地址）
 * @param config 限流配置
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now()
    const entry = store.get(identifier)

    // 如果没有记录或已过期，创建新记录
    if (!entry || entry.resetTime < now) {
        store.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs
        })

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: now + config.windowMs
        }
    }

    // 检查是否超过限制
    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime
        }
    }

    // 增加计数
    entry.count++
    store.set(identifier, entry)

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime
    }
}

/**
 * 获取客户端 IP 地址
 */
export function getClientIP(request: Request): string {
    // 尝试从各种 header 中获取真实 IP
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    const realIP = request.headers.get('x-real-ip')
    if (realIP) {
        return realIP.trim()
    }

    return 'unknown'
}
