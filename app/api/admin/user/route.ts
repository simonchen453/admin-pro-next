import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateId } from '@/lib/auth'
import { withAuthAndErrorHandler, AuthContext } from '@/lib/auth-middleware'
import {
  successResponse,
  ApiError,
  validateBody,
  validateQuery
} from '@/lib/api-handler'
import {
  createUserSchema,
  updateUserSchema,
  paginationSchema,
  idSchema
} from '@/lib/validation/schemas'

/**
 * GET /api/admin/user - 获取用户列表
 */
export const GET = withAuthAndErrorHandler(async (request: NextRequest, auth: AuthContext) => {
  // 验证查询参数
  const { page, pageSize, keyword } = validateQuery(request, paginationSchema)

  // 构建查询条件
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

  // 并行查询总数和数据
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

  return successResponse({
    list: users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
})

/**
 * POST /api/admin/user - 创建用户
 */
export const POST = withAuthAndErrorHandler(async (request: NextRequest, auth: AuthContext) => {
  // 验证请求体
  const data = await validateBody(request, createUserSchema)

  // 检查用户名是否已存在
  const existingUser = await prisma.sysUser.findFirst({
    where: {
      userDomain: data.userDomain,
      loginName: data.loginName,
    },
  })

  if (existingUser) {
    throw ApiError.conflict('用户名已存在')
  }

  // 生成用户ID
  const userId = `U${Date.now()}`

  // 加密密码
  const hashedPassword = await hashPassword(data.password)

  // 创建用户
  const user = await prisma.sysUser.create({
    data: {
      id: generateId(),
      userDomain: data.userDomain,
      userId,
      loginName: data.loginName,
      display: data.realName,
      realName: data.realName,
      email: data.email || null,
      mobileNo: data.mobileNo || null,
      deptNo: data.deptNo,
      post: data.post,
      status: data.status,
      pwd: hashedPassword,
      createdByUserDomain: auth.user.userDomain,
      createdByUserId: auth.user.userId,
    },
    select: {
      id: true,
      userDomain: true,
      userId: true,
      loginName: true,
      realName: true,
      email: true,
      status: true,
      createdDate: true,
    },
  })

  return successResponse(user, '用户创建成功')
})

/**
 * PUT /api/admin/user - 更新用户
 */
export const PUT = withAuthAndErrorHandler(async (request: NextRequest, auth: AuthContext) => {
  // 验证 ID 参数
  const { id } = validateQuery(request, idSchema)

  // 验证请求体
  const data = await validateBody(request, updateUserSchema)

  // 检查用户是否存在
  const existingUser = await prisma.sysUser.findUnique({
    where: { id },
  })

  if (!existingUser) {
    throw ApiError.notFound('用户不存在')
  }

  // 更新用户
  const user = await prisma.sysUser.update({
    where: { id },
    data: {
      display: data.realName,
      realName: data.realName,
      email: data.email || null,
      mobileNo: data.mobileNo || null,
      deptNo: data.deptNo,
      post: data.post,
      status: data.status,
      updatedByUserDomain: auth.user.userDomain,
      updatedByUserId: auth.user.userId,
    },
    select: {
      id: true,
      userDomain: true,
      userId: true,
      loginName: true,
      realName: true,
      email: true,
      status: true,
      updatedDate: true,
    },
  })

  return successResponse(user, '用户更新成功')
})

/**
 * DELETE /api/admin/user - 删除用户
 */
export const DELETE = withAuthAndErrorHandler(async (request: NextRequest, auth: AuthContext) => {
  // 验证 ID 参数
  const { id } = validateQuery(request, idSchema)

  // 检查用户是否存在
  const user = await prisma.sysUser.findUnique({
    where: { id },
  })

  if (!user) {
    throw ApiError.notFound('用户不存在')
  }

  // 检查是否为系统用户
  if (user.isSystem) {
    throw ApiError.forbidden('系统用户不能删除')
  }

  // 删除用户
  await prisma.sysUser.delete({
    where: { id },
  })

  return successResponse(null, '用户删除成功')
})
