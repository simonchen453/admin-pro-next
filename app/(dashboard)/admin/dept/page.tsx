'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2, Network, Search, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

interface Dept {
  id: string
  no: string
  parentId: string
  name: string
  orderNum: number
  linkman: string
  contact: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  children?: Dept[]
  level?: number
}

export default function DeptManagePage() {
  const [depts, setDepts] = useState<Dept[]>([])
  const [flatDepts, setFlatDepts] = useState<Dept[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null)
  const [formData, setFormData] = useState({
    no: '',
    parentId: '',
    name: '',
    orderNum: 0,
    linkman: '',
    contact: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
  })
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    fetchDepts()
  }, [])

  const fetchDepts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/dept')
      const data = await res.json()
      if (data.success) {
        setDepts(data.data)
        const flat = flattenDepts(data.data)
        setFlatDepts(flat)
      }
    } catch (error) {
      toast.error('获取部门列表失败')
    } finally {
      setLoading(false)
    }
  }

  const flattenDepts = (deptList: Dept[], level = 0): Dept[] => {
    let result: Dept[] = []
    deptList.forEach((dept) => {
      result.push({ ...dept, level })
      if (dept.children && dept.children.length > 0) {
        result = result.concat(flattenDepts(dept.children, level + 1))
      }
    })
    return result
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedDept(null)
    setFormData({
      no: '',
      parentId: '',
      name: '',
      orderNum: 0,
      linkman: '',
      contact: '',
      phone: '',
      email: '',
      status: 'active',
    })
    setDialogOpen(true)
  }

  const handleEdit = (dept: Dept) => {
    setDialogMode('edit')
    setSelectedDept(dept)
    setFormData({
      no: dept.no,
      parentId: dept.parentId || '',
      name: dept.name,
      orderNum: dept.orderNum || 0,
      linkman: dept.linkman || '',
      contact: dept.contact || '',
      phone: dept.phone || '',
      email: dept.email || '',
      status: dept.status,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (dept: Dept) => {
    if (!confirm(`确定要删除部门 "${dept.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/dept?id=${dept.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchDepts()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/dept' : `/api/admin/dept?id=${selectedDept?.id}`
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
        fetchDepts()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const columns: ColumnDef<Dept>[] = [
    {
      accessorKey: 'name',
      header: '部门名称',
      cell: ({ row }) => (
        <div className="flex items-center" style={{ paddingLeft: `${(row.original.level || 0) * 24}px` }}>
          <Network className="w-4 h-4 mr-2 text-indigo-500 opacity-70" />
          <span className="font-medium text-slate-800">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'no',
      header: '部门编号',
      cell: ({ row }) => <span className="font-mono text-xs bg-slate-50 px-2 py-0.5 rounded text-slate-500 border border-slate-100">{row.original.no}</span>
    },
    {
      accessorKey: 'linkman',
      header: '负责人',
      cell: ({ row }) => row.original.linkman ? (
        <div className="text-xs text-slate-600">{row.original.linkman}</div>
      ) : <span className="text-slate-300 text-xs">-</span>
    },
    {
      accessorKey: 'phone',
      header: '联系电话',
      cell: ({ row }) => row.original.phone ? (
        <div className="text-xs text-slate-600 font-mono">{row.original.phone}</div>
      ) : <span className="text-slate-300 text-xs">-</span>
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
            className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
            className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
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
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">部门管理</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-lg pl-12">
            配置公司组织架构与部门层级，管理部门人员与权限。
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 min-w-[300px] justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索部门..."
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
            新增部门
          </Button>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-none sm:rounded-2xl">
        {loading && flatDepts.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">正在加载数据...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={flatDepts.filter(dept =>
              dept.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
              dept.no.toLowerCase().includes(globalFilter.toLowerCase())
            )}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {dialogMode === 'create' ? '新增部门' : '编辑部门'}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  配置部门基本信息和层级关系
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-slate-700 font-medium">上级部门</Label>
                <Select
                  value={formData.parentId || "ROOT"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value === "ROOT" ? "" : value })
                  }
                >
                  <SelectTrigger id="parentId" className="border-slate-200">
                    <SelectValue placeholder="无（顶级部门）" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="ROOT">无（顶级部门）</SelectItem>
                    {flatDepts.filter(d => d.id !== selectedDept?.id).map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <span className="truncate">{'  '.repeat(dept.level || 0) + dept.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="no" className="text-slate-700 font-medium">部门编号 <span className="text-rose-500">*</span></Label>
                <Input
                  id="no"
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: D001"
                  className="font-mono text-sm border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">部门名称 <span className="text-rose-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="例如: 研发中心"
                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="linkman" className="text-slate-700 font-medium">负责人</Label>
                <Input
                  id="linkman"
                  value={formData.linkman}
                  onChange={(e) =>
                    setFormData({ ...formData, linkman: e.target.value })
                  }
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">手机号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNum" className="text-slate-700 font-medium">排序号</Label>
                <Input
                  id="orderNum"
                  type="number"
                  value={formData.orderNum}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNum: parseInt(e.target.value) || 0 })
                  }
                  className="border-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="space-y-0.5">
                <Label htmlFor="status" className="text-base font-medium text-slate-900">启用状态</Label>
                <p className="text-xs text-slate-500">部门停用后，该部门下的用户可能无法正常操作</p>
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
                {dialogMode === 'create' ? '创建部门' : '保存更改'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
