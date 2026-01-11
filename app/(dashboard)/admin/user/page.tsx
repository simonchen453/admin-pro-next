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
import { Plus, Pencil, Trash2, KeyRound, User, Mail, Building2 } from 'lucide-react'
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
    {
      accessorKey: 'loginName',
      header: '用户名',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs border border-indigo-100">
            {row.original.realName?.[0] || row.original.loginName?.[0] || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{row.original.loginName}</span>
            <span className="text-[10px] text-slate-400">{row.original.userDomain}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'realName',
      header: '姓名'
    },
    {
      accessorKey: 'email',
      header: '邮箱',
      cell: ({ row }) => row.original.email ? (
        <div className="flex items-center text-slate-500 text-xs">
          <Mail className="w-3 h-3 mr-1.5 opacity-70" />
          {row.original.email}
        </div>
      ) : <span className="text-slate-300 text-xs">-</span>
    },
    {
      accessorKey: 'deptNo',
      header: '部门',
      cell: ({ row }) => row.original.deptNo ? (
        <div className="flex items-center text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
          <Building2 className="w-3 h-3 mr-1.5 text-slate-400" />
          <span className="text-xs">{depts.find(d => d.no === row.original.deptNo)?.name || row.original.deptNo}</span>
        </div>
      ) : <span className="text-slate-300">-</span>
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
            onClick={() => handlePassword(row.original)}
            className="h-7 w-7 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
          >
            <KeyRound className="w-3.5 h-3.5" />
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
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-dashed border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">用户管理</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-lg pl-12">
            管理系统用户的账号、权限及状态，支持批量操作与安全设置。
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <Button
            onClick={handleCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增用户
          </Button>
        </div>
      </div>

      {/* 数据表格区域 */}
      <div className="bg-white/50 backdrop-blur-sm rounded-none sm:rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">正在加载用户数据...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            searchKey="loginName"
            searchPlaceholder="搜索用户名 / 姓名..."
          />
        )}
      </div>

      {/* 创建/编辑对话框 - 优化版 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                {dialogMode === 'password' ? <KeyRound className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {dialogMode === 'create' ? '新增用户' : dialogMode === 'edit' ? '编辑用户' : '修改密码'}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  {dialogMode === 'password' ? '重置用户的登录密码，请确保密码复杂度' : '配置用户的基本信息及角色权限'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            {dialogMode === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">新密码 <span className="text-rose-500">*</span></Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="mr-2">取消</Button>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">确认修改</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="userDomain" className="text-slate-700 font-medium">用户域 <span className="text-rose-500">*</span></Label>
                    <Select
                      value={formData.userDomain}
                      onValueChange={(value) =>
                        setFormData({ ...formData, userDomain: value })
                      }
                      disabled={dialogMode === 'edit'}
                    >
                      <SelectTrigger id="userDomain" className="border-slate-200">
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
                    <Label htmlFor="loginName" className="text-slate-700 font-medium">用户名 <span className="text-rose-500">*</span></Label>
                    <Input
                      id="loginName"
                      value={formData.loginName}
                      onChange={(e) =>
                        setFormData({ ...formData, loginName: e.target.value })
                      }
                      disabled={dialogMode === 'edit'}
                      required
                      className="border-slate-200"
                      placeholder="请输入登录账号"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="realName" className="text-slate-700 font-medium">姓名 <span className="text-rose-500">*</span></Label>
                  <Input
                    id="realName"
                    value={formData.realName}
                    onChange={(e) =>
                      setFormData({ ...formData, realName: e.target.value })
                    }
                    required
                    className="border-slate-200"
                    placeholder="请输入真实姓名"
                  />
                </div>

                {dialogMode === 'create' && (
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-700 font-medium">初始密码 <span className="text-rose-500">*</span></Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                      placeholder="设置初始登录密码"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border-slate-200"
                      placeholder="example@admin.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNo" className="text-slate-700 font-medium">手机号</Label>
                    <Input
                      id="mobileNo"
                      value={formData.mobileNo}
                      onChange={(e) =>
                        setFormData({ ...formData, mobileNo: e.target.value })
                      }
                      className="border-slate-200"
                      placeholder="13800000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="deptNo" className="text-slate-700 font-medium">部门</Label>
                    <Select
                      value={formData.deptNo}
                      onValueChange={(value) =>
                        setFormData({ ...formData, deptNo: value })
                      }
                    >
                      <SelectTrigger id="deptNo" className="border-slate-200">
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
                    <Label htmlFor="post" className="text-slate-700 font-medium">岗位</Label>
                    <Select
                      value={formData.post}
                      onValueChange={(value) =>
                        setFormData({ ...formData, post: value })
                      }
                    >
                      <SelectTrigger id="post" className="border-slate-200">
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

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="status" className="text-base font-medium text-slate-900">启用账号</Label>
                    <p className="text-xs text-slate-500">禁用后该用户将无法登录系统</p>
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
                    {dialogMode === 'create' ? '创建用户' : '保存更改'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
