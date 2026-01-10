# Admin-Pro Next.js 详细开发计划文档

## 文档版本信息
- **版本**: v2.0
- **更新日期**: 2026-01-10
- **文档状态**: 详细设计阶段

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈对比](#2-技术栈对比)
3. [完整模块清单](#3-完整模块清单)
4. [数据库表结构详解](#4-数据库表结构详解)
5. [安全架构设计](#5-安全架构设计)
6. [URL与权限映射关系](#6-url与权限映射关系)
7. [实施计划](#7-实施计划)
8. [关键文件清单](#8-关键文件清单)

---

## 1. 项目概述

### 1.1 项目目标

将 **Admin-Pro** 从 React+Java (Spring Boot) 架构完全迁移到 **Next.js 14+ 全栈应用**，保持所有功能、数据库结构和权限体系完全一致。

### 1.2 核心原则

| 原则 | 说明 |
|------|------|
| **数据一致性** | 数据库表结构、字段名、类型与原系统完全一致 |
| **功能完整性** | 所有 38+ 张表、20+ 页面功能全部实现 |
| **权限兼容** | RBAC 权限体系、多租户隔离逻辑保持不变 |
| **API 兼容** | REST API 端点设计与原系统保持一致 |

---

## 2. 技术栈对比

### 2.1 技术栈变更表

| 层级 | 原技术 | 新技术 | 迁移策略 |
|------|--------|--------|----------|
| **前端框架** | React 19 + Vite 7 | Next.js 14 App Router | 组件迁移，路由重构 |
| **UI 组件库** | Ant Design 5 | shadcn/ui + Tailwind CSS | 完全重写所有组件 |
| **状态管理** | Zustand | Zustand | 保持不变，直接迁移 |
| **表单处理** | React Hook Form + Zod | React Hook Form + Zod | 保持不变 |
| **后端框架** | Spring Boot 3.5.6 + Java 21 | Next.js API Routes | 完全重写 |
| **ORM** | 自定义 JDBC 层 | Prisma ORM | Schema 映射重写 |
| **认证方式** | Session-based | JWT-based | 迁移到 JWT |
| **数据库** | MySQL 8.0+ | MySQL 8.0+ | 保持不变 |

### 2.2 依赖包清单

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.20.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "next-themes": "^0.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.454.0",
    "@radix-ui/react-*": "latest",
    "date-fns": "^4.1.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "svg-captcha": "^4.3.0",
    "nanoid": "^5.0.7",
    "sharp": "^0.33.0",
    "recharts": "^2.14.0"
  }
}
```

---

## 3. 完整模块清单

### 3.1 模块分类

Admin-Pro 共包含 **7 大模块**，**38 张数据表**，**20 个前端页面**。

```
Admin-Pro 模块结构
├── [1] RBAC 核心模块 (11 张表, 7 个页面)
├── [2] 系统工具模块 (5 张表, 5 个页面)
├── [3] 日志审计模块 (3 张表, 3 个页面)
├── [4] 监控管理模块 (2 张表, 2 个页面)
├── [5] 文件管理模块 (1 张表, 0 个页面)
├── [6] 业务支撑模块 (8 张表, 0 个页面)
└── [7] 系统配置模块 (8 张表, 3 个页面)
```

### 3.2 RBAC 核心模块

#### 模块概述
- **功能**: 用户、角色、权限、部门、岗位管理
- **表数量**: 11 张
- **页面数量**: 7 个

#### 数据表清单

| 序号 | 表名 | 说明 | 主要字段数 |
|------|------|------|------------|
| 1 | `sys_user_domain_tbl` | 用户域（多租户） | 7 |
| 2 | `sys_user_domain_env_tbl` | 用户域环境配置 | 8 |
| 3 | `sys_user_tbl` | 用户表 | 42 |
| 4 | `sys_user_profile_tbl` | 用户简况 | 5 |
| 5 | `sys_user_tag_tbl` | 用户标签 | 4 |
| 6 | `sys_user_token_tbl` | 用户 Token | 8 |
| 7 | `sys_role_tbl` | 角色表 | 7 |
| 8 | `sys_menu_tbl` | 菜单权限表 | 13 |
| 9 | `sys_dept_tbl` | 部门表 | 12 |
| 10 | `sys_post_tbl` | 岗位表 | 6 |
| 11 | `sys_auth_code_tbl` | 认证码 | - |

#### 关联表清单

| 序号 | 表名 | 说明 | 关联关系 |
|------|------|------|----------|
| 12 | `sys_user_role_assign_tbl` | 用户-角色关联 | N:N |
| 13 | `sys_user_menu_assign_tbl` | 用户-菜单关联 | N:N |
| 14 | `sys_user_post_assign_tbl` | 用户-岗位关联 | N:N |
| 15 | `sys_role_menu_assign_tbl` | 角色-菜单关联 | N:N |

#### 前端页面清单

| 页面路径 | 页面名称 | 权限标识 | 说明 |
|----------|----------|----------|------|
| `/admin/user` | 用户管理 | `system:user` | 用户 CRUD、导入导出 |
| `/admin/role` | 角色管理 | `system:role` | 角色 CRUD、权限分配 |
| `/admin/menu` | 菜单管理 | `system:menu` | 菜单树管理、权限配置 |
| `/admin/dept` | 部门管理 | `system:dept` | 部门树 CRUD |
| `/admin/post` | 岗位管理 | `system:post` | 岗位 CRUD |
| `/admin/domain` | 用户域管理 | `system:domain` | 多租户域管理 |
| `/admin/userDomainEnv` | 用户域配置 | `system:user_domain_env` | 域环境配置 |

### 3.3 系统工具模块

#### 模块概述
- **功能**: 系统配置、字典管理、定时任务
- **表数量**: 5 张
- **页面数量**: 5 个

#### 数据表清单

| 序号 | 表名 | 说明 | 主要字段数 |
|------|------|------|------------|
| 1 | `sys_config_tbl` | 系统参数配置 | 7 |
| 2 | `sys_dict_tbl` | 字典类型 | 6 |
| 3 | `sys_dict_data_tbl` | 字典数据 | 8 |
| 4 | `sys_schedule_job_tbl` | 定时任务 | 7 |
| 5 | `sys_schedule_job_log_tbl` | 定时任务日志 | 8 |

#### 前端页面清单

| 页面路径 | 页面名称 | 权限标识 | 说明 |
|----------|----------|----------|------|
| `/admin/config` | 参数配置 | `system:config` | 系统参数 CRUD |
| `/admin/dict` | 字典管理 | `system:dict` | 字典类型/数据管理 |
| `/admin/job` | 定时任务 | `system:job` | 任务调度管理 |
| `/admin/generator` | 代码生成 | `system:generator` | 代码生成器 |
| `/admin/swagger` | 系统接口 | `system:swagger` | API 文档 |

### 3.4 日志审计模块

#### 模块概述
- **功能**: 系统日志、审计日志、异常日志
- **表数量**: 3 张
- **页面数量**: 3 个

#### 数据表清单

| 序号 | 表名 | 说明 | 主要字段数 |
|------|------|------|------------|
| 1 | `sys_sys_log_tbl` | 系统日志 | 14 |
| 2 | `sys_audit_log_tbl` | 审计日志 | 12 |
| 3 | `sys_exception_log` | 异常日志 | 5 |

#### 前端页面清单

| 页面路径 | 页面名称 | 权限标识 | 说明 |
|----------|----------|----------|------|
| `/admin/syslog` | 系统日志 | `system:syslog` | 访问日志查看 |
| `/admin/audit` | 审计日志 | `system:audit` | 业务操作审计 |
| `/admin/exception` | 异常日志 | `system:exception` | 系统异常查看 |

### 3.5 监控管理模块

#### 模块概述
- **功能**: 会话管理、服务器监控
- **表数量**: 2 张
- **页面数量**: 2 个

#### 数据表清单

| 序号 | 表名 | 说明 | 主要字段数 |
|------|------|------|------------|
| 1 | `sys_session_tbl` | 用户会话 | 14 |
| 2 | `sys_login_info_tbl` | 登录记录 | 13 |

#### 前端页面清单

| 页面路径 | 页面名称 | 权限标识 | 说明 |
|----------|----------|----------|------|
| `/admin/session` | 在线用户 | `system:session` | 会话管理、踢出 |
| `/admin/server` | 服务监控 | `system:server` | 服务器状态监控 |

### 3.6 文件管理模块

#### 模块概述
- **功能**: 文件上传、OSS 管理
- **表数量**: 1 张
- **页面数量**: 0 个（作为功能组件）

#### 数据表清单

| 序号 | 表名 | 说明 | 主要字段数 |
|------|------|------|------------|
| 1 | `sys_oss_tbl` | 文件存储 | 14 |

### 3.7 业务支撑模块

#### 模块概述
- **功能**: 任务管理、通知、城市数据等
- **表数量**: 8 张
- **页面数量**: 0 个

#### 数据表清单

| 序号 | 表名 | 说明 | 主要字段数 |
|------|------|------|------------|
| 1 | `sys_task_tbl` | 任务 | 12 |
| 2 | `sys_task_log_tbl` | 任务日志 | 6 |
| 3 | `sys_notification_tbl` | 通知 | 8 |
| 4 | `sys_city_tbl` | 城市区划 | 5 |
| 5 | `sys_apk_tbl` | APK 版本 | 8 |
| 6 | `sys_commons_sequence` | 序列生成器 | 2 |
| 7 | `sys_code_message_tbl` | 错误消息 | 3 |

### 3.8 系统配置模块

#### 模块概述
- **功能**: 基础数据支撑
- **表数量**: 已包含在其他模块中
- **页面数量**: 3 个

#### 前端页面清单

| 页面路径 | 页面名称 | 权限标识 | 说明 |
|----------|----------|----------|------|
| `/home` | 首页 | `system:home` | 仪表盘 |
| `/settings` | 个人设置 | `system:changepwd` | 密码修改、个人信息 |
| `/profile` | 个人资料 | `system:profile` | 用户资料 |

---

## 4. 数据库表结构详解

### 4.1 审计字段设计

所有业务表（除序列表外）均包含以下审计字段：

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `col_created_by_user_domain` | varchar(64) | 创建人 Domain | `system` |
| `col_created_by_user_id` | varchar(64) | 创建人 ID | `1068812449987166208` |
| `col_created_date` | datetime | 创建日期 | `2020-06-15 23:20:18` |
| `col_updated_by_user_domain` | varchar(64) | 更新人 Domain | `system` |
| `col_updated_by_user_id` | varchar(64) | 更新人 ID | `1068812449987166208` |
| `col_updated_date` | datetime | 更新日期 | `2020-06-15 23:20:18` |

### 4.2 核心表结构详解

#### 4.2.1 用户表 (sys_user_tbl)

**表说明**: 存储系统用户信息，支持多租户

| 字段名 | 类型 | 长度 | 必填 | 唯一 | 索引 | 说明 |
|--------|------|------|------|------|------|------|
| `col_id` | varchar | 64 | PK | - | PK | 主键 ID |
| `col_user_domain` | varchar | 64 | FK | - | IDX | 用户域（租户） |
| `col_user_id` | varchar | 64 | FK | - | IDX | 用户 ID |
| `col_login_name` | varchar | 255 | - | UK | - | 登录名 |
| `col_display` | varchar | 255 | - | - | - | 显示昵称 |
| `col_real_name` | varchar | 255 | - | - | - | 真实姓名 |
| `col_id_no` | varchar | 255 | - | - | - | 身份证号 |
| `col_email` | varchar | 255 | - | - | - | 邮箱 |
| `col_status` | varchar | 64 | - | - | - | 状态 |
| `col_authenticated` | bit | 1 | - | - | - | 是否实名认证 |
| `col_mobile_no` | varchar | 255 | - | UK | - | 手机号 |
| `col_is_system` | bit | 1 | - | - | - | 是否系统用户 |
| `col_address` | varchar | 255 | - | - | - | 地址 |
| `col_pwd` | varchar | 255 | - | - | - | 密码（加密） |
| `col_birthday` | datetime | - | - | - | - | 生日 |
| `col_sex` | varchar | 12 | - | - | - | 性别 |
| `col_marital` | varchar | 12 | - | - | - | 婚姻状态 |
| `col_nation` | varchar | 255 | - | - | - | 民族 |
| `col_pay_no_pwd` | int | 11 | - | - | - | 是否免密支付 |
| `col_pay_pwd` | varchar | 255 | - | - | - | 支付密码 |
| `col_pay_no_pwd_point` | int | 11 | - | - | - | 免密支付阀值 |
| `col_avatar_url` | varchar | 255 | - | - | - | 头像地址 |
| `col_post` | varchar | 255 | - | - | - | 职位 |
| `col_profession` | varchar | 255 | - | - | - | 职业 |
| `col_constellation` | varchar | 255 | - | - | - | 星座 |
| `col_third_party_user_name` | varchar | 255 | - | - | - | 第三方账号 |
| `col_third_party_pwd` | varchar | 255 | - | - | - | 第三方密码 |
| `col_job_no` | varchar | 255 | - | - | - | 工号 |
| `col_ext_user_id` | varchar | 255 | - | UK | - | 外部用户 ID |
| `col_authenticate_date` | datetime | - | - | - | - | 实名认证时间 |
| `col_latest_login_time` | datetime | - | - | - | - | 最后登录时间 |
| `col_latest_change_pwd_time` | datetime | - | - | - | - | 最后修改密码时间 |
| `col_description` | varchar | 255 | - | - | - | 用户描述 |
| `col_dept_no` | varchar | 255 | - | FK | - | 部门号 |
| `col_share_code` | varchar | 255 | - | UK | - | 分享码 |
| `col_parent_share_code` | varchar | 255 | - | - | - | 上级分享码 |
| `col_integral` | bigint | 20 | - | - | - | 用户积分 |
| `col_province` | varchar | 255 | - | - | - | 省 |
| `col_city` | varchar | 255 | - | - | - | 市 |
| `col_district` | varchar | 255 | - | - | - | 区 |

**唯一索引**:
- `unq_user_domain`: (col_user_domain, col_user_id)
- `unq_ext_userid`: (col_ext_user_id)
- `unq_login_name`: (col_user_domain, col_login_name)
- `uk_share_code`: (col_share_code)
- `unq_mobileno`: (col_user_domain, col_mobile_no)

**Prisma 模型**:

```prisma
model SysUser {
  id                   String    @id @map("col_id")
  userDomain           String    @map("col_user_domain")
  userId               String    @map("col_user_id")
  loginName            String?   @map("col_login_name")
  display              String?   @map("col_display")
  realName             String?   @map("col_real_name")
  idNo                 String?   @map("col_id_no")
  email                String?   @map("col_email")
  status               String?   @map("col_status")
  authenticated        Boolean?  @map("col_authenticated") @default(false)
  mobileNo             String?   @map("col_mobile_no")
  isSystem             Boolean?  @map("col_is_system") @default(false)
  address              String?   @map("col_address")
  pwd                  String?   @map("col_pwd")
  birthday             DateTime? @map("col_birthday")
  sex                  String?   @map("col_sex")
  marital              String?   @map("col_marital")
  nation               String?   @map("col_nation")
  payNoPwd             Int?      @map("col_pay_no_pwd")
  payPwd               String?   @map("col_pay_pwd")
  payNoPwdPoint        Int?      @map("col_pay_no_pwd_point")
  avatarUrl            String?   @map("col_avatar_url")
  post                 String?   @map("col_post")
  profession           String?   @map("col_profession")
  constellation        String?   @map("col_constellation")
  thirdPartyUserName   String?   @map("col_third_party_user_name")
  thirdPartyPwd        String?   @map("col_third_party_pwd")
  jobNo                String?   @map("col_job_no")
  extUserId            String?   @unique @map("col_ext_user_id")
  authenticateDate     DateTime? @map("col_authenticate_date")
  latestLoginTime      DateTime? @map("col_latest_login_time")
  latestChangePwdTime  DateTime? @map("col_latest_change_pwd_time")
  description          String?   @map("col_description")
  deptNo               String?   @map("col_dept_no")
  shareCode            String?   @unique @map("col_share_code")
  parentShareCode      String?   @map("col_parent_share_code")
  integral             BigInt?   @default(0) @map("col_integral")
  province             String?   @map("col_province")
  city                 String?   @map("col_city")
  district             String?   @map("col_district")

  createdByUserDomain  String?   @map("col_created_by_user_domain")
  createdByUserId      String?   @map("col_created_by_user_id")
  createdDate          DateTime? @map("col_created_date") @default(now())
  updatedByUserDomain  String?   @map("col_updated_by_user_domain")
  updatedByUserId      String?   @map("col_updated_by_user_id")
  updatedDate          DateTime? @map("col_updated_date") @updatedAt

  @@unique([userDomain, userId], name: "unq_user_domain")
  @@unique([userDomain, loginName], name: "unq_login_name")
  @@unique([userDomain, mobileNo], name: "unq_mobileno")
  @@map("sys_user_tbl")
}
```

#### 4.2.2 角色表 (sys_role_tbl)

**表说明**: 存储系统角色信息

| 字段名 | 类型 | 长度 | 必填 | 唯一 | 说明 |
|--------|------|------|------|------|------|
| `col_id` | varchar | 64 | PK | - | 主键 ID |
| `col_name` | varchar | 128 | - | UK | 角色名称 |
| `col_display` | varchar | 255 | - | - | 角色显示名称 |
| `col_status` | varchar | 64 | - | - | 状态 |
| `col_is_system` | bit | 1 | - | - | 是否系统配置 |

**Prisma 模型**:

```prisma
model SysRole {
  id                  String   @id @map("col_id")
  name                String   @unique @map("col_name")
  display             String?  @map("col_display")
  status              String?  @map("col_status")
  isSystem            Boolean? @map("col_is_system") @default(false)

  createdByUserDomain String?  @map("col_created_by_user_domain")
  createdByUserId     String?  @map("col_created_by_user_id")
  createdDate         DateTime? @map("col_created_date") @default(now())
  updatedByUserDomain String?  @map("col_updated_by_user_domain")
  updatedByUserId     String?  @map("col_updated_by_user_id")
  updatedDate         DateTime? @map("col_updated_date") @updatedAt

  @@map("sys_role_tbl")
}
```

#### 4.2.3 菜单表 (sys_menu_tbl)

**表说明**: 存储菜单权限信息，支持树形结构

| 字段名 | 类型 | 长度 | 必填 | 唯一 | 说明 |
|--------|------|------|------|------|------|
| `col_id` | varchar | 64 | PK | - | 主键 ID |
| `col_name` | varchar | 128 | - | UK | 菜单名称 |
| `col_display` | varchar | 255 | - | - | 显示名称 |
| `col_parent_id` | varchar | 64 | - | - | 父菜单 ID |
| `col_order_num` | int | 4 | - | - | 显示顺序 |
| `col_url` | varchar | 255 | - | - | 链接 URL |
| `col_is_frame` | int | 1 | - | - | 是否为外链（0 是 1 否） |
| `col_type` | varchar | 64 | - | - | 菜单类型（M 目录 C 菜单 F 按钮） |
| `col_visible` | varchar | 64 | - | - | 菜单状态（show 显示 hidden 隐藏） |
| `col_status` | varchar | 64 | - | - | 菜单状态 |
| `col_permission` | varchar | 100 | - | - | 权限标识 |
| `col_icon` | varchar | 100 | - | - | 图标 |
| `col_remark` | varchar | 500 | - | - | 备注 |

**Prisma 模型**:

```prisma
model SysMenu {
  id         String    @id @map("col_id")
  name       String    @unique @map("col_name")
  display    String?   @map("col_display")
  parentId   String?   @map("col_parent_id")
  orderNum   Int?      @default(0) @map("col_order_num")
  url        String?   @map("col_url")
  isFrame    Int?      @map("col_is_frame")
  type       String?   @map("col_type")
  visible    String?   @default("show") @map("col_visible")
  status     String?   @map("col_status")
  permission String?   @map("col_permission")
  icon       String?   @map("col_icon")
  remark     String?   @map("col_remark")

  createdByUserDomain String?  @map("col_created_by_user_domain")
  createdByUserId     String?  @map("col_created_by_user_id")
  createdDate         DateTime? @map("col_created_date") @default(now())
  updatedByUserDomain String?  @map("col_updated_by_user_domain")
  updatedByUserId     String?  @map("col_updated_by_user_id")
  updatedDate         DateTime? @map("col_updated_date") @updatedAt

  @@map("sys_menu_tbl")
}
```

#### 4.2.4 部门表 (sys_dept_tbl)

**表说明**: 存储部门信息，支持树形结构

| 字段名 | 类型 | 长度 | 必填 | 唯一 | 说明 |
|--------|------|------|------|------|------|
| `col_id` | varchar | 64 | PK | - | 主键 ID |
| `col_no` | varchar | 128 | - | UK | 部门编号 |
| `col_parent_id` | varchar | 64 | - | - | 父部门 ID |
| `col_ancestors` | varchar | 64 | - | - | 祖级列表 |
| `col_name` | varchar | 128 | - | - | 部门名称 |
| `col_order_num` | int | 4 | - | - | 显示顺序 |
| `col_del_flag` | int | 1 | - | - | 删除标志 |
| `col_description` | varchar | 255 | - | - | 部门描述 |
| `col_linkman` | varchar | 128 | - | - | 联系人 |
| `col_contact` | varchar | 128 | - | - | 联系方式 |
| `col_phone` | varchar | 128 | - | - | 联系电话 |
| `col_email` | varchar | 128 | - | - | 邮箱 |
| `col_status` | varchar | 64 | - | - | 状态 |
| `col_logo_path` | varchar | 255 | - | - | 部门图标 |
| `col_custom_login` | int | 1 | - | - | 是否定制 login |

**Prisma 模型**:

```prisma
model SysDept {
  id          String    @id @map("col_id")
  no          String    @unique @map("col_no")
  parentId    String    @map("col_parent_id")
  ancestors   String    @map("col_ancestors")
  name        String?   @map("col_name")
  orderNum    Int?      @map("col_order_num")
  delFlag     Int?      @map("col_del_flag")
  description String?   @map("col_description")
  linkman     String?   @map("col_linkman")
  contact     String?   @map("col_contact")
  phone       String?   @map("col_phone")
  email       String?   @map("col_email")
  status      String?   @map("col_status")
  logoPath    String?   @map("col_logo_path")
  customLogin Int?      @default(0) @map("col_custom_login")

  createdByUserDomain String?  @map("col_created_by_user_domain")
  createdByUserId     String?  @map("col_created_by_user_id")
  createdDate         DateTime? @map("col_created_date") @default(now())
  updatedByUserDomain String?  @map("col_updated_by_user_domain")
  updatedByUserId     String?  @map("col_updated_by_user_id")
  updatedDate         DateTime? @map("col_updated_date") @updatedAt

  @@map("sys_dept_tbl")
}
```

### 4.3 关联表结构详解

#### 4.3.1 用户-角色关联表 (sys_user_role_assign_tbl)

```prisma
model SysUserRoleAssign {
  id         String   @id @map("col_id")
  userDomain String   @map("col_user_domain")
  userId     String   @map("col_user_id")
  roleName   String   @map("col_role_name")
  remarks    String?  @map("col_remarks")

  createdByUserDomain String?  @map("col_created_by_user_domain")
  createdByUserId     String?  @map("col_created_by_user_id")
  createdDate         DateTime? @map("col_created_date") @default(now())
  updatedByUserDomain String?  @map("col_updated_by_user_domain")
  updatedByUserId     String?  @map("col_updated_by_user_id")
  updatedDate         DateTime? @map("col_updated_date") @updatedAt

  @@unique([userDomain, userId, roleName], name: "unq_user_role")
  @@map("sys_user_role_assign_tbl")
}
```

#### 4.3.2 角色-菜单关联表 (sys_role_menu_assign_tbl)

```prisma
model SysRoleMenuAssign {
  id       String   @id @map("col_id")
  roleName String   @map("col_role_name")
  menuName String   @map("col_menu_name")

  createdByUserDomain String?  @map("col_created_by_user_domain")
  createdByUserId     String?  @map("col_created_by_user_id")
  createdDate         DateTime? @map("col_created_date") @default(now())
  updatedByUserDomain String?  @map("col_updated_by_user_domain")
  updatedByUserId     String?  @map("col_updated_by_user_id")
  updatedDate         DateTime? @map("col_updated_date") @updatedAt

  @@unique([roleName, menuName], name: "unique_idx")
  @@map("sys_role_menu_assign_tbl")
}
```

---

## 5. 安全架构设计

### 5.1 认证架构

#### 5.1.1 认证流程图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  前端登录页  │────▶│ API /login  │────▶│  验证用户   │────▶│  生成 JWT   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                                        │
                           ▼                                        ▼
                   ┌─────────────┐                          ┌─────────────┐
                   │ 验证码校验   │                          │ 存储Token   │
                   └─────────────┘                          │ 到数据库     │
                                                          └─────────────┘
                                                                 │
                                                                 ▼
                                                          ┌─────────────┐
                                                          │ 返回用户数据 │
                                                          │ + Token     │
                                                          └─────────────┘
```

#### 5.1.2 JWT Token 结构

```typescript
interface JWTPayload {
  userId: string;      // 用户 ID
  userDomain: string;  // 用户域（租户）
  loginName: string;   // 登录名
  iat?: number;        // 签发时间
  exp?: number;        // 过期时间
}

// Token 示例
{
  "userId": "1068812449987166208",
  "userDomain": "system",
  "loginName": "admin",
  "iat": 1704873600,
  "exp": 1705478400
}
```

#### 5.1.3 密码加密规则

| 项目 | 配置 |
|------|------|
| 加密算法 | bcrypt |
| 盐值长度 | 10 rounds |
| 密码规则 | 8-20 位，必须包含大小写字母、数字、特殊字符 |
| 特殊字符 | `@$!%*?&` |

### 5.2 权限架构

#### 5.2.1 RBAC 模型图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户 (User)                             │
│  - userId: 1068812449987166208                                  │
│  - userDomain: system                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   用户-角色关联 (N:N)                            │
│  - sys_user_role_assign_tbl                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         角色 (Role)                             │
│  - SYS_ADMIN_ROLE                                              │
│  - SYS_SUPER_ADMIN_ROLE                                         │
│  - NORMAL_USER                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   角色-菜单关联 (N:N)                            │
│  - sys_role_menu_assign_tbl                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         菜单 (Menu)                              │
│  - M_USER (用户管理)                                            │
│  - M_ROLE (角色管理)                                            │
│  - M_MENU (菜单管理)                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       权限标识 (Permission)                       │
│  - system:user                                                 │
│  - system:role                                                 │
│  - system:menu                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 权限检查流程

```typescript
// 权限检查伪代码
async function checkPermission(userDomain: string, userId: string, requiredPermission: string): Promise<boolean> {
  // 1. 获取用户角色
  const userRoles = await db.sysUserRoleAssign.findMany({
    where: { userDomain, userId }
  });
  const roleNames = userRoles.map(r => r.roleName);

  // 2. 获取角色菜单
  const roleMenus = await db.sysRoleMenuAssign.findMany({
    where: { roleName: { in: roleNames } }
  });
  const menuNames = roleMenus.map(m => m.menuName);

  // 3. 获取菜单权限
  const menus = await db.sysMenu.findMany({
    where: {
      name: { in: menuNames },
      permission: { not: null }
    }
  });
  const permissions = menus.map(m => m.permission);

  // 4. 检查权限
  return permissions.some(p => {
    if (p === requiredPermission) return true;
    if (p.endsWith(':*')) {
      const prefix = p.slice(0, -2);
      return requiredPermission.startsWith(prefix);
    }
    return false;
  });
}
```

#### 5.2.3 权限标识规范

| 模块 | 权限标识 | 说明 |
|------|----------|------|
| 首页 | `system:home` | 首页访问 |
| 用户管理 | `system:user` | 用户 CRUD |
| 角色管理 | `system:role` | 角色 CRUD |
| 菜单管理 | `system:menu` | 菜单 CRUD |
| 部门管理 | `system:dept` | 部门 CRUD |
| 岗位管理 | `system:post` | 岗位 CRUD |
| 用户域管理 | `system:domain` | 域管理 |
| 用户域配置 | `system:user_domain_env` | 域配置 |
| 参数配置 | `system:config` | 配置 CRUD |
| 字典管理 | `system:dict` | 字典 CRUD |
| 在线用户 | `system:session` | 会话管理 |
| 定时任务 | `system:job` | 任务管理 |
| 服务监控 | `system:server` | 服务器监控 |
| 系统日志 | `system:syslog` | 日志查看 |
| 审计日志 | `system:audit` | 审计查看 |
| 代码生成 | `system:generator` | 代码生成 |
| 系统接口 | `system:swagger` | API 文档 |
| 通用权限 | `system:common` | 基础权限 |
| 通用权限 | `common:changepwd` | 修改密码 |
| 通用权限 | `common:dept:treeselect` | 部门树选择 |
| 通用权限 | `common:menu:treeselect` | 菜单树选择 |
| 通用权限 | `common:oss:upload` | OSS 上传 |
| 通用权限 | `common:file:upload` | 文件上传 |
| 通用权限 | `common:home-data` | 首页数据 |
| 通用权限 | `common:domains` | 获取所有域 |

### 5.3 多租户架构

#### 5.3.1 租户隔离策略

| 隔离维度 | 实现方式 | 说明 |
|----------|----------|------|
| 数据隔离 | `user_domain` 字段 | 所有业务表包含 `col_user_domain` 字段 |
| 认证隔离 | JWT 中的 `userDomain` | Token 包含租户信息 |
| 权限隔离 | 基于域的角色 | 不同域可有不同角色体系 |
| 配置隔离 | `sys_user_domain_env_tbl` | 每个域独立的环境配置 |

#### 5.3.2 租户列表

| 租户代码 | 租户名称 | 说明 |
|----------|----------|------|
| `system` | 系统用户 | 系统内置租户 |
| `intranet` | 局域网用户 | 内网用户租户 |
| `internet` | 因特网用户 | 外网用户租户 |

---

## 6. URL 与权限映射关系

### 6.1 前端路由与权限映射表

| 前端路由 | 页面名称 | 权限标识 | 菜单名称 | 菜单类型 | 说明 |
|----------|----------|----------|----------|----------|------|
| `/home` | 首页 | `system:home` | M_HOME | C | 首页仪表盘 |
| `/admin/user` | 用户管理 | `system:user` | M_USER | C | 用户 CRUD |
| `/admin/role` | 角色管理 | `system:role` | M_ROLE | C | 角色 CRUD |
| `/admin/menu` | 菜单管理 | `system:menu` | M_MENU | C | 菜单树管理 |
| `/admin/dept` | 部门管理 | `system:dept` | M_DEPT | C | 部门树管理 |
| `/admin/post` | 岗位管理 | `system:post` | M_POST | C | 岗位 CRUD |
| `/admin/domain` | 用户域 | `system:domain` | M_DOMAIN | C | 租户管理 |
| `/admin/userDomainEnv` | 用户域配置 | `system:user_domain_env` | M_USER_DOMAIN_ENV | C | 域配置 |
| `/admin/config` | 参数配置 | `system:config` | M_CONFIG | C | 系统配置 |
| `/admin/dict` | 字典管理 | `system:dict` | M_DICT | C | 字典管理 |
| `/admin/session` | 在线用户 | `system:session` | M_USER_SESSION | C | 会话管理 |
| `/admin/job` | 定时任务 | `system:job` | M_JOB | C | 任务调度 |
| `/admin/server` | 服务监控 | `system:server` | M_SERVER | C | 服务器监控 |
| `/admin/generator` | 代码生成 | `system:generator` | M_CODE_GENERATOR | C | 代码生成器 |
| `/admin/swagger` | 系统接口 | `system:swagger` | M_SWAGGER | C | API 文档 |
| `/admin/syslog` | 系统日志 | `system:syslog` | - | C | 系统日志 |
| `/admin/audit` | 审计日志 | `system:audit` | M_AUDIT | C | 审计日志 |
| `/settings` | 个人设置 | `system:changepwd` | M_CHANGE_PWD | C | 密码修改 |
| `/profile` | 个人资料 | `system:profile` | - | C | 用户资料 |
| `/logout` | 退出登录 | `system:logout` | M_LOGOUT | C | 退出登录 |

### 6.2 API 路由与权限映射表

| API 路由 | HTTP 方法 | 权限标识 | 说明 |
|----------|-----------|----------|------|
| `/api/auth/login` | POST | 公开 | 用户登录 |
| `/api/auth/logout` | POST | `system:logout` | 用户登出 |
| `/api/auth/captcha` | GET | 公开 | 获取验证码 |
| `/api/auth/userinfo` | GET | 认证用户 | 获取当前用户信息 |
| `/api/admin/user/list` | POST | `system:user` | 获取用户列表 |
| `/api/admin/user` | POST | `system:user` | 创建用户 |
| `/api/admin/user` | PATCH | `system:user` | 更新用户 |
| `/api/admin/user/delete` | DELETE | `system:user` | 删除用户 |
| `/api/admin/user/prepare` | GET | `system:user` | 获取表单准备数据 |
| `/api/admin/user/detail/{domain}/{id}` | GET | `system:user` | 获取用户详情 |
| `/api/admin/user/active/{domain}/{id}` | PATCH | `system:user` | 激活用户 |
| `/api/admin/user/inactive/{domain}/{id}` | PATCH | `system:user` | 停用用户 |
| `/api/admin/user/resetpwd` | PATCH | `system:user` | 重置密码 |
| `/api/admin/user/upload` | POST | `common:file:upload` | 上传头像 |
| `/api/admin/user/import` | POST | `system:user` | 导入用户 |
| `/api/admin/user/export` | GET | `system:user` | 导出用户 |
| `/api/admin/role/list` | POST | `system:role` | 获取角色列表 |
| `/api/admin/role` | POST | `system:role` | 创建角色 |
| `/api/admin/role` | PATCH | `system:role` | 更新角色 |
| `/api/admin/role/delete` | DELETE | `system:role` | 删除角色 |
| `/api/admin/role/prepare` | GET | `system:role` | 获取准备数据 |
| `/api/admin/role/detail/{id}` | GET | `system:role` | 获取角色详情 |
| `/api/admin/role/menuTreeSelect` | GET | `common:menu:treeselect` | 获取菜单树 |
| `/api/admin/role/roleMenuTree/{id}` | GET | `common:menu:roleMenuTreeSelect` | 获取角色菜单 |
| `/api/admin/menu/list` | POST | `system:menu` | 获取菜单树 |
| `/api/admin/menu` | POST | `system:menu` | 创建菜单 |
| `/api/admin/menu` | PATCH | `system:menu` | 更新菜单 |
| `/api/admin/menu/delete` | DELETE | `system:menu` | 删除菜单 |
| `/api/userMenus` | GET | 认证用户 | 获取当前用户菜单 |
| `/api/admin/menu/treeSelect` | GET | `common:menu:treeselect` | 获取菜单树 |
| `/api/admin/dept/list` | POST | `system:dept` | 获取部门树 |
| `/api/admin/dept` | POST | `system:dept` | 创建部门 |
| `/api/admin/dept` | PATCH | `system:dept` | 更新部门 |
| `/api/admin/dept/delete` | DELETE | `system:dept` | 删除部门 |
| `/api/admin/dept/treeSelect` | GET | `common:dept:treeselect` | 获取部门树 |
| `/api/admin/post/list` | POST | `system:post` | 获取岗位列表 |
| `/api/admin/post` | POST | `system:post` | 创建岗位 |
| `/api/admin/post` | PATCH | `system:post` | 更新岗位 |
| `/api/admin/post/delete` | DELETE | `system:post` | 删除岗位 |
| `/api/admin/domain/list` | POST | `system:domain` | 获取用户域列表 |
| `/api/admin/domain` | POST | `system:domain` | 创建用户域 |
| `/api/admin/domain` | PATCH | `system:domain` | 更新用户域 |
| `/api/admin/domain/delete` | DELETE | `system:domain` | 删除用户域 |
| `/api/admin/config/list` | POST | `system:config` | 获取配置列表 |
| `/api/admin/config` | POST | `system:config` | 创建配置 |
| `/api/admin/config` | PATCH | `system:config` | 更新配置 |
| `/api/admin/config/delete` | DELETE | `system:config` | 删除配置 |
| `/api/admin/dict/list` | POST | `system:dict` | 获取字典列表 |
| `/api/admin/dict` | POST | `system:dict` | 创建字典 |
| `/api/admin/dict` | PATCH | `system:dict` | 更新字典 |
| `/api/admin/dict/delete` | DELETE | `system:dict` | 删除字典 |
| `/api/admin/session/list` | POST | `system:session` | 获取会话列表 |
| `/api/admin/session/kickout` | DELETE | `system:session` | 踢出用户 |
| `/api/admin/job/list` | POST | `system:job` | 获取任务列表 |
| `/api/admin/job` | POST | `system:job` | 创建任务 |
| `/api/admin/job` | PATCH | `system:job` | 更新任务 |
| `/api/admin/job/delete` | DELETE | `system:job` | 删除任务 |
| `/api/admin/job/execute` | POST | `system:job` | 执行任务 |
| `/api/admin/server/info` | GET | `system:server` | 获取服务器信息 |
| `/api/admin/syslog/list` | POST | `system:syslog` | 获取系统日志 |
| `/api/admin/audit/list` | POST | `system:audit` | 获取审计日志 |
| `/api/admin/generator/tables` | GET | `system:generator` | 获取数据库表 |
| `/api/admin/generator/code` | POST | `system:generator` | 生成代码 |

### 6.3 权限控制实现

#### 6.3.1 中间件权限检查

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// 公开路径列表（无需认证）
const publicPaths = [
  '/login',
  '/api/auth/login',
  '/api/auth/captcha'
];

// 路径与权限映射表
const routePermissionMap: Record<string, string> = {
  '/admin/user': 'system:user',
  '/admin/role': 'system:role',
  '/admin/menu': 'system:menu',
  '/admin/dept': 'system:dept',
  '/admin/post': 'system:post',
  '/admin/domain': 'system:domain',
  '/admin/config': 'system:config',
  '/admin/dict': 'system:dict',
  '/admin/session': 'system:session',
  '/admin/job': 'system:job',
  '/admin/server': 'system:server',
  '/admin/syslog': 'system:syslog',
  '/admin/audit': 'system:audit',
  '/admin/generator': 'system:generator',
  '/admin/swagger': 'system:swagger',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 公开路径直接放行
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 检查认证 token
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return request.nextUrl.pathname.startsWith('/api')
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
  }

  // 验证 token
  const payload = verifyToken(token);
  if (!payload) {
    return request.nextUrl.pathname.startsWith('/api')
      ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
  }

  // 检查路径权限
  const requiredPermission = getRequiredPermission(pathname);
  if (requiredPermission && !(await hasPermission(payload.userDomain, payload.userId, requiredPermission))) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  // 添加用户信息到请求头
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId);
  response.headers.set('x-user-domain', payload.userDomain);
  response.headers.set('x-login-name', payload.loginName);

  return response;
}

function getRequiredPermission(pathname: string): string | null {
  // 精确匹配
  if (routePermissionMap[pathname]) {
    return routePermissionMap[pathname];
  }

  // 前缀匹配
  for (const [route, permission] of Object.entries(routePermissionMap)) {
    if (pathname.startsWith(route)) {
      return permission;
    }
  }

  return null;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
```

#### 6.3.2 API 路由权限装饰器

```typescript
// src/lib/api-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from './lib/auth';

export function withAuth(
  handler: (request: NextRequest, session: any) => Promise<NextResponse>,
  options?: { requirePermission?: string }
) {
  return async (request: NextRequest) => {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (options?.requirePermission) {
      const permitted = await hasPermission(
        session.userDomain,
        session.userId,
        options.requirePermission
      );

      if (!permitted) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return handler(request, session);
  };
}

// 使用示例
export const GET = withAuth(
  async (request, session) => {
    // 业务逻辑
    return NextResponse.json({ success: true });
  },
  { requirePermission: 'system:user' }
);
```

---

## 7. 实施计划

### 7.1 开发阶段划分

| 阶段 | 名称 | 工期 | 交付物 |
|------|------|------|--------|
| **Phase 0** | 项目准备 | 2 天 | 开发环境、技术选型确认 |
| **Phase 1** | 项目初始化 | 5 天 | Next.js 项目、Prisma Schema |
| **Phase 2** | 认证系统 | 5 天 | JWT 认证、中间件 |
| **Phase 3** | RBAC 核心 | 10 天 | 用户/角色/菜单/部门/岗位 |
| **Phase 4** | 系统工具 | 8 天 | 配置/字典/任务/生成器 |
| **Phase 5** | 日志审计 | 5 天 | 系统日志/审计日志 |
| **Phase 6** | 监控管理 | 5 天 | 会话/服务器监控 |
| **Phase 7** | UI 优化 | 10 天 | shadcn/ui 组件适配 |
| **Phase 8** | 测试上线 | 5 天 | 测试、修复、部署 |

### 7.2 详细任务分解

#### Phase 1: 项目初始化 (5 天)

**Day 1: 项目创建与基础配置**
- [ ] 创建 Next.js 项目 (`npx create-next-app@latest`)
- [ ] 配置 TypeScript、ESLint、Prettier
- [ ] 配置 Tailwind CSS
- [ ] 初始化 shadcn/ui
- [ ] 安装核心依赖包

**Day 2: Prisma 配置**
- [ ] 安装 Prisma (`npm install prisma @prisma/client`)
- [ ] 创建完整 schema.prisma (38+ 表)
- [ ] 配置数据库连接
- [ ] 生成 Prisma Client
- [ ] 创建数据库迁移

**Day 3: 项目结构搭建**
- [ ] 创建目录结构
- [ ] 配置环境变量
- [ ] 创建基础 layout 组件
- [ ] 配置 next.config.js

**Day 4: 基础工具函数**
- [ ] 创建 `src/lib/prisma.ts` (Prisma 单例)
- [ ] 创建 `src/lib/utils.ts` (工具函数)
- [ ] 创建 `src/lib/validation.ts` (Zod schemas)
- [ ] 创建 `src/lib/tree.ts` (树形结构处理)

**Day 5: shadcn/ui 组件安装**
- [ ] 安装基础 UI 组件
- [ ] 配置主题变量
- [ ] 创建全局样式
- [ ] 测试组件渲染

#### Phase 2: 认证系统 (5 天)

**Day 1: JWT 认证工具**
- [ ] 创建 `src/lib/auth.ts`
  - [ ] `hashPassword()` - 密码加密
  - [ ] `verifyPassword()` - 密码验证
  - [ ] `generateToken()` - 生成 JWT
  - [ ] `verifyToken()` - 验证 JWT
  - [ ] `getSession()` - 获取会话
  - [ ] `setSessionCookie()` - 设置 Cookie
  - [ ] `clearSessionCookie()` - 清除 Cookie

**Day 2: 验证码功能**
- [ ] 创建 `src/lib/captcha.ts`
- [ ] 实现 SVG 数学验证码
- [ ] 创建 `/api/auth/captcha` API

**Day 3: 登录功能**
- [ ] 创建 `/api/auth/login` API
- [ ] 创建 `/api/auth/logout` API
- [ ] 创建 `/api/auth/userinfo` API
- [ ] 创建登录页面

**Day 4: 权限系统**
- [ ] 创建 `src/lib/permissions.ts`
- [ ] 实现 `getUserPermissions()`
- [ ] 实现 `hasPermission()`
- [ ] 创建权限检查中间件

**Day 5: Zustand 状态管理**
- [ ] 创建 `src/stores/auth.ts`
- [ ] 实现登录状态持久化
- [ ] 测试认证流程

#### Phase 3: RBAC 核心模块 (10 天)

**Day 1-2: 用户管理**
- [ ] 创建 `/api/admin/user` API (CRUD)
- [ ] 创建 `/api/admin/user/[id]` API
- [ ] 创建 `/api/admin/user/prepare` API
- [ ] 创建 `/api/admin/user/resetpwd` API
- [ ] 创建 `/api/admin/user/upload` API
- [ ] 创建 `/api/admin/user/import` API
- [ ] 创建 `/api/admin/user/export` API
- [ ] 创建用户管理页面

**Day 3-4: 角色管理**
- [ ] 创建 `/api/admin/role` API (CRUD)
- [ ] 创建 `/api/admin/role/menuTreeSelect` API
- [ ] 创建 `/api/admin/role/roleMenuTree` API
- [ ] 创建角色管理页面
- [ ] 实现角色-菜单分配功能

**Day 5-6: 菜单管理**
- [ ] 创建 `/api/admin/menu` API (CRUD)
- [ ] 创建 `/api/admin/menu/treeSelect` API
- [ ] 创建 `/api/userMenus` API
- [ ] 创建菜单管理页面
- [ ] 实现树形结构组件

**Day 7-8: 部门管理**
- [ ] 创建 `/api/admin/dept` API (CRUD)
- [ ] 创建 `/api/admin/dept/treeSelect` API
- [ ] 创建部门管理页面
- [ ] 实现部门树组件

**Day 9: 岗位管理**
- [ ] 创建 `/api/admin/post` API (CRUD)
- [ ] 创建岗位管理页面

**Day 10: 用户域管理**
- [ ] 创建 `/api/admin/domain` API
- [ ] 创建 `/api/admin/userDomainEnv` API
- [ ] 创建用户域管理页面
- [ ] 创建用户域配置页面

#### Phase 4: 系统工具模块 (8 天)

**Day 1-2: 配置管理**
- [ ] 创建 `/api/admin/config` API
- [ ] 创建配置管理页面
- [ ] 实现配置热加载

**Day 3-4: 字典管理**
- [ ] 创建 `/api/admin/dict` API
- [ ] 创建 `/api/admin/dict/data` API
- [ ] 创建字典管理页面
- [ ] 实现字典类型/数据管理

**Day 5-6: 定时任务**
- [ ] 创建 `/api/admin/job` API
- [ ] 创建 `/api/admin/job/execute` API
- [ ] 创建 `/api/admin/job/log` API
- [ ] 创建任务管理页面
- [ ] 实现 Cron 调度

**Day 7-8: 代码生成器**
- [ ] 创建 `/api/admin/generator/tables` API
- [ ] 创建 `/api/admin/generator/code` API
- [ ] 创建代码生成页面
- [ ] 实现代码模板

#### Phase 5: 日志审计模块 (5 天)

**Day 1-2: 系统日志**
- [ ] 创建 `/api/admin/syslog` API
- [ ] 实现日志记录中间件
- [ ] 创建系统日志页面

**Day 3-4: 审计日志**
- [ ] 创建 `/api/admin/audit` API
- [ ] 实现审计日志 AOP
- [ ] 创建审计日志页面

**Day 5: 异常日志**
- [ ] 实现全局异常捕获
- [ ] 创建异常日志页面

#### Phase 6: 监控管理模块 (5 天)

**Day 1-2: 会话管理**
- [ ] 创建 `/api/admin/session` API
- [ ] 创建 `/api/admin/session/kickout` API
- [ ] 创建会话管理页面

**Day 3-4: 服务器监控**
- [ ] 创建 `/api/admin/server/info` API
- [ ] 实现系统信息采集
- [ ] 创建服务器监控页面

**Day 5: 文件上传**
- [ ] 创建 `/api/upload` API
- [ ] 创建 `/api/oss/upload` API
- [ ] 实现文件存储

#### Phase 7: UI 优化 (10 天)

**Day 1-2: Layout 组件**
- [ ] 创建主 Layout
- [ ] 创建 Header 组件
- [ ] 创建 Sidebar 组件
- [ ] 创建 Footer 组件

**Day 3-4: 通用组件**
- [ ] 创建 DataTable 组件
- [ ] 创建 TreeView 组件
- [ ] 创建 SearchForm 组件
- [ ] 创建 Modal 组件

**Day 5-6: 表单组件**
- [ ] 创建 UserForm 组件
- [ ] 创建 RoleForm 组件
- [ ] 创建 MenuForm 组件
- [ ] 创建 DeptForm 组件

**Day 7-8: 样式优化**
- [ ] 实现主题切换
- [ ] 实现响应式布局
- [ ] 优化移动端显示

**Day 9-10: 性能优化**
- [ ] 实现数据缓存
- [ ] 优化 API 请求
- [ ] 实现虚拟滚动

#### Phase 8: 测试上线 (5 天)

**Day 1-2: 功能测试**
- [ ] 登录/登出测试
- [ ] RBAC 权限测试
- [ ] 多租户隔离测试
- [ ] 各模块功能测试

**Day 3: 性能测试**
- [ ] 页面加载测试
- [ ] API 响应测试
- [ ] 并发测试

**Day 4: 安全测试**
- [ ] SQL 注入测试
- [ ] XSS 测试
- [ ] CSRF 测试
- [ ] 权限绕过测试

**Day 5: 部署上线**
- [ ] 数据库迁移
- [ ] 生产环境配置
- [ ] 部署脚本编写
- [ ] 正式上线

### 7.3 里程碑节点

| 里程碑 | 时间点 | 交付成果 | 验收标准 |
|--------|--------|----------|----------|
| **M1** | Day 5 | 项目初始化完成 | 项目可启动，Prisma 连接成功 |
| **M2** | Day 10 | 认证系统完成 | 可登录登出，JWT 正常工作 |
| **M3** | Day 20 | RBAC 核心完成 | 用户/角色/菜单/部门可管理 |
| **M4** | Day 28 | 系统工具完成 | 配置/字典/任务/生成器可用 |
| **M5** | Day 33 | 日志审计完成 | 日志记录和查看正常 |
| **M6** | Day 38 | 监控完成 | 会话/服务器监控正常 |
| **M7** | Day 48 | UI 优化完成 | 界面美观，交互流畅 |
| **M8** | Day 53 | 项目交付 | 全部功能可用，通过测试 |

---

## 8. 关键文件清单

### 8.1 必须创建的文件清单

#### 配置文件 (7 个)

| 文件路径 | 说明 |
|----------|------|
| `package.json` | 项目依赖配置 |
| `next.config.js` | Next.js 配置 |
| `tailwind.config.ts` | Tailwind CSS 配置 |
| `tsconfig.json` | TypeScript 配置 |
| `.env.local` | 环境变量配置 |
| `prisma/schema.prisma` | 数据库 Schema 定义 |
| `postcss.config.js` | PostCSS 配置 |

#### 核心库文件 (6 个)

| 文件路径 | 说明 |
|----------|------|
| `src/lib/prisma.ts` | Prisma Client 单例 |
| `src/lib/auth.ts` | JWT 认证工具 |
| `src/lib/captcha.ts` | 验证码生成 |
| `src/lib/permissions.ts` | 权限检查工具 |
| `src/lib/validation.ts` | Zod 验证 Schema |
| `src/lib/utils.ts` | 通用工具函数 |

#### 中间件 (1 个)

| 文件路径 | 说明 |
|----------|------|
| `src/middleware.ts` | Next.js 中间件（认证+权限） |

#### 状态管理 (1 个)

| 文件路径 | 说明 |
|----------|------|
| `src/stores/auth.ts` | Zustand 认证状态 |

#### API 路由 (约 50 个)

| 目录 | 数量 | 说明 |
|------|------|------|
| `src/app/api/auth/` | 4 | 认证相关 API |
| `src/app/api/admin/user/` | 8 | 用户管理 API |
| `src/app/api/admin/role/` | 6 | 角色管理 API |
| `src/app/api/admin/menu/` | 5 | 菜单管理 API |
| `src/app/api/admin/dept/` | 4 | 部门管理 API |
| `src/app/api/admin/post/` | 4 | 岗位管理 API |
| `src/app/api/admin/domain/` | 4 | 用户域管理 API |
| `src/app/api/admin/config/` | 4 | 配置管理 API |
| `src/app/api/admin/dict/` | 5 | 字典管理 API |
| `src/app/api/admin/session/` | 3 | 会话管理 API |
| `src/app/api/admin/job/` | 5 | 任务管理 API |
| `src/app/api/admin/server/` | 2 | 服务器监控 API |
| `src/app/api/admin/syslog/` | 2 | 系统日志 API |
| `src/app/api/admin/audit/` | 2 | 审计日志 API |
| `src/app/api/admin/generator/` | 3 | 代码生成 API |
| `src/app/api/upload/` | 2 | 文件上传 API |

#### 前端页面 (约 20 个)

| 路径 | 数量 | 说明 |
|------|------|------|
| `src/app/(auth)/login/` | 1 | 登录页面 |
| `src/app/(dashboard)/layout.tsx` | 1 | 主布局 |
| `src/app/(dashboard)/home/` | 1 | 首页 |
| `src/app/(dashboard)/admin/user/` | 1 | 用户管理 |
| `src/app/(dashboard)/admin/role/` | 1 | 角色管理 |
| `src/app/(dashboard)/admin/menu/` | 1 | 菜单管理 |
| `src/app/(dashboard)/admin/dept/` | 1 | 部门管理 |
| `src/app/(dashboard)/admin/post/` | 1 | 岗位管理 |
| `src/app/(dashboard)/admin/domain/` | 1 | 用户域管理 |
| `src/app/(dashboard)/admin/config/` | 1 | 配置管理 |
| `src/app/(dashboard)/admin/dict/` | 1 | 字典管理 |
| `src/app/(dashboard)/admin/session/` | 1 | 会话管理 |
| `src/app/(dashboard)/admin/job/` | 1 | 定时任务 |
| `src/app/(dashboard)/admin/server/` | 1 | 服务器监控 |
| `src/app/(dashboard)/admin/syslog/` | 1 | 系统日志 |
| `src/app/(dashboard)/admin/audit/` | 1 | 审计日志 |
| `src/app/(dashboard)/admin/generator/` | 1 | 代码生成器 |
| `src/app/(dashboard)/settings/` | 1 | 个人设置 |
| `src/app/(dashboard)/profile/` | 1 | 个人资料 |

#### 共享组件 (约 15 个)

| 目录 | 数量 | 说明 |
|------|------|------|
| `src/components/ui/` | 10+ | shadcn/ui 基础组件 |
| `src/components/layout/` | 3 | Header, Sidebar, Footer |
| `src/components/shared/` | 5 | DataTable, TreeView 等 |

#### 类型定义 (1 个)

| 文件路径 | 说明 |
|----------|------|
| `src/types/index.ts` | TypeScript 类型定义 |

---

## 附录 A: 数据库表结构完整清单

### 表 1: sys_user_domain_tbl (用户域)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_name | varchar(128) UK | 用户域名称 |
| col_display | varchar(255) | 用户域显示名称 |
| col_is_system | bit(1) | 是否系统配置 |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 2: sys_user_domain_env_tbl (用户域环境配置)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_user_domain | varchar(64) UK | 用户域 |
| col_common_role | varchar(255) | 用户域基础角色 |
| col_description | varchar(255) | 描述 |
| col_error_page_url | varchar(255) | 错误页面 URL |
| col_fatal_error_page_url | varchar(255) | 严重错误页面 URL |
| col_home_page_url | varchar(255) | 首页 URL |
| col_login_url | varchar(255) | 登录地址 |
| col_layout | varchar(255) | 布局名称 |
| col_session_expired_url | varchar(255) | Session 过期 URL |

### 表 3: sys_user_tbl (用户表) - 42 个字段

见 4.2.1 节详细定义

### 表 4: sys_user_profile_tbl (用户简况)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_user_domain | varchar(64) | 用户域 |
| col_user_id | varchar(64) | 用户 ID |
| col_show_age | int(1) | 是否显示年龄 |
| col_show_profession | int(1) | 是否显示职业 |
| col_show_footprint | int(1) | 是否显示足记 |

### 表 5: sys_user_tag_tbl (用户标签)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_user_domain | varchar(64) | 用户域 |
| col_user_id | varchar(64) | 用户 ID |
| col_tag | varchar(255) | 标签内容 |

### 表 6: sys_user_token_tbl (用户 Token)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_token | varchar(255) | Token 值 |
| col_user_domain | varchar(64) | 用户域 |
| col_user_id | varchar(64) | 用户 ID |
| col_login_name | varchar(255) | 登录名 |
| col_device | varchar(255) | 登录设备 |
| col_expire_time | datetime | 过期时间 |
| col_status | varchar(64) | 状态 |
| col_update_time | datetime | 更新时间 |

### 表 7-15: 角色菜单相关表

见 4.2.2-4.3.2 节

### 表 16: sys_config_tbl (系统配置)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_key | varchar(128) UK | 参数键名 |
| col_name | varchar(128) | 参数名称 |
| col_value | varchar(1024) | 参数键值 |
| col_system | int(1) | 是否系统内置 |
| col_remark | varchar(500) | 备注 |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 17-18: sys_dict_tbl, sys_dict_data_tbl (字典)

见 3.3 节

### 表 19-20: sys_schedule_job_tbl, sys_schedule_job_log_tbl (定时任务)

见 3.3 节

### 表 21: sys_session_tbl (会话)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_session_id | varchar(128) UK | Session ID |
| col_third_party_session_id | varchar(128) | 第三方 Session ID |
| col_status | varchar(64) | 状态 |
| col_user_domain | varchar(64) | 用户域 |
| col_user_id | varchar(64) | 用户 ID |
| col_login_name | varchar(255) | 用户登录名 |
| col_ip_addr | varchar(128) | 登录 IP |
| col_login_location | varchar(128) | 登录地址 |
| col_browser | varchar(128) | 浏览器 |
| col_os | varchar(128) | 操作系统 |
| col_dept_no | varchar(128) | 部门编号 |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 22: sys_sys_log_tbl (系统日志)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_user_domain | varchar(64) | 用户域 |
| col_user_id | varchar(64) | 用户 ID |
| col_ip | varchar(255) | 用户 IP |
| col_browser | varchar(255) | 访问浏览器 |
| col_method | varchar(255) | Request Method |
| col_os | varchar(255) | 操作系统 |
| col_params | mediumtext | 访问参数 |
| col_response | longtext | Response |
| col_time | bigint(20) | 消耗时间 |
| col_category | varchar(64) | 分类 |
| col_module | varchar(64) | 模块 |
| col_status | varchar(32) | 状态 |
| col_description | varchar(255) | 操作描述 |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 23: sys_audit_log_tbl (审计日志)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_category | varchar(64) | 分类 |
| col_module | varchar(64) | 模块 |
| col_ip_address | varchar(80) | 访问 IP |
| col_status | varchar(64) | 状态 |
| col_event | varchar(255) | 事件 |
| col_before_data | mediumtext | 事件前数据 |
| col_after_data | mediumtext | 事件后数据 |
| col_session_id | varchar(100) | Session ID |
| col_execution_time | bigint | 执行时间（毫秒） |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 24: sys_exception_log (异常日志)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_type | text | 异常类型 |
| col_path | varchar(255) | 访问路径 |
| col_details | mediumtext | 异常详情 |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 25: sys_oss_tbl (文件存储)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| col_id | varchar(64) PK | 主键 |
| col_url | varchar(200) | URL 地址 |
| col_key | varchar(200) | KEY |
| col_hash | varchar(200) | HASH |
| col_suffix | varchar(200) | 后缀 |
| col_original | varchar(200) | 文件名 |
| col_size | bigint(20) | 文件大小 |
| col_batch_id | varchar(255) | 批次 ID |
| col_type | varchar(255) | 类型 |
| col_cover | varchar(255) | 封面地址 |
| col_cover_key | varchar(255) | 封面 KEY |
| col_status | varchar(64) | 状态 |
| [审计字段 6 个] | - | 创建/更新信息 |

### 表 26-33: 业务支撑表

| 表名 | 说明 |
|------|------|
| sys_city_tbl | 城市区划 |
| sys_apk_tbl | APK 版本管理 |
| sys_task_tbl | 任务 |
| sys_task_log_tbl | 任务日志 |
| sys_notification_tbl | 通知 |
| sys_commons_sequence | 序列生成器 |
| sys_code_message_tbl | 错误消息 |
| sys_login_info_tbl | 登录记录 |

---

## 附录 B: 权限标识完整清单

### B.1 系统权限 (system:)

| 权限标识 | 名称 | 说明 |
|----------|------|------|
| system:home | 首页 | 首页访问权限 |
| system:user | 用户管理 | 用户 CRUD 权限 |
| system:role | 角色管理 | 角色 CRUD 权限 |
| system:menu | 菜单管理 | 菜单 CRUD 权限 |
| system:dept | 部门管理 | 部门 CRUD 权限 |
| system:post | 岗位管理 | 岗位 CRUD 权限 |
| system:domain | 用户域 | 用户域管理权限 |
| system:user_domain_env | 用户域配置 | 域配置权限 |
| system:config | 参数配置 | 配置管理权限 |
| system:dict | 字典管理 | 字典管理权限 |
| system:session | 在线用户 | 会话管理权限 |
| system:job | 定时任务 | 任务管理权限 |
| system:server | 服务监控 | 服务器监控权限 |
| system:syslog | 系统日志 | 日志查看权限 |
| system:audit | 审计日志 | 审计查看权限 |
| system:generator | 代码生成 | 代码生成权限 |
| system:swagger | 系统接口 | API 文档权限 |
| system:common | 基础权限 | 通用基础权限 |
| system:logout | 退出登录 | 退出登录权限 |

### B.2 通用权限 (common:)

| 权限标识 | 名称 | 说明 |
|----------|------|------|
| common:changepwd | 修改密码 | 密码修改权限 |
| common:dept:treeselect | 部门树选择 | 获取部门树权限 |
| common:menu:treeselect | 菜单树选择 | 获取菜单树权限 |
| common:menu:roleMenuTreeSelect | 角色菜单树 | 获取角色菜单树权限 |
| common:oss:upload | OSS 上传 | OSS 文件上传权限 |
| common:file:upload | 文件上传 | 普通文件上传权限 |
| common:home-data | 首页数据 | 获取首页数据权限 |
| common:domains | 获取所有域 | 获取用户域列表权限 |

---

## 附录 C: 初始化数据脚本

### C.1 默认菜单数据

```sql
-- 首页
INSERT INTO sys_menu_tbl VALUES
('1998425430192951296', 'M_HOME', '首页', '0', 0, '/home', 0, 'C', 'show', 'active', 'system:home', 'HomeOutlined', NULL, 'system', '1068812449987166208', '2025-12-10 00:12:06', 'system', '1068812449987166208', '2025-12-10 00:13:16');

-- 系统管理目录
INSERT INTO sys_menu_tbl VALUES
('1268893422756958208', 'C_SYS_MGR', '系统管理', '0', 2, NULL, 0, 'M', 'show', 'active', NULL, 'SettingOutlined', NULL, '', '', '2020-06-05 21:12:22', 'system', '1068812449987166208', '2020-06-20 13:00:32');

-- 用户管理
INSERT INTO sys_menu_tbl VALUES
('1268894158748258304', 'M_USER', '用户管理', '1268893422756958208', 1, '/admin/user', 0, 'C', 'show', 'active', 'system:user', 'UserOutlined', NULL, '', '', '2020-06-05 21:15:17', 'system', '1068812449987166208', '2020-06-19 23:32:11');

-- 角色管理
INSERT INTO sys_menu_tbl VALUES
('1268894323924144128', 'M_ROLE', '角色管理', '1268893422756958208', 2, '/admin/role', 0, 'C', 'show', 'active', 'system:role', 'TeamOutlined', NULL, '', '', '2020-06-05 21:15:56', 'system', '1068812449987166208', '2020-06-19 23:46:49');

-- 菜单管理
INSERT INTO sys_menu_tbl VALUES
('1268894555311312896', 'M_MENU', '菜单管理', '1268893422756958208', 3, '/admin/menu', 0, 'C', 'show', 'active', 'system:menu', 'BarsOutlined', NULL, '', '', '2020-06-05 21:16:52', 'system', '1068812449987166208', '2020-06-19 23:35:17');

-- 更多菜单...
```

### C.2 默认用户数据

```sql
-- 默认管理员用户
INSERT INTO sys_user_tbl VALUES
('1275410212509061126', 'system', '1068812449987166207', 'admin', '系统管理员', '管理员', NULL, '438767782@qq.com', 'active', 0, '18913157427', 0, '', '[hashed_password]', NULL, 'female', '0', NULL, 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-06-15 23:20:18', NULL, '系统管理员', '00001', NULL, NULL, 0, NULL, NULL, NULL, 'system', 'superadmin', '2017-06-21 16:33:25', 'system', 'admin', '2020-06-15 23:20:18');

-- 默认角色
INSERT INTO sys_role_tbl VALUES
('1271976532176543744', 'SYS_ADMIN_ROLE', '系统管理员', 'active', 1, '', '', '2020-06-14 09:23:32', '', '', '2020-06-14 09:23:32'),
('1271976532176543745', 'SYS_SUPER_ADMIN_ROLE', '系统超级管理员', 'active', 1, '', '', '2020-06-14 09:23:32', 'system', '1068812449987166208', '2020-06-15 15:40:39'),
('1271976758429884416', 'NORMAL_USER', '普通用户', 'active', 1, '', '', '2020-06-14 09:24:26', '', '', '2020-06-14 09:24:26');
```

### C.3 默认配置数据

```sql
-- 平台配置
INSERT INTO sys_config_tbl VALUES
('1274356700303986688', 'app.platform.name', '平台名称', 'AdminPro开发平台', NULL, NULL, 'system', '1068812449987166208', '2020-06-20 23:01:28', 'system', '1068812449987166208', '2020-06-20 23:01:28'),
('1274356700303986689', 'app.platform.short.name', '平台短名称', 'AdminPro', NULL, NULL, 'system', '1068812449987166208', '2020-06-20 23:01:28', 'system', '1068812449987166208', '2020-06-20 23:01:28'),
('1274356897968951296', 'app.check.capture.domains', '需要校验验证码的用户域', 'system', NULL, NULL, 'system', '1068812449987166208', '2020-06-20 23:02:16', 'system', '1068812449987166208', '2020-06-20 23:02:16');

-- 密码规则配置
INSERT INTO sys_config_tbl VALUES
(CONCAT('PWD_RULE_', UNIX_TIMESTAMP(NOW()) * 1000), 'app.password.rule', '密码规则配置', '{"minLength":8,"maxLength":20,"requireLowerCase":true,"requireUpperCase":true,"requireDigit":true,"requireSpecialChar":true,"specialChars":"@$!%*?&"}', 0, '密码规则配置，JSON格式。包含最小长度、最大长度、是否需要大小写字母、数字、特殊字符等规则', 'system', '1068812449987166208', NOW(), 'system', '1068812449987166208', NOW());
```

---

**文档结束**

*本文档包含 Admin-Pro 迁移到 Next.js 的完整设计方案，共涵盖 7 大模块、38 张数据表、20 个前端页面、50+ API 端点的详细实现计划。*
