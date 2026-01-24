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
import { Loader2, AlertCircle, Building2, LayoutDashboard, Globe } from 'lucide-react'

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
      await new Promise(resolve => setTimeout(resolve, 300))

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
    <div className="min-h-screen w-full flex">
      {/* 左侧品牌区域 - 极简深色风格 */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative flex-col justify-between p-16 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Admin Pro</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight max-w-md mb-6">
            构建现代化的<br />企业级管理平台
          </h1>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            提供安全、高效、灵活的数字化解决方案，助力企业降本增效，实现智能化转型。
          </p>
        </div>

        {/* 底部装饰 - 抽象线条 */}
        <div className="relative z-10 flex gap-8 text-slate-500 text-sm">
          <span>© 2024 Admin Pro Inc.</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>

        {/* 背景纹理 */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}>
        </div>
        {/* 并移除那些过分花哨的光球动画 */}
      </div>

      {/* 右侧表单区域 - 干净的留白风格 */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">欢迎回来</h2>
            <p className="text-sm text-slate-500">请输入您的凭证以访问系统</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              {/* Login Domain Select */}
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-sm font-medium text-slate-700">登录环境</Label>
                <Select
                  value={formData.userDomain}
                  onValueChange={(value) => setFormData({ ...formData, userDomain: value })}
                >
                  <SelectTrigger id="domain" className="h-11 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
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
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">用户名</Label>
                <Input
                  id="username"
                  placeholder="name@example.com"
                  value={formData.loginName}
                  onChange={(e) => setFormData({ ...formData, loginName: e.target.value })}
                  className="h-11 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">密码</Label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">忘记密码？</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {captcha && (
                <div className="space-y-2">
                  <Label htmlFor="captcha" className="text-sm font-medium text-slate-700">验证码</Label>
                  <div className="grid grid-cols-[1fr_120px] gap-3 h-11">
                    <Input
                      id="captcha"
                      placeholder="计算结果"
                      value={formData.captchaText}
                      onChange={(e) => setFormData({ ...formData, captchaText: e.target.value })}
                      className="h-full border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 text-center font-medium"
                      required
                    />
                    <div
                      className="h-full rounded-md border border-slate-200 bg-slate-50 overflow-hidden cursor-pointer hover:border-slate-300 transition-colors flex items-center justify-center p-1"
                      onClick={fetchCaptcha}
                      dangerouslySetInnerHTML={{ __html: captcha.svg }}
                      title="看不清？点击刷新"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
