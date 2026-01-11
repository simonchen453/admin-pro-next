import { NextResponse } from 'next/server'
import { getTokenFromRequest } from '@/lib/token'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request)

    if (token) {
      // 创建登出记录
      // 这里可以添加更多的登出逻辑，比如清除session等
    }

    return NextResponse.json({
      success: true,
      message: '退出成功',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '退出失败',
      },
      { status: 500 }
    )
  }
}
