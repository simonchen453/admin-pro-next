import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/token"
import { SysMenu } from "@prisma/client"

// GET /api/admin/menu - 获取菜单列表
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

    const menus = await prisma.sysMenu.findMany({
      orderBy: { orderNum: 'asc' },
    })

    // 构建菜单树
    const buildTree = (parentId: string | null = null): any[] => {
      return menus
        .filter((m: SysMenu) => m.parentId === parentId)
        .map((menu: SysMenu) => ({
          ...menu,
          children: buildTree(menu.id),
        }))
    }

    const tree = buildTree()

    return NextResponse.json({ success: true, data: tree })
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    return NextResponse.json({ success: false, message: '获取菜单列表失败' }, { status: 500 })
  }
}

// POST /api/admin/menu - 创建菜单
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
    const { name, display, parentId, orderNum, url, type, visible, status, permission, icon } = body

    // 检查菜单名是否已存在
    const existingMenu = await prisma.sysMenu.findUnique({
      where: { name },
    })

    if (existingMenu) {
      return NextResponse.json({ success: false, message: '菜单名已存在' }, { status: 400 })
    }

    const menu = await prisma.sysMenu.create({
      data: {
        name,
        display,
        parentId: parentId || null,
        orderNum: orderNum || 0,
        url,
        type,
        visible,
        status,
        permission,
        icon,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: menu })
  } catch (error) {
    console.error('创建菜单失败:', error)
    return NextResponse.json({ success: false, message: '创建菜单失败' }, { status: 500 })
  }
}

// PUT /api/admin/menu - 更新菜单
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
      return NextResponse.json({ success: false, message: '缺少菜单ID' }, { status: 400 })
    }

    const body = await request.json()
    const { display, orderNum, url, visible, status, permission, icon } = body

    const menu = await prisma.sysMenu.update({
      where: { id },
      data: {
        display,
        orderNum,
        url,
        visible,
        status,
        permission,
        icon,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: menu })
  } catch (error) {
    console.error('更新菜单失败:', error)
    return NextResponse.json({ success: false, message: '更新菜单失败' }, { status: 500 })
  }
}

// DELETE /api/admin/menu - 删除菜单
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
      return NextResponse.json({ success: false, message: '缺少菜单ID' }, { status: 400 })
    }

    // 检查是否有子菜单
    const childMenus = await prisma.sysMenu.findMany({
      where: { parentId: id },
    })

    if (childMenus.length > 0) {
      return NextResponse.json({ success: false, message: '请先删除子菜单' }, { status: 400 })
    }

    await prisma.sysMenu.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除菜单失败:', error)
    return NextResponse.json({ success: false, message: '删除菜单失败' }, { status: 500 })
  }
}
