-- ============================================
-- Admin-Pro Next 数据库初始化脚本
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS admin_pro_next DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE admin_pro_next;

-- ============================================
-- 初始化数据
-- ============================================

-- 1. 插入用户域
INSERT INTO sys_user_domain_tbl (col_id, col_name, col_display, col_is_system, col_created_date, col_updated_date) VALUES
('domain-001', 'system', '系统用户', 1, NOW(), NOW()),
('domain-002', 'intranet', '局域网用户', 0, NOW(), NOW()),
('domain-003', 'internet', '因特网用户', 0, NOW(), NOW());

-- 2. 插入用户域环境配置
INSERT INTO sys_user_domain_env_tbl (col_id, col_user_domain, col_home_page_url, col_login_url, col_created_date, col_updated_date) VALUES
('env-001', 'system', '/home', '/login', NOW(), NOW()),
('env-002', 'intranet', '/home', '/login', NOW(), NOW()),
('env-003', 'internet', '/home', '/login', NOW(), NOW());

-- 3. 插入部门
INSERT INTO sys_dept_tbl (col_id, col_no, col_parent_id, col_ancestors, col_name, col_order_num, col_status, col_created_date, col_updated_date) VALUES
('dept-001', 'D001', '', '0', '总公司', 0, 'active', NOW(), NOW()),
('dept-002', 'D002', 'dept-001', '0,dept-001', '技术部', 1, 'active', NOW(), NOW()),
('dept-003', 'D003', 'dept-001', '0,dept-001', '市场部', 2, 'active', NOW(), NOW()),
('dept-004', 'D004', 'dept-001', '0,dept-001', '人事部', 3, 'active', NOW(), NOW()),
('dept-005', 'D005', 'dept-002', '0,dept-001,dept-002', '研发组', 1, 'active', NOW(), NOW()),
('dept-006', 'D006', 'dept-002', '0,dept-001,dept-002', '测试组', 2, 'active', NOW(), NOW());

-- 4. 插入岗位
INSERT INTO sys_post_tbl (col_id, col_code, col_name, col_display, col_order_num, col_status, col_created_date, col_updated_date) VALUES
('post-001', 'CEO', 'CEO', '首席执行官', 1, 'active', NOW(), NOW()),
('post-002', 'CTO', 'CTO', '首席技术官', 2, 'active', NOW(), NOW()),
('post-003', 'CFO', 'CFO', '首席财务官', 3, 'active', NOW(), NOW()),
('post-004', 'MANAGER', 'MANAGER', '部门经理', 4, 'active', NOW(), NOW()),
('post-005', 'DEVELOPER', 'DEVELOPER', '开发工程师', 5, 'active', NOW(), NOW()),
('post-006', 'TESTER', 'TESTER', '测试工程师', 6, 'active', NOW(), NOW()),
('post-007', 'DESIGNER', 'DESIGNER', 'UI/UX设计师', 7, 'active', NOW(), NOW()),
('post-008', 'PM', 'PM', '产品经理', 8, 'active', NOW(), NOW());

-- 5. 插入角色
INSERT INTO sys_role_tbl (col_id, col_name, col_display, col_is_system, col_status, col_created_date, col_updated_date) VALUES
('role-001', 'SUPER_ADMIN', '超级管理员', 1, 'active', NOW(), NOW()),
('role-002', 'ADMIN', '管理员', 1, 'active', NOW(), NOW()),
('role-003', 'USER', '普通用户', 0, 'active', NOW(), NOW()),
('role-004', 'GUEST', '访客', 0, 'active', NOW(), NOW());

-- 6. 插入菜单
INSERT INTO sys_menu_tbl (col_id, col_name, col_display, col_parent_id, col_order_num, col_url, col_type, col_visible, col_status, col_permission, col_icon, col_created_date, col_updated_date) VALUES
-- 一级菜单
('menu-001', 'M_HOME', '首页', NULL, 1, '/home', 'C', 'show', 'active', 'system:home', 'LayoutDashboard', NOW(), NOW()),
('menu-002', 'C_SYS_MGR', '系统管理', NULL, 2, '', 'M', 'show', 'active', '', 'Settings', NOW(), NOW()),

