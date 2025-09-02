/**
 * 管理员后台接口测试程序
 * 功能：测试管理员登录认证、文章管理、社交平台管理、统计管理等所有接口
 * 作者：SOLO Coding
 * 日期：2025-01-19
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Supabase 配置 - 从环境变量读取
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('缺少Supabase配置信息，请检查环境变量');
  process.exit(1);
}

// 创建 Supabase 客户端（使用 service key 进行管理操作）
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * 测试结果记录
 */
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * 记录测试结果
 * @param {string} testName - 测试名称
 * @param {boolean} passed - 是否通过
 * @param {string} error - 错误信息
 */
function logTest(testName, passed, error = null) {
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, error });
    console.log(`❌ ${testName}: ${error}`);
  }
}

/**
 * 检查管理员账号是否存在
 */
async function checkAdminAccount() {
  console.log('\n🔍 检查管理员账号...');
  
  try {
    // 查询所有管理员账号
    const { data: admins, error } = await supabase
      .from('admin')
      .select('*');
    
    if (error) {
      logTest('查询管理员表', false, error.message);
      return false;
    }
    
    logTest('查询管理员表', true);
    console.log(`📊 找到 ${admins.length} 个管理员账号`);
    
    if (admins.length === 0) {
      console.log('⚠️  没有找到任何管理员账号，需要创建内置管理员账号');
      return await createDefaultAdmin();
    }
    
    // 检查是否存在 admin 用户名的账号
    const adminUser = admins.find(admin => admin.username === 'admin' || admin.email === 'admin@example.com');
    
    if (adminUser) {
      logTest('找到admin账号', true);
      console.log('👤 管理员账号信息:', {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        is_active: adminUser.is_active
      });
      
      // 测试密码验证
      const passwordMatch = await bcrypt.compare('admin123', adminUser.password_hash);
      logTest('密码验证', passwordMatch, passwordMatch ? null : '密码不匹配');
      
      return passwordMatch;
    } else {
      logTest('找到admin账号', false, '未找到用户名为admin的账号');
      console.log('📋 现有管理员账号:');
      admins.forEach(admin => {
        console.log(`  - ${admin.username || admin.email} (${admin.name || 'N/A'})`);
      });
      return await createDefaultAdmin();
    }
  } catch (error) {
    logTest('检查管理员账号', false, error.message);
    return false;
  }
}

/**
 * 创建默认管理员账号
 */
async function createDefaultAdmin() {
  console.log('\n🔧 创建默认管理员账号...');
  
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const { data, error } = await supabase
      .from('admin')
      .insert({
        username: 'admin',
        email: 'admin@example.com',
        password_hash: passwordHash,
        name: '系统管理员',
        role: 'admin',
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      logTest('创建默认管理员', false, error.message);
      return false;
    }
    
    logTest('创建默认管理员', true);
    console.log('✨ 默认管理员账号创建成功:', {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com'
    });
    
    return true;
  } catch (error) {
    logTest('创建默认管理员', false, error.message);
    return false;
  }
}

/**
 * 测试管理员登录
 */
async function testAdminLogin() {
  console.log('\n🔐 测试管理员登录...');
  
  try {
    // 查找管理员账号
    const { data: admin, error: findError } = await supabase
      .from('admin')
      .select('*')
      .or('username.eq.admin,email.eq.admin@example.com')
      .single();
    
    if (findError) {
      logTest('查找管理员账号', false, findError.message);
      return null;
    }
    
    logTest('查找管理员账号', true);
    
    // 验证密码
    const passwordMatch = await bcrypt.compare('admin123', admin.password_hash);
    logTest('密码验证', passwordMatch, passwordMatch ? null : '密码不匹配');
    
    if (passwordMatch) {
      // 更新最后登录时间
      const { error: updateError } = await supabase
        .from('admin')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', admin.id);
      
      logTest('更新登录时间', !updateError, updateError?.message);
      
      return admin;
    }
    
    return null;
  } catch (error) {
    logTest('管理员登录测试', false, error.message);
    return null;
  }
}

/**
 * 测试文章管理接口
 */
