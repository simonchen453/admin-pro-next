import {
  Users,
  Building2,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {trend === 'up' ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">+{change}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                <span className="text-red-600 font-medium">{change}%</span>
              </>
            )}
            <span className="ml-0.5">较上月</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-8 w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-1.5">欢迎回来！</h1>
          <p className="text-blue-100 text-sm md:text-base">今天也是充满活力的一天，让我们开始工作吧</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总用户数"
          value="2,543"
          change={12.5}
          trend="up"
          icon={<Users className="w-5 h-5 text-white" />}
        />
        <StatCard
          title="部门数量"
          value="48"
          change={3.2}
          trend="up"
          icon={<Building2 className="w-5 h-5 text-white" />}
        />
        <StatCard
          title="系统日志"
          value="15,234"
          change={-2.4}
          trend="down"
          icon={<FileText className="w-5 h-5 text-white" />}
        />
        <StatCard
          title="活跃会话"
          value="186"
          change={8.1}
          trend="up"
          icon={<Activity className="w-5 h-5 text-white" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Quick Actions */}
        <Card className="md:col-span-4 border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">快捷操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm">添加用户</h3>
                  <p className="text-xs text-slate-500 truncate">快速创建新用户账户</p>
                </div>
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </button>

              <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 text-left group">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm">部门管理</h3>
                  <p className="text-xs text-slate-500 truncate">组织架构维护</p>
                </div>
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </button>

              <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 text-left group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm">查看日志</h3>
                  <p className="text-xs text-slate-500 truncate">系统操作审计</p>
                </div>
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </button>

              <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 text-left group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm">系统监控</h3>
                  <p className="text-xs text-slate-500 truncate">实时性能状态</p>
                </div>
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-3 border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: '张三', action: '创建了新用户', target: 'user_001', time: '2 分钟前', color: 'bg-blue-500' },
                { user: '李四', action: '修改了角色权限', target: '管理员角色', time: '15 分钟前', color: 'bg-blue-500' },
                { user: '王五', action: '删除了部门', target: '测试部门', time: '1 小时前', color: 'bg-red-500' },
                { user: '赵六', action: '更新了系统配置', target: 'SMTP设置', time: '2 小时前', color: 'bg-emerald-500' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-slate-600"> {activity.action} </span>
                      <span className="font-medium text-blue-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
