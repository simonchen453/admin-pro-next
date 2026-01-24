'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import type { Menu } from '@/types'

interface SidebarProps {
  menus: Menu[]
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ menus, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  /* eslint-disable react-hooks/exhaustive-deps */
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())

  // Auto-expand menu based on current path
  useEffect(() => {
    // Helper to find parent of active menu
    const findParentOfActive = (items: Menu[], parentName: string | null = null): string | null => {
      for (const item of items) {
        if (item.url === pathname) {
          return parentName
        }
        if (item.children) {
          const found = findParentOfActive(item.children, item.name)
          if (found) return found
        }
      }
      return null
    }

    const parentName = findParentOfActive(menus)
    if (parentName) {
      setExpandedMenus((prev) => {
        const next = new Set(prev)
        next.add(parentName)
        return next
      })
    }
  }, [pathname, menus])

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
    const hasChildren = menu.children && menu.children.length > 0
    const isActive = pathname === menu.url
    const isExpanded = expandedMenus.has(menu.name)

    if (hasChildren) {
      return (
        <div key={menu.id}>
          <button
            onClick={() => toggleMenu(menu.name)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
              'text-slate-400 hover:text-white hover:bg-white/5',
              isExpanded && 'text-white',
              level > 0 && 'ml-4'
            )}
          >
            {menu.icon && <DynamicIcon name={menu.icon} className="w-4 h-4" />}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{menu.display}</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>
          {isExpanded && !collapsed && (
            <div className="mt-1 space-y-0.5">
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
            'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
            isActive
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-white/5',
            level > 0 && 'ml-4'
          )}
        >
          {menu.icon && <DynamicIcon name={menu.icon} className="w-4 h-4" />}
          {!collapsed && <span>{menu.display}</span>}
        </div>
      </Link>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-[#0F172A] border-r border-slate-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-sm whitespace-nowrap">
              Admin Pro
            </span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-1">
          {menus.map((menu) => renderMenuItem(menu))}
        </div>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onToggle}
          className="w-full h-8 flex items-center justify-center rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