-- 系统管理子菜单
('menu-003', 'M_USER', '用户管理', 'menu-002', 1, '/admin/user', 'C', 'show', 'active', 'system:user', 'Users', NOW(), NOW()),
('menu-004', 'M_ROLE', '角色管理', 'menu-002', 2, '/admin/role', 'C', 'show', 'active', 'system:role', 'UserCog', NOW(), NOW()),
('menu-005', 'M_MENU', '菜单管理', 'menu-002', 3, '/admin/menu', 'C', 'show', 'active', 'system:menu', 'Menu', NOW(), NOW()),
('menu-006', 'M_DEPT', '部门管理', 'menu-002', 4, '/admin/dept', 'C', 'show', 'active', 'system:dept', 'Building2', NOW(), NOW()),
('menu-007', 'M_POST', '岗位管理', 'menu-002', 5, '/admin/post', 'C', 'show', 'active', 'system:post', 'Briefcase', NOW(), NOW()),
('menu-008', 'M_DOMAIN', '用户域管理', 'menu-002', 6, '/admin/domain', 'C', 'show', 'active', 'system:domain', 'Globe', NOW(), NOW()),
('menu-009', 'M_CONFIG', '参数配置', 'menu-002', 7, '/admin/config', 'C', 'show', 'active', 'system:config', 'Settings', NOW(), NOW()),
('menu-010', 'M_DICT', '字典管理', 'menu-002', 8, '/admin/dict', 'C', 'show', 'active', 'system:dict', 'Book', NOW(), NOW()),

-- 系统监控
('menu-011', 'C_MONITOR', '系统监控', NULL, 3, '', 'M', 'show', 'active', '', 'Activity', NOW(), NOW()),
('menu-012', 'M_USER_SESSION', '在线用户', 'menu-011', 1, '/admin/session', 'C', 'show', 'active', 'system:session', 'Users', NOW(), NOW()),
('menu-013', 'M_SYS_LOG', '系统日志', 'menu-011', 2, '/admin/syslog', 'C', 'show', 'active', 'system:syslog', 'List', NOW(), NOW()),
('menu-014', 'M_AUDIT', '审计日志', 'menu-011', 3, '/admin/audit', 'C', 'show', 'active', 'system:audit', 'FileText', NOW(), NOW()),

-- 按钮权限（用户管理）
('menu-101', 'BTN_USER_ADD', '新增用户', 'menu-003', 1, '', 'F', 'show', 'active', 'system:user:add', '', NOW(), NOW()),
('menu-102', 'BTN_USER_EDIT', '编辑用户', 'menu-003', 2, '', 'F', 'show', 'active', 'system:user:edit', '', NOW(), NOW()),
('menu-103', 'BTN_USER_DELETE', '删除用户', 'menu-003', 3, '', 'F', 'show', 'active', 'system:user:delete', '', NOW(), NOW()),
('menu-104', 'BTN_USER_EXPORT', '导出用户', 'menu-003', 4, '', 'F', 'show', 'active', 'system:user:export', '', NOW(), NOW()),

-- 按钮权限（角色管理）
('menu-105', 'BTN_ROLE_ADD', '新增角色', 'menu-004', 1, '', 'F', 'show', 'active', 'system:role:add', '', NOW(), NOW()),
('menu-106', 'BTN_ROLE_EDIT', '编辑角色', 'menu-004', 2, '', 'F', 'show', 'active', 'system:role:edit', '', NOW(), NOW()),
('menu-107', 'BTN_ROLE_DELETE', '删除角色', 'menu-004', 3, '', 'F', 'show', 'active', 'system:role:delete', '', NOW(), NOW()),
('menu-108', 'BTN_ROLE_ASSIGN', '分配权限', 'menu-004', 4, '', 'F', 'show', 'active', 'system:role:assign', '', NOW(), NOW());

-- 7. 为超级管理员角色分配所有菜单权限
INSERT INTO sys_role_menu_assign_tbl (col_id, col_role_name, col_menu_name, col_created_date, col_updated_date)
SELECT UUID(), 'SUPER_ADMIN', col_name, NOW(), NOW() FROM sys_menu_tbl;

-- 8. 为管理员角色分配部分菜单权限
INSERT INTO sys_role_menu_assign_tbl (col_id, col_role_name, col_menu_name, col_created_date, col_updated_date)
SELECT UUID(), 'ADMIN', col_name, NOW(), NOW() FROM sys_menu_tbl WHERE col_name NOT LIKE 'M_DOMAIN%';

-- 9. 创建管理员用户（密码: admin123）
-- 注意：实际密码应该使用 bcrypt 加密，这里使用预计算的哈希值
-- admin123 的 bcrypt 哈希值（10 rounds）
INSERT INTO sys_user_tbl (
  col_id, col_user_domain, col_user_id, col_login_name, col_display, col_real_name,
  col_pwd, col_email, col_mobile_no, col_status, col_authenticated, col_is_system,
  col_dept_no, col_job_no, col_created_date, col_updated_date
) VALUES
(
  'user-001', 'system', 'U001', 'admin', '系统管理员', '超级管理员',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin@system.com', '13800138000', 'active', 1, 1,
  'D001', 'JOB001', NOW(), NOW()
);

