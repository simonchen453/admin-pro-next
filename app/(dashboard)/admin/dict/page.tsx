'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

export default function DictManagePage() {
  const [dicts, setDicts] = useState<any[]>([])
  const [selectedDict, setSelectedDict] = useState<any | null>(null)
  const [dictData, setDictData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dictDialogOpen, setDictDialogOpen] = useState(false)
  const [dataDialogOpen, setDataDialogOpen] = useState(false)
  const [dictDialogMode, setDictDialogMode] = useState<'create' | 'edit'>('create')
  const [dataDialogMode, setDataDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedDictType, setSelectedDictType] = useState<any>(null)
  const [selectedData, setSelectedData] = useState<any>(null)

  const [dictFormData, setDictFormData] = useState({
    name: '',
    display: '',
    status: 'active',
    remark: '',
  })

  const [dataFormData, setDataFormData] = useState({
    display: '',
    value: '',
    orderNum: 0,
    status: 'active',
    remark: '',
  })

  useEffect(() => {
    fetchDicts()
  }, [])

  const fetchDicts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/dict')
      const data = await res.json()
      if (data.success) {
        setDicts(data.data)
      }
    } catch (error) {
      toast.error('获取字典列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchDictData = async (dictName: string) => {
    try {
      const res = await fetch(`/api/admin/dict/data?dictName=${dictName}`)
      const data = await res.json()
      if (data.success) {
        setDictData(data.data)
      }
    } catch (error) {
      toast.error('获取字典数据失败')
    }
  }

  const handleSelectDict = (dict: any) => {
    setSelectedDict(dict)
    fetchDictData(dict.name)
  }

  const handleCreateDict = () => {
    setDictDialogMode('create')
    setSelectedDictType(null)
    setDictFormData({
      name: '',
      display: '',
      status: 'active',
      remark: '',
    })
    setDictDialogOpen(true)
  }

  const handleEditDict = (dict: any) => {
    setDictDialogMode('edit')
    setSelectedDictType(dict)
    setDictFormData({
      name: dict.name,
      display: dict.display || '',
      status: dict.status || 'active',
      remark: dict.remark || '',
    })
    setDictDialogOpen(true)
  }

  const handleDeleteDict = async (dict: any) => {
    if (!confirm(`确定要删除字典类型 "${dict.display || dict.name}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/dict?id=${dict.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('删除成功')
        fetchDicts()
        if (selectedDict?.id === dict.id) {
          setSelectedDict(null)
          setDictData([])
        }
      } else {
        toast.error(data.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleCreateData = () => {
    if (!selectedDict) {
      toast.error('请先选择字典类型')
      return
    }
    setDataDialogMode('create')
    setSelectedData(null)
    setDataFormData({
      display: '',
      value: '',
      orderNum: 0,
      status: 'active',
      remark: '',
    })
    setDataDialogOpen(true)
  }

  const handleEditData = (data: any) => {
    setDataDialogMode('edit')
    setSelectedData(data)
    setDataFormData({
      display: data.display || '',
      value: data.value || '',
      orderNum: data.orderNum || 0,
      status: data.status || 'active',
      remark: data.remark || '',
    })
    setDataDialogOpen(true)
  }

  const handleDeleteData = async (data: any) => {
    if (!confirm(`确定要删除字典数据 "${data.display || data.value}" 吗？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/dict/data?id=${data.id}`, {
        method: 'DELETE',
      })
      const response = await res.json()
      if (response.success) {
        toast.success('删除成功')
        fetchDictData(selectedDict.name)
      } else {
        toast.error(response.message || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleDictSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dictDialogMode === 'create' ? '/api/admin/dict' : `/api/admin/dict?id=${selectedDictType?.id}`
    const method = dictDialogMode === 'create' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dictFormData),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(dictDialogMode === 'create' ? '创建成功' : '更新成功')
        setDictDialogOpen(false)
        fetchDicts()
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = dataDialogMode === 'create' ? '/api/admin/dict/data' : `/api/admin/dict/data?id=${selectedData?.id}`
    const method = dataDialogMode === 'create' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataFormData,
          dictName: selectedDict.name,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(dataDialogMode === 'create' ? '创建成功' : '更新成功')
        setDataDialogOpen(false)
        fetchDictData(selectedDict.name)
      } else {
        toast.error(data.message || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const dictColumns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: '字典名称' },
    { accessorKey: 'display', header: '显示名称' },
    { accessorKey: 'dataCount', header: '数据数量' },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'active' ? 'text-green-600' : 'text-red-600'
          }
        >
          {row.original.status === 'active' ? '正常' : '禁用'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditDict(row.original)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteDict(row.original)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  const dataColumns: ColumnDef<any>[] = [
    { accessorKey: 'display', header: '显示名称' },
    { accessorKey: 'value', header: '数据值' },
    { accessorKey: 'orderNum', header: '排序' },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'active' ? 'text-green-600' : 'text-red-600'
          }
        >
          {row.original.status === 'active' ? '正常' : '禁用'}
        </span>
      ),
    },
    { accessorKey: 'remark', header: '备注' },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditData(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteData(row.original)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">字典管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中的字典类型和字典数据
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 字典类型列表 */}
        <div className="lg:col-span-1 rounded-md border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">字典类型</h2>
            <Button size="sm" onClick={handleCreateDict} className="gap-1">
              <Plus className="w-4 h-4" />
              新增
            </Button>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-8">加载中...</div>
          ) : (
            <div className="space-y-2">
              {dicts.map((dict) => (
                <div
                  key={dict.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                    selectedDict?.id === dict.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => handleSelectDict(dict)}
                >
                  <div className="font-medium">{dict.display || dict.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {dict.dataCount || 0} 条数据
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 字典数据列表 */}
        <div className="lg:col-span-2 rounded-md border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {selectedDict ? `${selectedDict.display} - 数据列表` : '字典数据'}
            </h2>
            <Button
              size="sm"
              onClick={handleCreateData}
              disabled={!selectedDict}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              新增数据
            </Button>
          </div>

          {!selectedDict ? (
            <div className="text-center text-muted-foreground py-16">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>请选择左侧字典类型查看数据</p>
            </div>
          ) : dictData.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>暂无字典数据</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">显示名称</th>
                    <th className="p-3 text-left font-medium">数据值</th>
                    <th className="p-3 text-left font-medium">排序</th>
                    <th className="p-3 text-left font-medium">状态</th>
                    <th className="p-3 text-left font-medium">备注</th>
                    <th className="p-3 text-left font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {dictData.map((data) => (
                    <tr key={data.id} className="border-b">
                      <td className="p-3">{data.display}</td>
                      <td className="p-3">{data.value}</td>
                      <td className="p-3">{data.orderNum}</td>
                      <td className="p-3">
                        <span
                          className={
                            data.status === 'active'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {data.status === 'active' ? '正常' : '禁用'}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {data.remark || '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditData(data)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteData(data)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 字典类型对话框 */}
      <Dialog open={dictDialogOpen} onOpenChange={setDictDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dictDialogMode === 'create' ? '新增字典类型' : '编辑字典类型'}
            </DialogTitle>
            <DialogDescription>
              填写字典类型信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDictSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dictName">字典名称 *</Label>
              <Input
                id="dictName"
                value={dictFormData.name}
                onChange={(e) =>
                  setDictFormData({ ...dictFormData, name: e.target.value })
                }
                disabled={dictDialogMode === 'edit'}
                required
                placeholder="如: sys_user_status"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dictDisplay">显示名称 *</Label>
              <Input
                id="dictDisplay"
                value={dictFormData.display}
                onChange={(e) =>
                  setDictFormData({ ...dictFormData, display: e.target.value })
                }
                required
                placeholder="如: 用户状态"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dictRemark">备注</Label>
              <Textarea
                id="dictRemark"
                value={dictFormData.remark}
                onChange={(e) =>
                  setDictFormData({ ...dictFormData, remark: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="dictStatus"
                checked={dictFormData.status === 'active'}
                onCheckedChange={(checked) =>
                  setDictFormData({ ...dictFormData, status: checked ? 'active' : 'inactive' })
                }
              />
              <Label htmlFor="dictStatus">启用状态</Label>
            </div>

            <DialogFooter>
              <Button type="submit">
                {dictDialogMode === 'create' ? '创建' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 字典数据对话框 */}
      <Dialog open={dataDialogOpen} onOpenChange={setDataDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dataDialogMode === 'create' ? '新增字典数据' : '编辑字典数据'}
            </DialogTitle>
            <DialogDescription>
              填写字典数据信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDataSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataDisplay">显示名称 *</Label>
                <Input
                  id="dataDisplay"
                  value={dataFormData.display}
                  onChange={(e) =>
                    setDataFormData({ ...dataFormData, display: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataValue">数据值 *</Label>
                <Input
                  id="dataValue"
                  value={dataFormData.value}
                  onChange={(e) =>
                    setDataFormData({ ...dataFormData, value: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataOrderNum">排序</Label>
                <Input
                  id="dataOrderNum"
                  type="number"
                  value={dataFormData.orderNum}
                  onChange={(e) =>
                    setDataFormData({
                      ...dataFormData,
                      orderNum: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="dataStatus"
                  checked={dataFormData.status === 'active'}
                  onCheckedChange={(checked) =>
                    setDataFormData({ ...dataFormData, status: checked ? 'active' : 'inactive' })
                  }
                />
                <Label htmlFor="dataStatus">启用</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRemark">备注</Label>
              <Textarea
                id="dataRemark"
                value={dataFormData.remark}
                onChange={(e) =>
                  setDataFormData({ ...dataFormData, remark: e.target.value })
                }
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {dataDialogMode === 'create' ? '创建' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
