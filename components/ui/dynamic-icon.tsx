'use client'

import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { useMemo } from 'react'

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
        const kebabName = toKebabCase(name) as keyof typeof dynamicIconImports

        // 2. Check if icon exists in the library
        if (!dynamicIconImports[kebabName]) {
            // console.warn(`Icon not found: ${name} -> ${kebabName}`)
            return null
        }

        // 3. Dynamic Import
        return dynamic(dynamicIconImports[kebabName], {
            loading: () => <IconFallback {...props} />
        })
    }, [name])

    if (!LucideIcon) return null

    return <LucideIcon {...props} />
}
