/**
 * 调试管理员登录问题
 * 创建日期：2024-12-19
 * 功能：检查数据库中admin账号的具体信息和密码哈希
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Supabase配置 - 从环境变量读取
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少Supabase配置信息，请检查环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

/**
 * 调试管理员登录
 */
async function debugAdminLogin() {
  console.log('🔍 调试管理员登录问题...')
  
  try {
    // 1. 查询所有管理员账号（使用admin权限）
    console.log('📋 查询所有管理员账号:')
    const { data: allAdmins, error: allError } = await supabaseAdmin
      .from('admin')
      .select('*')
    
    if (allError) {
      console.error('❌ 查询失败:', allError)
    } else {
      console.log(`📊 找到 ${allAdmins.length} 个管理员账号:`)
      allAdmins.forEach(admin => {
        console.log(`  - ID: ${admin.id}, 用户名: ${admin.username}, 邮箱: ${admin.email}, 角色: ${admin.role}`)
      })
    }
 
    // 2. 查找用户名为admin的账号
    console.log('\n🔍 查找用户名为admin的账号:')
    const { data: adminUsers, error: findError } = await supabaseAdmin
      .from('admin')
      .select('*')
      .eq('username', 'admin')
    
    const adminUser = adminUsers && adminUsers.length > 0 ? adminUsers[0] : null
    
    // 3. 查找邮箱为admin@example.com的账号
    console.log('\n🔍 查找邮箱为admin@example.com的账号:')
    const { data: emailUsers, error: emailError } = await supabaseAdmin
      .from('admin')
      .select('*')
      .eq('email', 'admin@example.com')
    
    const emailUser = emailUsers && emailUsers.length > 0 ? emailUsers[0] : null
    
    if (findError || !adminUser) {
      console.log('❌ 未找到用户名为admin的账号')
      console.log('错误信息:', findError?.message)
      
      if (emailError || !emailUser) {
        console.log('❌ 未找到邮箱为admin@example.com的账号')
        
        // 创建admin账号
        console.log('\n🔧 创建admin账号...')
        const passwordHash = await bcrypt.hash('admin123', 10)
        
        const { data: newAdmin, error: createError } = await supabaseAdmin
          .from('admin')
          .insert({
            username: 'admin',
            email: 'admin@example.com',
            name: '系统管理员',
            password_hash: passwordHash,
            role: 'super_admin',
            is_active: true
          })
          .select()
          .single()
        
        if (createError) {
          console.error('❌ 创建admin账号失败:', createError)
        } else {
          console.log('✅ 成功创建admin账号')
          console.log('📋 新账号信息:', newAdmin)
        }
      } else {
        console.log('✅ 找到邮箱为admin@example.com的账号，但用户名不是admin')
        console.log('📋 账号信息:', emailUser)
        
        // 更新用户名为admin
        console.log('\n🔧 更新用户名为admin...')
        const { error: updateError } = await supabaseAdmin
          .from('admin')
          .update({ username: 'admin' })
          .eq('id', emailUser.id)
        
        if (updateError) {
          console.error('❌ 更新用户名失败:', updateError)
        } else {
          console.log('✅ 成功更新用户名为admin')
        }
      }
      
    } else {
      console.log('✅ 找到admin账号:')
      console.log(`   ID: ${adminUser.id}`)
      console.log(`   用户名: ${adminUser.username}`)
      console.log(`   邮箱: ${adminUser.email}`)
      console.log(`   密码哈希: ${adminUser.password_hash}`)
      console.log(`   状态: ${adminUser.is_active ? '激活' : '禁用'}`)
      
      // 4. 验证密码
      console.log('\n🔐 验证密码:')
      const isValidPassword = await bcrypt.compare('admin123', adminUser.password_hash)
      console.log(`   密码验证结果: ${isValidPassword ? '✅ 正确' : '❌ 错误'}`)
      
      if (!isValidPassword) {
        console.log('\n🔧 更新密码哈希...')
        const newPasswordHash = await bcrypt.hash('admin123', 10)
        
        const { error: updateError } = await supabaseAdmin
          .from('admin')
          .update({ password_hash: newPasswordHash })
          .eq('id', adminUser.id)
        
        if (updateError) {
          console.error('❌ 更新密码失败:', updateError)
        } else {
          console.log('✅ 密码哈希已更新')
        }
      }
    }
    
    // 5. 测试登录流程
    console.log('\n🧪 测试登录流程:')
    const { data: testAdmin, error: testError } = await supabaseAdmin
      .from('admin')
      .select('*')
      .eq('username', 'admin')
      .eq('is_active', true)
      .single()
    
    if (testError || !testAdmin) {
      console.log('❌ 登录测试失败: 未找到激活的admin账号')
      return
    }
    
    const passwordValid = await bcrypt.compare('admin123', testAdmin.password_hash)
    console.log(`   查找账号: ✅ 成功`)
    console.log(`   密码验证: ${passwordValid ? '✅ 成功' : '❌ 失败'}`)
    
    if (passwordValid) {
      console.log('\n🎉 登录测试通过！admin/admin123 应该可以正常登录')
    } else {
      console.log('\n❌ 登录测试失败！密码验证不通过')
    }
    
  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error)
  }
}

// 运行调试
debugAdminLogin().then(() => {
  console.log('\n🏁 调试完成')
}).catch(error => {
  console.error('❌ 调试失败:', error)
})