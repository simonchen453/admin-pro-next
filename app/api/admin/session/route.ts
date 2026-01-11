import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/session - 获取会话列表
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Token 无效' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''

    const where = status ? { status } : {}

    const sessions = await prisma.sysSession.findMany({
      where,
      orderBy: { createdDate: 'desc' },
    })

    return NextResponse.json({ success: true, data: sessions })
  } catch (error) {
    console.error('获取会话列表失败:', error)
    return NextResponse.json({ success: false, message: '获取会话列表失败' }, { status: 500 })
  }
}

// DELETE /api/admin/session - 强制退出用户
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Token 无效' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少会话ID' }, { status: 400 })
    }

    await prisma.sysSession.update({
      where: { id },
      data: { status: 'inactive' },
    })

    return NextResponse.json({ success: true, message: '用户已退出' })
  } catch (error) {
    console.error('强制退出失败:', error)
    return NextResponse.json({ success: false, message: '强制退出失败' }, { status: 500 })
  }
}
