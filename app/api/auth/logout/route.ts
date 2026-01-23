import { NextResponse } from 'next/server'
import { getTokenFromRequest } from '@/lib/token'
import { revokeSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request)

    if (token) {
      // 销毁会话 (清理 Cache + 删除 DB)
      await revokeSession(token)
    }

    const response = NextResponse.json({
      success: true,
      message: '退出成功',
    })

    // 清除 Cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '退出失败',
      },
      { status: 500 }
    )
  }
}
