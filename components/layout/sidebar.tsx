'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all-300',
              'hover:bg-accent hover:text-accent-foreground',
              isExpanded && 'bg-accent/50',
              level > 0 && 'ml-4'
            )}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm">{menu.display}</span>
                <ChevronRight
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isExpanded && 'rotate-90'
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
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-all-300 text-sm',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
            level > 0 && 'ml-4'
          )}
        >
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && <span>{menu.display}</span>}
        </div>
      </Link>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin-Pro
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 菜单 */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menus.map((menu) => renderMenuItem(menu))}
        </div>
      </ScrollArea>

      {/* 底部 */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {!collapsed && <span>系统运行正常</span>}
        </div>
      </div>
    </div>
  )
}
