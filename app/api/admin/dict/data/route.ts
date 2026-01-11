import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateId } from '@/lib/auth'
import { getTokenFromRequest, verifyToken } from '@/lib/token'

// GET /api/admin/dict/data - 获取字典数据列表
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
    const dictName = searchParams.get('dictName')

    if (!dictName) {
      return NextResponse.json({ success: false, message: '缺少字典名称' }, { status: 400 })
    }

    const dictData = await prisma.sysDictData.findMany({
      where: { dictName },
      orderBy: { orderNum: 'asc' },
    })

    return NextResponse.json({ success: true, data: dictData })
  } catch (error) {
    console.error('获取字典数据失败:', error)
    return NextResponse.json({ success: false, message: '获取字典数据失败' }, { status: 500 })
  }
}

// POST /api/admin/dict/data - 创建字典数据
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
    const { dictName, display, value, orderNum, status, remark } = body

    // 检查字典类型是否存在
    const dict = await prisma.sysDict.findUnique({
      where: { name: dictName },
    })

    if (!dict) {
      return NextResponse.json({ success: false, message: '字典类型不存在' }, { status: 400 })
    }

    const data = await prisma.sysDictData.create({
      data: {
        id: generateId(),
        dictName,
        display,
        value,
        orderNum: orderNum || 0,
        status: status || 'active',
        remark,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('创建字典数据失败:', error)
    return NextResponse.json({ success: false, message: '创建字典数据失败' }, { status: 500 })
  }
}

// PUT /api/admin/dict/data - 更新字典数据
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
      return NextResponse.json({ success: false, message: '缺少字典数据ID' }, { status: 400 })
    }

    const body = await request.json()
    const { display, value, orderNum, status, remark } = body

    const data = await prisma.sysDictData.update({
      where: { id },
      data: {
        display,
        value,
        orderNum,
        status,
        remark,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('更新字典数据失败:', error)
    return NextResponse.json({ success: false, message: '更新字典数据失败' }, { status: 500 })
  }
}

// DELETE /api/admin/dict/data - 删除字典数据
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
      return NextResponse.json({ success: false, message: '缺少字典数据ID' }, { status: 400 })
    }

    await prisma.sysDictData.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除字典数据失败:', error)
    return NextResponse.json({ success: false, message: '删除字典数据失败' }, { status: 500 })
  }
}