-- 10. 为管理员分配超级管理员角色
INSERT INTO sys_user_role_assign_tbl (col_id, col_user_domain, col_user_id, col_role_name, col_created_date, col_updated_date)
VALUES ('ura-001', 'system', 'U001', 'SUPER_ADMIN', NOW(), NOW());

-- 11. 创建测试用户
INSERT INTO sys_user_tbl (
  col_id, col_user_domain, col_user_id, col_login_name, col_display, col_real_name,
  col_pwd, col_email, col_mobile_no, col_status, col_authenticated, col_is_system,
  col_dept_no, col_job_no, col_created_date, col_updated_date
) VALUES
(
  'user-002', 'system', 'U002', 'test', '测试用户', '张三',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'test@system.com', '13800138001', 'active', 1, 0,
  'D002', 'JOB002', NOW(), NOW()
),
(
  'user-003', 'system', 'U003', 'lisi', '普通用户', '李四',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'lisi@system.com', '13800138002', 'active', 0, 0,
  'D003', 'JOB003', NOW(), NOW()
);

-- 12. 为测试用户分配角色
INSERT INTO sys_user_role_assign_tbl (col_id, col_user_domain, col_user_id, col_role_name, col_created_date, col_updated_date)
VALUES
('ura-002', 'system', 'U002', 'ADMIN', NOW(), NOW()),
('ura-003', 'system', 'U003', 'USER', NOW(), NOW());

-- 13. 插入系统配置
INSERT INTO sys_config_tbl (col_id, col_key, col_name, col_value, col_system, col_created_date, col_updated_date) VALUES
('config-001', 'sys.user.initPassword', '用户初始密码', 'admin123', 1, NOW(), NOW()),
('config-002', 'sys.user.maxLoginRetry', '最大登录重试次数', '5', 1, NOW(), NOW()),
('config-003', 'sys.session.timeout', '会话超时时间(分钟)', '30', 1, NOW(), NOW()),
('config-004', 'sys.file.uploadPath', '文件上传路径', '/uploads', 1, NOW(), NOW()),
('config-005', 'sys.file.maxSize', '文件最大大小(MB)', '10', 1, NOW(), NOW()),
('config-006', 'app.name', '应用名称', 'Admin-Pro Next', 0, NOW(), NOW()),
('config-007', 'app.version', '应用版本', '1.0.0', 0, NOW(), NOW());

-- 14. 插入字典类型
INSERT INTO sys_dict_tbl (col_id, col_name, col_display, col_status, col_created_date, col_updated_date) VALUES
('dict-001', 'sys_user_status', '用户状态', 'active', NOW(), NOW()),
('dict-002', 'sys_menu_type', '菜单类型', 'active', NOW(), NOW()),
('dict-003', 'sys_job_status', '任务状态', 'active', NOW(), NOW()),
('dict-004', 'sys_yes_no', '是否', 'active', NOW(), NOW());

-- 15. 插入字典数据
INSERT INTO sys_dict_data_tbl (col_id, col_dict_name, col_display, col_value, col_order_num, col_status, col_created_date, col_updated_date) VALUES
-- 用户状态
('dd-001', 'sys_user_status', '正常', 'active', 1, 'active', NOW(), NOW()),
('dd-002', 'sys_user_status', '禁用', 'inactive', 2, 'active', NOW(), NOW()),

-- 菜单类型
('dd-003', 'sys_menu_type', '目录', 'M', 1, 'active', NOW(), NOW()),
('dd-004', 'sys_menu_type', '菜单', 'C', 2, 'active', NOW(), NOW()),
('dd-005', 'sys_menu_type', '按钮', 'F', 3, 'active', NOW(), NOW()),

-- 任务状态
('dd-006', 'sys_job_status', '正常', 'active', 1, 'active', NOW(), NOW()),
('dd-007', 'sys_job_status', '暂停', 'inactive', 2, 'active', NOW(), NOW()),
('dd-008', 'sys_job_status', '完成', 'completed', 3, 'active', NOW(), NOW()),

-- 是否
('dd-009', 'sys_yes_no', '是', '1', 1, 'active', NOW(), NOW()),
('dd-010', 'sys_yes_no', '否', '0', 2, 'active', NOW(), NOW());

-- 完成初始化
SELECT '数据库初始化完成！' AS message;
SELECT '默认管理员账号: admin / admin123' AS admin_info;
SELECT '默认测试账号: test / admin123' AS test_info;
