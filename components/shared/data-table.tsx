'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Search, ListFilter } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = '搜索...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  return (
    <div className="space-y-4">
      {/* 工具栏：搜索和筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <span className="text-xs font-medium text-slate-500">每页行数</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) =>
                setPagination((prev) => ({ ...prev, pageSize: Number(value) }))
              }
            >
              <SelectTrigger className="w-16 h-7 border-0 bg-transparent text-xs font-medium text-slate-700 px-1 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 表格主体 */}
      <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden shadow-sm shadow-slate-200/40">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12 px-6 text-xs uppercase tracking-wider font-semibold text-slate-500 first:pl-6 last:pr-6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group hover:bg-slate-50/60 border-slate-50 transition-colors duration-200 data-[state=selected]:bg-indigo-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 text-sm text-slate-600 first:pl-6 last:pr-6 align-middle group-hover:text-slate-900 transition-colors">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 rounded-full bg-slate-50">
                      <ListFilter className="w-8 h-8 text-slate-300" />
                    </div>
                    <span className="text-sm font-medium">暂无数据记录</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页控制 */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="text-xs text-slate-400 font-medium pl-1">
            显示第 {pagination.pageIndex * pagination.pageSize + 1} 到 {Math.min((pagination.pageIndex + 1) * pagination.pageSize, table.getFilteredRowModel().rows.length)} 条，
            共 <span className="text-slate-600 font-semibold">{table.getFilteredRowModel().rows.length}</span> 条
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md min-w-[2rem] text-center">
                {pagination.pageIndex + 1}
              </span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-medium text-slate-500 bg-transparent px-2 py-1 min-w-[2rem] text-center">
                {table.getPageCount()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
