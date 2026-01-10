import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// POST /api/admin/job/execute - 执行定时任务
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Token 无效' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少任务ID' }, { status: 400 })
    }

    const job = await prisma.sysScheduleJob.findUnique({
      where: { id },
    })

    if (!job) {
      return NextResponse.json({ success: false, message: '任务不存在' }, { status: 404 })
    }

    // 创建任务日志
    const log = await prisma.sysScheduleJobLog.create({
      data: {
        id: generateId(),
        jobName: job.name,
        status: 'running',
        startTime: new Date(),
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    // TODO: 这里应该实际执行任务
    // 由于这是演示环境，我们只是模拟执行
    // 实际应该使用 node-cron 或类似库来执行

    return NextResponse.json({ success: true, message: '任务已开始执行', data: log })
  } catch (error) {
    console.error('执行任务失败:', error)
    return NextResponse.json({ success: false, message: '执行任务失败' }, { status: 500 })
  }
}

// 辅助函数：生成ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
