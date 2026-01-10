import { NextResponse } from 'next/server'
import { generateCaptcha } from '@/lib/captcha'

export async function GET() {
  try {
    const captcha = generateCaptcha()
    return NextResponse.json({
      success: true,
      data: {
        id: captcha.id,
        svg: captcha.svg,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '生成验证码失败',
      },
      { status: 500 }
    )
  }
}
