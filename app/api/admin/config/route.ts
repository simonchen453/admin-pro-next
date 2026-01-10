import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken, generateId } from '@/lib/auth'

// GET /api/admin/config - 获取配置列表
export async function GET(request: NextRequest) {
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
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const keyword = searchParams.get('keyword') || ''
    const systemOnly = searchParams.get('systemOnly') === 'true'

    const where = keyword
      ? {
          OR: [
            { key: { contains: keyword } },
            { name: { contains: keyword } },
          ],
        }
      : systemOnly
      ? { system: 1 }
      : {}

    const [total, configs] = await Promise.all([
      prisma.sysConfig.count({ where }),
      prisma.sysConfig.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdDate: 'desc' },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: configs,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取配置列表失败:', error)
    return NextResponse.json({ success: false, message: '获取配置列表失败' }, { status: 500 })
  }
}

// POST /api/admin/config - 创建配置
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
    const { key, name, value, system, remark } = body

    // 检查配置键是否已存在
    const existingConfig = await prisma.sysConfig.findUnique({
      where: { key },
    })

    if (existingConfig) {
      return NextResponse.json({ success: false, message: '配置键已存在' }, { status: 400 })
    }

    const config = await prisma.sysConfig.create({
      data: {
        id: generateId(),
        key,
        name,
        value,
        system: system ? 1 : 0,
        remark,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('创建配置失败:', error)
    return NextResponse.json({ success: false, message: '创建配置失败' }, { status: 500 })
  }
}

// PUT /api/admin/config - 更新配置
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
      return NextResponse.json({ success: false, message: '缺少配置ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, value, remark } = body

    const config = await prisma.sysConfig.update({
      where: { id },
      data: {
        name,
        value,
        remark,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('更新配置失败:', error)
    return NextResponse.json({ success: false, message: '更新配置失败' }, { status: 500 })
  }
}

// DELETE /api/admin/config - 删除配置
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
      return NextResponse.json({ success: false, message: '缺少配置ID' }, { status: 400 })
    }

    // 检查是否为系统配置
    const config = await prisma.sysConfig.findUnique({
      where: { id },
    })

    if (config?.system === 1) {
      return NextResponse.json({ success: false, message: '系统配置不能删除' }, { status: 400 })
    }

    await prisma.sysConfig.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除配置失败:', error)
    return NextResponse.json({ success: false, message: '删除配置失败' }, { status: 500 })
  }
}
