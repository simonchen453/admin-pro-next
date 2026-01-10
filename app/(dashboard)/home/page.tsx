'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import {
  Users,
  UserCog,
  Building2,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuthStore()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 9) setGreeting('早上好')
    else if (hour < 12) setGreeting('上午好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else if (hour < 22) setGreeting('晚上好')
    else setGreeting('夜深了')
  }, [])

  const stats = [
    {
      title: '用户总数',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: '角色数量',
      value: '24',
      change: '+2',
      icon: UserCog,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: '部门数量',
      value: '18',
      change: '+1',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: '在线用户',
      value: '89',
      change: '+5',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  const quickActions = [
    { name: '用户管理', href: '/admin/user', color: 'bg-blue-500' },
    { name: '角色管理', href: '/admin/role', color: 'bg-purple-500' },
    { name: '菜单管理', href: '/admin/menu', color: 'bg-green-500' },
    { name: '部门管理', href: '/admin/dept', color: 'bg-orange-500' },
    { name: '系统配置', href: '/admin/config', color: 'bg-pink-500' },
    { name: '系统日志', href: '/admin/syslog', color: 'bg-indigo-500' },
  ]

  const recentActivities = [
    { id: 1, user: '张三', action: '创建了用户', time: '5 分钟前', status: 'success' },
    { id: 2, user: '李四', action: '修改了角色权限', time: '10 分钟前', status: 'success' },
    { id: 3, user: '王五', action: '删除了部门', time: '15 分钟前', status: 'warning' },
    { id: 4, user: '赵六', action: '导出了数据', time: '20 分钟前', status: 'success' },
    { id: 5, user: '系统', action: '定时任务执行', time: '30 分钟前', status: 'info' },
  ]

  return (
    <div className="space-y-6">
      {/* 欢迎标语 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}，{user?.displayName || user?.loginName}！
          </h1>
          <p className="text-muted-foreground mt-1">
            欢迎回到 Admin-Pro Next 管理系统
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  较上周 {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* 快捷操作 */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
            <CardDescription>常用功能快速入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <div className="w-5 h-5 bg-white/20 rounded" />
                  </div>
                  <span className="font-medium">{action.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>系统最新动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-2 h-2 rounded-full ${
                      activity.status === 'success'
                        ? 'bg-green-500'
                        : activity.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 系统状态 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CPU 使用率</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-[32%] bg-blue-500 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">内存使用率</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-[68%] bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">磁盘使用率</CardTitle>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-[45%] bg-orange-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
