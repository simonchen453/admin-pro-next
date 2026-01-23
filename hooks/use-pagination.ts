'use client'

import { useState, useCallback, useMemo } from 'react'

export interface PaginationState {
    page: number
    pageSize: number
    total: number
}

export interface UsePaginationOptions {
    /** 初始页码，默认 1 */
    initialPage?: number
    /** 初始每页数量，默认 10 */
    initialPageSize?: number
    /** 可选的每页数量选项 */
    pageSizeOptions?: number[]
}

export interface UsePaginationReturn extends PaginationState {
    /** 总页数 */
    totalPages: number
    /** 是否有上一页 */
    hasPrevPage: boolean
    /** 是否有下一页 */
    hasNextPage: boolean
    /** 当前页显示的记录范围 */
    range: { start: number; end: number }
    /** 每页数量选项 */
    pageSizeOptions: number[]

    // 操作方法
    /** 设置总数 */
    setTotal: (total: number) => void
    /** 跳转到指定页 */
    goToPage: (page: number) => void
    /** 上一页 */
    prevPage: () => void
    /** 下一页 */
    nextPage: () => void
    /** 跳转到第一页 */
    firstPage: () => void
    /** 跳转到最后一页 */
    lastPage: () => void
    /** 修改每页数量 */
    changePageSize: (size: number) => void
    /** 重置分页 */
    reset: () => void
    /** 获取 API 查询参数 */
    getQueryParams: () => { page: number; pageSize: number }
}

/**
 * 分页状态管理 Hook
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const {
        initialPage = 1,
        initialPageSize = 10,
        pageSizeOptions = [10, 20, 50, 100],
    } = options

    const [state, setState] = useState<PaginationState>({
        page: initialPage,
        pageSize: initialPageSize,
        total: 0,
    })

    // 计算总页数
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(state.total / state.pageSize))
    }, [state.total, state.pageSize])

    // 是否有上一页
    const hasPrevPage = useMemo(() => state.page > 1, [state.page])

    // 是否有下一页
    const hasNextPage = useMemo(() => state.page < totalPages, [state.page, totalPages])

    // 当前页显示的记录范围
    const range = useMemo(() => {
        const start = (state.page - 1) * state.pageSize + 1
        const end = Math.min(state.page * state.pageSize, state.total)
        return { start: state.total > 0 ? start : 0, end }
    }, [state.page, state.pageSize, state.total])

    // 设置总数
    const setTotal = useCallback((total: number) => {
        setState((prev) => ({ ...prev, total }))
    }, [])

    // 跳转到指定页
    const goToPage = useCallback(
        (page: number) => {
            const validPage = Math.max(1, Math.min(page, totalPages))
            setState((prev) => ({ ...prev, page: validPage }))
        },
        [totalPages]
    )

    // 上一页
    const prevPage = useCallback(() => {
        if (hasPrevPage) {
            setState((prev) => ({ ...prev, page: prev.page - 1 }))
        }
    }, [hasPrevPage])

    // 下一页
    const nextPage = useCallback(() => {
        if (hasNextPage) {
            setState((prev) => ({ ...prev, page: prev.page + 1 }))
        }
    }, [hasNextPage])

    // 第一页
    const firstPage = useCallback(() => {
        setState((prev) => ({ ...prev, page: 1 }))
    }, [])

    // 最后一页
    const lastPage = useCallback(() => {
        setState((prev) => ({ ...prev, page: totalPages }))
    }, [totalPages])

    // 修改每页数量
    const changePageSize = useCallback((size: number) => {
        setState((prev) => ({
            ...prev,
            pageSize: size,
            page: 1, // 修改每页数量时重置到第一页
        }))
    }, [])

    // 重置
    const reset = useCallback(() => {
        setState({
            page: initialPage,
            pageSize: initialPageSize,
            total: 0,
        })
    }, [initialPage, initialPageSize])

    // 获取 API 查询参数
    const getQueryParams = useCallback(() => {
        return {
            page: state.page,
            pageSize: state.pageSize,
        }
    }, [state.page, state.pageSize])

    return {
        // 状态
        ...state,
        totalPages,
        hasPrevPage,
        hasNextPage,
        range,
        pageSizeOptions,

        // 方法
        setTotal,
        goToPage,
        prevPage,
        nextPage,
        firstPage,
        lastPage,
        changePageSize,
        reset,
        getQueryParams,
    }
}
