import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

/**
 * JWT Payload 接口
 */
export interface JWTPayload {
  userId: string
  userDomain: string
  loginName: string
  iat?: number
  exp?: number
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return nanoid()
}

/**
 * 加密密码
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 生成 JWT Token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
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

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('密码长度至少8位')
  }

  if (password.length > 20) {
    errors.push('密码长度不超过20位')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母')
  }

  if (!/\d/.test(password)) {
    errors.push('密码必须包含数字')
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push('密码必须包含特殊字符 (@$!%*?&)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
