'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth'
import { Loader2, AlertCircle, Shield, User, Lock, Globe } from 'lucide-react'

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
  const { setAuth } = useAuthStore()

  // 获取验证码
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        // 保存认证信息
        setAuth(data.data.user, data.data.token)

        // 设置 Cookie
        document.cookie = `auth_token=${data.data.token}; path=/; max-age=604800`

        // 跳转
        router.push(redirect)
      } else {
        setError(data.message || '登录失败')
        fetchCaptcha()
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin-Pro Next
          </h1>
          <p className="text-muted-foreground mt-2">企业级管理系统</p>
        </div>

        {/* 登录表单 */}
        <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
            <CardDescription>请输入您的账号信息进行登录</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户域选择 */}
              <div className="space-y-2">
                <Label htmlFor="userDomain" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  用户域
                </Label>
                <Select
                  value={formData.userDomain}
                  onValueChange={(value) => setFormData({ ...formData, userDomain: value })}
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

              {/* 用户名 */}
              <div className="space-y-2">
                <Label htmlFor="loginName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  用户名
                </Label>
                <Input
                  id="loginName"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.loginName}
                  onChange={(e) => setFormData({ ...formData, loginName: e.target.value })}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {/* 验证码 */}
              {captcha && (
                <div className="space-y-2">
                  <Label htmlFor="captcha">验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="captcha"
                      type="text"
                      placeholder="计算结果"
                      value={formData.captchaText}
                      onChange={(e) => setFormData({ ...formData, captchaText: e.target.value })}
                      required
                      disabled={loading}
                      className="h-11 flex-1"
                    />
                    <div
                      className="h-11 px-4 rounded-md border bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={fetchCaptcha}
                      dangerouslySetInnerHTML={{ __html: captcha.svg }}
                    />
                  </div>
                </div>
              )}

              {/* 错误提示 */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 登录按钮 */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </Button>

              {/* 默认账号提示 */}
              <div className="text-center text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <p className="font-medium mb-1">默认测试账号</p>
                <p>用户名: admin / 密码: admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
