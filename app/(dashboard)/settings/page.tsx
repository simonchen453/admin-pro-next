'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { User, Key, Bell, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false)
  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    display: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/userinfo')
      const data = await res.json()
      if (data.success) {
        setUserInfo(data.data)
        setProfileForm({
          display: data.data.display || '',
          email: data.data.email || '',
          phone: data.data.mobileNo || '',
        })
      }
    } catch (error) {
      toast.error('获取用户信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }

    if (pwdForm.newPassword.length < 8) {
      toast.error('密码长度不能少于8位')
      return
    }

    try {
      const res = await fetch('/api/admin/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: pwdForm.oldPassword,
          newPassword: pwdForm.newPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('密码修改成功，请重新登录')
        setPwdDialogOpen(false)
        setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
      } else {
        toast.error(data.message || '密码修改失败')
      }
    } catch (error) {
      toast.error('密码修改失败')
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/admin/user?id=${userInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('个人信息更新成功')
        setProfileDialogOpen(false)
        fetchUserInfo()
      } else {
        toast.error(data.message || '更新失败')
      }
    } catch (error) {
      toast.error('更新失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">个人中心</h1>
        <p className="text-muted-foreground mt-1">
          管理您的个人信息和系统设置
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            通知设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>个人资料</CardTitle>
              <CardDescription>
                管理您的个人信息和公开资料
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 bg-primary/10 flex items-center justify-center text-3xl font-semibold">
                  {userInfo?.display?.charAt(0)?.toUpperCase() ||
                    userInfo?.loginName?.charAt(0)?.toUpperCase() ||
                    'U'}
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {userInfo?.display || userInfo?.loginName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userInfo?.realName || '未设置真实姓名'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    编辑资料
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">用户名</Label>
                  <p className="font-medium">{userInfo?.loginName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">用户域</Label>
                  <p className="font-medium">{userInfo?.userDomain}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">真实姓名</Label>
                  <p className="font-medium">
                    {userInfo?.realName || '未设置'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">邮箱</Label>
                  <p className="font-medium">{userInfo?.email || '未设置'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">手机号</Label>
                  <p className="font-medium">{userInfo?.mobileNo || '未设置'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">部门</Label>
                  <p className="font-medium">{userInfo?.deptNo || '未分配'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>账户信息</CardTitle>
              <CardDescription>您的账户详细信息和状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">用户ID</Label>
                  <p className="font-medium text-sm">{userInfo?.userId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">账户状态</Label>
                  <p
                    className={`font-medium ${
                      userInfo?.status === 'active'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {userInfo?.status === 'active' ? '正常' : '已禁用'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">最后登录时间</Label>
                  <p className="font-medium">
                    {userInfo?.latestLoginTime
                      ? new Date(userInfo.latestLoginTime).toLocaleString(
                          'zh-CN'
                        )
                      : '首次登录'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">最后修改密码时间</Label>
                  <p className="font-medium">
                    {userInfo?.latestChangePwdTime
                      ? new Date(userInfo.latestChangePwdTime).toLocaleString(
                          'zh-CN'
                        )
                      : '未修改过'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>修改密码</CardTitle>
              <CardDescription>
                定期修改密码可以提高账户安全性
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>密码规则：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>长度至少 8 位，最多 20 位</li>
                    <li>必须包含大写字母</li>
                    <li>必须包含小写字母</li>
                    <li>必须包含数字</li>
                    <li>必须包含特殊字符 (@$!%*?&)</li>
                  </ul>
                </div>
                <Button onClick={() => setPwdDialogOpen(true)}>
                  修改密码
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>登录信息</CardTitle>
              <CardDescription>您最近的登录活动</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最后登录时间</span>
                  <span className="font-medium">
                    {userInfo?.latestLoginTime
                      ? new Date(userInfo.latestLoginTime).toLocaleString(
                          'zh-CN'
                        )
                      : '首次登录'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">密码强度</span>
                  <span className="font-medium">强</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>通知偏好</CardTitle>
              <CardDescription>
                管理您希望接收的通知类型
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                通知设置功能开发中...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 修改密码对话框 */}
      <Dialog open={pwdDialogOpen} onOpenChange={setPwdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>
              请输入您的旧密码和新密码
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">旧密码 *</Label>
              <Input
                id="oldPassword"
                type="password"
                value={pwdForm.oldPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, oldPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码 *</Label>
              <Input
                id="newPassword"
                type="password"
                value={pwdForm.newPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, newPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={pwdForm.confirmPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">确认修改</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 编辑资料对话框 */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑个人资料</DialogTitle>
            <DialogDescription>更新您的个人信息</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display">显示名称 *</Label>
              <Input
                id="display"
                value={profileForm.display}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, display: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
