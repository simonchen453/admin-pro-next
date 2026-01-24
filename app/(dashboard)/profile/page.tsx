'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  CreditCard,
  Globe,
  Camera,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  // Form State
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

  // Initialize Data
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
        syncFormData(data.data)
      }
    } catch (error) {
      toast.error('获取用户信息失败')
    } finally {
      setLoading(false)
    }
  }

  const syncFormData = (data: any) => {
    setFormData({
      display: data.display || '',
      realName: data.realName || '',
      email: data.email || '',
      mobileNo: data.mobileNo || '',
      phone: data.phone || '',
      address: data.address || '',
      post: data.post || '',
      profession: data.profession || '',
      sex: data.sex || '',
      birthday: data.birthday?.split(' ')[0] || '',
      nation: data.nation || '',
      marital: data.marital || '',
      description: data.description || '',
    })
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
    syncFormData(userInfo)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">加载个人资料...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 -m-6 p-6">
      {/* 1. Header Banner */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-900 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* 2. Left Column: Identity Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-4">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarImage src={userInfo?.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 text-4xl font-bold">
                      {userInfo?.display?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white/80" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">{userInfo?.display}</h2>
                <p className="text-slate-500 font-medium mb-4">
                  {userInfo?.post || '职位未设置'} · {userInfo?.userDomain}
                </p>

                <div className="flex gap-2 mb-6">
                  <Badge variant={userInfo?.status === 'active' ? 'default' : 'destructive'} className="px-3 py-1 rounded-full">
                    {userInfo?.status === 'active' ? '● 状态正常' : '○ 已禁用'}
                  </Badge>
                  {userInfo?.isSystem && (
                    <Badge variant="outline" className="px-3 py-1 rounded-full border-blue-200 text-blue-700 bg-blue-50">
                      系统管理员
                    </Badge>
                  )}
                </div>

                <div className="w-full border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Building className="w-4 h-4" /> 所属部门
                    </span>
                    <span className="font-medium text-slate-900">{userInfo?.deptNo || '未分配'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> 工号
                    </span>
                    <span className="font-medium text-slate-900">{userInfo?.jobNo || '--'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 加入时间
                    </span>
                    <span className="font-medium text-slate-900">2024-01-01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" /> 联系方式
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">电子邮箱</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{userInfo?.email || '未绑定'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">手机号码</p>
                    <p className="text-sm font-medium text-slate-900">{userInfo?.mobileNo || '未绑定'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Right Column: Details & Edit */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">基本信息</h3>
                  <p className="text-slate-500 text-sm mt-1">管理您的个人档案信息，这些信息将对其他用户可见</p>
                </div>
                <div>
                  {!editing ? (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      编辑资料
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="ghost"
                        className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <X className="w-4 h-4 mr-2" />
                        取消
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <Label>显示名称</Label>
                    <Input value={formData.display} onChange={e => setFormData({ ...formData, display: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>真实姓名</Label>
                    <Input value={formData.realName} onChange={e => setFormData({ ...formData, realName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>联系电话</Label>
                    <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>职业</Label>
                    <Input value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>性别</Label>
                    <Select value={formData.sex} onValueChange={v => setFormData({ ...formData, sex: v })}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>婚姻状况</Label>
                    <Select value={formData.marital} onValueChange={v => setFormData({ ...formData, marital: v })}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">未婚</SelectItem>
                        <SelectItem value="1">已婚</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>生日</Label>
                    <Input type="date" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>民族</Label>
                    <Input value={formData.nation} onChange={e => setFormData({ ...formData, nation: e.target.value })} />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>居住地址</Label>
                    <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>个人简介</Label>
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="介绍一下你自己..."
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="group">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" /> 真实姓名
                    </h4>
                    <p className="text-slate-900 font-medium">{userInfo?.realName || '未设置'}</p>
                  </div>
                  <div className="group">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> 职业
                    </h4>
                    <p className="text-slate-900 font-medium">{userInfo?.profession || '未设置'}</p>
                  </div>
                  <div className="group">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" /> 性别
                    </h4>
                    <p className="text-slate-900 font-medium">
                      {userInfo?.sex === 'male' ? '男' : userInfo?.sex === 'female' ? '女' : '未设置'}
                    </p>
                  </div>
                  <div className="group">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" /> 婚姻状况
                    </h4>
                    <p className="text-slate-900 font-medium">
                      {userInfo?.marital === '1' ? '已婚' : userInfo?.marital === '0' ? '未婚' : '未设置'}
                    </p>
                  </div>
                  <div className="group">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 生日
                    </h4>
                    <p className="text-slate-900 font-medium">{userInfo?.birthday ? userInfo.birthday.split(' ')[0] : '未设置'}</p>
                  </div>
                  <div className="group">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> 民族
                    </h4>
                    <p className="text-slate-900 font-medium">{userInfo?.nation || '未设置'}</p>
                  </div>
                  <div className="group col-span-1 md:col-span-2">
                    <h4 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> 居住地址
                    </h4>
                    <p className="text-slate-900 font-medium">{userInfo?.address || '未设置'}</p>
                  </div>
                  <div className="group col-span-1 md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-sm font-medium text-slate-500 mb-2">个人简介</h4>
                    <p className="text-slate-700 leading-relaxed">
                      {userInfo?.description || '这个人很懒，什么都没有写...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
