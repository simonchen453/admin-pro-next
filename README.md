# Admin-Pro Next

<div align="center">

![Admin-Pro Next](https://img.shields.io/badge/Admin--Pro-Next-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748)

**企业级管理系统 - 基于 Next.js 14+ 构建的现代化 RBAC 权限管理系统**

[功能特性](#功能特性) • [快速开始](#快速开始) • [技术栈](#技术栈) • [项目结构](#项目结构) • [开发文档](#开发文档)

</div>

## ✨ 功能特性

- 🔐 **完整 RBAC 权限系统** - 用户、角色、菜单、部门、岗位管理
- 🌐 **多租户支持** - 基于用户域的数据隔离
- 🎨 **精美 UI 设计** - 使用 shadcn/ui + Tailwind CSS 构建的现代界面
- 🌓 **暗色模式** - 支持明暗主题切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔍 **数据表格** - 支持搜索、排序、分页的高级表格组件
- 📊 **数据可视化** - 首页 Dashboard 统计图表
- 🚀 **高性能** - Next.js 16 + Turbopack 构建

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
npm install
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
# 方式一：使用 Prisma（推荐）
npm run db:push      # 推送 Schema 到数据库
npm run db:seed      # 填充初始数据

# 方式二：使用 SQL 脚本
mysql -u root -p < prisma/init.sql
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可查看系统。

### 默认账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin  | admin123 | 超级管理员 | 拥有所有权限 |
| test   | admin123 | 管理员   | 普通管理员权限 |

## 🛠️ 技术栈

### 前端框架

- **[Next.js 16](https://nextjs.org/)** - React 全栈框架
- **[React 19](https://react.dev/)** - UI 库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 原子化 CSS

### UI 组件

- **[shadcn/ui](https://ui.shadcn.com/)** - 高质量 React 组件
- **[Lucide Icons](https://lucide.dev/)** - 精美图标库
- **[Sonner](https://sonner.emilkowal.ski/)** - 优雅的 Toast 通知

### 状态管理

- **[Zustand](https://zustand-demo.pmnd.rs/)** - 轻量级状态管理
- **[next-themes](https://github.com/pacocoursey/next-themes)** - 主题切换

### 数据库 & ORM

- **[MySQL 8](https://www.mysql.com/)** - 关系型数据库
- **[Prisma 6](https://www.prisma.io/)** - 现代 ORM

### 认证 & 安全

- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - 密码加密
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - JWT 认证

### 数据可视化

- **[Recharts](https://recharts.org/)** - React 图表库

## 📁 项目结构

```
admin-pro-next/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证路由组
│   │   └── login/           # 登录页面
│   ├── (dashboard)/         # 受保护的路由组
│   │   ├── home/            # 首页 Dashboard
│   │   └── admin/           # 管理模块
│   │       ├── user/        # 用户管理
│   │       ├── role/        # 角色管理
│   │       └── menu/        # 菜单管理
│   ├── api/                 # API 路由
│   │   ├── auth/            # 认证 API
│   │   └── admin/           # 管理 API
│   ├── globals.css          # 全局样式
│   └── layout.tsx           # 根布局
├── components/              # React 组件
│   ├── layout/              # 布局组件
│   │   ├── header.tsx       # 顶部导航
│   │   ├── sidebar.tsx      # 侧边栏
│   │   └── dashboard-layout.tsx
│   ├── shared/              # 共享组件
│   │   └── data-table.tsx   # 数据表格
│   ├── ui/                  # shadcn/ui 组件
│   └── theme-provider.tsx   # 主题提供者
├── lib/                     # 工具库
│   ├── auth.ts              # 认证工具
│   ├── captcha.ts           # 验证码
│   ├── prisma.ts            # Prisma 客户端
│   └── utils.ts             # 通用工具
├── prisma/                  # Prisma 配置
│   ├── schema.prisma        # 数据库 Schema
│   ├── seed.ts              # 初始数据
│   └── init.sql             # SQL 初始化脚本
├── stores/                  # Zustand 状态管理
│   └── auth.ts              # 认证状态
├── types/                   # TypeScript 类型
│   └── index.ts
├── middleware.ts            # Next.js 中间件
├── package.json
└── tsconfig.json
```

## 📖 可用命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 数据库
npm run db:generate      # 生成 Prisma Client
npm run db:push          # 推送 Schema 到数据库
npm run db:migrate       # 运行数据库迁移
npm run db:seed          # 填充初始数据
npm run db:studio        # 打开 Prisma Studio
npm run db:reset         # 重置数据库

# 代码检查
npm run lint             # 运行 ESLint
```

## 🗄️ 数据库设计

系统包含 **38 张数据表**，分为以下模块：

| 模块 | 表数量 | 说明 |
|------|--------|------|
| RBAC 核心 | 11 | 用户、角色、菜单、部门、岗位等 |
| 系统工具 | 5 | 配置、字典、定时任务等 |
| 日志审计 | 3 | 系统日志、审计日志、异常日志 |
| 监控管理 | 2 | 会话、登录记录 |
| 文件管理 | 1 | 文件存储 |
| 业务支撑 | 8 | 任务、通知、城市区划等 |

详细的数据库设计请查看 [docs/development-plan.md](docs/development-plan.md)。

## 🔐 权限模型

系统采用经典的 RBAC（基于角色的访问控制）模型：

```
用户 (User)
  ↓ 多对多
角色 (Role)
  ↓ 多对多
菜单/权限 (Menu/Permission)
```

**权限标识格式**：`模块:操作`，例如：
- `system:user` - 用户管理权限
- `system:user:add` - 新增用户权限
- `system:user:edit` - 编辑用户权限

## 📸 截图

### 登录页面
- 精美的渐变背景
- SVG 数学验证码
- 表单验证

### Dashboard
- 统计卡片
- 快捷操作
- 最近活动

### 管理页面
- 高级数据表格
- 搜索和筛选
- CRUD 操作

## 🧪 开发指南

### 添加新页面

1. 在 `app/(dashboard)/` 下创建页面目录
2. 在 `prisma/schema.prisma` 中添加数据模型
3. 创建对应的 API 路由
4. 实现前端页面和组件

### 添加新权限

1. 在 `sys_menu_tbl` 中添加菜单记录
2. 在 `middleware.ts` 中添加路由权限映射
3. 为角色分配新权限

### 样式定制

项目使用 Tailwind CSS v4 和 CSS 变量系统。修改 `app/globals.css` 中的 `@theme` 块即可自定义主题颜色。

## 📝 开发计划

完整的开发计划请查看 [docs/development-plan.md](docs/development-plan.md)。

### 已完成 ✅

- [x] 项目初始化
- [x] 认证系统
- [x] 用户管理
- [x] 角色管理
- [x] 菜单管理
- [x] Dashboard 首页

### 进行中 🚧

- [ ] 部门管理
- [ ] 岗位管理
- [ ] 系统配置
- [ ] 字典管理
- [ ] 系统日志
- [ ] 会话管理

### 计划中 📋

- [ ] 数据导出
- [ ] 文件上传
- [ ] 定时任务
- [ ] 系统监控
- [ ] 消息通知

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

---

<div align="center">

**Made with ❤️ by Admin-Pro Team**

</div>
