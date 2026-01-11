// import fetch from 'node-fetch'; // 使用原生 fetch

const BASE_URL = 'http://localhost:3000/api';

async function verifyApi() {
    console.log('🚀 开始 API 功能验证...');

    // 1. 登录验证
    console.log('\n🔒 正在验证登录接口...');
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`登录失败: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        if (!loginData.success || !loginData.data.token) {
            throw new Error('登录响应格式错误或缺少 Token');
        }

        const token = loginData.data.token;
        console.log('✅ 登录成功，Token 获取正常');

        // 2. 菜单验证
        console.log('\n📋 正在验证菜单接口...');
        const menuRes = await fetch(`${BASE_URL}/admin/menu`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!menuRes.ok) {
            throw new Error(`菜单请求失败: ${menuRes.status} ${menuRes.statusText}`);
        }

        const menuData = await menuRes.json();
        if (!menuData.success || !Array.isArray(menuData.data)) {
            throw new Error('菜单响应格式错误');
        }

        // 检查是否包含新添加的菜单
        const menus = JSON.stringify(menuData.data);
        const hasJob = menus.includes('admin/job') || menus.includes('定时任务');
        const hasServer = menus.includes('admin/server') || menus.includes('服务监控');

        if (hasJob) console.log('✅ "定时任务" 菜单存在');
        else console.error('❌ "定时任务" 菜单缺失');

        if (hasServer) console.log('✅ "服务监控" 菜单存在');
        else console.error('❌ "服务监控" 菜单缺失');

        // 3. 字典验证 (API 修复验证)
        console.log('\n📚 正在验证字典接口 (Implicit Any 修复验证)...');
        const dictRes = await fetch(`${BASE_URL}/admin/dict`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!dictRes.ok) {
            throw new Error(`字典请求失败: ${dictRes.status} ${dictRes.statusText}`);
        }
        const dictData = await dictRes.json();
        if (dictData.success) {
            console.log('✅ 字典接口调用成功');
        } else {
            console.error('❌ 字典接口返回错误');
        }

    } catch (error) {
        console.error('❌ 验证过程中发生错误:', error);
        process.exit(1);
    }
}

verifyApi();
