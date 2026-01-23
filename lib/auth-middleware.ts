import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken, JWTPayload } from './token'
import { ApiError, ApiResponse, errorResponse } from './api-handler'

/**
 * 认证上下文类型
 */
export interface AuthContext {
    user: JWTPayload
}

/**
 * 带认证的 API 处理器类型 (简化版，兼容 Next.js 16)
 */
export type AuthenticatedHandler = (
    request: NextRequest,
    auth: AuthContext
) => Promise<Response>

/**
 * 认证中间件
 * 自动验证 Token 并提取用户信息
 */
export function withAuth(handler: AuthenticatedHandler) {
    return async (request: NextRequest): Promise<Response> => {
        // 获取 Token
        const token = getTokenFromRequest(request)

        if (!token) {
            return errorResponse('未授权，请先登录', 401, undefined, 'UNAUTHORIZED')
        }

        // 验证 Token
        const payload = await verifyToken(token)

        if (!payload) {
            return errorResponse('Token 无效或已过期', 401, undefined, 'TOKEN_INVALID')
        }

        // 创建认证上下文
        const auth: AuthContext = {
            user: payload,
        }

        // 执行业务处理器
        return handler(request, auth)
    }
}

/**
 * 组合使用: withErrorHandler + withAuth
 * 推荐在 API 路由中使用此组合
 */
export function withAuthAndErrorHandler(handler: AuthenticatedHandler) {
    return async (request: NextRequest): Promise<Response> => {
        try {
            // 获取 Token
            const token = getTokenFromRequest(request)

            if (!token) {
                throw ApiError.unauthorized()
            }

            // 验证 Token
            const payload = await verifyToken(token)

            if (!payload) {
                throw new ApiError(401, 'Token 无效或已过期', 'TOKEN_INVALID')
            }

            // 创建认证上下文
            const auth: AuthContext = {
                user: payload,
            }

            // 执行业务处理器
            return await handler(request, auth)
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
