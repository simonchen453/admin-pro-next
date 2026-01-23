'use client'

import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-6xl font-bold text-slate-900 mb-2">403</h1>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-4">权限不足</h2>
                    <p className="text-slate-600 mb-8">
                        抱歉，您没有访问此页面的权限。如需帮助，请联系系统管理员。
                    </p>
                </div>

                <Link href="/home">
                    <Button className="w-full sm:w-auto">
                        <Home className="w-4 h-4 mr-2" />
                        返回首页
                    </Button>
                </Link>
            </div>
        </div>
    )
}
