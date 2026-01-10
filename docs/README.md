# Admin-Pro Next.js 详细文档

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境配置](#环境配置)
- [快速开始](#快速开始)
- [数据库设计](#数据库设计)
- [认证与授权](#认证与授权)
- [API 文档](#api-文档)
- [模块说明](#模块说明)
- [部署指南](#部署指南)
- [常见问题](#常见问题)
- [开发规范](#开发规范)

---

## 项目概述

Admin-Pro Next.js 是一个基于 React 19 + Java Spring Boot 的后端管理系统 Admin-Pro 的完整 Next.js 迁移版本。该项目保留了原有的所有功能和数据库结构，同时采用了现代化的技术栈和最佳实践。

### 核心特性

- **完整的 RBAC 权限系统**：基于角色-菜单的权限控制
- **多租户支持**：通过 userDomain 实现数据隔离
- **JWT 认证**：无状态的身份验证机制
- **38+ 数据库表**：完整保留原有数据库结构
- **现代化 UI**：基于 shadcn/ui 和 Tailwind CSS 4
- **类型安全**：TypeScript 全覆盖，Prisma ORM 提供类型推断

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  App Router │ Server Components │ Client Components         │
├─────────────────────────────────────────────────────────────┤
│                    API Routes (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  认证中间件 │ 权限验证 │ 业务逻辑 │ 数据验证                 │
├─────────────────────────────────────────────────────────────┤
│                     Prisma ORM                              │
├─────────────────────────────────────────────────────────────┤
│                    MySQL 8.0 数据库                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 技术栈

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.1.1 | React 全栈框架 |
| React | 19.2.3 | UI 库 |
| TypeScript | 5.9.3 | 类型安全 |
| Tailwind CSS | 4.1.18 | 样式框架 |
| shadcn/ui | - | UI 组件库 |
| Zustand | 5.0.9 | 状态管理 |
| next-themes | 0.4.6 | 主题管理 |
| TanStack Table | 8.21.3 | 数据表格 |
| Sonner | 2.0.7 | 消息提示 |

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js API Routes | 16.1.1 | 服务端 API |
| Prisma | 6.19.1 | ORM 框架 |
| JWT | 9.0.3 | 身份认证 |
| bcrypt | 6.0.0 | 密码加密 |
| SVG Captcha | 1.4.0 | 验证码生成 |

### 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| pnpm | 9.0.0+ | 包管理器 |
| ESLint | 9.39.2 | 代码检查 |
| ts-node | 10.9.2 | TypeScript 执行 |

---

## 项目结构

```
admin-pro-next/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证相关页面路由组
│   │   └── login/
│   │       └── page.tsx          # 登录页面
│   ├── (dashboard)/              # 主应用路由组
│   │   ├── layout.tsx            # Dashboard 布局
│   │   ├── home/
│   │   │   └── page.tsx          # 首页
│   │   ├── admin/                # 管理模块
│   │   │   ├── user/             # 用户管理
│   │   │   ├── role/             # 角色管理
│   │   │   ├── menu/             # 菜单管理
│   │   │   ├── dept/             # 部门管理
│   │   │   ├── post/             # 岗位管理
│   │   │   ├── config/           # 系统配置
│   │   │   ├── dict/             # 字典管理
│   │   │   ├── job/              # 定时任务
│   │   │   ├── server/           # 服务器监控
│   │   │   ├── session/          # 在线用户
│   │   │   ├── syslog/           # 系统日志
│   │   │   └── audit/            # 审计日志
│   │   ├── settings/             # 个人中心
│   │   └── profile/              # 个人资料
│   ├── api/                      # API 路由
│   │   ├── auth/                 # 认证接口
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── captcha/
│   │   └── admin/                # 管理接口
│   │       ├── user/
│   │       ├── role/
│   │       ├── menu/
│   │       ├── dept/
│   │       ├── post/
│   │       ├── config/
│   │       ├── dict/
│   │       ├── job/
│   │       ├── server/
│   │       ├── session/
│   │       ├── syslog/
│   │       └── audit/
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   └── page.tsx                  # 首页重定向
├── components/                   # React 组件
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx            # 顶部导航
│   │   ├── sidebar.tsx           # 侧边栏
│   │   └── theme-provider.tsx    # 主题提供者
│   ├── shared/                   # 共享组件
│   │   └── data-table.tsx        # 数据表格组件
│   └── ui/                       # shadcn/ui 组件
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...                   # 更多 UI 组件
├── lib/                          # 工具库
│   ├── auth.ts                   # 认证工具
│   ├── captcha.ts                # 验证码工具
│   ├── prisma.ts                 # Prisma 客户端
│   └── utils.ts                  # 通用工具
├── prisma/                       # Prisma 配置
│   ├── schema.prisma             # 数据库模型
│   └── seed.ts                   # 初始数据
├── stores/                       # Zustand 状态管理
│   └── use-auth-store.ts         # 认证状态
├── types/                        # TypeScript 类型
│   └── index.ts                  # 全局类型定义
├── docs/                         # 文档
│   ├── development-plan.md       # 开发计划
│   └── README.md                 # 本文档
├── middleware.ts                 # Next.js 中间件
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind 配置
├── components.json               # shadcn/ui 配置
├── package.json                  # 项目依赖
├── .env.local                    # 环境变量（本地）
└── README.md                     # 项目说明
```

---

## 环境配置

### 环境要求

- **Node.js**: >= 18.17.0
- **pnpm**: >= 9.0.0
- **MySQL**: >= 8.0

### 环境变量配置

创建 `.env.local` 文件：

```bash
# 数据库连接
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"

# JWT 密钥（生产环境请使用强随机字符串）
JWT_SECRET="your-secret-key-change-in-production"

# JWT 过期时间
JWT_EXPIRES_IN="7d"

# 应用端口（可选，默认 3000）
PORT=3000

# 应用 URL（用于生成回调链接）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 环境变量说明

| 变量名 | 必填 | 说明 | 示例 |
|--------|------|------|------|
| `DATABASE_URL` | 是 | MySQL 数据库连接字符串 | `mysql://root:password@localhost:3306/admin_pro` |
| `JWT_SECRET` | 是 | JWT 签名密钥，至少 32 字符 | `random-secret-key-12345678` |
| `JWT_EXPIRES_IN` | 否 | Token 过期时间 | `7d`, `24h`, `60m` |
| `PORT` | 否 | 应用端口 | `3000` |
| `NEXT_PUBLIC_APP_URL` | 是 | 应用访问地址 | `http://localhost:3000` |

---

## 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm
pnpm install
```

### 2. 配置数据库

创建 MySQL 数据库：

```sql
CREATE DATABASE admin_pro_next CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量

复制并编辑环境变量文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 配置数据库连接。

### 4. 初始化数据库

```bash
# 推送数据库结构
pnpm prisma db push

# 生成 Prisma Client
pnpm prisma generate

# （可选）填充初始数据
pnpm prisma db seed
```

### 5. 启动开发服务器

```bash
pnpm run dev
```

访问 http://localhost:3000

### 6. 默认登录账号

| 用户名 | 密码 | 用户域 | 角色 |
|--------|------|--------|------|
| admin | admin123 | DEFAULT | 超级管理员 |
| test | admin123 | DEFAULT | 管理员 |
| lisi | admin123 | DEFAULT | 普通用户 |

---

## 数据库设计

### 数据库规范

- **表名格式**: `{模块}_{实体}_tbl`
- **字段命名**: 小写 + 下划线分隔
- **主键**: 所有表使用 UUID 作为主键，字段名为 `col_id`
- **审计字段**: 所有业务表包含 6 个审计字段

### 审计字段

每个业务表都包含以下审计字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `col_created_by_user_domain` | varchar(64) | 创建人用户域 |
| `col_created_by_user_id` | varchar(64) | 创建人ID |
| `col_created_date` | datetime | 创建时间 |
| `col_updated_by_user_domain` | varchar(64) | 更新人用户域 |
| `col_updated_by_user_id` | varchar(64) | 更新人ID |
| `col_updated_date` | datetime | 更新时间 |

### 核心数据表

#### RBAC 核心表（11张）

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `sys_user_tbl` | 用户表 | 用户名、密码、邮箱、手机、状态 |
| `sys_role_tbl` | 角色表 | 角色名、角色类型、状态 |
| `sys_menu_tbl` | 菜单表 | 菜单名、类型、路径、权限标识 |
| `sys_dept_tbl` | 部门表 | 部门名、父级ID、层级路径 |
| `sys_post_tbl` | 岗位表 | 岗位编码、岗位名、排序 |
| `sys_user_role_rel_tbl` | 用户角色关系表 | 用户ID、角色ID |
| `sys_role_menu_rel_tbl` | 角色菜单关系表 | 角色ID、菜单ID |
| `sys_role_user_rel_tbl` | 角色用户关系表 | 角色ID、用户ID |
| `sys_user_post_rel_tbl` | 用户岗位关系表 | 用户ID、岗位ID |
| `sys_user_org_rel_tbl` | 用户组织关系表 | 用户ID、组织ID |
| `sys_role_org_rel_tbl` | 角色组织关系表 | 角色ID、组织ID |

#### 系统工具表（5张）

| 表名 | 说明 |
|------|------|
| `sys_config_tbl` | 系统参数配置表 |
| `sys_dict_tbl` | 字典类型表 |
| `sys_dict_data_tbl` | 字典数据表 |
| `sys_schedule_job_tbl` | 定时任务表 |
| `sys_schedule_job_log_tbl` | 定时任务日志表 |

#### 日志表（3张）

| 表名 | 说明 |
|------|------|
| `sys_sys_log_tbl` | 系统日志表 |
| `sys_audit_log_tbl` | 审计日志表 |
| `sys_operation_log_tbl` | 操作日志表 |

#### 其他表

- 监控表（2张）：服务器监控、性能监控
- 文件表（1张）：OSS 文件管理
- 业务支持表（8+张）：根据具体业务需求扩展

### Prisma Schema 示例

```prisma
model SysUser {
  id                   String     @id @map("col_id") @default(uuid())
  userDomain           String     @map("col_user_domain")
  userId               String     @map("col_user_id")
  loginName            String?    @map("col_login_name")
  display              String?    @map("col_display")
  pwd                  String?    @map("col_pwd")
  email                String?    @map("col_email")
  status               String?    @map("col_status") @default("active")

  // 审计字段
  createdByUserDomain  String?    @map("col_created_by_user_domain")
  createdByUserId      String?    @map("col_created_by_user_id")
  createdDate          DateTime?  @map("col_created_date") @default(now())
  updatedByUserDomain  String?    @map("col_updated_by_user_domain")
  updatedByUserId      String?    @map("col_updated_by_user_id")
  updatedDate          DateTime?  @map("col_updated_date") @updatedAt

  @@unique([userDomain, userId], name: "unq_user_domain")
  @@map("sys_user_tbl")
}
```

---

## 认证与授权

### 认证流程

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  用户    │ ───> │ 登录页面 │ ───> │ 后端API  │ ───> │ 数据库   │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                      │                  │
                      v                  v
                 ┌──────────┐      ┌──────────┐
                 │ 验证码   │      │  JWT     │
                 │ 校验     │      │  Token   │
                 └──────────┘      └──────────┘
```

### JWT Token 结构

```typescript
interface JWTPayload {
  userId: string          // 用户ID
  userDomain: string      // 用户域
  loginName: string       // 登录名
  iat?: number           // 签发时间
  exp?: number           // 过期时间
}
```

### 认证实现

#### 1. 密码加密

```typescript
// lib/auth.ts
import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}
```

#### 2. Token 生成

```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
```

#### 3. 中间件保护

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 权限检查
  const path = request.nextUrl.pathname
  const requiredPermission = routePermissionMap[path]

  if (requiredPermission) {
    const hasPermission = await checkUserPermission(payload.userId, requiredPermission)
    if (!hasPermission) {
      return NextResponse.json({ message: '无权限' }, { status: 403 })
    }
  }

  return NextResponse.next()
}
```

### 权限控制

#### URL-权限映射

```typescript
const routePermissionMap: Record<string, string> = {
  '/admin/user': 'system:user',
  '/admin/role': 'system:role',
  '/admin/menu': 'system:menu',
  '/admin/dept': 'system:dept',
  '/admin/post': 'system:post',
  '/admin/config': 'system:config',
  '/admin/dict': 'system:dict',
  '/admin/job': 'system:job',
  '/admin/server': 'system:server',
  '/admin/session': 'system:session',
  '/admin/syslog': 'system:log',
  '/admin/audit': 'system:audit',
}
```

#### 权限检查函数

```typescript
async function checkUserPermission(userId: string, permission: string): Promise<boolean> {
  // 1. 获取用户角色
  const userRoles = await prisma.sysUserRoleRel.findMany({
    where: { userId },
    select: { roleId: true },
  })

  // 2. 获取角色权限
  const roleIds = userRoles.map(r => r.roleId)
  const roleMenus = await prisma.sysRoleMenuRel.findMany({
    where: { roleId: { in: roleIds } },
    select: { menuId: true },
  })

  // 3. 检查权限
  const menus = await prisma.sysMenu.findMany({
    where: {
      id: { in: roleMenus.map(r => r.menuId) },
      permission: permission,
    },
  })

  return menus.length > 0
}
```

### 密码规则

- **长度**: 8-20 个字符
- **必须包含**:
  - 大写字母 (A-Z)
  - 小写字母 (a-z)
  - 数字 (0-9)
  - 特殊字符 (@$!%*?&)

```typescript
function validatePassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  return regex.test(password)
}
```

---

## API 文档

### API 规范

- **基础路径**: `/api`
- **认证方式**: JWT Token (Cookie: `auth_token`)
- **请求格式**: `application/json`
- **响应格式**: `application/json`

### 统一响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": any,
  "message": "操作成功"
}

// 失败响应
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误"
}
```

### 认证接口

#### 1. 获取验证码

**请求**
```http
GET /api/auth/captcha
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "svg": "<svg>...</svg>"
  }
}
```

#### 2. 用户登录

**请求**
```http
POST /api/auth/login
Content-Type: application/json

{
  "userDomain": "DEFAULT",
  "loginName": "admin",
  "password": "admin123",
  "captchaId": "uuid",
  "captchaCode": "15"
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "loginName": "admin",
      "display": "管理员"
    }
  }
}
```

#### 3. 用户登出

**请求**
```http
POST /api/auth/logout
```

**响应**
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 用户管理接口

#### 1. 获取用户列表

**请求**
```http
GET /api/admin/user?page=1&pageSize=10&keyword=张三
```

**响应**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 2. 创建用户

**请求**
```http
POST /api/admin/user
Content-Type: application/json

{
  "userDomain": "DEFAULT",
  "userId": "user001",
  "loginName": "zhangsan",
  "display": "张三",
  "pwd": "Admin123@",
  "email": "zhangsan@example.com"
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "loginName": "zhangsan",
    "display": "张三"
  }
}
```

#### 3. 更新用户

**请求**
```http
PUT /api/admin/user?id={userId}
Content-Type: application/json

{
  "display": "张三三",
  "email": "new@example.com"
}
```

#### 4. 删除用户

**请求**
```http
DELETE /api/admin/user?id={userId}
```

#### 5. 修改密码

**请求**
```http
PATCH /api/admin/user/password
Content-Type: application/json

{
  "id": "userId",
  "oldPassword": "oldPwd@123",
  "newPassword": "NewPwd@123"
}
```

### 角色管理接口

```http
# 获取角色列表
GET /api/admin/role

# 创建角色
POST /api/admin/role
Body: { "name": "EDITOR", "display": "编辑", "remark": "" }

# 更新角色
PUT /api/admin/role?id={roleId}

# 删除角色
DELETE /api/admin/role?id={roleId}

# 分配菜单
POST /api/admin/role/menus
Body: { "roleId": "...", "menuIds": ["...", "..."] }
```

### 菜单管理接口

```http
# 获取菜单树
GET /api/admin/menu

# 创建菜单
POST /api/admin/menu
Body: {
  "name": "M_USER_MGR",
  "type": "C",
  "display": "用户管理",
  "path": "/admin/user",
  "permission": "system:user"
}

# 更新菜单
PUT /api/admin/menu?id={menuId}

# 删除菜单
DELETE /api/admin/menu?id={menuId}
```

### 部门管理接口

```http
# 获取部门树
GET /api/admin/dept

# 创建部门
POST /api/admin/dept
Body: {
  "name": "研发部",
  "parentId": "",
  "ancestors": "0,"
}

# 更新部门
PUT /api/admin/dept?id={deptId}

# 删除部门
DELETE /api/admin/dept?id={deptId}
```

### 字典管理接口

```http
# 获取字典类型列表
GET /api/admin/dict

# 创建字典类型
POST /api/admin/dict
Body: { "name": "USER_STATUS", "display": "用户状态" }

# 获取字典数据
GET /api/admin/dict/data?dictName=USER_STATUS

# 创建字典数据
POST /api/admin/dict/data
Body: { "dictName": "USER_STATUS", "label": "正常", "value": "1" }
```

### 定时任务接口

```http
# 获取任务列表
GET /api/admin/job

# 创建任务
POST /api/admin/job
Body: {
  "name": "DATA_SYNC",
  "display": "数据同步",
  "cron": "0 0 2 * * ?",
  "className": "com.example.DataSyncJob"
}

# 执行任务
POST /api/admin/job/execute
Body: { "id": "jobId" }

# 获取任务日志
GET /api/admin/job/log?jobName=DATA_SYNC
```

### 服务器监控接口

```http
# 获取服务器信息
GET /api/admin/server/info

# 响应
{
  "success": true,
  "data": {
    "system": { "hostname": "...", "platform": "..." },
    "cpu": { "model": "...", "cores": 8 },
    "memory": { "total": "16 GB", "used": "8 GB", "usage": "50%" },
    "network": [...],
    "stats": { "userCount": 100, "activeSessionCount": 20 }
  }
}
```

### 日志接口

```http
# 系统日志
GET /api/admin/syslog?keyword=登录&category=auth

# 审计日志
GET /api/admin/audit?status=success&module=user
```

---

## 模块说明

### 1. 用户管理 (`/admin/user`)

**功能**
- 用户 CRUD 操作
- 密码修改
- 角色分配
- 状态管理（启用/禁用）

**关键特性**
- 用户域隔离
- 密码加密存储
- 登录失败次数限制
- 用户状态管理

**字段说明**
- `userId`: 用户唯一标识
- `loginName`: 登录名
- `display`: 显示名称
- `status`: 用户状态 (active/inactive)

### 2. 角色管理 (`/admin/role`)

**功能**
- 角色 CRUD 操作
- 菜单权限分配
- 角色类型（系统角色/自定义）

**内置角色**
- `SUPER_ADMIN`: 超级管理员
- `ADMIN`: 管理员
- `USER`: 普通用户
- `GUEST`: 访客

### 3. 菜单管理 (`/admin/menu`)

**功能**
- 菜单树管理
- 权限标识配置
- 菜单类型（目录/菜单/按钮）

**菜单类型**
- `M`: 目录
- `C`: 菜单
- `F`: 按钮/功能

**权限标识格式**
```
system:user     - 用户管理
system:role     - 角色管理
common:changepwd - 修改密码
```

### 4. 部门管理 (`/admin/dept`)

**功能**
- 部门树管理
- 组织结构维护

**层级关系**
- 使用 `parentId` 建立树形结构
- `ancestors` 字段存储完整路径（如：`0,1,2,`）

### 5. 系统配置 (`/admin/config`)

**功能**
- 系统参数配置
- 键值对存储

**系统配置示例**
- `sys.user.initPassword`: 初始密码
- `sys.user.passwordPolicy`: 密码策略
- `sys.session.timeout`: 会话超时时间

### 6. 定时任务 (`/admin/job`)

**功能**
- 任务 CRUD 操作
- Cron 表达式配置
- 任务执行日志
- 手动触发执行

**Cron 表达式示例**
```
0 0 2 * * ?     # 每天凌晨2点
0 0 */2 * * ?   # 每2小时
0 0 12 * * MON  # 每周一中午12点
```

### 7. 服务器监控 (`/admin/server`)

**监控指标**
- 系统信息（主机名、操作系统）
- CPU（型号、核心数）
- 内存（总量、已用、使用率）
- 网络（接口、IP地址）
- 统计数据（用户数、会话数）

### 8. 日志管理

#### 系统日志 (`/admin/syslog`)
- 记录系统级别日志
- 分类：登录、操作、错误等

#### 审计日志 (`/admin/audit`)
- 记录业务操作
- 追溯数据变更历史

---

## 部署指南

### 生产环境检查清单

- [ ] 修改 JWT_SECRET 为强随机字符串
- [ ] 配置 HTTPS
- [ ] 设置数据库备份策略
- [ ] 配置日志收集
- [ ] 设置监控告警
- [ ] 配置 CDN（静态资源）
- [ ] 数据库连接池优化

### 使用 Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm

# 工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 生成 Prisma Client
RUN pnpm prisma generate

# 构建应用
RUN pnpm run build

# 生产环境
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["pnpm", "start"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: admin_pro_next
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "mysql://root:rootpassword@mysql:3306/admin_pro_next"
      JWT_SECRET: "your-production-secret-key"
    depends_on:
      - mysql

volumes:
  mysql_data:
```

#### 3. 启动服务

```bash
docker-compose up -d
```

### 使用 PM2 部署

#### 1. 安装 PM2

```bash
pnpm add -g pm2
```

#### 2. 创建 ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'admin-pro-next',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
```

#### 3. 启动应用

```bash
# 构建应用
pnpm run build

# 启动 PM2
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs admin-pro-next

# 设置开机自启
pm2 startup
pm2 save
```

### Nginx 反向代理配置

```nginx
upstream admin_pro_next {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name admin.example.com;

    # 强制 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.example.com;

    # SSL 证书
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 代理设置
    location / {
        proxy_pass http://admin_pro_next;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://admin_pro_next;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 常见问题

### Q1: 数据库连接失败

**问题**: `Error: Can't reach database server`

**解决方案**:
1. 检查 MySQL 服务是否运行
2. 确认 DATABASE_URL 配置正确
3. 检查数据库用户权限
4. 确认防火墙设置

### Q2: Prisma Client 生成失败

**问题**: `Error: P3005`

**解决方案**:
```bash
# 重新生成 Prisma Client
pnpm prisma generate

# 如果仍失败，清理后重试
rm -rf node_modules/.prisma
pnpm prisma generate
```

### Q3: 验证码显示失败

**问题**: SVG 验证码无法显示

**解决方案**:
1. 确认内存存储正常运行
2. 检查 SVG 生成代码
3. 确认浏览器支持 SVG

### Q4: JWT Token 无效

**问题**: 登录后频繁提示 Token 无效

**解决方案**:
1. 检查 JWT_SECRET 配置
2. 确认 Token 过期时间设置
3. 检查系统时间是否同步
4. 清除浏览器 Cookie

### Q5: 权限检查失败

**问题**: 有权限的用户无法访问页面

**解决方案**:
1. 检查 `routePermissionMap` 配置
2. 确认角色菜单关系正确
3. 检查菜单权限标识
4. 清除浏览器缓存重新登录

### Q6: 部署后样式丢失

**问题**: 生产环境页面样式错乱

**解决方案**:
1. 检查 `NEXT_PUBLIC_APP_URL` 配置
2. 确认静态资源路径正确
3. 检查 Nginx/CND 配置
4. 清除 Next.js 缓存重新构建

---

## 开发规范

### 代码风格

#### 命名规范

```typescript
// 文件名：kebab-case
user-management-page.tsx
api-route-handler.ts

// 组件名：PascalCase
export function UserManagementPage() {}

// 变量/函数：camelCase
const userName = 'admin'
function getUserInfo() {}

// 常量：UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5
const DEFAULT_PAGE_SIZE = 10

// 类型/接口：PascalCase
interface UserInfo {}
type UserRole = 'admin' | 'user'
```

#### 组件结构

```typescript
'use client' // 客户端组件标记

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// 1. 类型定义
interface Props {
  userId: string
}

// 2. 组件定义
export default function UserManagement({ userId }: Props) {
  // 3. 状态声明
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 4. 副作用
  useEffect(() => {
    fetchUsers()
  }, [])

  // 5. 事件处理
  const handleEdit = (user: any) => {
    // ...
  }

  // 6. 渲染
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### API 路由规范

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// GET - 查询
export async function GET(request: NextRequest) {
  try {
    // 1. 认证检查
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      )
    }

    // 2. 参数解析
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')

    // 3. 业务逻辑
    const data = await prisma.sysUser.findMany({
      skip: (page - 1) * 10,
      take: 10,
    })

    // 4. 返回结果
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

// POST - 创建
export async function POST(request: NextRequest) {
  // ...
}

// PUT - 更新
export async function PUT(request: NextRequest) {
  // ...
}

// DELETE - 删除
export async function DELETE(request: NextRequest) {
  // ...
}
```

### Git 提交规范

```bash
# 格式
<type>(<scope>): <subject>

# 类型
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具

# 示例
feat(user): 添加用户导出功能
fix(auth): 修复验证码验证失败问题
docs: 更新 API 文档
```

### 数据库迁移规范

```bash
# 修改 schema.prisma 后执行

# 1. 生成迁移（推荐开发环境）
pnpm prisma migrate dev --name add_user_avatar

# 2. 直接推送（生产环境慎用）
pnpm prisma db push

# 3. 生成客户端
pnpm prisma generate

# 4. 重置数据库（仅开发环境）
pnpm prisma migrate reset
```

---

## 性能优化建议

### 1. 数据库查询优化

```typescript
// ❌ N+1 查询问题
const users = await prisma.sysUser.findMany()
for (const user of users) {
  const roles = await prisma.sysUserRoleRel.findMany({
    where: { userId: user.id }
  })
}

// ✅ 使用 include 预加载
const users = await prisma.sysUser.findMany({
  include: {
    roles: true
  }
})
```

### 2. 分页查询

```typescript
// 使用游标分页处理大数据集
const users = await prisma.sysUser.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastUserId },
  orderBy: { id: 'asc' }
})
```

### 3. 缓存策略

```typescript
// 使用 Redis 缓存热点数据
import { Redis } from 'ioredis'

const redis = new Redis()

async function getUsers() {
  const cacheKey = 'users:all'
  const cached = await redis.get(cacheKey)

  if (cached) {
    return JSON.parse(cached)
  }

  const users = await prisma.sysUser.findMany()
  await redis.setex(cacheKey, 300, JSON.stringify(users))

  return users
}
```

### 4. Next.js 优化

```typescript
// 使用 Server Components 减少客户端 JS
async function UserList() {
  const users = await prisma.sysUser.findMany()
  return <div>{/* ... */}</div>
}

// 使用动态导入减少初始加载
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
})
```

---

## 安全建议

### 1. 输入验证

```typescript
import { z } from 'zod'

const userSchema = z.object({
  loginName: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
})

// 使用
const validatedData = userSchema.parse(requestBody)
```

### 2. SQL 注入防护

```typescript
// ✅ Prisma 自动防护
const users = await prisma.sysUser.findMany({
  where: {
    loginName: userInput // 自动参数化查询
  }
})

// ❌ 原始 SQL 需谨慎
await prisma.$queryRaw`
  SELECT * FROM sys_user_tbl WHERE col_login_name = ${userInput}
`
```

### 3. XSS 防护

```typescript
// React 默认转义 JSX 中的内容
<div>{userInput}</div> // 安全

// 使用 dangerouslySetInnerHTML 需谨慎
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### 4. CSRF 防护

```typescript
// 使用 Next.js 内置 CSRF 保护
import { csrf } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  await csrf(request)
  // ...
}
```

---

## 附录

### A. 完整权限列表

```
system:user         - 用户管理
system:role         - 角色管理
system:menu         - 菜单管理
system:dept         - 部门管理
system:post         - 岗位管理
system:config       - 系统配置
system:dict         - 字典管理
system:job          - 定时任务
system:server       - 服务器监控
system:session      - 会话管理
system:log          - 系统日志
system:audit        - 审计日志
common:changepwd    - 修改密码
common:profile      - 个人资料
```

### B. 用户状态列表

```
active    - 正常/启用
inactive  - 禁用
locked    - 锁定
expired   - 过期
```

### C. 日志级别

```
DEBUG     - 调试信息
INFO      - 一般信息
WARN      - 警告信息
ERROR     - 错误信息
FATAL     - 致命错误
```

### D. 常用命令速查

```bash
# 开发
pnpm run dev              # 启动开发服务器
pnpm run build            # 构建生产版本
pnpm run start            # 启动生产服务器
pnpm run lint             # 代码检查

# 数据库
pnpm prisma studio        # 打开 Prisma Studio
pnpm prisma generate      # 生成 Prisma Client
pnpm prisma db push       # 推送 schema 到数据库
pnpm prisma migrate dev   # 创建并应用迁移
pnpm prisma db seed       # 填充种子数据

# Docker
docker-compose up -d      # 启动服务
docker-compose down       # 停止服务
docker-compose logs -f    # 查看日志

# PM2
pm2 start                 # 启动应用
pm2 restart               # 重启应用
pm2 stop                  # 停止应用
pm2 logs                  # 查看日志
pm2 monit                 # 监控面板
```

---

## 技术支持

- **GitHub Issues**: [项目地址]
- **文档地址**: [在线文档]
- **更新日志**: [CHANGELOG.md]

---

**文档版本**: 1.0.0
**最后更新**: 2026-01-10
