import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken, generateId } from '@/lib/auth'

// POST /api/admin/dept - 创建部门
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
    const { no, parentId, name, orderNum, linkman, contact, phone, email, status } = body

    // 检查部门编号是否已存在
    const existingDept = await prisma.sysDept.findUnique({
      where: { no },
    })

    if (existingDept) {
      return NextResponse.json({ success: false, message: '部门编号已存在' }, { status: 400 })
    }

    // 计算 ancestors
    let ancestors = '0'
    if (parentId) {
      const parentDept = await prisma.sysDept.findUnique({
        where: { id: parentId },
      })
      if (parentDept) {
        ancestors = `${parentDept.ancestors},${parentDept.id}`
      }
    }

    const dept = await prisma.sysDept.create({
      data: {
        id: generateId(),
        no,
        parentId: parentId || '',
        ancestors,
        name,
        orderNum: orderNum || 0,
        linkman,
        contact,
        phone,
        email,
        status: status || 'active',
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: dept })
  } catch (error) {
    console.error('创建部门失败:', error)
    return NextResponse.json({ success: false, message: '创建部门失败' }, { status: 500 })
  }
}

// PUT /api/admin/dept - 更新部门
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
      return NextResponse.json({ success: false, message: '缺少部门ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, orderNum, linkman, contact, phone, email, status } = body

    const dept = await prisma.sysDept.update({
      where: { id },
      data: {
        name,
        orderNum,
        linkman,
        contact,
        phone,
        email,
        status,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: dept })
  } catch (error) {
    console.error('更新部门失败:', error)
    return NextResponse.json({ success: false, message: '更新部门失败' }, { status: 500 })
  }
}

// DELETE /api/admin/dept - 删除部门
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
      return NextResponse.json({ success: false, message: '缺少部门ID' }, { status: 400 })
    }

    // 检查是否有子部门
    const childDepts = await prisma.sysDept.findMany({
      where: { parentId: id },
    })

    if (childDepts.length > 0) {
      return NextResponse.json({ success: false, message: '请先删除子部门' }, { status: 400 })
    }

    await prisma.sysDept.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除部门失败:', error)
    return NextResponse.json({ success: false, message: '删除部门失败' }, { status: 500 })
  }
}
