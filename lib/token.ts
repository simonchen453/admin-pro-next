import { SignJWT, jwtVerify } from 'jose'

// Critical Security: JWT_SECRET MUST be configured
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET 环境变量未配置！系统无法启动。')
}
const encodedSecret = new TextEncoder().encode(JWT_SECRET)

/**
 * JWT Payload 接口
 */
export interface JWTPayload {
    userId: string
    userDomain: string
    loginName: string
    iat?: number
    exp?: number
    [key: string]: any // allow extra properties
}

/**
 * 生成 JWT Token (Edge Compatible)
 */
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedSecret)

    return token
}

/**
 * 验证 JWT Token (Edge Compatible)
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, encodedSecret)
        return payload as unknown as JWTPayload
    } catch (error) {
        return null
    }
}

/**
 * 从请求中获取 Token
 */
export function getTokenFromRequest(request: Request): string | null {
    // 从 Cookie 中获取
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim())
        const authCookie = cookies.find(c => c.startsWith('auth_token='))
        if (authCookie) {
            return authCookie.split('=')[1]
        }
    }

    // 从 Authorization Header 中获取
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }

    return null
}
