import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateId } from '@/lib/auth'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// GET /api/admin/user - 获取用户列表
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

    const where = keyword
      ? {
          OR: [
            { loginName: { contains: keyword } },
            { realName: { contains: keyword } },
            { email: { contains: keyword } },
            { mobileNo: { contains: keyword } },
          ],
        }
      : {}

    const [total, users] = await Promise.all([
      prisma.sysUser.count({ where }),
      prisma.sysUser.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdDate: 'desc' },
        select: {
          id: true,
          userDomain: true,
          userId: true,
          loginName: true,
          display: true,
          realName: true,
          email: true,
          mobileNo: true,
          status: true,
          deptNo: true,
          post: true,
          isSystem: true,
          latestLoginTime: true,
          createdDate: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({ success: false, message: '获取用户列表失败' }, { status: 500 })
  }
}

// POST /api/admin/user - 创建用户
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
    const { userDomain, loginName, realName, email, mobileNo, deptNo, post, status, password } = body

    // 检查用户名是否已存在
    const existingUser = await prisma.sysUser.findFirst({
      where: {
        userDomain,
        loginName,
      },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, message: '用户名已存在' }, { status: 400 })
    }

    // 生成用户ID
    const userId = `U${Date.now()}`

    // 加密密码
    const hashedPassword = await hashPassword(password || 'admin123')

    // 创建用户
    const user = await prisma.sysUser.create({
      data: {
        id: generateId(),
        userDomain,
        userId,
        loginName,
        display: realName,
        realName,
        email,
        mobileNo,
        deptNo,
        post,
        status: status || 'active',
        pwd: hashedPassword,
        createdByUserDomain: payload.userDomain,
        createdByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json({ success: false, message: '创建用户失败' }, { status: 500 })
  }
}

// PUT /api/admin/user - 更新用户
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
      return NextResponse.json({ success: false, message: '缺少用户ID' }, { status: 400 })
    }

    const body = await request.json()
    const { realName, email, mobileNo, deptNo, post, status } = body

    const user = await prisma.sysUser.update({
      where: { id },
      data: {
        display: realName,
        realName,
        email,
        mobileNo,
        deptNo,
        post,
        status,
        updatedByUserDomain: payload.userDomain,
        updatedByUserId: payload.userId,
      },
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('更新用户失败:', error)
    return NextResponse.json({ success: false, message: '更新用户失败' }, { status: 500 })
  }
}

// DELETE /api/admin/user - 删除用户
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
      return NextResponse.json({ success: false, message: '缺少用户ID' }, { status: 400 })
    }

    // 检查是否为系统用户
    const user = await prisma.sysUser.findUnique({
      where: { id },
    })

    if (user?.isSystem) {
      return NextResponse.json({ success: false, message: '系统用户不能删除' }, { status: 400 })
    }

    await prisma.sysUser.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({ success: false, message: '删除用户失败' }, { status: 500 })
  }
}
