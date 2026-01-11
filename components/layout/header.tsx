'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth'
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [searchFocused, setSearchFocused] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      logout()
      document.cookie = 'auth_token=; path=/; max-age=0'
      router.push('/login')
    }
  }

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.loginName) {
      return user.loginName.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="搜索菜单、功能..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full h-10 pl-10 pr-4 rounded-xl border bg-white text-sm transition-all duration-200
                ${searchFocused
                  ? 'border-violet-500 ring-4 ring-violet-500/10 shadow-md'
                  : 'border-slate-200 hover:border-violet-300'
                }
                focus:outline-none placeholder:text-slate-400`}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 bg-white border-slate-200 shadow-xl">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">通知</h3>
                <p className="text-xs text-slate-500 mt-0.5">您有 3 条未读消息</p>
              </div>
              <div className="max-h-96 overflow-auto">
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium">系统更新通知</p>
                      <p className="text-xs text-slate-500 mt-1">新版本已发布，请及时更新</p>
                      <p className="text-xs text-slate-400 mt-1">5 分钟前</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 text-center text-sm text-slate-500">
                  查看全部通知
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium text-slate-700">
                  {user?.displayName || user?.loginName}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-xl">
              <DropdownMenuLabel className="font-normal pb-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || user?.loginName}</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile" className="flex items-center gap-3 px-3 py-2">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">个人资料</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2">
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">账户设置</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
