// 用户相关类型
export interface User {
  id: string
  userDomain: string
  userId: string
  loginName: string
  displayName?: string
  realName?: string
  email?: string
  mobileNo?: string
  avatarUrl?: string
  status?: string
  deptNo?: string
  jobNo?: string
  post?: string
  isAuthenticated?: boolean
  isSystem?: boolean
}

// 角色相关类型
export interface Role {
  id: string
  name: string
  display?: string
  status?: string
  isSystem?: boolean
}

// 菜单相关类型
export interface Menu {
  id: string
  name: string
  display?: string
  parentId?: string | null
  orderNum: number
  url?: string
  isFrame?: number
  type?: 'M' | 'C' | 'F'
  visible?: string
  status?: string
  permission?: string
  icon?: string
  remark?: string
  children?: Menu[]
}

// 部门相关类型
export interface Dept {
  id: string
  no: string
  parentId: string
  ancestors: string
  name?: string
  orderNum?: number
  delFlag?: number
  description?: string
  linkman?: string
  contact?: string
  phone?: string
  email?: string
  status?: string
  logoPath?: string
  customLogin?: number
  children?: Dept[]
}

// 岗位相关类型
export interface Post {
  id: string
  code: string
  name: string
  display?: string
  orderNum: number
  status?: string
  remark?: string
}

// 用户域相关类型
export interface UserDomain {
  id: string
  name: string
  display?: string
  isSystem?: boolean
}

// 系统配置相关类型
export interface SysConfig {
  id: string
  key: string
  name?: string
  value?: string
  system?: number
  remark?: string
}

// 字典相关类型
export interface Dict {
  id: string
  name: string
  display?: string
  status?: string
  remark?: string
  dataList?: DictData[]
}

export interface DictData {
  id: string
  dictName: string
  display?: string
  value?: string
  orderNum: number
  status?: string
  remark?: string
}

// 会话相关类型
export interface Session {
  id: string
  sessionId: string
  userDomain?: string
  userId?: string
  loginName?: string
  ipAddr?: string
  loginLocation?: string
  browser?: string
  os?: string
  status?: string
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// API 响应
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  code?: number
}

// 登录请求
export interface LoginRequest {
  userDomain: string
  loginName: string
  password: string
  captchaId: string
  captchaText: string
}

// 登录响应
export interface LoginResponse {
  user: User
  token: string
  permissions: string[]
  menus: Menu[]
}

// 表单操作类型
export type FormAction = 'create' | 'edit' | 'view'

// 表单状态
export interface FormState<T> {
  action: FormAction
  data?: T
  loading: boolean
}

// 列表查询参数
export interface ListQuery extends PageParams {
  keyword?: string
  status?: string
  [key: string]: any
}
