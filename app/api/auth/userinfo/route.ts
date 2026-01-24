import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/token'
import { verifySession } from '@/lib/session'
import { withErrorHandler, ApiError } from '@/lib/api-handler'

export const GET = withErrorHandler(async (request: NextRequest) => {
    // 1. Get Token
    const token = getTokenFromRequest(request)
    if (!token) {
        throw new ApiError(401, 'Unauthorized', 'AUTH_REQUIRED')
    }

    // 2. Verify Token & Session
    const payload = await verifyToken(token)
    if (!payload) {
        throw new ApiError(401, 'Invalid Token', 'INVALID_TOKEN')
    }

    const isSessionValid = await verifySession(token)
    if (!isSessionValid) {
        throw new ApiError(401, 'Session Expired', 'SESSION_EXPIRED')
    }

    // 3. Fetch User Data
    const user = await prisma.sysUser.findUnique({
        where: { id: payload.userId }, // Assuming payload has userId which maps to sysUser.id (or userId field)
    })

    // Note: generateToken uses `userId: user.userId` (e.g. U001), but prisma findUnique usually needs primary key `id` (e.g. user-001).
    // Let's re-check token generation logic. 
    // In route.ts (login): `userId: user.userId` refers to the logical ID, not the UUID primary key?
    // Let's check schema.prisma if possible, or assume 'userId' in payload refers to the `userId` column in DB.

    // Wait, looking at seed.ts:
    // id: 'user-001' (UUID like)
    // userId: 'U001' (Business ID)

    // And in login/route.ts:
    // const token = await generateToken({ userId: user.userId ... }) -> storing 'U001'

    // So we should query by `userId` column, not primary key `id`.

    const userByBusinessId = await prisma.sysUser.findFirst({
        where: { userId: payload.userId }
    })

    if (!userByBusinessId) {
        throw new ApiError(404, 'User Not Found', 'USER_NOT_FOUND')
    }

    // 4. Sanitize (Remove Password)
    const { pwd, ...safeUser } = userByBusinessId

    return NextResponse.json({
        success: true,
        data: safeUser,
    })
})
