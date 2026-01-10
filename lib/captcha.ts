/**
 * SVG 数学验证码生成器
 */
export interface CaptchaResult {
  id: string
  svg: string
  text: string
}

// 简单的内存存储（生产环境应使用 Redis）
const captchaStore = new Map<string, { text: string; expires: number }>()

// 每分钟清理过期验证码
setInterval(() => {
  const now = Date.now()
  for (const [id, data] of captchaStore.entries()) {
    if (data.expires < now) {
      captchaStore.delete(id)
    }
  }
}, 60000)

/**
 * 生成随机数
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成 SVG 验证码
 */
export function generateCaptcha(): CaptchaResult {
  const id = Math.random().toString(36).substring(2, 15)
  const num1 = randomInt(1, 20)
  const num2 = randomInt(1, 20)
  const operators = ['+', '-']
  const operator = operators[randomInt(0, 1)]
  let answer: number

  if (operator === '+') {
    answer = num1 + num2
  } else {
    answer = num1 - num2
  }

  // 存储验证码，5分钟过期
  captchaStore.set(id, {
    text: answer.toString(),
    expires: Date.now() + 5 * 60 * 1000,
  })

  // 生成 SVG
  const width = 120
  const height = 40
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" rx="4"/>
      <text x="50%" y="55%" text-anchor="middle" font-size="18" font-family="Arial" font-weight="bold" fill="#333">
        ${num1} ${operator} ${num2} = ?
      </text>
      ${generateNoise(width, height)}
    </svg>
  `.trim()

  return {
    id,
    svg,
    text: answer.toString(),
  }
}

/**
 * 生成干扰线和点
 */
function generateNoise(width: number, height: number): string {
  let noise = ''
  // 添加干扰线
  for (let i = 0; i < 3; i++) {
    const x1 = randomInt(0, width)
    const y1 = randomInt(0, height)
    const x2 = randomInt(0, width)
    const y2 = randomInt(0, height)
    const color = `rgb(${randomInt(100, 200)}, ${randomInt(100, 200)}, ${randomInt(100, 200)})`
    noise += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.5"/>`
  }
  // 添加干扰点
  for (let i = 0; i < 20; i++) {
    const x = randomInt(0, width)
    const y = randomInt(0, height)
    const color = `rgb(${randomInt(100, 200)}, ${randomInt(100, 200)}, ${randomInt(100, 200)})`
    noise += `<circle cx="${x}" cy="${y}" r="1" fill="${color}" opacity="0.5"/>`
  }
  return noise
}

/**
 * 验证验证码
 */
export function verifyCaptcha(id: string, text: string): boolean {
  const data = captchaStore.get(id)
  if (!data) return false

  // 检查是否过期
  if (data.expires < Date.now()) {
    captchaStore.delete(id)
    return false
  }

  // 验证后删除验证码
  captchaStore.delete(id)

  return data.text === text
}
