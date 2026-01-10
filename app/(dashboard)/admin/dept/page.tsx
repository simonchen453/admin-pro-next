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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function DeptManagePage() {
  const [depts, setDepts] = useState<any[]>([])
  const [flatDepts, setFlatDepts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedDept, setSelectedDept] = useState<any>(null)
  const [formData, setFormData] = useState({
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

  const flattenDepts = (deptList: any[], level = 0): any[] => {
    let result: any[] = []
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

  const handleEdit = (dept: any) => {
    setDialogMode('edit')
    setSelectedDept(dept)
    setFormData({
      no: dept.no,
      parentId: dept.parentId || '',
      name: dept.name || '',
      orderNum: dept.orderNum || 0,
      linkman: dept.linkman || '',
      contact: dept.contact || '',
      phone: dept.phone || '',
      email: dept.email || '',
      status: dept.status || 'active',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (dept: any) => {
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: '部门名称',
      cell: ({ row }) => (
        <span style={{ paddingLeft: `${row.original.level * 20}px` }}>
          {row.original.name}
        </span>
      ),
    },
    { accessorKey: 'no', header: '部门编号' },
    { accessorKey: 'linkman', header: '负责人' },
    { accessorKey: 'contact', header: '联系电话' },
    { accessorKey: 'phone', header: '手机号' },
    { accessorKey: 'email', header: '邮箱' },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">部门管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的组织架构和部门信息
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增部门
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
            data={flatDepts}
            searchKey="name"
            searchPlaceholder="搜索部门..."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? '新增部门' : '编辑部门'}
            </DialogTitle>
            <DialogDescription>
              填写部门信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="no">部门编号 *</Label>
                <Input
                  id="no"
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: D001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">上级部门</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="无（顶级部门）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">无（顶级部门）</SelectItem>
                    {flatDepts.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {'  '.repeat(dept.level) + dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">部门名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNum">排序号</Label>
                <Input
                  id="orderNum"
                  type="number"
                  value={formData.orderNum}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNum: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkman">负责人</Label>
                <Input
                  id="linkman"
                  value={formData.linkman}
                  onChange={(e) =>
                    setFormData({ ...formData, linkman: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
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
