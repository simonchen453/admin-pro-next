import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 开始初始化数据库...')

    try {
        // 创建默认管理员用户
        const hashedPassword = await hashPassword('admin123')

        const admin = await prisma.sysUser.upsert({
            where: {
                uniqueUserDomainLogin: {
                    userDomain: 'system',
                    loginName: 'admin',
                },
            },
            update: {},
            create: {
                userDomain: 'system',
                userId: 'admin',
                loginName: 'admin',
                display: '系统管理员',
                realName: '管理员',
                email: 'admin@admin.com',
                status: 'Active',
                authenticated: 'Yes',
                isSystem: 'Yes',
                pwd: hashedPassword,
                sex: 'Male',
                createdByUserDomain: 'system',
                createdByUserId: 'system',
                createdDate: new Date(),
            },
        })

        console.log('✅ 默认管理员用户已创建:', admin.loginName)
        console.log('   用户名: admin')
        console.log('   密码: admin123')
        console.log('   环境: system')

    } catch (error) {
        console.error('❌ 初始化失败:', error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
