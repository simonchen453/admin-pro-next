import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/token'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// GET /api/admin/server/info - 获取服务器信息
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Token 无效' }, { status: 401 })
    }

    // 获取 CPU 信息
    const cpus = os.cpus()
    const cpuModel = cpus[0]?.model || 'Unknown'
    const cpuCores = cpus.length

    // 获取内存信息
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsage = ((usedMem / totalMem) * 100).toFixed(2)

    // 获取系统运行时间
    const uptime = os.uptime()
    const uptimeDays = Math.floor(uptime / 86400)
    const uptimeHours = Math.floor((uptime % 86400) / 3600)
    const uptimeMinutes = Math.floor((uptime % 3600) / 60)

    // 获取系统信息
    const platform = os.platform()
    const arch = os.arch()
    const hostname = os.hostname()
    const release = os.release()

    // 获取网络接口信息
    const networkInterfaces = os.networkInterfaces()
    const interfaces: any[] = []
    for (const [name, addrs] of Object.entries(networkInterfaces)) {
      const ipv4 = addrs?.find((addr) => addr.family === 'IPv4' && !addr.internal)
      if (ipv4) {
        interfaces.push({
          name,
          address: ipv4.address,
        })
      }
    }

    // 获取用户统计
    const userCount = await prisma.sysUser.count()
    const activeUserCount = await prisma.sysUser.count({
      where: { status: 'active' },
    })

    // 获取会话统计
    const sessionCount = await prisma.sysSession.count()
    const activeSessionCount = await prisma.sysSession.count({
      where: { status: 'active' },
    })

    // 获取日志统计（最近24小时）
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const logCount = await prisma.sysSysLog.count({
      where: {
        createdDate: {
          gte: yesterday,
        },
      },
    })

    const serverInfo = {
      system: {
        hostname,
        platform: `${platform} ${release}`,
        arch,
        uptime: `${uptimeDays}天 ${uptimeHours}小时 ${uptimeMinutes}分钟`,
      },
      cpu: {
        model: cpuModel,
        cores: cpuCores,
        usage: 0, // 实际项目中应使用系统监控库获取
      },
      memory: {
        total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usage: memUsage + '%',
      },
      network: interfaces,
      stats: {
        userCount,
        activeUserCount,
        sessionCount,
        activeSessionCount,
        logCount,
      },
    }

    return NextResponse.json({ success: true, data: serverInfo })
  } catch (error) {
    console.error('获取服务器信息失败:', error)
    return NextResponse.json({ success: false, message: '获取服务器信息失败' }, { status: 500 })
  }
}
