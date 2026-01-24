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
import { cn } from '@/lib/utils'

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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="flex h-16 items-center gap-4 px-6">

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
              searchFocused ? "text-blue-500" : "text-slate-400"
            )} />
            <input
              type="search"
              placeholder="搜索..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full h-9 pl-9 pr-4 rounded-md border text-sm transition-all outline-none",
                searchFocused
                  ? "border-blue-500 ring-2 ring-blue-500/10"
                  : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
              )}
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
                className="relative h-9 w-9 rounded-md hover:bg-slate-100 text-slate-500"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg border-slate-200">
              <div className="px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">通知</h3>
              </div>
              <div className="max-h-[300px] overflow-auto py-1">
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <span className="relative flex h-2 w-2 mt-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900 font-medium leading-none">系统更新通知</p>
                      <p className="text-xs text-slate-500">新版本已发布，请及时更新</p>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 px-2 rounded-md hover:bg-slate-100 data-[state=open]:bg-slate-100"
              >
                <Avatar className="w-6 h-6 border border-slate-200">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium text-slate-700">
                  {user?.displayName || user?.loginName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-lg border-slate-200 p-1">
              <DropdownMenuLabel className="px-2 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">{user?.displayName}</p>
                  <p className="text-xs leading-none text-slate-500 truncate">{user?.email || user?.loginName}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-slate-50">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">个人资料</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-slate-50">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">账户设置</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-red-50 text-red-600 focus:text-red-700 focus:bg-red-50"
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

