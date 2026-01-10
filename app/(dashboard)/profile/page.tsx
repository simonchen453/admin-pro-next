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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Building, Calendar } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    display: '',
    realName: '',
    email: '',
    mobileNo: '',
    phone: '',
    address: '',
    post: '',
    profession: '',
    sex: '',
    birthday: '',
    nation: '',
    marital: '',
    description: '',
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
        setFormData({
          display: data.data.display || '',
          realName: data.data.realName || '',
          email: data.data.email || '',
          mobileNo: data.data.mobileNo || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          post: data.data.post || '',
          profession: data.data.profession || '',
          sex: data.data.sex || '',
          birthday: data.data.birthday?.split(' ')[0] || '',
          nation: data.data.nation || '',
          marital: data.data.marital || '',
          description: data.data.description || '',
        })
      }
    } catch (error) {
      toast.error('获取用户信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/user?id=${userInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('保存成功')
        setEditing(false)
        fetchUserInfo()
      } else {
        toast.error(data.message || '保存失败')
      }
    } catch (error) {
      toast.error('保存失败')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      display: userInfo?.display || '',
      realName: userInfo?.realName || '',
      email: userInfo?.email || '',
      mobileNo: userInfo?.mobileNo || '',
      phone: userInfo?.phone || '',
      address: userInfo?.address || '',
      post: userInfo?.post || '',
      profession: userInfo?.profession || '',
      sex: userInfo?.sex || '',
      birthday: userInfo?.birthday?.split(' ')[0] || '',
      nation: userInfo?.nation || '',
      marital: userInfo?.marital || '',
      description: userInfo?.description || '',
    })
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">个人资料</h1>
          <p className="text-muted-foreground mt-1">
            查看和管理您的详细个人信息
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>编辑资料</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 左侧个人信息卡片 */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-32 h-32 bg-primary/10 flex items-center justify-center text-5xl font-semibold">
                {userInfo?.display?.charAt(0)?.toUpperCase() ||
                  userInfo?.loginName?.charAt(0)?.toUpperCase() ||
                  'U'}
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {userInfo?.display || userInfo?.loginName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userInfo?.realName || '未设置真实姓名'}
                </p>
              </div>
              <Badge
                variant={userInfo?.status === 'active' ? 'default' : 'destructive'}
              >
                {userInfo?.status === 'active' ? '正常' : '已禁用'}
              </Badge>
              <div className="w-full pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">用户名</span>
                  <span className="font-medium">{userInfo?.loginName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">用户域</span>
                  <span className="font-medium">{userInfo?.userDomain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">工号</span>
                  <span className="font-medium">
                    {userInfo?.jobNo || '未设置'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右侧详细资料 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              {editing ? '编辑您的个人信息' : '您的详细个人信息'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display">显示名称 *</Label>
                    <Input
                      id="display"
                      value={formData.display}
                      onChange={(e) =>
                        setFormData({ ...formData, display: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="realName">真实姓名</Label>
                    <Input
                      id="realName"
                      value={formData.realName}
                      onChange={(e) =>
                        setFormData({ ...formData, realName: e.target.value })
                      }
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post">职位</Label>
                    <Input
                      id="post"
                      value={formData.post}
                      onChange={(e) =>
                        setFormData({ ...formData, post: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">职业</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) =>
                        setFormData({ ...formData, profession: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">生日</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) =>
                        setFormData({ ...formData, birthday: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">性别</Label>
                    <Select
                      value={formData.sex}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sex: value })
                      }
                    >
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">未设置</SelectItem>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marital">婚姻状况</Label>
                    <Select
                      value={formData.marital}
                      onValueChange={(value) =>
                        setFormData({ ...formData, marital: value })
                      }
                    >
                      <SelectTrigger id="marital">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">未设置</SelectItem>
                        <SelectItem value="0">未婚</SelectItem>
                        <SelectItem value="1">已婚</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nation">民族</Label>
                    <Input
                      id="nation"
                      value={formData.nation}
                      onChange={(e) =>
                        setFormData({ ...formData, nation: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">地址</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">个人描述</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>保存</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">显示名称</p>
                      <p className="font-medium">
                        {userInfo?.display || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">真实姓名</p>
                      <p className="font-medium">
                        {userInfo?.realName || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">邮箱</p>
                      <p className="font-medium">{userInfo?.email || '未设置'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">手机号</p>
                      <p className="font-medium">
                        {userInfo?.mobileNo || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">职位</p>
                      <p className="font-medium">{userInfo?.post || '未设置'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">职业</p>
                      <p className="font-medium">
                        {userInfo?.profession || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">生日</p>
                      <p className="font-medium">
                        {userInfo?.birthday
                          ? new Date(userInfo.birthday).toLocaleDateString(
                              'zh-CN'
                            )
                          : '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">性别</p>
                      <p className="font-medium">
                        {userInfo?.sex === 'male'
                          ? '男'
                          : userInfo?.sex === 'female'
                          ? '女'
                          : userInfo?.sex === 'other'
                          ? '其他'
                          : '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">民族</p>
                      <p className="font-medium">
                        {userInfo?.nation || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">婚姻状况</p>
                      <p className="font-medium">
                        {userInfo?.marital === '1'
                          ? '已婚'
                          : userInfo?.marital === '0'
                          ? '未婚'
                          : '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 col-span-2">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">地址</p>
                      <p className="font-medium">{userInfo?.address || '未设置'}</p>
                    </div>
                  </div>
                </div>

                {userInfo?.description && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      个人描述
                    </p>
                    <p className="text-sm">{userInfo.description}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
