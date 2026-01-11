
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying Menu Data in Database...')

    const menus = await prisma.sysMenu.findMany({
        orderBy: { orderNum: 'asc' }
    })

    console.log(`\n📦 Total Menus Found: ${menus.length}`)

    const expectedMenus = ['M_JOB', 'M_SERVER', 'M_DICT', 'M_MENU']
    let allFound = true

    expectedMenus.forEach(code => {
        const found = menus.find(m => m.name === code)
        if (found) {
            console.log(`✅ Found Menu: ${code} (${found.display}) - URL: ${found.url}`)
        } else {
            console.error(`❌ Missing Menu: ${code}`)
            allFound = false
        }
    })

    if (allFound) {
        console.log('\n✨ All critical menus are present in the database.')
    } else {
        console.error('\n⚠️ Some menus are missing.')
        process.exit(1)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
