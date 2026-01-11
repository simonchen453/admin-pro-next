import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateId } from '@/lib/auth'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/job - 获取定时任务列表
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
    const status = searchParams.get('status') || ''

    const where: any = {}
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { display: { contains: keyword } },
      ]
    }
    if (status) {
      where.status = status
    }

    const jobs = await prisma.sysScheduleJob.findMany({
      where,
      orderBy: { createdDate: 'desc' },
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('获取定时任务列表失败:', error)
    return NextResponse.json({ success: false, message: '获取定时任务列表失败' }, { status: 500 })
  }
}

// POST /api/admin/job - 创建定时任务
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Token 无效' }, { status: 401 })
    }

    const body = await request.json()
    const { name, display, cron, className, methodName, params, status, remark } = body

    // 检查任务名称是否已存在
    const existingJob = await prisma.sysScheduleJob.findUnique({
      where: { name },
    })

    if (existingJob) {
      return NextResponse.json({ success: false, message: '任务名称已存在' }, { status: 400 })
    }

    const job = await prisma.sysScheduleJob.create({
      data: {
        id: generateId(),
        name,
        display,
        cron,
        className: className || methodName,
        status: status || 'inactive',
        remark,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    console.error('创建定时任务失败:', error)
    return NextResponse.json({ success: false, message: '创建定时任务失败' }, { status: 500 })
  }
}

// PUT /api/admin/job - 更新定时任务
export async function PUT(request: NextRequest) {
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
      return NextResponse.json({ success: false, message: '缺少任务ID' }, { status: 400 })
    }

    const body = await request.json()
    const { display, cron, className, methodName, params, status, remark } = body

    const job = await prisma.sysScheduleJob.update({
      where: { id },
      data: {
        display,
        cron,
        className: className || methodName,
        status,
        remark,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    console.error('更新定时任务失败:', error)
    return NextResponse.json({ success: false, message: '更新定时任务失败' }, { status: 500 })
  }
}

// DELETE /api/admin/job - 删除定时任务
export async function DELETE(request: NextRequest) {
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
      return NextResponse.json({ success: false, message: '缺少任务ID' }, { status: 400 })
    }

    await prisma.sysScheduleJob.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除定时任务失败:', error)
    return NextResponse.json({ success: false, message: '删除定时任务失败' }, { status: 500 })
  }
}
