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
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function PostManagePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    display: '',
    orderNum: 0,
    status: 'active',
    remark: '',
  })

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

  const handleEdit = (post: any) => {
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

  const handleDelete = async (post: any) => {
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

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'code', header: '岗位编码' },
    { accessorKey: 'name', header: '岗位名称' },
    { accessorKey: 'display', header: '显示名称' },
    { accessorKey: 'orderNum', header: '排序' },
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
          <h1 className="text-3xl font-bold tracking-tight">岗位管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的岗位信息
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增岗位
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
            data={posts}
            searchKey="display"
            searchPlaceholder="搜索岗位..."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? '新增岗位' : '编辑岗位'}
            </DialogTitle>
            <DialogDescription>
              填写岗位信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">岗位编码 *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={dialogMode === 'edit'}
                  required
                  placeholder="如: DEVELOPER"
                />
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

            <div className="space-y-2">
              <Label htmlFor="name">岗位名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
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
