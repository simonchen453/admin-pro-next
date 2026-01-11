import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/job/log - 获取任务日志列表
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
    const jobName = searchParams.get('jobName') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}
    if (jobName) {
      where.jobName = jobName
    }
    if (status) {
      where.status = status
    }

    const logs = await prisma.sysScheduleJobLog.findMany({
      where,
      orderBy: { startTime: 'desc' },
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    console.error('获取任务日志失败:', error)
    return NextResponse.json({ success: false, message: '获取任务日志失败' }, { status: 500 })
  }
}
