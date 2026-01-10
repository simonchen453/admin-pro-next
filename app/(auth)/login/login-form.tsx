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
import { Loader2, AlertCircle, Sparkles, User, Lock, Globe, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { setAuth } = useAuthStore()

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
      await new Promise(resolve => setTimeout(resolve, 800))

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setAuth(data.data.user, data.data.token)
        document.cookie = `auth_token=${data.data.token}; path=/; max-age=604800`
        router.push(redirect)
      } else {
        setError(data.message || '登录失败')
        fetchCaptcha()
      }
    } catch (err) {
      setError('网络连接错误')
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-slate-50">

      {/* Left Panel - Brand & Atmosphere */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Soft Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '-3s' }} />

        {/* Top Branding */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Pro</h1>
              <p className="text-xs text-slate-400">企业管理系统</p>
            </div>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white leading-tight">
              优雅高效的
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                企业管理平台
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              为现代企业打造的智能化管理解决方案
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-slate-300">
              ✨ 安全可靠
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-slate-300">
              🚀 高效便捷
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-slate-300">
              💎 精致优雅
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10">
          <p className="text-sm text-slate-500 italic">
            "简约而不简单，专业而不失温度"
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form (Warm Light Theme) */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-[150px]" />

        <div className="w-full max-w-md relative z-10">

          {/* Form Header */}
          <div className="space-y-3 mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-slate-900">欢迎回来</h3>
            <p className="text-slate-600">请登录您的账户以继续</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Domain Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">登录环境</Label>
              <Select
                value={formData.userDomain}
                onValueChange={(value) => setFormData({ ...formData, userDomain: value })}
              >
                <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 hover:border-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-violet-500" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl">
                  <SelectItem value="system">系统管理后台</SelectItem>
                  <SelectItem value="intranet">内部办公网</SelectItem>
                  <SelectItem value="internet">互联网接入</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">用户名</Label>
              <div className={cn(
                "relative group transition-all duration-200 rounded-xl overflow-hidden border bg-white shadow-sm",
                focusedField === 'username'
                  ? "border-violet-500 ring-4 ring-violet-500/10"
                  : "border-slate-200 hover:border-violet-300"
              )}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-violet-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.loginName}
                  onChange={(e) => setFormData({ ...formData, loginName: e.target.value })}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 pl-12 bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">密码</Label>
              <div className={cn(
                "relative group transition-all duration-200 rounded-xl overflow-hidden border bg-white shadow-sm",
                focusedField === 'password'
                  ? "border-violet-500 ring-4 ring-violet-500/10"
                  : "border-slate-200 hover:border-violet-300"
              )}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-violet-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 pl-12 bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0"
                  required
                />
              </div>
            </div>

            {/* Captcha */}
            {captcha && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">验证码</Label>
                <div className="grid grid-cols-[1fr_140px] gap-3">
                  <div className={cn(
                    "relative group transition-all duration-200 rounded-xl overflow-hidden border bg-white shadow-sm",
                    focusedField === 'captcha'
                      ? "border-violet-500 ring-4 ring-violet-500/10"
                      : "border-slate-200 hover:border-violet-300"
                  )}>
                    <Input
                      type="text"
                      placeholder="请输入计算结果"
                      value={formData.captchaText}
                      onChange={(e) => setFormData({ ...formData, captchaText: e.target.value })}
                      onFocus={() => setFocusedField('captcha')}
                      onBlur={() => setFocusedField(null)}
                      className="h-12 bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 text-center"
                      required
                    />
                  </div>
                  <div
                    className="h-12 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-all border border-slate-200 bg-white shadow-sm hover:border-violet-300 hover:shadow-md flex items-center justify-center"
                    onClick={fetchCaptcha}
                    dangerouslySetInnerHTML={{ __html: captcha.svg }}
                    title="点击刷新验证码"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center animate-in fade-in">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="relative w-full h-14 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 hover:from-violet-500 hover:via-violet-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  立即登录 <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>

          </form>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              © 2024 Admin Pro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
