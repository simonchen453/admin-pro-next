import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken, generateId } from '@/lib/auth'

// POST /api/admin/post - 创建岗位
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
    const { code, name, display, orderNum, status, remark } = body

    // 检查岗位编码是否已存在
    const existingPost = await prisma.sysPost.findUnique({
      where: { code },
    })

    if (existingPost) {
      return NextResponse.json({ success: false, message: '岗位编码已存在' }, { status: 400 })
    }

    const post = await prisma.sysPost.create({
      data: {
        id: generateId(),
        code,
        name,
        display,
        orderNum: orderNum || 0,
        status: status || 'active',
        remark,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('创建岗位失败:', error)
    return NextResponse.json({ success: false, message: '创建岗位失败' }, { status: 500 })
  }
}

// PUT /api/admin/post - 更新岗位
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
      return NextResponse.json({ success: false, message: '缺少岗位ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, display, orderNum, status, remark } = body

    const post = await prisma.sysPost.update({
      where: { id },
      data: {
        name,
        display,
        orderNum,
        status,
        remark,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('更新岗位失败:', error)
    return NextResponse.json({ success: false, message: '更新岗位失败' }, { status: 500 })
  }
}

// DELETE /api/admin/post - 删除岗位
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
      return NextResponse.json({ success: false, message: '缺少岗位ID' }, { status: 400 })
    }

    await prisma.sysPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除岗位失败:', error)
    return NextResponse.json({ success: false, message: '删除岗位失败' }, { status: 500 })
  }
}
