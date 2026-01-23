import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/syslog - 获取系统日志
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
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const keyword = searchParams.get('keyword') || ''
    const category = searchParams.get('category') || ''
    const module = searchParams.get('module') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    if (keyword) {
      where.OR = [
        { description: { contains: keyword } },
        { module: { contains: keyword } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (module) {
      where.module = module
    }

    if (status) {
      where.status = status
    }

    const [total, logs] = await Promise.all([
      prisma.sysSysLog.count({ where }),
      prisma.sysSysLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdDate: 'desc' },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: logs,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取系统日志失败:', error)
    return NextResponse.json({ success: false, message: '获取系统日志失败' }, { status: 500 })
  }
}
