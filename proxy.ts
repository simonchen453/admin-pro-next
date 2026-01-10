import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// 公开路径列表（无需认证）
const publicPaths = ['/login', '/api/auth/login', '/api/auth/captcha']

// 路径与权限映射表
const routePermissionMap: Record<string, string> = {
  '/admin/user': 'system:user',
  '/admin/role': 'system:role',
  '/admin/menu': 'system:menu',
  '/admin/dept': 'system:dept',
  '/admin/post': 'system:post',
  '/admin/domain': 'system:domain',
  '/admin/userDomainEnv': 'system:user_domain_env',
  '/admin/config': 'system:config',
  '/admin/dict': 'system:dict',
  '/admin/session': 'system:session',
  '/admin/job': 'system:job',
  '/admin/server': 'system:server',
  '/admin/syslog': 'system:syslog',
  '/admin/audit': 'system:audit',
  '/admin/generator': 'system:generator',
  '/admin/swagger': 'system:swagger',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公开路径直接放行
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // API 路由的认证处理
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
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
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const payload = verifyToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 检查路径权限
  const requiredPermission = getRequiredPermission(pathname)
  if (requiredPermission) {
    // 这里简化处理，实际应该从数据库或缓存中获取用户权限
    // 暂时跳过详细权限检查
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
