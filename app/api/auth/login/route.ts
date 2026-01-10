import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { generateToken } from '@/lib/token'
import { verifyCaptcha } from '@/lib/captcha'
import type { LoginRequest, LoginResponse } from '@/types'

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json()
    const { userDomain, loginName, password, captchaId, captchaText } = body

    // 验证必填字段
    if (!userDomain || !loginName || !password) {
      return NextResponse.json(
        {
          success: false,
          message: '请填写完整的登录信息',
        },
        { status: 400 }
      )
    }

    // 验证验证码
    if (!captchaId || !captchaText || !verifyCaptcha(captchaId, captchaText)) {
      return NextResponse.json(
        {
          success: false,
          message: '验证码错误',
        },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.sysUser.findFirst({
      where: {
        userDomain,
        loginName,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '用户名或密码错误',
        },
        { status: 401 }
      )
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          message: '账号已被禁用',
        },
        { status: 403 }
      )
    }

    // 验证密码
    if (!user.pwd || !verifyPassword(password, user.pwd)) {
      return NextResponse.json(
        {
          success: false,
          message: '用户名或密码错误',
        },
        { status: 401 }
      )
    }

    // 获取用户角色
    const userRoles = await prisma.sysUserRoleAssign.findMany({
      where: {
        userDomain,
        userId: user.userId,
      },
    })

    const roleNames = userRoles.map((r: any) => r.roleName)

    // 获取角色菜单
    const roleMenus = await prisma.sysRoleMenuAssign.findMany({
      where: {
        roleName: {
          in: roleNames,
        },
      },
    })

    const menuNames = roleMenus.map((m: any) => m.menuName)

    // 获取菜单详情
    const menus = await prisma.sysMenu.findMany({
      where: {
        name: {
          in: menuNames,
        },
        status: 'active',
        visible: 'show',
      },
      orderBy: {
        orderNum: 'asc',
      },
    })

    // 提取权限
    const permissions = menus
      .filter((m: any) => m.permission)
      .map((m: any) => m.permission!)

    // 生成 Token
    const token = await generateToken({
      userId: user.userId,
      userDomain: user.userDomain,
      loginName: user.loginName || '',
    })

    // 更新最后登录时间
    await prisma.sysUser.update({
      where: { id: user.id },
      data: {
        latestLoginTime: new Date(),
      },
    })

    // 创建登录记录
    await prisma.sysLoginInfo.create({
      data: {
        userDomain: user.userDomain,
        userId: user.userId,
        loginName: user.loginName,
        status: 'success',
      },
    })

    // 构建菜单树
    const menuTree = buildMenuTree(menus)

    const response: LoginResponse = {
      user: {
        id: user.id,
        userDomain: user.userDomain,
        userId: user.userId,
        loginName: user.loginName || '',
        displayName: user.display || user.realName || user.loginName || '',
        realName: user.realName || undefined,
        email: user.email || undefined,
        mobileNo: user.mobileNo || undefined,
        avatarUrl: user.avatarUrl || undefined,
        deptNo: user.deptNo || undefined,
        jobNo: user.jobNo || undefined,
        post: user.post || undefined,
      },
      token,
      permissions,
      menus: menuTree,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '登录失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}

// 构建菜单树
function buildMenuTree(menus: any[], parentId: string | null = null): any[] {
  return menus
    .filter((menu) => menu.parentId === parentId)
    .map((menu) => ({
      ...menu,
      children: buildMenuTree(menus, menu.id),
    }))
}
