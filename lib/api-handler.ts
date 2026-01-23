import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

/**
 * 标准 API 错误类
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message)
        this.name = 'ApiError'
    }

    static badRequest(message: string, code?: string) {
        return new ApiError(400, message, code)
    }

    static unauthorized(message = '未授权，请先登录') {
        return new ApiError(401, message, 'UNAUTHORIZED')
    }

    static forbidden(message = '无权访问此资源') {
        return new ApiError(403, message, 'FORBIDDEN')
    }

    static notFound(message = '资源不存在') {
        return new ApiError(404, message, 'NOT_FOUND')
    }

    static conflict(message: string) {
        return new ApiError(409, message, 'CONFLICT')
    }

    static internal(message = '服务器内部错误') {
        return new ApiError(500, message, 'INTERNAL_ERROR')
    }
}

/**
 * API 响应类型
 */
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
    code?: string
    errors?: string[]
}

/**
 * 成功响应
 */
export function successResponse<T>(data?: T, message?: string): Response {
    return NextResponse.json({
        success: true,
        data,
        message,
    })
}

/**
 * 错误响应
 */
export function errorResponse(
    message: string,
    statusCode = 500,
    errors?: string[],
    code?: string
): Response {
    return NextResponse.json(
        {
            success: false,
            message,
            code,
            errors,
        },
        { status: statusCode }
    )
}

/**
 * 验证请求体
 */
export async function validateBody<T>(
    request: NextRequest,
    schema: ZodSchema<T>
): Promise<T> {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message)
        throw new ApiError(400, errors[0], 'VALIDATION_ERROR')
    }

    return result.data
}

/**
 * 验证查询参数
 */
export function validateQuery<T>(
    request: NextRequest,
    schema: ZodSchema<T>
): T {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const result = schema.safeParse(params)

    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message)
        throw new ApiError(400, errors[0], 'VALIDATION_ERROR')
    }

    return result.data
}

/**
 * API 处理器类型 (兼容 Next.js 16)
 */
export type ApiHandler = (request: NextRequest) => Promise<Response>

/**
 * 错误处理包装器
 * 自动捕获错误并返回标准化响应
 */
export function withErrorHandler(handler: ApiHandler): ApiHandler {
    return async (request) => {
        try {
            return await handler(request)
        } catch (error) {
            // 已知的 API 错误
            if (error instanceof ApiError) {
                return errorResponse(error.message, error.statusCode, undefined, error.code)
            }

            // JSON 解析错误
            if (error instanceof SyntaxError && error.message.includes('JSON')) {
                return errorResponse('请求体格式错误', 400, undefined, 'INVALID_JSON')
            }

            // 未知错误
            console.error('API Error:', error)
            return errorResponse('服务器内部错误', 500, undefined, 'INTERNAL_ERROR')
        }
    }
}
