# Admin-Pro Next

<div align="center">

![Admin-Pro Next](https://img.shields.io/badge/Admin--Pro-Next-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748)

**企业级管理系统 - 基于 Next.js 16+ 构建的现代化 RBAC 权限管理系统**

[功能特性](#功能特性) • [快速开始](#快速开始) • [技术栈](#技术栈) • [项目结构](#项目结构) • [开发文档](#开发文档)

</div>

## ✨ 功能特性

- 🔐 **完整 RBAC 权限系统** - 用户、角色、菜单、部门、岗位管理
- 🛡️ **安全认证架构** - **有状态会话管理** (MySQL + LRU Cache)，支持在线用户监控与强制下线
- 🌐 **多租户支持** - 基于用户域的数据隔离
- 🎨 **精美 UI 设计** - 使用 shadcn/ui + Tailwind CSS 4 构建的现代界面
- 🌓 **暗色模式** - 支持明暗主题切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔍 **数据表格** - 支持搜索、排序、分页的高级表格组件
- 📊 **数据可视化** - 首页 Dashboard 统计图表
- 🚀 **高性能** - Next.js 16 + Turbopack 构建，内存级缓存优化

## 🚀 快速开始

### 环境要求

- Node.js >= 18.17.0
- MySQL >= 8.0

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd admin-pro-next
```

2. **安装依赖**

```bash
# 推荐使用 pnpm
pnpm install
```

3. **配置环境变量**

复制 `.env.example` 为 `.env.local` 并配置数据库连接：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 数据库连接
DATABASE_URL="mysql://root:password@localhost:3306/admin_pro_next"

# JWT 密钥（生产环境请修改）
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# 应用配置
NEXT_PUBLIC_APP_NAME="Admin-Pro Next"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **初始化数据库**

```bash
# 生成 Prisma Client
pnpm db:generate

# 推送 Schema 到数据库
pnpm db:push

# 填充初始数据
pnpm db:seed
```

5. **启动开发服务器**

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可查看系统。

### 默认账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin  | admin123 | 超级管理员 | 拥有所有权限 |
| test   | admin123 | 管理员   | 普通管理员权限 |

## 🛠️ 技术栈

### 前端框架

- **[Next.js 16](https://nextjs.org/)** - React 全栈框架 (App Router)
- **[React 19](https://react.dev/)** - UI 库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 原子化 CSS

### UI 组件

- **[shadcn/ui](https://ui.shadcn.com/)** - 高质量 React 组件
- **[Lucide Icons](https://lucide.dev/)** - 精美图标库
- **[Sonner](https://sonner.emilkowal.ski/)** - 优雅的 Toast 通知

### 核心逻辑 & 工具

- **[Zustand](https://zustand-demo.pmnd.rs/)** - 轻量级状态管理
- **[Zod](https://zod.dev/)** - 模式声明和验证库
- **[lru-cache](https://github.com/isaacs/node-lru-cache)** - 高性能内存缓存

### 数据库 & ORM

- **[MySQL 8](https://www.mysql.com/)** - 关系型数据库
- **[Prisma 6](https://www.prisma.io/)** - 现代 ORM (支持关联查询优化)

### 认证 & 安全

- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - 密码加密
- **[jose](https://github.com/panva/jose)** - JWT 签名 (Edge 兼容)
- **双层缓存会话** - 内存 + 数据库混合存储策略

## 📁 项目结构

```
admin-pro-next/
├── app/                      # Next.js App Router
├── components/               # React 组件
│   ├── layout/              # 布局组件
│   ├── shared/              # 共享组件
│   └── ui/                  # shadcn/ui 组件
├── hooks/                    # 自定义 Hooks (useAuth, usePagination等)
├── lib/                      # 工具库
│   ├── api-handler.ts       # API 统一错误处理
│   ├── auth-middleware.ts   # 认证中间件
│   ├── session.ts           # 会话管理 (LRU + DB)
│   ├── token.ts             # JWT 工具
│   ├── validation/          # Zod 验证 Schemas
│   └── prisma.ts            # Prisma 客户端
├── prisma/                   # Prisma 配置
│   ├── schema.prisma        # 数据库 Schema
│   └── seed.ts              # 初始数据
├── proxy.ts                  # 路由代理与权限拦截
└── types/                    # TypeScript 类型
```

## 📖 可用命令

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器

# 数据库
pnpm db:generate      # 生成 Prisma Client
pnpm db:push          # 推送 Schema 到数据库
pnpm db:studio        # 打开 Prisma Studio
pnpm db:reset         # 重置数据库 (危险)

# 代码检查
pnpm lint             # 运行 ESLint
```

## 🗄️ 数据库设计

系统包含 **38 张数据表**，经过深度优化：

- **索引优化**：关键查询字段（如登录名、状态、外键）均添加了索引。
- **关联优化**：RBAC 关联表采用 ID 强关联，提升查询稳定性和一致性。
- **双层 Log**：操作日志与登录日志独立存储，支持高并发写入。

详细的数据库设计请查看 [docs/development-plan.md](docs/development-plan.md)。

## 🔐 权限模型

系统采用经典的 RBAC（基于角色的访问控制）模型：

```
用户 (User) <--> 角色 (Role) <--> 菜单/权限 (Menu/Permission)
```

**认证流程**：
1. 用户登录 -> 验证账号密码 -> 生成 Token
2. 写入 Token 到数据库 `SysUserToken` 表
3. 写入 Token 状态到内存 LRU Cache
4. 请求接口 -> 优先查内存 Cache -> (未命中) 查数据库 -> 验证通过

## 📝 开发计划

### 已完成 ✅

- [x] 项目初始化 (Next.js 16 + Tailwind v4)
- [x] **有状态认证架构** (MySQL + LRU)
- [x] **API 规范化** (Zod 验证 + 统一错误处理)
- [x] 用户管理 (CRUD + 角色分配)
- [x] 角色管理 (权限分配)
- [x] 菜单管理 (动态路由)
- [x] Dashboard 首页
- [x] 在线用户监控

### 进行中 🚧

- [ ] 部门管理
- [ ] 岗位管理
- [ ] 系统参数配置
- [ ] 字典管理
- [ ] 系统日志查看

### 计划中 📋

- [ ] 数据导出
- [ ] 文件上传
- [ ] 定时任务
- [ ] 服务监控
- [ ] 消息通知

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
