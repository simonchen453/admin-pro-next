import { z } from 'zod'

/**
 * 登录请求验证
 */
export const loginSchema = z.object({
    userDomain: z.string({ message: '用户域不能为空' })
        .min(1, '用户域不能为空'),

    loginName: z.string({ message: '用户名不能为空' })
        .min(1, '用户名不能为空')
        .max(50, '用户名不能超过50字符'),

    password: z.string({ message: '密码不能为空' })
        .min(1, '密码不能为空'),

    captchaId: z.string({ message: '验证码ID不能为空' })
        .min(1, '验证码ID不能为空'),

    captchaText: z.string({ message: '验证码不能为空' })
        .min(1, '验证码不能为空'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * 创建用户验证
 */
export const createUserSchema = z.object({
    userDomain: z.string({ message: '用户域不能为空' })
        .min(1, '用户域不能为空'),

    loginName: z.string({ message: '用户名不能为空' })
        .min(3, '用户名至少3个字符')
        .max(50, '用户名不能超过50字符')
        .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),

    password: z.string({ message: '密码不能为空' })
        .min(8, '密码至少8位')
        .max(20, '密码不能超过20位')
        .regex(/[a-z]/, '密码必须包含小写字母')
        .regex(/[A-Z]/, '密码必须包含大写字母')
        .regex(/\d/, '密码必须包含数字')
        .regex(/[@$!%*?&]/, '密码必须包含特殊字符 (@$!%*?&)'),

    realName: z.string().max(50, '姓名不能超过50字符').optional(),

    email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),

    mobileNo: z.string()
        .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
        .optional()
        .or(z.literal('')),

    deptNo: z.string().optional(),

    post: z.string().optional(),

    status: z.enum(['active', 'inactive']).default('active'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

/**
 * 更新用户验证
 */
export const updateUserSchema = z.object({
    realName: z.string().max(50, '姓名不能超过50字符').optional(),

    email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),

    mobileNo: z.string()
        .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
        .optional()
        .or(z.literal('')),

    deptNo: z.string().optional(),

    post: z.string().optional(),

    status: z.enum(['active', 'inactive']).optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

/**
 * 分页参数验证
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    keyword: z.string().optional(),
})

export type PaginationInput = z.infer<typeof paginationSchema>

/**
 * ID 参数验证
 */
export const idSchema = z.object({
    id: z.string({ message: 'ID不能为空' })
        .min(1, 'ID不能为空'),
})

export type IdInput = z.infer<typeof idSchema>

/**
 * 角色创建/更新验证
 */
export const roleSchema = z.object({
    name: z.string({ message: '角色名称不能为空' })
        .min(1, '角色名称不能为空')
        .max(50, '角色名称不能超过50字符'),

    display: z.string().max(100, '显示名称不能超过100字符').optional(),

    status: z.enum(['active', 'inactive']).default('active'),
})

export type RoleInput = z.infer<typeof roleSchema>

/**
 * 菜单创建/更新验证
 */
export const menuSchema = z.object({
    name: z.string({ message: '菜单名称不能为空' })
        .min(1, '菜单名称不能为空')
        .max(50, '菜单名称不能超过50字符'),

    display: z.string().max(100, '显示名称不能超过100字符').optional(),

    parentId: z.string().nullable().optional(),

    orderNum: z.number().int().min(0).default(0),

    url: z.string().max(200, 'URL不能超过200字符').optional(),

    type: z.enum(['M', 'C', 'F']).default('C'),

    visible: z.enum(['show', 'hide']).default('show'),

    status: z.enum(['active', 'inactive']).default('active'),

    permission: z.string().max(100, '权限标识不能超过100字符').optional(),

    icon: z.string().max(50, '图标名称不能超过50字符').optional(),
})

export type MenuInput = z.infer<typeof menuSchema>

/**
 * 解析验证结果
 */
export function parseValidation<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
    const result = schema.safeParse(data)

    if (result.success) {
        return { success: true, data: result.data }
    }

    const errors = result.error.issues.map(issue => issue.message)
    return { success: false, errors }
}
