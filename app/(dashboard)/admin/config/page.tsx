'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function ConfigManagePage() {
  const [configs, setConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedConfig, setSelectedConfig] = useState<any>(null)
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    value: '',
    system: false,
    remark: '',
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/config')
      const data = await res.json()
      if (data.success) {
        setConfigs(data.data)
      }
    } catch (error) {
      toast.error('获取配置列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedConfig(null)
    setFormData({
      key: '',
      name: '',
      value: '',
      system: false,
      remark: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (config: any) => {
    setDialogMode('edit')
    setSelectedConfig(config)
    setFormData({
      key: config.key,
      name: config.name || '',
      value: config.value || '',
      system: config.system === 1,
      remark: config.remark || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (config: any) => {
    if (!confirm(`确定要删除配置 "${config.name || config.key}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/config?id=${config.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchConfigs()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/config' : `/api/admin/config?id=${selectedConfig?.id}`
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
        fetchConfigs()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'key', header: '配置键' },
    { accessorKey: 'name', header: '配置名称' },
    { accessorKey: 'value', header: '配置值' },
    {
      accessorKey: 'system',
      header: '类型',
      cell: ({ row }) => (
        <span className={row.original.system === 1 ? 'text-orange-600' : 'text-blue-600'}>
          {row.original.system === 1 ? '系统' : '自定义'}
        </span>
      ),
    },
    { accessorKey: 'remark', header: '备注' },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="text-destructive"
            disabled={row.original.system === 1}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">参数配置</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的参数配置
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增配置
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
            data={configs}
            searchKey="name"
            searchPlaceholder="搜索配置..."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? '新增配置' : '编辑配置'}
            </DialogTitle>
            <DialogDescription>
              填写配置信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">配置键 *</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: sys.user.initPassword"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="system"
                  checked={formData.system}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, system: checked })
                  }
                  disabled={dialogMode === 'edit'}
                />
                <Label htmlFor="system">系统配置</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">配置名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="如: 用户初始密码"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">配置值</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="如: admin123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark">备注</Label>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {dialogMode === 'create' ? '创建' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