async function testArticleManagement() {
  console.log('\n📝 测试文章管理接口...');
  
  try {
    // 测试获取文章列表
    const { data: articles, error: getError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    logTest('获取文章列表', !getError, getError?.message);
    console.log(`📊 找到 ${articles?.length || 0} 篇文章`);
    
    // 测试创建文章
    const testArticle = {
      title: '测试文章',
      summary: '这是一篇测试文章',
      content: '测试文章内容',
      status: 'draft',
      tags: ['测试'],
      cover_image: 'https://example.com/test.jpg'
    };
    
    const { data: newArticle, error: createError } = await supabase
      .from('articles')
      .insert(testArticle)
      .select()
      .single();
    
    logTest('创建文章', !createError, createError?.message);
    
    if (newArticle) {
      // 测试更新文章
      const { error: updateError } = await supabase
        .from('articles')
        .update({ title: '更新后的测试文章' })
        .eq('id', newArticle.id);
      
      logTest('更新文章', !updateError, updateError?.message);
      
      // 测试删除文章
      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', newArticle.id);
      
      logTest('删除文章', !deleteError, deleteError?.message);
    }
  } catch (error) {
    logTest('文章管理测试', false, error.message);
  }
}

/**
 * 测试社交平台管理接口
 */
async function testSocialPlatformManagement() {
  console.log('\n🌐 测试社交平台管理接口...');
  
  try {
    // 测试获取社交平台列表
    const { data: platforms, error: getError } = await supabase
      .from('social_platforms')
      .select('*')
      .order('sort_order', { ascending: true });
    
    logTest('获取社交平台列表', !getError, getError?.message);
    console.log(`📊 找到 ${platforms?.length || 0} 个社交平台`);
    
    // 测试创建社交平台
    const testPlatform = {
      name: '测试平台',
      platform_type: 'other',
      url: 'https://test.com',
      follower_count: 1000,
      description: '测试平台描述',
      is_active: true,
      sort_order: 999
    };
    
    const { data: newPlatform, error: createError } = await supabase
      .from('social_platforms')
      .insert(testPlatform)
      .select()
      .single();
    
    logTest('创建社交平台', !createError, createError?.message);
    
    if (newPlatform) {
      // 测试更新社交平台
      const { error: updateError } = await supabase
        .from('social_platforms')
        .update({ follower_count: 2000 })
        .eq('id', newPlatform.id);
      
      logTest('更新社交平台', !updateError, updateError?.message);
      
      // 测试删除社交平台
      const { error: deleteError } = await supabase
        .from('social_platforms')
        .delete()
        .eq('id', newPlatform.id);
      
      logTest('删除社交平台', !deleteError, deleteError?.message);
    }
  } catch (error) {
    logTest('社交平台管理测试', false, error.message);
  }
}

/**
 * 测试统计管理接口
 */
async function testStatsManagement() {
  console.log('\n📊 测试统计管理接口...');
  
  try {
    // 测试获取统计数据
    const { data: stats, error: getError } = await supabase
      .from('site_stats')
      .select('*')
      .order('updated_at', { ascending: false });
    
    logTest('获取统计数据', !getError, getError?.message);
    console.log(`📊 找到 ${stats?.length || 0} 条统计记录`);
    
    // 测试创建/更新统计数据
    const testStats = {
      total_followers: 5000,
      total_articles: 100,
      total_partners: 10,
      total_platforms: 5
    };
    
    // 先尝试获取现有统计记录
    const { data: existingStats } = await supabase
      .from('site_stats')
      .select('*')
      .limit(1)
      .single();
    
    if (existingStats) {
      // 更新现有记录
      const { error: updateError } = await supabase
        .from('site_stats')
        .update(testStats)
        .eq('id', existingStats.id);
      
      logTest('更新统计数据', !updateError, updateError?.message);
    } else {
      // 创建新记录
      const { error: createError } = await supabase
        .from('site_stats')
        .insert(testStats);
      
      logTest('创建统计数据', !createError, createError?.message);
    }
  } catch (error) {
    logTest('统计管理测试', false, error.message);
  }
}

/**
 * 测试管理员日志记录
 */
async function testAdminLogs(adminId) {
  console.log('\n📋 测试管理员日志记录...');
  
  try {
    // 创建测试日志
    const testLog = {
      admin_id: adminId,
      action: 'test_action',
      target_type: 'test',
      target_id: 'test-id',
      details: { test: true },
      ip_address: '127.0.0.1',
      user_agent: 'Test Agent'
    };
    
    const { error: createError } = await supabase
      .from('admin_logs')
      .insert(testLog);
    
    logTest('创建管理员日志', !createError, createError?.message);
    
    // 获取日志列表
    const { data: logs, error: getError } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    logTest('获取管理员日志', !getError, getError?.message);
    console.log(`📊 找到 ${logs?.length || 0} 条日志记录`);
  } catch (error) {
    logTest('管理员日志测试', false, error.message);
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log('🚀 开始管理员后台接口测试\n');
  console.log('=' .repeat(50));
  
  // 1. 检查管理员账号
  const adminExists = await checkAdminAccount();
  
  if (!adminExists) {
    console.log('\n❌ 管理员账号检查失败，无法继续测试');
    return;
  }
  
  // 2. 测试管理员登录
  const admin = await testAdminLogin();
  
  if (!admin) {
    console.log('\n❌ 管理员登录失败，无法继续测试');
    return;
  }
  
  // 3. 测试各个管理模块
  await testArticleManagement();
  await testSocialPlatformManagement();
  await testStatsManagement();
  await testAdminLogs(admin.id);
  
  // 输出测试结果
  console.log('\n' + '=' .repeat(50));
  console.log('📊 测试结果汇总:');
  console.log(`✅ 通过: ${testResults.passed}`);
  console.log(`❌ 失败: ${testResults.failed}`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ 失败的测试:');
    testResults.errors.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`);
    });
  }
  
  if (testResults.failed === 0) {
    console.log('\n🎉 所有测试通过！管理员后台系统运行正常。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关功能。');
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  checkAdminAccount,
  testAdminLogin,
  testArticleManagement,
  testSocialPlatformManagement,
  testStatsManagement
};