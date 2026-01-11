
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying Role-Menu Assignments...')

    const roleName = 'SUPER_ADMIN'
    const newMenus = ['M_JOB', 'M_SERVER']

    const assignments = await prisma.sysRoleMenuAssign.findMany({
        where: {
            roleName: roleName,
            menuName: { in: newMenus }
        }
    })

    console.log(`\n📦 Assignments found for ${roleName}: ${assignments.length}`)

    newMenus.forEach(menu => {
        const found = assignments.find(a => a.menuName === menu)
        if (found) {
            console.log(`✅ ${menu} is assigned to ${roleName}`)
        } else {
            console.error(`❌ ${menu} is NOT assigned to ${roleName}`)
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
