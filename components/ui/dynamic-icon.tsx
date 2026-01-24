'use client'

import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { useMemo } from 'react'
import {
    // Core Menu Icons
    LayoutDashboard,
    Settings,
    Users,
    UserCog,
    Menu as MenuIcon, // Rename to avoid conflict with generic terms
    List,
    Building,
    Building2,
    Briefcase,
    Globe,
    Book,
    Activity,
    FileText,
    Terminal,

    // App UI Icons
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Loader2,
    TrendingUp,
    TrendingDown,
    Plus,
    Search,
    Bell,
    LogOut,
    User,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Zap,
    BarChart3
} from 'lucide-react'

// Map of statically imported icons
const staticIcons: Record<string, React.ComponentType<LucideProps>> = {
    // Common mappings
    'layout-dashboard': LayoutDashboard,
    'settings': Settings,
    'users': Users,
    'user-cog': UserCog,
    'menu': MenuIcon,
    'list': List,
    'building': Building,
    'building-2': Building2,
    'briefcase': Briefcase,
    'globe': Globe,
    'book': Book,
    'activity': Activity,
    'file-text': FileText,
    'terminal': Terminal,

    // UI Helpers
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'chevron-down': ChevronDown,
    'loader-2': Loader2,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'plus': Plus,
    'search': Search,
    'bell': Bell,
    'log-out': LogOut,
    'user': User,
    'shield': Shield,
    'lock': Lock,
    'eye': Eye,
    'eye-off': EyeOff,
    'zap': Zap,
    'bar-chart-3': BarChart3
}

interface DynamicIconProps extends LucideProps {
    name: string
}

// Convert PascalCase to kebab-case
const toKebabCase = (str: string) => {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

// Fallback icon component
const IconFallback = (props: LucideProps) => {
    // Simple square placeholder
    return (
        <div
            style={{ width: props.size || 24, height: props.size || 24 }}
            className={props.className}
        />
    )
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
    const LucideIcon = useMemo(() => {
        // 1. Convert DB name (PascalCase) to Lucide key (kebab-case)
        const kebabName = toKebabCase(name)

        // 2. Check Static Map FIRST (Instant render, no flicker)
        if (staticIcons[kebabName]) {
            return staticIcons[kebabName]
        }

        // 3. Check if icon exists in the dynamic library
        const dynamicName = kebabName as keyof typeof dynamicIconImports
        if (!dynamicIconImports[dynamicName]) {
            // console.warn(`Icon not found: ${name} -> ${kebabName}`)
            return null
        }

        // 4. Fallback to Dynamic Import
        return dynamic(dynamicIconImports[dynamicName], {
            loading: () => <IconFallback {...props} />
        })
    }, [name])

    if (!LucideIcon) return null

    return <LucideIcon {...props} />
}
