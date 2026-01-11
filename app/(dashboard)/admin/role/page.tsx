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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2, Shield, Search, Key } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

interface Role {
  id: string
  name: string
  display: string
  isSystem: boolean
  status: 'active' | 'inactive'
  createdDate: string
}

export default function RoleManagePage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    display: '',
    status: 'active',
  })

  // 搜索过滤
  const [globalFilter, setGlobalFilter] = useState('')

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

  const handleEdit = (role: Role) => {
    setDialogMode('edit')
    setSelectedRole(role)
    setFormData({
      name: role.name,
      display: role.display || '',
      status: role.status,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (role: Role) => {
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

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: '角色标识',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{row.original.name}</span>,
    },
    {
      accessorKey: 'display',
      header: '角色名称',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-700">{row.original.display}</span>
        </div>
      ),
    },
    {
      accessorKey: 'isSystem',
      header: '类型',
      cell: ({ row }) => (
        row.original.isSystem ? (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">系统内置</Badge>
        ) : (
          <Badge variant="outline" className="text-slate-500 bg-white">自定义</Badge>
        )
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const isActive = row.original.status === 'active'
        return (
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isActive
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {isActive ? '正常' : '禁用'}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            disabled={row.original.isSystem}
            className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
            className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
            disabled={row.original.isSystem}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-dashed border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">角色管理</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-lg pl-12">
            定义系统角色及其权限范围，控制用户对资源的访问级别。
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 min-w-[300px] justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索角色名称或标识..."
              className="pl-9 w-full sm:w-64 bg-white/80 border-slate-200 focus:bg-white transition-all rounded-xl"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增角色
          </Button>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-none sm:rounded-2xl">
        {loading && roles.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">正在加载数据...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={roles.filter(role =>
              role.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
              role.display.toLowerCase().includes(globalFilter.toLowerCase())
            )}
          // Not parsing searchKey to disable internal search
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {dialogMode === 'create' ? '新增角色' : '编辑角色'}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  {dialogMode === 'create' ? '创建一个新的系统角色' : '修改现有角色信息'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">角色标识 <span className="text-rose-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={dialogMode === 'edit'}
                required
                placeholder="例如: ROLE_MANAGER"
                className="font-mono text-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
              <p className="text-[10px] text-slate-400">唯一标识符，建议使用大写字母和下划线。</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display" className="text-slate-700 font-medium">角色名称 <span className="text-rose-500">*</span></Label>
              <Input
                id="display"
                value={formData.display}
                onChange={(e) =>
                  setFormData({ ...formData, display: e.target.value })
                }
                required
                placeholder="例如: 部门经理"
                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="space-y-0.5">
                <Label htmlFor="status" className="text-base font-medium text-slate-900">启用状态</Label>
                <p className="text-xs text-slate-500">禁用后该角色关联的用户将无法通过权限验证</p>
              </div>
              <Switch
                id="status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                }
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-200">
                取消
              </Button>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200">
                {dialogMode === 'create' ? '立即创建' : '保存更改'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
