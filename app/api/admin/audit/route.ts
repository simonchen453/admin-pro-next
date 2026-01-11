import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/audit - 获取审计日志列表
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
    const keyword = searchParams.get('keyword') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const module = searchParams.get('module') || ''

    const where: any = {}
    if (keyword) {
      where.OR = [
        { event: { contains: keyword } },
        { ipAddress: { contains: keyword } },
      ]
    }
    if (category) {
      where.category = category
    }
    if (status) {
      where.status = status
    }
    if (module) {
      where.module = module
    }

    const logs = await prisma.sysAuditLog.findMany({
      where,
      orderBy: { createdDate: 'desc' },
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    console.error('获取审计日志失败:', error)
    return NextResponse.json({ success: false, message: '获取审计日志失败' }, { status: 500 })
  }
}
