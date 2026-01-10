'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DataTable } from '@/components/shared/data-table'
import { useAuthStore } from '@/stores/auth'
import { Plus, Pencil, Trash2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'

export default function UserManagePage() {
  const [users, setUsers] = useState<any[]>([])
  const [depts, setDepts] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'password'>('create')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    userDomain: 'system',
    loginName: '',
    realName: '',
    email: '',
    mobileNo: '',
    deptNo: '',
    post: '',
    status: 'active',
    password: '',
  })

  useEffect(() => {
    fetchUsers()
    fetchDepts()
    fetchPosts()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/user')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      toast.error('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchDepts = async () => {
    try {
      const res = await fetch('/api/admin/dept')
      const data = await res.json()
      if (data.success) {
        setDepts(data.data)
      }
    } catch (error) {
      console.error('获取部门列表失败:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/post')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error('获取岗位列表失败:', error)
    }
  }

  const handleCreate = () => {
    setDialogMode('create')
    setSelectedUser(null)
    setFormData({
      userDomain: 'system',
      loginName: '',
      realName: '',
      email: '',
      mobileNo: '',
      deptNo: '',
      post: '',
      status: 'active',
      password: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (user: any) => {
    setDialogMode('edit')
    setSelectedUser(user)
    setFormData({
      userDomain: user.userDomain,
      loginName: user.loginName || '',
      realName: user.realName || '',
      email: user.email || '',
      mobileNo: user.mobileNo || '',
      deptNo: user.deptNo || '',
      post: user.post || '',
      status: user.status || 'active',
      password: '',
    })
    setDialogOpen(true)
  }

  const handlePassword = (user: any) => {
    setDialogMode('password')
    setSelectedUser(user)
    setFormData({ ...formData, password: '' })
    setDialogOpen(true)
  }

  const handleDelete = async (user: any) => {
    if (!confirm(`确定要删除用户 "${user.realName || user.loginName}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/user?id=${user.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchUsers()
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dialogMode === 'create' ? '/api/admin/user' : `/api/admin/user?id=${selectedUser?.id}`
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
        fetchUsers()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/admin/user/password?id=${selectedUser?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('密码修改成功')
        setDialogOpen(false)
      } else {
        toast.error(data.message || '密码修改失败')
      }
    } catch (error) {
      toast.error('密码修改失败')
    }
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'loginName', header: '用户名' },
    { accessorKey: 'realName', header: '姓名' },
    { accessorKey: 'email', header: '邮箱' },
    { accessorKey: 'mobileNo', header: '手机号' },
    { accessorKey: 'deptNo', header: '部门' },
    { accessorKey: 'post', header: '岗位' },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'active'
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {row.original.status === 'active' ? '正常' : '禁用'}
        </span>
      ),
    },
    {
      accessorKey: 'latestLoginTime',
      header: '最后登录',
      cell: ({ row }) => formatDate(row.original.latestLoginTime),
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
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePassword(row.original)}
          >
            <KeyRound className="w-4 h-4" />
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
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的用户账号和权限
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新增用户
        </Button>
      </div>

      {/* 数据表格 */}
      <div className="rounded-md border bg-card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            searchKey="loginName"
            searchPlaceholder="搜索用户名或姓名..."
          />
        )}
      </div>

      {/* 创建/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create'
                ? '新增用户'
                : dialogMode === 'edit'
                ? '编辑用户'
                : '修改密码'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'password'
                ? '请输入新密码'
                : '填写用户信息，带 * 的为必填项'}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">新密码 *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">确定</Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userDomain">用户域 *</Label>
                  <Select
                    value={formData.userDomain}
                    onValueChange={(value) =>
                      setFormData({ ...formData, userDomain: value })
                    }
                    disabled={dialogMode === 'edit'}
                  >
                    <SelectTrigger id="userDomain">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">系统用户</SelectItem>
                      <SelectItem value="intranet">局域网用户</SelectItem>
                      <SelectItem value="internet">因特网用户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginName">用户名 *</Label>
                  <Input
                    id="loginName"
                    value={formData.loginName}
                    onChange={(e) =>
                      setFormData({ ...formData, loginName: e.target.value })
                    }
                    disabled={dialogMode === 'edit'}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="realName">姓名 *</Label>
                <Input
                  id="realName"
                  value={formData.realName}
                  onChange={(e) =>
                    setFormData({ ...formData, realName: e.target.value })
                  }
                  required
                />
              </div>

              {dialogMode === 'create' && (
                <div className="space-y-2">
                  <Label htmlFor="newPassword">初始密码 *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNo">手机号</Label>
                  <Input
                    id="mobileNo"
                    value={formData.mobileNo}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deptNo">部门</Label>
                  <Select
                    value={formData.deptNo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, deptNo: value })
                    }
                  >
                    <SelectTrigger id="deptNo">
                      <SelectValue placeholder="请选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {depts.map((dept) => (
                        <SelectItem key={dept.id} value={dept.no}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post">岗位</Label>
                  <Select
                    value={formData.post}
                    onValueChange={(value) =>
                      setFormData({ ...formData, post: value })
                    }
                  >
                    <SelectTrigger id="post">
                      <SelectValue placeholder="请选择岗位" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map((post) => (
                        <SelectItem key={post.id} value={post.code}>
                          {post.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
