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
import { DataTable } from '@/components/shared/data-table'
import { FileText, Search, RefreshCw, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'

export default function SysLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    module: '',
    status: '',
  })

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.keyword) params.append('keyword', filters.keyword)
      if (filters.category) params.append('category', filters.category)
      if (filters.module) params.append('module', filters.module)
      if (filters.status) params.append('status', filters.status)

      const res = await fetch(`/api/admin/syslog?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setLogs(data.data || [])
      }
    } catch (error) {
      console.error('获取日志失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchLogs()
  }

  const handleRefresh = () => {
    setFilters({ keyword: '', category: '', module: '', status: '' })
    fetchLogs()
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'module', header: '模块' },
    { accessorKey: 'category', header: '分类' },
    { accessorKey: 'description', header: '操作描述' },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'success'
              ? 'text-green-600'
              : row.original.status === 'error'
              ? 'text-red-600'
              : 'text-orange-600'
          }
        >
          {row.original.status === 'success' ? '成功' : row.original.status === 'error' ? '失败' : '警告'}
        </span>
      ),
    },
    { accessorKey: 'method', header: '方法' },
    { accessorKey: 'ip', header: 'IP地址' },
    {
      accessorKey: 'createdDate',
      header: '创建时间',
      cell: ({ row }) => formatDate(row.original.createdDate),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系统日志</h1>
          <p className="text-muted-foreground mt-1">
            查看系统操作日志
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">关键字</Label>
            <Input
              id="keyword"
              placeholder="搜索日志描述..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">分类</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                <SelectItem value="system">系统</SelectItem>
                <SelectItem value="business">业务</SelectItem>
                <SelectItem value="auth">认证</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="error">失败</SelectItem>
                <SelectItem value="warning">警告</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full gap-2">
              <Search className="w-4 h-4" />
              搜索
            </Button>
          </div>
        </div>
      </div>

      {/* 日志列表 */}
      <div className="rounded-md border bg-card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无日志记录</p>
          </div>
        ) : (
          <DataTable columns={columns} data={logs} searchKey="" />
        )}
      </div>
    </div>
  )
}
