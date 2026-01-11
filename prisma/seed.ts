import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化数据库数据...')

  // 1. 创建用户域
  console.log('创建用户域...')
  await prisma.sysUserDomain.createMany({
    data: [
      { id: 'domain-001', name: 'system', display: '系统用户', isSystem: true },
      { id: 'domain-002', name: 'intranet', display: '局域网用户', isSystem: false },
      { id: 'domain-003', name: 'internet', display: '因特网用户', isSystem: false },
    ],
    skipDuplicates: true,
  })

  // 2. 创建用户域环境配置
  console.log('创建用户域环境配置...')
  await prisma.sysUserDomainEnv.createMany({
    data: [
      { id: 'env-001', userDomain: 'system', homePageUrl: '/home', loginUrl: '/login' },
      { id: 'env-002', userDomain: 'intranet', homePageUrl: '/home', loginUrl: '/login' },
      { id: 'env-003', userDomain: 'internet', homePageUrl: '/home', loginUrl: '/login' },
    ],
    skipDuplicates: true,
  })

  // 3. 创建部门
  console.log('创建部门...')
  const depts = [
    { id: 'dept-001', no: 'D001', parentId: '', ancestors: '0', name: '总公司', orderNum: 0 },
    { id: 'dept-002', no: 'D002', parentId: 'dept-001', ancestors: '0,dept-001', name: '技术部', orderNum: 1 },
    { id: 'dept-003', no: 'D003', parentId: 'dept-001', ancestors: '0,dept-001', name: '市场部', orderNum: 2 },
    { id: 'dept-004', no: 'D004', parentId: 'dept-001', ancestors: '0,dept-001', name: '人事部', orderNum: 3 },
    { id: 'dept-005', no: 'D005', parentId: 'dept-002', ancestors: '0,dept-001,dept-002', name: '研发组', orderNum: 1 },
    { id: 'dept-006', no: 'D006', parentId: 'dept-002', ancestors: '0,dept-001,dept-002', name: '测试组', orderNum: 2 },
  ]
  await prisma.sysDept.createMany({ data: depts, skipDuplicates: true })

  // 4. 创建岗位
  console.log('创建岗位...')
  const posts = [
    { id: 'post-001', code: 'CEO', name: '首席执行官', display: 'CEO', orderNum: 1 },
    { id: 'post-002', code: 'CTO', name: '首席技术官', display: 'CTO', orderNum: 2 },
    { id: 'post-003', code: 'CFO', name: '首席财务官', display: 'CFO', orderNum: 3 },
    { id: 'post-004', code: 'MANAGER', name: '部门经理', display: '部门经理', orderNum: 4 },
    { id: 'post-005', code: 'DEVELOPER', name: '开发工程师', display: '开发工程师', orderNum: 5 },
    { id: 'post-006', code: 'TESTER', name: '测试工程师', display: '测试工程师', orderNum: 6 },
    { id: 'post-007', code: 'DESIGNER', name: 'UI/UX设计师', display: 'UI/UX设计师', orderNum: 7 },
    { id: 'post-008', code: 'PM', name: '产品经理', display: '产品经理', orderNum: 8 },
  ]
  await prisma.sysPost.createMany({ data: posts, skipDuplicates: true })

  // 5. 创建角色
  console.log('创建角色...')
  await prisma.sysRole.createMany({
    data: [
      { id: 'role-001', name: 'SUPER_ADMIN', display: '超级管理员', isSystem: true },
      { id: 'role-002', name: 'ADMIN', display: '管理员', isSystem: true },
      { id: 'role-003', name: 'USER', display: '普通用户', isSystem: false },
      { id: 'role-004', name: 'GUEST', display: '访客', isSystem: false },
    ],
    skipDuplicates: true,
  })

  // 6. 创建菜单
  console.log('创建菜单...')
  const menus = [
    // 一级菜单
    { id: 'menu-001', name: 'M_HOME', display: '首页', orderNum: 1, url: '/home', type: 'C', permission: 'system:home', icon: 'LayoutDashboard' },
    { id: 'menu-002', name: 'C_SYS_MGR', display: '系统管理', orderNum: 2, type: 'M', icon: 'Settings' },

    // 系统管理子菜单
    { id: 'menu-003', name: 'M_USER', display: '用户管理', parentId: 'menu-001', orderNum: 1, url: '/admin/user', type: 'C', permission: 'system:user', icon: 'Users' },
    { id: 'menu-004', name: 'M_ROLE', display: '角色管理', parentId: 'menu-002', orderNum: 2, url: '/admin/role', type: 'C', permission: 'system:role', icon: 'UserCog' },
    { id: 'menu-005', name: 'M_MENU', display: '菜单管理', parentId: 'menu-002', orderNum: 3, url: '/admin/menu', type: 'C', permission: 'system:menu', icon: 'MenuIcon' },
    { id: 'menu-006', name: 'M_DEPT', display: '部门管理', parentId: 'menu-002', orderNum: 4, url: '/admin/dept', type: 'C', permission: 'system:dept', icon: 'Building2' },
    { id: 'menu-007', name: 'M_POST', display: '岗位管理', parentId: 'menu-002', orderNum: 5, url: '/admin/post', type: 'C', permission: 'system:post', icon: 'Briefcase' },
    { id: 'menu-008', name: 'M_DOMAIN', display: '用户域管理', parentId: 'menu-002', orderNum: 6, url: '/admin/domain', type: 'C', permission: 'system:domain', icon: 'Globe' },
    { id: 'menu-009', name: 'M_CONFIG', display: '参数配置', parentId: 'menu-002', orderNum: 7, url: '/admin/config', type: 'C', permission: 'system:config', icon: 'Settings' },
    { id: 'menu-010', name: 'M_DICT', display: '字典管理', parentId: 'menu-002', orderNum: 8, url: '/admin/dict', type: 'C', permission: 'system:dict', icon: 'Book' },

    // 系统监控
    { id: 'menu-011', name: 'C_MONITOR', display: '系统监控', orderNum: 3, type: 'M', icon: 'Activity' },
    { id: 'menu-012', name: 'M_USER_SESSION', display: '在线用户', parentId: 'menu-011', orderNum: 1, url: '/admin/session', type: 'C', permission: 'system:session', icon: 'Users' },
    { id: 'menu-013', name: 'M_SYS_LOG', display: '系统日志', parentId: 'menu-011', orderNum: 2, url: '/admin/syslog', type: 'C', permission: 'system:syslog', icon: 'List' },
    { id: 'menu-014', name: 'M_AUDIT', display: '审计日志', parentId: 'menu-011', orderNum: 3, url: '/admin/audit', type: 'C', permission: 'system:audit', icon: 'FileText' },
    { id: 'menu-015', name: 'M_JOB', display: '定时任务', parentId: 'menu-011', orderNum: 4, url: '/admin/job', type: 'C', permission: 'system:job', icon: 'Activity' },
    { id: 'menu-016', name: 'M_SERVER', display: '服务监控', parentId: 'menu-011', orderNum: 5, url: '/admin/server', type: 'C', permission: 'system:server', icon: 'Terminal' },
  ]
  await prisma.sysMenu.createMany({ data: menus, skipDuplicates: true })

  // 7. 为超级管理员分配所有菜单权限
  console.log('为超级管理员分配菜单权限...')
  const allMenus = await prisma.sysMenu.findMany()
  const roleMenus = allMenus.map((menu) => ({
    id: `rma-${Math.random().toString(36).substr(2, 9)}`,
    roleName: 'SUPER_ADMIN',
    menuName: menu.name,
  }))
  await prisma.sysRoleMenuAssign.createMany({ data: roleMenus, skipDuplicates: true })

  // 8. 为管理员分配部分菜单权限
  const adminMenus = allMenus.filter((m) => !m.name.includes('DOMAIN'))
  const adminRoleMenus = adminMenus.map((menu) => ({
    id: `rma-${Math.random().toString(36).substr(2, 9)}`,
    roleName: 'ADMIN',
    menuName: menu.name,
  }))
  await prisma.sysRoleMenuAssign.createMany({ data: adminRoleMenus, skipDuplicates: true })

  // 9. 创建用户
  console.log('创建用户...')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.sysUser.createMany({
    data: [
      {
        id: 'user-001',
        userDomain: 'system',
        userId: 'U001',
        loginName: 'admin',
        display: '系统管理员',
        realName: '超级管理员',
        pwd: hashedPassword,
        email: 'admin@system.com',
        mobileNo: '13800138000',
        status: 'active',
        authenticated: true,
        isSystem: true,
        deptNo: 'D001',
        jobNo: 'CEO',
      },
      {
        id: 'user-002',
        userDomain: 'system',
        userId: 'U002',
        loginName: 'test',
        display: '测试用户',
        realName: '张三',
        pwd: hashedPassword,
        email: 'test@system.com',
        mobileNo: '13800138001',
        status: 'active',
        authenticated: true,
        isSystem: false,
        deptNo: 'D002',
        jobNo: 'CTO',
      },
      {
        id: 'user-003',
        userDomain: 'system',
        userId: 'U003',
        loginName: 'lisi',
        display: '普通用户',
        realName: '李四',
        pwd: hashedPassword,
        email: 'lisi@system.com',
        mobileNo: '13800138002',
        status: 'active',
        authenticated: false,
        isSystem: false,
        deptNo: 'D003',
        jobNo: 'CFO',
      },
    ],
    skipDuplicates: true,
  })

  // 10. 为用户分配角色
  console.log('为用户分配角色...')
  await prisma.sysUserRoleAssign.createMany({
    data: [
      { id: 'ura-001', userDomain: 'system', userId: 'U001', roleName: 'SUPER_ADMIN' },
      { id: 'ura-002', userDomain: 'system', userId: 'U002', roleName: 'ADMIN' },
      { id: 'ura-003', userDomain: 'system', userId: 'U003', roleName: 'USER' },
    ],
    skipDuplicates: true,
  })

  // 11. 创建系统配置
  console.log('创建系统配置...')
  await prisma.sysConfig.createMany({
    data: [
      { id: 'config-001', key: 'sys.user.initPassword', name: '用户初始密码', value: 'admin123', system: 1 },
      { id: 'config-002', key: 'sys.user.maxLoginRetry', name: '最大登录重试次数', value: '5', system: 1 },
      { id: 'config-003', key: 'sys.session.timeout', name: '会话超时时间(分钟)', value: '30', system: 1 },
      { id: 'config-004', key: 'sys.file.uploadPath', name: '文件上传路径', value: '/uploads', system: 1 },
      { id: 'config-005', key: 'sys.file.maxSize', name: '文件最大大小(MB)', value: '10', system: 1 },
      { id: 'config-006', key: 'app.name', name: '应用名称', value: 'Admin-Pro Next', system: 0 },
      { id: 'config-007', key: 'app.version', name: '应用版本', value: '1.0.0', system: 0 },
    ],
    skipDuplicates: true,
  })

  // 12. 创建字典类型
  console.log('创建字典类型...')
  await prisma.sysDict.createMany({
    data: [
      { id: 'dict-001', name: 'sys_user_status', display: '用户状态' },
      { id: 'dict-002', name: 'sys_menu_type', display: '菜单类型' },
      { id: 'dict-003', name: 'sys_job_status', display: '任务状态' },
      { id: 'dict-004', name: 'sys_yes_no', display: '是否' },
    ],
    skipDuplicates: true,
  })

  // 13. 创建字典数据
  console.log('创建字典数据...')
  await prisma.sysDictData.createMany({
    data: [
      // 用户状态
      { id: 'dd-001', dictName: 'sys_user_status', display: '正常', value: 'active', orderNum: 1 },
      { id: 'dd-002', dictName: 'sys_user_status', display: '禁用', value: 'inactive', orderNum: 2 },
      // 菜单类型
      { id: 'dd-003', dictName: 'sys_menu_type', display: '目录', value: 'M', orderNum: 1 },
      { id: 'dd-004', dictName: 'sys_menu_type', display: '菜单', value: 'C', orderNum: 2 },
      { id: 'dd-005', dictName: 'sys_menu_type', display: '按钮', value: 'F', orderNum: 3 },
      // 任务状态
      { id: 'dd-006', dictName: 'sys_job_status', display: '正常', value: 'active', orderNum: 1 },
      { id: 'dd-007', dictName: 'sys_job_status', display: '暂停', value: 'inactive', orderNum: 2 },
      { id: 'dd-008', dictName: 'sys_job_status', display: '完成', value: 'completed', orderNum: 3 },
      // 是否
      { id: 'dd-009', dictName: 'sys_yes_no', display: '是', value: '1', orderNum: 1 },
      { id: 'dd-010', dictName: 'sys_yes_no', display: '否', value: '0', orderNum: 2 },
    ],
    skipDuplicates: true,
  })

  console.log('✅ 数据库初始化完成！')
  console.log('📝 默认管理员账号: admin / admin123')
  console.log('📝 默认测试账号: test / admin123')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
