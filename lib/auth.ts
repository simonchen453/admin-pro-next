import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

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
