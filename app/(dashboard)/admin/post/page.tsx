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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2, Briefcase, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

interface Post {
  id: string
  code: string
  name: string
  display: string
  orderNum: number
  status: 'active' | 'inactive'
  remark: string
}

export default function PostManagePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    display: '',
    orderNum: 0,
    status: 'active' as 'active' | 'inactive',
    remark: '',
  })
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/post')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      toast.error('获取岗位列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedPost(null)
    setFormData({
      code: '',
      name: '',
      display: '',
      orderNum: 0,
      status: 'active',
      remark: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (post: Post) => {
    setDialogMode('edit')
    setSelectedPost(post)
    setFormData({
      code: post.code,
      name: post.name || '',
      display: post.display || '',
      orderNum: post.orderNum || 0,
      status: post.status || 'active',
      remark: post.remark || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (post: Post) => {
    if (!confirm(`确定要删除岗位 "${post.display || post.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/post?id=${post.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchPosts()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/post' : `/api/admin/post?id=${selectedPost?.id}`
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
        fetchPosts()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'display',
      header: '显示名称',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 mr-2.5">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-800">{row.original.display}</span>
        </div>
      )
    },
    {
      accessorKey: 'name',
      header: '岗位名称',
      cell: ({ row }) => <span className="text-slate-600 font-normal">{row.original.name}</span>
    },
    {
      accessorKey: 'code',
      header: '岗位编码',
      cell: ({ row }) => <code className="text-xs bg-slate-50 px-2 py-0.5 rounded text-slate-500 font-mono border border-slate-100">{row.original.code}</code>
    },
    {
      accessorKey: 'orderNum',
      header: '排序',
      cell: ({ row }) => <span className="text-slate-400 font-mono text-xs">{row.original.orderNum}</span>
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
      accessorKey: 'remark',
      header: '备注',
      cell: ({ row }) => <span className="text-slate-400 text-xs truncate max-w-[150px] inline-block" title={row.original.remark}>{row.original.remark || '-'}</span>
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
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">岗位管理</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-lg pl-12">
            管理公司职位与岗位信息，维护岗位职责与层级。
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 min-w-[300px] justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索岗位..."
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
            新增岗位
          </Button>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-none sm:rounded-2xl">
        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">正在加载数据...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={posts.filter(p =>
              p.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
              p.code.toLowerCase().includes(globalFilter.toLowerCase()) ||
              p.display.toLowerCase().includes(globalFilter.toLowerCase())
            )}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {dialogMode === 'create' ? '新增岗位' : '编辑岗位'}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  填写岗位基本信息
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-700 font-medium">岗位编码 <span className="text-rose-500">*</span></Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: DEV"
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

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">岗位名称 <span className="text-rose-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="例如: 软件开发工程师"
                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display" className="text-slate-700 font-medium">显示名称 <span className="text-rose-500">*</span></Label>
              <Input
                id="display"
                value={formData.display}
                onChange={(e) =>
                  setFormData({ ...formData, display: e.target.value })
                }
                required
                placeholder="例如: 高级研发"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark" className="text-slate-700 font-medium">备注</Label>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                rows={3}
                className="border-slate-200 resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="space-y-0.5">
                <Label htmlFor="status" className="text-base font-medium text-slate-900">启用状态</Label>
                <p className="text-xs text-slate-500">禁用后，该岗位将无法分配给用户</p>
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
                {dialogMode === 'create' ? '创建岗位' : '保存更改'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
