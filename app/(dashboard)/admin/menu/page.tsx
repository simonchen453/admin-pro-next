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
import { Plus, Pencil, Trash2, Menu as MenuIcon, Search, LayoutTemplate } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

interface Menu {
  id: string
  name: string
  type: 'DIRECTORY' | 'MENU' | 'BUTTON'
  parentId: string | null
  path: string | null
  component: string | null
  icon: string | null
  orderNum: number
  i18n: string | null
  status: 'active' | 'inactive'
  children?: Menu[]
  level?: number
}

export default function MenuManagePage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [flatMenus, setFlatMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'MENU' as 'DIRECTORY' | 'MENU' | 'BUTTON',
    parentId: '',
    path: '',
    component: '',
    icon: '',
    orderNum: 0,
    i18n: '',
    status: 'active' as 'active' | 'inactive',
  })
  const [globalFilter, setGlobalFilter] = useState('')

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
        const flat = flattenMenus(data.data)
        setFlatMenus(flat)
      }
    } catch (error) {
      toast.error('获取菜单列表失败')
    } finally {
      setLoading(false)
    }
  }

  const flattenMenus = (menuList: Menu[], level = 0): Menu[] => {
    let result: Menu[] = []
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
      type: 'MENU',
      parentId: '',
      path: '',
      component: '',
      icon: '',
      orderNum: 0,
      i18n: '',
      status: 'active',
    })
    setDialogOpen(true)
  }

  const handleEdit = (menu: Menu) => {
    setDialogMode('edit')
    setSelectedMenu(menu)
    setFormData({
      name: menu.name,
      type: menu.type,
      parentId: menu.parentId || '',
      path: menu.path || '',
      component: menu.component || '',
      icon: menu.icon || '',
      orderNum: menu.orderNum || 0,
      i18n: menu.i18n || '',
      status: menu.status,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (menu: Menu) => {
    if (!confirm(`确定要删除菜单 "${menu.name}" 吗？`)) {
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

    // Clean data for API
    const submissionData = {
      ...formData,
      // If parentId is empty string, convert to null
      parentId: formData.parentId === "" ? null : formData.parentId
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
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

  const columns: ColumnDef<Menu>[] = [
    {
      accessorKey: 'name',
      header: '菜单名称',
      cell: ({ row }) => (
        <div className="flex items-center" style={{ paddingLeft: `${(row.original.level || 0) * 20}px` }}>
          <div className="mr-2 text-slate-400">
            {row.original.level === 0 ? <LayoutTemplate className="w-4 h-4" /> : <div className="w-4 h-px bg-slate-200" />}
          </div>
          <span className="font-medium text-slate-800">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: '类型',
      cell: ({ row }) => {
        const typeMap = {
          DIRECTORY: { label: '目录', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          MENU: { label: '菜单', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          BUTTON: { label: '按钮', color: 'bg-slate-50 text-slate-500 border-slate-200' },
        }
        const config = typeMap[row.original.type] || typeMap.MENU
        return (
          <span className={`text-[10px] px-2 py-0.5 rounded border ${config.color}`}>
            {config.label}
          </span>
        )
      },
    },
    {
      accessorKey: 'path',
      header: '路由地址',
      cell: ({ row }) => row.original.path ? (
        <span className="font-mono text-xs text-slate-500">{row.original.path}</span>
      ) : <span className="text-slate-300">-</span>,
    },
    {
      accessorKey: 'component',
      header: '组件路径',
      cell: ({ row }) => row.original.component ? (
        <span className="font-mono text-xs text-slate-500">{row.original.component}</span>
      ) : <span className="text-slate-300">-</span>,
    },
    {
      accessorKey: 'orderNum',
      header: '排序',
      cell: ({ row }) => <span className="text-slate-400 font-mono text-xs">{row.original.orderNum}</span>,
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
              <MenuIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">菜单管理</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-lg pl-12">
            配置系统菜单项、路由和权限按钮，构建系统导航结构。
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 min-w-[300px] justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索菜单..."
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
            新增菜单
          </Button>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-none sm:rounded-2xl">
        {loading && flatMenus.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">正在加载数据...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={flatMenus.filter(menu =>
              menu.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
              (menu.path && menu.path.toLowerCase().includes(globalFilter.toLowerCase()))
            )}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                <MenuIcon className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {dialogMode === 'create' ? '新增菜单' : '编辑菜单'}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  配置菜单项的详细信息
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-slate-700 font-medium">上级菜单</Label>
                <Select
                  value={formData.parentId || "ROOT"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value === "ROOT" ? "" : value })
                  }
                >
                  <SelectTrigger id="parentId" className="border-slate-200">
                    <SelectValue placeholder="无（顶级菜单）" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="ROOT">无（顶级菜单）</SelectItem>
                    {flatMenus.filter(m => m.id !== selectedMenu?.id && m.type !== 'BUTTON').map((menu) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        <span className="truncate">{'  '.repeat(menu.level || 0) + menu.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-700 font-medium">菜单类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'DIRECTORY' | 'MENU' | 'BUTTON') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type" className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIRECTORY">目录</SelectItem>
                    <SelectItem value="MENU">菜单</SelectItem>
                    <SelectItem value="BUTTON">按钮</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">菜单名称 <span className="text-rose-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="例如: 用户管理"
                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="path" className="text-slate-700 font-medium">路由地址</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder={formData.type === 'BUTTON' ? '无需填写' : '/admin/user'}
                  disabled={formData.type === 'BUTTON'}
                  className="font-mono text-sm border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="component" className="text-slate-700 font-medium">组件路径</Label>
                <Input
                  id="component"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  placeholder="layout/Layout 或 admin/user"
                  className="font-mono text-sm border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-slate-700 font-medium">图标</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="例如: user, settings"
                  className="font-mono text-sm border-slate-200"
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
                <p className="text-xs text-slate-500">禁用后菜单将不可见</p>
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
                {dialogMode === 'create' ? '创建菜单' : '保存更改'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
