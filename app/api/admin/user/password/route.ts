import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// PUT /api/admin/user/password - 修改用户密码
export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Token 无效' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少用户ID' }, { status: 400 })
    }

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ success: false, message: '密码不能为空' }, { status: 400 })
    }

    // 加密新密码
    const hashedPassword = await hashPassword(password)

    // 更新密码
    await prisma.sysUser.update({
      where: { id },
      data: {
        pwd: hashedPassword,
        latestChangePwdTime: new Date(),
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, message: '密码修改成功' })
  } catch (error) {
    console.error('修改密码失败:', error)
    return NextResponse.json({ success: false, message: '修改密码失败' }, { status: 500 })
  }
}
