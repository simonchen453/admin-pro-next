'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import type { Menu } from '@/types'

interface SidebarProps {
  menus: Menu[]
  collapsed: boolean
  onToggle: () => void
}

// 动态图标映射表


export function Sidebar({ menus, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev)
      if (next.has(menuName)) {
        next.delete(menuName)
      } else {
        next.add(menuName)
      }
      return next
    })
  }

  const renderMenuItem = (menu: Menu, level = 0) => {
    // 使用 DynamicIcon 组件根据数据库字符串加载图标
    // const IconComponent = menu.icon ? iconMap[menu.icon] : null
    const hasChildren = menu.children && menu.children.length > 0
    const isActive = pathname === menu.url
    const isExpanded = expandedMenus.has(menu.name)

    if (hasChildren) {
      return (
        <div key={menu.id}>
          <button
            onClick={() => toggleMenu(menu.name)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              'text-slate-400 hover:bg-white/5 hover:text-white',
              isExpanded && 'bg-white/5 text-white',
              level > 0 && 'ml-4'
            )}
          >
            {menu.icon && <DynamicIcon name={menu.icon} className="w-5 h-5 flex-shrink-0" />}
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">{menu.display}</span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>
          {isExpanded && !collapsed && (
            <div className="mt-1 space-y-1">
              {menu.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    if (!menu.url) return null

    return (
      <Link key={menu.id} href={menu.url}>
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium',
            'relative overflow-hidden group',
            isActive
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white',
            level > 0 && 'ml-4'
          )}
        >
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-100 -z-10" />
          )}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-100 -z-10" />
          )}
          {menu.icon && <DynamicIcon name={menu.icon} className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && <span>{menu.display}</span>}
        </div>
      </Link>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 transition-all duration-300 relative',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Logo Area */}
      <div className="relative flex items-center justify-between h-20 px-5 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Pro</h1>
              <p className="text-xs text-slate-500">企业管理系统</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 relative">
        <div className="px-3 py-4 space-y-1.5">
          {menus.map((menu) => renderMenuItem(menu))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* Toggle Button - Redesigned */}
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-center h-10 rounded-xl transition-all duration-300",
            "text-slate-400 hover:text-white hover:bg-white/5 group",
            collapsed ? "px-0" : "px-4"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 transition-transform group-hover:scale-110" />
          ) : (
            <>
              <div className="flex-1 flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium truncate">收起侧边栏</span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Bottom Status */}
      <div className="relative px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
          {!collapsed && (
            <div className="flex-1">
              <p className="text-xs text-slate-400">系统运行正常</p>
              <p className="text-[10px] text-slate-600 mt-0.5">All systems operational</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
