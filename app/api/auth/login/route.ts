import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { generateToken } from '@/lib/token'
import { verifyCaptcha } from '@/lib/captcha'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { loginSchema } from '@/lib/validation/schemas'
import { withErrorHandler, ApiError } from '@/lib/api-handler'
import { createSession } from '@/lib/session'
import type { LoginResponse } from '@/types'

// Cookie 配置
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 天（秒）
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * 登录 API
 * POST /api/auth/login
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  // 1. 速率限制: 每个 IP 10次/分钟
  const clientIP = getClientIP(request)
  const rateLimit = checkRateLimit(clientIP, {
    maxRequests: 10,
    windowMs: 60 * 1000
  })

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: '请求过于频繁，请稍后再试',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      }
    )
  }

  // 2. 请求体验证 (使用 Zod)
  const body = await request.json()
  const validation = loginSchema.safeParse(body)

  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message)
    throw new ApiError(400, errors[0], 'VALIDATION_ERROR')
  }

  const { userDomain, loginName, password, captchaId, captchaText } = validation.data

  // 3. 验证验证码
  if (!verifyCaptcha(captchaId, captchaText)) {
    throw ApiError.badRequest('验证码错误', 'CAPTCHA_ERROR')
  }

  // 4. 查找用户
  const user = await prisma.sysUser.findFirst({
    where: { userDomain, loginName },
  })

  // 统一返回模糊错误信息，防止账号枚举
  if (!user) {
    throw new ApiError(401, '用户名或密码错误', 'AUTH_FAILED')
  }

  // 5. 检查用户状态
  if (user.status !== 'active') {
    // 安全考虑: 不明确告知账号状态
    throw new ApiError(401, '用户名或密码错误', 'AUTH_FAILED')
  }

  // 6. 验证密码
  if (!user.pwd) {
    throw new ApiError(401, '用户名或密码错误', 'AUTH_FAILED')
  }

  const isPasswordValid = await verifyPassword(password, user.pwd)
  if (!isPasswordValid) {
    throw new ApiError(401, '用户名或密码错误', 'AUTH_FAILED')
  }

  // 7. 获取用户角色（使用 ID 关联）
  const userRoles = await prisma.sysUserRoleAssign.findMany({
    where: { userDomain, userId: user.userId },
    select: { roleId: true }
  })

  const roleIds = userRoles.map(r => r.roleId)

  // 8. 获取角色菜单（使用 ID 关联）
  const roleMenus = roleIds.length > 0
    ? await prisma.sysRoleMenuAssign.findMany({
      where: { roleId: { in: roleIds } },
      select: { menuId: true }
    })
    : []

  const menuIds = roleMenus.map(m => m.menuId)

  // 9. 获取菜单详情（使用 ID 查询）
  const menus = menuIds.length > 0
    ? await prisma.sysMenu.findMany({
      where: {
        id: { in: menuIds },
        status: 'active',
        visible: 'show',
      },
      orderBy: { orderNum: 'asc' },
    })
    : []

  // 10. 提取权限
  const permissions = menus
    .filter(m => m.permission)
    .map(m => m.permission!)

  // 11. 生成 Token
  const token = await generateToken({
    userId: user.userId,
    userDomain: user.userDomain,
    loginName: user.loginName || '',
  })

  // 12. 更新最后登录时间
  await prisma.sysUser.update({
    where: { id: user.id },
    data: { latestLoginTime: new Date() },
  })

  // 13. 创建会话 (MySQL + LRU Cache)
  await createSession(token, {
    userId: user.userId,
    userDomain: user.userDomain,
    loginName: user.loginName || '',
  }, request.headers.get('user-agent') || 'unknown')

  // 14. 创建登录记录
  await prisma.sysLoginInfo.create({
    data: {
      userDomain: user.userDomain,
      userId: user.userId,
      loginName: user.loginName,
      ipAddr: clientIP,
      status: 'success',
    },
  })

  // 14. 构建菜单树
  const menuTree = buildMenuTree(menus)

  // 15. 构建响应数据
  const responseData: LoginResponse = {
    user: {
      id: user.id,
      userDomain: user.userDomain,
      userId: user.userId,
      loginName: user.loginName || '',
      displayName: user.display || user.realName || user.loginName || '',
      realName: user.realName || undefined,
      email: user.email || undefined,
      mobileNo: user.mobileNo || undefined,
      avatarUrl: user.avatarUrl || undefined,
      deptNo: user.deptNo || undefined,
      jobNo: user.jobNo || undefined,
      post: user.post || undefined,
    },
    token,
    permissions,
    menus: menuTree,
  }

  // 16. 创建响应并设置安全 Cookie
  const response = NextResponse.json({
    success: true,
    data: responseData,
  })

  // 设置安全 Cookie
  response.cookies.set('auth_token', token, {
    httpOnly: true,                    // 防 XSS
    secure: IS_PRODUCTION,             // 生产环境仅 HTTPS
    sameSite: 'lax',                   // 防 CSRF
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  return response
})

/**
 * 构建菜单树
 */
function buildMenuTree(menus: any[], parentId: string | null = null): any[] {
  return menus
    .filter((menu) => menu.parentId === parentId)
    .map((menu) => ({
      ...menu,
      children: buildMenuTree(menus, menu.id),
    }))
}
