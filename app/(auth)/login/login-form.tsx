'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth'
import {
  Loader2,
  AlertCircle,
  LayoutDashboard,
  Globe,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/home'

  const [formData, setFormData] = useState({
    userDomain: 'system',
    loginName: '',
    password: '',
    captchaId: '',
    captchaText: '',
  })
  const [captcha, setCaptcha] = useState<{ id: string; svg: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth, setMenus, setPermissions } = useAuthStore()

  const fetchCaptcha = async () => {
    try {
      const res = await fetch('/api/auth/captcha')
      const data = await res.json()
      if (data.success) {
        setCaptcha(data.data)
        setFormData((prev) => ({ ...prev, captchaId: data.data.id, captchaText: '' }))
      }
    } catch (err) {
      console.error('Failed to fetch captcha:', err)
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 模拟一点网络延迟，让交互更有质感
      await new Promise(resolve => setTimeout(resolve, 500))

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setAuth(data.data.user, data.data.token)
        setMenus(data.data.menus)
        setPermissions(data.data.permissions)
        router.push(redirect)
      } else {
        setError(data.message || '登录失败')
        fetchCaptcha()
      }
    } catch (err) {
      setError('网络连接错误，请稍后重试')
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex overflow-hidden">
      {/* 左侧品牌区域 - 动态高级风格 */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-slate-900">

        {/* 动态背景 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 animate-gradient-x"></div>
          <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
          <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
        </div>

        {/* 浮动装饰元素 - 已移除 */}

        {/* 内容区域 */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Admin Pro</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight max-w-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-300">
            构建现代化的<br />企业级管理平台
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            提供安全、高效、灵活的数字化解决方案，助力企业降本增效，实现智能化转型。
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-slate-500 text-sm font-medium">
          <span className="hover:text-slate-300 transition-colors cursor-pointer">© 2024 Admin Pro Inc.</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
        {/* 顶部装饰 - 已移除 */}

        <div className="w-full max-w-[420px] space-y-8 animate-in mt-10 lg:mt-0 slide-in-from-bottom-5 fade-in duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">欢迎回来</h2>
            <p className="text-slate-500">请输入您的凭证以访问系统</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-5">
              {/* Login Domain Select */}
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-sm font-medium text-slate-700 ml-1">登录环境</Label>
                <Select
                  value={formData.userDomain}
                  onValueChange={(value) => setFormData({ ...formData, userDomain: value })}
                >
                  <SelectTrigger id="domain" className="h-12 border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">系统管理后台</SelectItem>
                    <SelectItem value="intranet">内部办公网</SelectItem>
                    <SelectItem value="internet">互联网接入</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700 ml-1">用户名</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    id="username"
                    placeholder="请输入用户名"
                    value={formData.loginName}
                    onChange={(e) => setFormData({ ...formData, loginName: e.target.value })}
                    className="h-12 pl-11 border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">密码</Label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">忘记密码？</a>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 pl-11 pr-11 border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {captcha && (
                <div className="space-y-2">
                  <Label htmlFor="captcha" className="text-sm font-medium text-slate-700 ml-1">验证码</Label>
                  <div className="grid grid-cols-[1fr_130px] gap-4 h-12">
                    <div className="relative group h-full">
                      <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <Input
                        id="captcha"
                        placeholder="请输入验证码"
                        value={formData.captchaText}
                        onChange={(e) => setFormData({ ...formData, captchaText: e.target.value })}
                        className="h-full pl-11 border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-medium"
                        required
                      />
                    </div>
                    <div
                      className="h-full rounded-lg border border-slate-200 bg-white overflow-hidden cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-center p-1 group"
                      onClick={fetchCaptcha}
                      title="看不清？点击刷新"
                    >
                      <div
                        className="transform group-hover:scale-105 transition-transform"
                        dangerouslySetInnerHTML={{ __html: captcha.svg }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-base font-medium shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  正在登录...
                </>
              ) : (
                '登 录'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
