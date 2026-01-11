
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.sysUser.findFirst({
        where: { loginName: 'admin' }
    })

    if (user) {
        console.log(`HASH:${user.pwd}`)
    } else {
        console.log('User admin not found')
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
