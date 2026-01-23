import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/token'

// 公开路径列表（无需认证）
const publicPaths = new Set([
  '/login',
  '/api/auth/login',
  '/api/auth/captcha',
  '/api/auth/logout',
])

// 路径与权限映射表
const routePermissionMap: Record<string, string> = {
  '/admin/user': 'system:user',
  '/admin/role': 'system:role',
  '/admin/menu': 'system:menu',
  '/admin/dept': 'system:dept',
  '/admin/post': 'system:post',
  '/admin/config': 'system:config',
  '/admin/dict': 'system:dict',
  '/admin/session': 'system:session',
  '/admin/job': 'system:job',
  '/admin/server': 'system:server',
  '/admin/syslog': 'system:syslog',
  '/admin/audit': 'system:audit',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 获取 token
  const token = request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  // 已登录用户访问登录页，重定向到首页
  if (pathname === '/login' || pathname === '/login/') {
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/home', request.url))
      }
    }
    // 未登录用户访问登录页，直接放行
    return NextResponse.next()
  }

  // 公开路径直接放行
  if (publicPaths.has(pathname)) {
    return NextResponse.next()
  }

  // API 路由的认证处理
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 添加用户信息到请求头
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.userId)
    response.headers.set('x-user-domain', payload.userDomain)
    response.headers.set('x-login-name', payload.loginName)
    return response
  }

  // 页面路由的认证处理
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 检查路径权限
  const requiredPermission = getRequiredPermission(pathname)
  if (requiredPermission) {
    // 从数据库获取用户权限（带缓存）
    const { getUserPermissions } = await import('./lib/permission')
    const userPermissions = await getUserPermissions(payload.userDomain, payload.userId)

    // 验证权限
    if (!userPermissions.includes(requiredPermission)) {
      // 无权限，重定向到403页面
      const forbiddenUrl = new URL('/403', request.url)
      return NextResponse.redirect(forbiddenUrl)
    }
  }

  // 添加用户信息到请求头
  const response = NextResponse.next()
  response.headers.set('x-user-id', payload.userId)
  response.headers.set('x-user-domain', payload.userDomain)
  response.headers.set('x-login-name', payload.loginName)

  return response
}

function getRequiredPermission(pathname: string): string | null {
  // 精确匹配
  if (routePermissionMap[pathname]) {
    return routePermissionMap[pathname]
  }

  // 前缀匹配
  for (const [route, permission] of Object.entries(routePermissionMap)) {
    if (pathname.startsWith(route)) {
      return permission
    }
  }

  return null
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
