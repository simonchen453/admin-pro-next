'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function RoleManagePage() {
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    display: '',
    status: 'active',
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/role')
      const data = await res.json()
      if (data.success) {
        setRoles(data.data)
      }
    } catch (error) {
      toast.error('获取角色列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedRole(null)
    setFormData({ name: '', display: '', status: 'active' })
    setDialogOpen(true)
  }

  const handleEdit = (role: any) => {
    setDialogMode('edit')
    setSelectedRole(role)
    setFormData({
      name: role.name,
      display: role.display || '',
      status: role.status || 'active',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (role: any) => {
    if (!confirm(`确定要删除角色 "${role.display || role.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/role?id=${role.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchRoles()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/role' : `/api/admin/role?id=${selectedRole?.id}`
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
        fetchRoles()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: '角色标识' },
    { accessorKey: 'display', header: '角色名称' },
    {
      accessorKey: 'isSystem',
      header: '系统角色',
      cell: ({ row }) => (row.original.isSystem ? '是' : '否'),
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
          {row.original.status === 'active' ? '正常' : '禁用'}
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
            onClick={() => handleEdit(row.original)}
            disabled={row.original.isSystem}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="text-destructive"
            disabled={row.original.isSystem}
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
          <h1 className="text-3xl font-bold tracking-tight">角色管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的角色和权限
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增角色
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
            data={roles}
            searchKey="name"
            searchPlaceholder="搜索角色..."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? '新增角色' : '编辑角色'}
            </DialogTitle>
            <DialogDescription>
              填写角色信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">角色标识 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={dialogMode === 'edit'}
                required
                placeholder="如: ROLE_ADMIN"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display">角色名称 *</Label>
              <Input
                id="display"
                value={formData.display}
                onChange={(e) =>
                  setFormData({ ...formData, display: e.target.value })
                }
                required
                placeholder="如: 管理员"
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
    </div>
  )
}
