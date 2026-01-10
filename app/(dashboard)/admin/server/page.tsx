'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Server,
  Cpu,
  HardDrive,
  Network,
  Users,
  Activity,
  FileText,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

interface ServerInfo {
  system: {
    hostname: string
    platform: string
    arch: string
    uptime: string
  }
  cpu: {
    model: string
    cores: number
    usage: number
  }
  memory: {
    total: string
    used: string
    free: string
    usage: string
  }
  network: Array<{
    name: string
    address: string
  }>
  stats: {
    userCount: number
    activeUserCount: number
    sessionCount: number
    activeSessionCount: number
    logCount: number
  }
}

export default function ServerMonitorPage() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchServerInfo()
    // 每30秒自动刷新
    const interval = setInterval(fetchServerInfo, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchServerInfo = async () => {
    try {
      if (!loading) setLoading(true)
      const res = await fetch('/api/admin/server/info')
      const data = await res.json()
      if (data.success) {
        setServerInfo(data.data)
      }
    } catch (error) {
      toast.error('获取服务器信息失败')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchServerInfo()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!serverInfo) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">无法获取服务器信息</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">服务监控</h1>
          <p className="text-muted-foreground mt-1">
            实时监控系统运行状态和资源使用情况
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">用户总数</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverInfo.stats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              活跃用户: {serverInfo.stats.activeUserCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线会话</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serverInfo.stats.activeSessionCount}
            </div>
            <p className="text-xs text-muted-foreground">
              总会话: {serverInfo.stats.sessionCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24小时日志</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverInfo.stats.logCount}</div>
            <p className="text-xs text-muted-foreground">系统日志条数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统运行时间</CardTitle>
            <Server className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverInfo.system.uptime}</div>
            <p className="text-xs text-muted-foreground">持续运行中</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 系统信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              系统信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">主机名</p>
                <p className="font-medium">{serverInfo.system.hostname}</p>
              </div>
              <div>
                <p className="text-muted-foreground">架构</p>
                <p className="font-medium">{serverInfo.system.arch}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">操作系统</p>
                <p className="font-medium">{serverInfo.system.platform}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CPU信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              CPU信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">处理器</span>
                <span className="font-medium">{serverInfo.cpu.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">核心数</span>
                <span className="font-medium">{serverInfo.cpu.cores} 核</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 内存信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              内存信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">总内存</span>
                  <span className="font-medium">{serverInfo.memory.total}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">已使用</span>
                  <span className="font-medium">{serverInfo.memory.used}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">可用</span>
                  <span className="font-medium">{serverInfo.memory.free}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">使用率</span>
                    <span className="font-medium">{serverInfo.memory.usage}</span>
                  </div>
                  <Progress
                    value={parseFloat(serverInfo.memory.usage)}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 网络信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              网络信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {serverInfo.network.length > 0 ? (
              serverInfo.network.map((iface, index) => (
                <div key={index} className="text-sm">
                  <p className="text-muted-foreground">{iface.name}</p>
                  <p className="font-medium">{iface.address}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">无网络接口信息</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
