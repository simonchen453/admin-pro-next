import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken, generateId } from '@/lib/auth'

// GET /api/admin/dict - 获取字典类型列表
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
    const keyword = searchParams.get('keyword') || ''

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { display: { contains: keyword } },
          ],
        }
      : {}

    const dicts = await prisma.sysDict.findMany({
      where,
      orderBy: { createdDate: 'desc' },
    })

    // 获取每个字典类型的数据数量
    const dictsWithData = await Promise.all(
      dicts.map(async (dict) => {
        const dataCount = await prisma.sysDictData.count({
          where: { dictName: dict.name },
        })
        return {
          ...dict,
          dataCount,
        }
      })
    )

    return NextResponse.json({ success: true, data: dictsWithData })
  } catch (error) {
    console.error('获取字典列表失败:', error)
    return NextResponse.json({ success: false, message: '获取字典列表失败' }, { status: 500 })
  }
}

// POST /api/admin/dict - 创建字典类型
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
    const { name, display, status, remark } = body

    // 检查字典名称是否已存在
    const existingDict = await prisma.sysDict.findUnique({
      where: { name },
    })

    if (existingDict) {
      return NextResponse.json({ success: false, message: '字典名称已存在' }, { status: 400 })
    }

    const dict = await prisma.sysDict.create({
      data: {
        id: generateId(),
        name,
        display,
        status: status || 'active',
        remark,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: dict })
  } catch (error) {
    console.error('创建字典类型失败:', error)
    return NextResponse.json({ success: false, message: '创建字典类型失败' }, { status: 500 })
  }
}

// PUT /api/admin/dict - 更新字典类型
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
      return NextResponse.json({ success: false, message: '缺少字典ID' }, { status: 400 })
    }

    const body = await request.json()
    const { display, status, remark } = body

    const dict = await prisma.sysDict.update({
      where: { id },
      data: {
        display,
        status,
        remark,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: dict })
  } catch (error) {
    console.error('更新字典类型失败:', error)
    return NextResponse.json({ success: false, message: '更新字典类型失败' }, { status: 500 })
  }
}

// DELETE /api/admin/dict - 删除字典类型
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
      return NextResponse.json({ success: false, message: '缺少字典ID' }, { status: 400 })
    }

    // 检查是否有字典数据
    const dictDataCount = await prisma.sysDictData.count({
      where: { dictName: (await prisma.sysDict.findUnique({ where: { id } }))!.name },
    })

    if (dictDataCount > 0) {
      return NextResponse.json({ success: false, message: '请先删除字典数据' }, { status: 400 })
    }

    await prisma.sysDict.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除字典类型失败:', error)
    return NextResponse.json({ success: false, message: '删除字典类型失败' }, { status: 500 })
  }
}
