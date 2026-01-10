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

export default function MenuManagePage() {
  const [menus, setMenus] = useState<any[]>([])
  const [flatMenus, setFlatMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedMenu, setSelectedMenu] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    display: '',
    parentId: '',
    orderNum: 0,
    url: '',
    type: 'C',
    visible: 'show',
    status: 'active',
    permission: '',
    icon: '',
  })

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/menu')
      const data = await res.json()
      if (data.success) {
        setMenus(data.data)
        // 展平菜单用于表格显示
        const flat = flattenMenus(data.data)
        setFlatMenus(flat)
      }
    } catch (error) {
      toast.error('获取菜单列表失败')
    } finally {
      setLoading(false)
    }
  }

  const flattenMenus = (menuList: any[], level = 0): any[] => {
    let result: any[] = []
    menuList.forEach((menu) => {
      result.push({ ...menu, level })
      if (menu.children && menu.children.length > 0) {
        result = result.concat(flattenMenus(menu.children, level + 1))
      }
    })
    return result
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedMenu(null)
    setFormData({
      name: '',
      display: '',
      parentId: '',
      orderNum: 0,
      url: '',
      type: 'C',
      visible: 'show',
      status: 'active',
      permission: '',
      icon: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (menu: any) => {
    setDialogMode('edit')
    setSelectedMenu(menu)
    setFormData({
      name: menu.name,
      display: menu.display || '',
      parentId: menu.parentId || '',
      orderNum: menu.orderNum || 0,
      url: menu.url || '',
      type: menu.type || 'C',
      visible: menu.visible || 'show',
      status: menu.status || 'active',
      permission: menu.permission || '',
      icon: menu.icon || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (menu: any) => {
    if (!confirm(`确定要删除菜单 "${menu.display || menu.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/menu?id=${menu.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchMenus()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/menu' : `/api/admin/menu?id=${selectedMenu?.id}`
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
        fetchMenus()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const getTypeName = (type: string) => {
    const types: Record<string, string> = {
      M: '目录',
      C: '菜单',
      F: '按钮',
    }
    return types[type] || type
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'display',
      header: '菜单名称',
      cell: ({ row }) => (
        <span style={{ paddingLeft: `${row.original.level * 20}px` }}>
          {row.original.display || row.original.name}
        </span>
      ),
    },
    { accessorKey: 'name', header: '标识' },
    {
      accessorKey: 'type',
      header: '类型',
      cell: ({ row }) => getTypeName(row.original.type),
    },
    { accessorKey: 'permission', header: '权限标识' },
    { accessorKey: 'url', header: '路由' },
    {
      accessorKey: 'visible',
      header: '显示',
      cell: ({ row }) => (row.original.visible === 'show' ? '显示' : '隐藏'),
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
          <h1 className="text-3xl font-bold tracking-tight">菜单管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的菜单和权限
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增菜单
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
            data={flatMenus}
            searchKey="display"
            searchPlaceholder="搜索菜单..."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? '新增菜单' : '编辑菜单'}
            </DialogTitle>
            <DialogDescription>
              填写菜单信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">菜单标识 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: M_USER"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">菜单类型 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">目录</SelectItem>
                    <SelectItem value="C">菜单</SelectItem>
                    <SelectItem value="F">按钮</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display">菜单名称 *</Label>
              <Input
                id="display"
                value={formData.display}
                onChange={(e) =>
                  setFormData({ ...formData, display: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentId">上级菜单</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="无（顶级菜单）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">无（顶级菜单）</SelectItem>
                    {flatMenus.map((menu) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {'  '.repeat(menu.level) + (menu.display || menu.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
            </div>

            {formData.type !== 'M' && (
              <div className="space-y-2">
                <Label htmlFor="url">路由地址</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/admin/user"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="permission">权限标识</Label>
              <Input
                id="permission"
                value={formData.permission}
                onChange={(e) =>
                  setFormData({ ...formData, permission: e.target.value })
                }
                placeholder="system:user"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">图标</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Users"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="visible"
                  checked={formData.visible === 'show'}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, visible: checked ? 'show' : 'hide' })
                  }
                />
                <Label htmlFor="visible">显示</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="status"
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                  }
                />
                <Label htmlFor="status">启用</Label>
              </div>
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
