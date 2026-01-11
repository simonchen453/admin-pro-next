'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

export function Breadcrumb() {
    const pathname = usePathname()

    // 路径映射表
    const pathMap: Record<string, string> = {
        '': '首页',
        'home': '首页',
        'admin': '系统管理',
        'user': '用户管理',
        'role': '角色管理',
        'menu': '菜单管理',
        'dept': '部门管理',
        'post': '岗位管理',
        'domain': '租户管理',
        'config': '参数设置',
        'dict': '字典管理',
        'job': '定时任务',
        'server': '服务监控',
        'syslog': '系统日志',
        'audit': '审计日志',
        'session': '会话管理',
        'profile': '个人资料',
        'settings': '账户设置',
    }

    if (pathname === '/') return null

    const paths = pathname.split('/').filter(Boolean)

    return (
        <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-slate-100">
            <Link
                href="/home"
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>首页</span>
            </Link>

            {paths.map((path, index) => {
                const href = '/' + paths.slice(0, index + 1).join('/')
                const isLast = index === paths.length - 1
                const label = pathMap[path] || path

                return (
                    <Fragment key={path}>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        {isLast ? (
                            <span className="text-sm font-medium text-slate-900">{label}</span>
                        ) : (
                            <Link
                                href={href}
                                className="text-sm text-slate-600 hover:text-violet-600 transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </Fragment>
                )
            })}
        </div>
    )
}
