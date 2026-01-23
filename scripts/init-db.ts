import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 开始初始化数据库...')

    try {
        // 创建默认管理员用户
        const hashedPassword = await hashPassword('admin123')

        // 先尝试查找现有用户
        const existingAdmin = await prisma.sysUser.findFirst({
            where: {
                userDomain: 'system',
                loginName: 'admin',
            },
        })

        let admin
        if (existingAdmin) {
            console.log('管理员用户已存在，跳过创建')
            admin = existingAdmin
        } else {
            admin = await prisma.sysUser.create({
                data: {
                    userDomain: 'system',
                    userId: 'admin',
                    loginName: 'admin',
                    display: '系统管理员',
                    realName: '管理员',
                    email: 'admin@admin.com',
                    status: 'active',
                    authenticated: true,
                    isSystem: true,
                    pwd: hashedPassword,
                    sex: 'male',
                    createdByUserDomain: 'system',
                    createdByUserId: 'system',
                },
            })
            console.log('✅ 默认管理员用户已创建')
        }

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
