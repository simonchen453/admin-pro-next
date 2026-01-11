import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/role - 获取角色列表
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

    const roles = await prisma.sysRole.findMany({
      orderBy: { createdDate: 'desc' },
    })

    return NextResponse.json({ success: true, data: roles })
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return NextResponse.json({ success: false, message: '获取角色列表失败' }, { status: 500 })
  }
}

// POST /api/admin/role - 创建角色
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
    const { name, display, status } = body

    // 检查角色名是否已存在
    const existingRole = await prisma.sysRole.findUnique({
      where: { name },
    })

    if (existingRole) {
      return NextResponse.json({ success: false, message: '角色名已存在' }, { status: 400 })
    }

    const role = await prisma.sysRole.create({
      data: {
        name,
        display,
        status: status || 'active',
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: role })
  } catch (error) {
    console.error('创建角色失败:', error)
    return NextResponse.json({ success: false, message: '创建角色失败' }, { status: 500 })
  }
}

// PUT /api/admin/role - 更新角色
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
      return NextResponse.json({ success: false, message: '缺少角色ID' }, { status: 400 })
    }

    const body = await request.json()
    const { display, status } = body

    const role = await prisma.sysRole.update({
      where: { id },
      data: {
        display,
        status,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: role })
  } catch (error) {
    console.error('更新角色失败:', error)
    return NextResponse.json({ success: false, message: '更新角色失败' }, { status: 500 })
  }
}

// DELETE /api/admin/role - 删除角色
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
      return NextResponse.json({ success: false, message: '缺少角色ID' }, { status: 400 })
    }

    // 检查是否为系统角色
    const role = await prisma.sysRole.findUnique({
      where: { id },
    })

    if (role?.isSystem) {
      return NextResponse.json({ success: false, message: '系统角色不能删除' }, { status: 400 })
    }

    await prisma.sysRole.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除角色失败:', error)
    return NextResponse.json({ success: false, message: '删除角色失败' }, { status: 500 })
  }
}
