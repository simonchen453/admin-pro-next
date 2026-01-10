'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/shared/data-table'
import { Search, RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    status: '',
    module: '',
  })

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.keyword) params.append('keyword', filters.keyword)
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if (filters.module) params.append('module', filters.module)

      const res = await fetch(`/api/admin/audit?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setLogs(data.data)
      }
    } catch (error) {
      toast.error('获取审计日志失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchLogs()
  }

  const handleReset = () => {
    setFilters({
      keyword: '',
      category: '',
      status: '',
      module: '',
    })
    setTimeout(fetchLogs, 0)
  }

  const handleExport = () => {
    toast.info('导出功能开发中...')
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdDate',
      header: '操作时间',
      cell: ({ row }) =>
        row.original.createdDate
          ? new Date(row.original.createdDate).toLocaleString('zh-CN')
          : '-',
    },
    {
      accessorKey: 'category',
      header: '分类',
      cell: ({ row }) => {
        const category = row.original.category
        const categoryMap: Record<string, string> = {
          auth: '认证',
          user: '用户',
          role: '角色',
          menu: '菜单',
          dept: '部门',
          post: '岗位',
          config: '配置',
          dict: '字典',
          job: '任务',
        }
        return categoryMap[category] || category || '-'
      },
    },
    {
      accessorKey: 'module',
      header: '模块',
      cell: ({ row }) => row.original.module || '-',
    },
    {
      accessorKey: 'event',
      header: '操作事件',
      cell: ({ row }) => (
        <span className="max-w-xs truncate block" title={row.original.event}>
          {row.original.event || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP地址',
      cell: ({ row }) => row.original.ipAddress || '-',
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const status = row.original.status
        const statusMap: Record<string, { text: string; className: string }> = {
          success: { text: '成功', className: 'text-green-600' },
          failed: { text: '失败', className: 'text-red-600' },
        }
        const { text, className } = statusMap[status] || { text: status, className: '' }
        return <span className={className}>{text}</span>
      },
    },
    {
      accessorKey: 'executionTime',
      header: '耗时(ms)',
      cell: ({ row }) => row.original.executionTime || '-',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">审计日志</h1>
          <p className="text-muted-foreground mt-1">
            查看系统业务操作的审计记录
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重置
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 搜索过滤 */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>关键词</Label>
            <Input
              placeholder="搜索事件或IP..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <Label>分类</Label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部分类</SelectItem>
                <SelectItem value="auth">认证</SelectItem>
                <SelectItem value="user">用户</SelectItem>
                <SelectItem value="role">角色</SelectItem>
                <SelectItem value="menu">菜单</SelectItem>
                <SelectItem value="dept">部门</SelectItem>
                <SelectItem value="post">岗位</SelectItem>
                <SelectItem value="config">配置</SelectItem>
                <SelectItem value="dict">字典</SelectItem>
                <SelectItem value="job">任务</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>状态</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>模块</Label>
            <Input
              placeholder="输入模块名"
              value={filters.module}
              onChange={(e) =>
                setFilters({ ...filters, module: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleSearch} className="gap-2">
            <Search className="w-4 h-4" />
            搜索
          </Button>
        </div>
      </Card>

      {/* 日志列表 */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={logs}
            searchKey="event"
            searchPlaceholder="搜索审计日志..."
          />
        )}
      </Card>
    </div>
  )
}
