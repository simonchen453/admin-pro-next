'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Users,
  UserCog,
  Menu as MenuIcon,
  Building2,
  Briefcase,
  Globe,
  Settings,
  FileText,
  Book,
  Clock,
  Activity,
  List,
  FileCode,
  Terminal,
  Shield,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import type { Menu } from '@/types'

interface SidebarProps {
  menus: Menu[]
  collapsed: boolean
  onToggle: () => void
}

const menuIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'M_HOME': LayoutDashboard,
  'C_SYS_MGR': Settings,
  'M_USER': Users,
  'M_ROLE': UserCog,
  'M_MENU': MenuIcon,
  'M_DEPT': Building2,
  'M_POST': Briefcase,
  'M_DOMAIN': Globe,
  'M_CONFIG': Settings,
  'M_DICT': Book,
  'M_USER_SESSION': Clock,
  'M_JOB': Activity,
  'M_SERVER': Terminal,
  'M_SYS_LOG': List,
  'M_AUDIT': FileText,
  'M_CODE_GENERATOR': FileCode,
  'M_SWAGGER': Terminal,
  'M_CHANGE_PWD': Shield,
}

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
    const Icon = menuIcons[menu.name]
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
            {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
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
            'text-slate-400 hover:bg-white/5 hover:text-white relative',
            isActive && 'bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border-l-4 border-violet-500',
            !isActive && 'hover:translate-x-0.5',
            level > 0 && 'ml-4'
          )}
        >
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
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

      {/* Toggle Button */}
      <div className="relative px-4 py-3 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full h-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">收起菜单</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 relative">
        <div className="px-3 py-4 space-y-1.5">
          {menus.map((menu) => renderMenuItem(menu))}
        </div>
      </ScrollArea>

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
