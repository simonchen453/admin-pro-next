'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2, Play, History } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function JobManagePage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [jobLogs, setJobLogs] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    display: '',
    cron: '',
    className: '',
    methodName: '',
    params: '',
    status: 'inactive',
    remark: '',
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/job')
      const data = await res.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      toast.error('获取任务列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchJobLogs = async (jobName: string) => {
    try {
      const res = await fetch(`/api/admin/job/log?jobName=${encodeURIComponent(jobName)}`)
      const data = await res.json()
      if (data.success) {
        setJobLogs(data.data)
      }
    } catch (error) {
      toast.error('获取任务日志失败')
    }
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedJob(null)
    setFormData({
      name: '',
      display: '',
      cron: '',
      className: '',
      methodName: '',
      params: '',
      status: 'inactive',
      remark: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (job: any) => {
    setDialogMode('edit')
    setSelectedJob(job)
    setFormData({
      name: job.name,
      display: job.display || '',
      cron: job.cron || '',
      className: job.className || '',
      methodName: job.className || '',
      params: '',
      status: job.status || 'inactive',
      remark: job.remark || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (job: any) => {
    if (!confirm(`确定要删除任务 "${job.display || job.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/job?id=${job.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchJobs()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleExecute = async (job: any) => {
    if (!confirm(`确定要立即执行任务 "${job.display || job.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/job/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('任务已开始执行')
      } else {
        toast.error(data.message || '执行失败')
      }
    } catch (error) {
      toast.error('执行失败')
    }
  }

  const handleViewLogs = (job: any) => {
    setSelectedJob(job)
    fetchJobLogs(job.name)
    setLogDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/job' : `/api/admin/job?id=${selectedJob?.id}`
    const method = dialogMode === 'create' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(dialogMode === 'create' ? '创建成功' : '更新成功')
        setDialogOpen(false)
        fetchJobs()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: '任务名称' },
    { accessorKey: 'display', header: '显示名称' },
    {
      accessorKey: 'cron',
      header: 'Cron表达式',
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {row.original.cron || '-'}
        </code>
      ),
    },
    {
      accessorKey: 'className',
      header: '执行类',
      cell: ({ row }) => row.original.className || '-',
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'active' ? 'text-green-600' : 'text-red-600'
          }
        >
          {row.original.status === 'active' ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExecute(row.original)}
            title="立即执行"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewLogs(row.original)}
            title="查看日志"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  const logColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'startTime',
      header: '执行时间',
      cell: ({ row }) =>
        row.original.startTime
          ? new Date(row.original.startTime).toLocaleString('zh-CN')
          : '-',
    },
    {
      accessorKey: 'endTime',
      header: '结束时间',
      cell: ({ row }) =>
        row.original.endTime
          ? new Date(row.original.endTime).toLocaleString('zh-CN')
          : '-',
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const status = row.original.status
        const statusMap: Record<string, { text: string; className: string }> = {
          running: { text: '执行中', className: 'text-blue-600' },
          success: { text: '成功', className: 'text-green-600' },
          failed: { text: '失败', className: 'text-red-600' },
        }
        const { text, className } = statusMap[status] || { text: status, className: '' }
        return <span className={className}>{text}</span>
      },
    },
    {
      accessorKey: 'duration',
      header: '耗时(ms)',
      cell: ({ row }) => row.original.duration || '-',
    },
    { accessorKey: 'remark', header: '备注' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">定时任务</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的定时任务和调度
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增任务
        </Button>
      </div>

      <div className="rounded-md border bg-card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={jobs}
            searchKey="display"
            searchPlaceholder="搜索任务..."
          />
        )}
      </div>

      {/* 创建/编辑任务对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? '新增任务' : '编辑任务'}
            </DialogTitle>
            <DialogDescription>
              填写任务信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">任务名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: DATA_SYNC_JOB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display">显示名称 *</Label>
                <Input
                  id="display"
                  value={formData.display}
                  onChange={(e) =>
                    setFormData({ ...formData, display: e.target.value })
                  }
                  required
                  placeholder="如: 数据同步任务"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cron">Cron表达式 *</Label>
              <Input
                id="cron"
                value={formData.cron}
                onChange={(e) =>
                  setFormData({ ...formData, cron: e.target.value })
                }
                required
                placeholder="如: 0 0 2 * * ?"
              />
              <p className="text-xs text-muted-foreground">
                示例：0 0 2 * * ? (每天凌晨2点执行)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="className">执行类/方法 *</Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
                required
                placeholder="如: com.example.Job 或 executeMethod"
              />
              <p className="text-xs text-muted-foreground">
                执行任务的完整类名或方法名
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark">备注</Label>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                }
              />
              <Label htmlFor="status">启用状态</Label>
            </div>

            <DialogFooter>
              <Button type="submit">
                {dialogMode === 'create' ? '创建' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 任务日志对话框 */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>任务执行日志</DialogTitle>
            <DialogDescription>
              {selectedJob?.display || selectedJob?.name} 的执行历史
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-96 overflow-auto">
            <DataTable
              columns={logColumns}
              data={jobLogs}
              searchKey="remark"
              searchPlaceholder="搜索日志..."
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
