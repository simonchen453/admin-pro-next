import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying Role-Menu Assignments...')

    // 先获取角色 ID
    const role = await prisma.sysRole.findUnique({
        where: { name: 'SUPER_ADMIN' }
    })

    if (!role) {
        console.error('❌ SUPER_ADMIN role not found')
        process.exit(1)
    }

    // 获取要验证的菜单
    const newMenus = ['M_JOB', 'M_SERVER']
    const menus = await prisma.sysMenu.findMany({
        where: { name: { in: newMenus } },
        select: { id: true, name: true }
    })

    const menuIds = menus.map(m => m.id)

    // 使用 ID 查询关联
    const assignments = await prisma.sysRoleMenuAssign.findMany({
        where: {
            roleId: role.id,
            menuId: { in: menuIds }
        },
        include: {
            menu: { select: { name: true } }
        }
    })

    console.log(`\n📦 Assignments found for SUPER_ADMIN: ${assignments.length}`)

    newMenus.forEach(menuName => {
        const menu = menus.find(m => m.name === menuName)
        if (!menu) {
            console.error(`❌ Menu ${menuName} not found`)
            return
        }
        const found = assignments.find(a => a.menuId === menu.id)
        if (found) {
            console.log(`✅ ${menuName} is assigned to SUPER_ADMIN`)
        } else {
            console.error(`❌ ${menuName} is NOT assigned to SUPER_ADMIN`)
        }
    })

    if (assignments.length === newMenus.length) {
        console.log('\n✨ Permissions verification successful.')
    } else {
        console.log('\n⚠️ Permissions missing. You may need to re-run seed or manually assign.')
        process.exit(1)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
