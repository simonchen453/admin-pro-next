'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable } from '@/components/shared/data-table'
import { Users, RefreshCw, Ban } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function SessionPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)

      const res = await fetch(`/api/admin/session?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setSessions(data.data || [])
      }
    } catch (error) {
      toast.error('获取会话列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleForceLogout = async (session: any) => {
    if (!confirm(`确定要强制退出用户 "${session.loginName || session.userId}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/session?id=${session.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('用户已退出')
        fetchSessions()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'userId', header: '用户ID' },
    { accessorKey: 'loginName', header: '登录名' },
    { accessorKey: 'userDomain', header: '用户域' },
    { accessorKey: 'ipAddr', header: 'IP地址' },
    { accessorKey: 'loginLocation', header: '登录地点' },
    { accessorKey: 'browser', header: '浏览器' },
    { accessorKey: 'os', header: '操作系统' },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'active'
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {row.original.status === 'active' ? '在线' : '离线'}
        </span>
      ),
    },
    {
      accessorKey: 'createdDate',
      header: '登录时间',
      cell: ({ row }) => formatDate(row.original.createdDate),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleForceLogout(row.original)}
          disabled={row.original.status !== 'active'}
          className="text-destructive"
        >
          <Ban className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">在线用户</h1>
          <p className="text-muted-foreground mt-1">
            查看和管理当前在线的用户会话
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部状态</SelectItem>
              <SelectItem value="active">在线</SelectItem>
              <SelectItem value="inactive">离线</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchSessions} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">在线用户</p>
              <p className="text-2xl font-bold">
                {sessions.filter((s) => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900/20">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总会话数</p>
              <p className="text-2xl font-bold">{sessions.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <div className="w-6 h-6 rounded-full bg-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">系统域</p>
              <p className="text-2xl font-bold">
                {sessions.filter((s) => s.userDomain === 'system').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <div className="w-6 h-6 rounded-full bg-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">其他域</p>
              <p className="text-2xl font-bold">
                {sessions.filter((s) => s.userDomain !== 'system').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无在线用户</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sessions}
            searchKey="loginName"
            searchPlaceholder="搜索用户名或ID..."
          />
        )}
      </div>
    </div>
  )
}
