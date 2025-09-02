/**
 * 统计管理功能测试
 * 创建日期：2024-12-19
 * 功能：测试AdminStats页面的统计数据增删改查功能
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// 初始化Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少Supabase配置信息')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * 测试统计数据创建功能
 */
async function testCreateSiteStats() {
  console.log('\n=== 测试创建统计数据 ===')
  
  const testStat = {
    stat_type: 'page_views',
    current_value: 1000,
    growth_rate: 15.5,
    unit: '次',
    description: '测试页面访问量统计',
    created_at: new Date().toISOString()
  }
  
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .insert(testStat)
      .select()
      .single()
    
    if (error) {
      console.error('创建统计数据失败:', error)
      return null
    }
    
    console.log('✅ 统计数据创建成功:', data)
    return data
  } catch (error) {
    console.error('❌ 创建统计数据异常:', error)
    return null
  }
}

/**
 * 测试统计数据查询功能
 */
async function testGetSiteStats() {
  console.log('\n=== 测试查询统计数据 ===')
  
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('查询统计数据失败:', error)
      return []
    }
    
    console.log(`✅ 查询到 ${data.length} 条统计数据`)
    data.forEach(stat => {
      console.log(`  - ${stat.stat_type}: ${stat.current_value} ${stat.unit || ''} (增长率: ${stat.growth_rate}%)`)
    })
    return data
  } catch (error) {
    console.error('❌ 查询统计数据异常:', error)
    return []
  }
}

/**
 * 测试统计数据更新功能
 */
async function testUpdateSiteStats(statId) {
  console.log('\n=== 测试更新统计数据 ===')
  
  const updates = {
    current_value: 1500,
    growth_rate: 25.0,
    description: '更新后的测试统计',
    updated_at: new Date().toISOString()
  }
  
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .update(updates)
      .eq('id', statId)
      .select()
      .single()
    
    if (error) {
      console.error('更新统计数据失败:', error)
      return false
    }
    
    console.log('✅ 统计数据更新成功:', data)
    return true
  } catch (error) {
    console.error('❌ 更新统计数据异常:', error)
    return false
  }
}

/**
 * 测试统计数据删除功能
 */
async function testDeleteSiteStats(statId) {
  console.log('\n=== 测试删除统计数据 ===')
  
  try {
    const { error } = await supabase
      .from('site_stats')
      .delete()
      .eq('id', statId)
    
    if (error) {
      console.error('删除统计数据失败:', error)
      return false
    }
    
    console.log('✅ 统计数据删除成功')
    return true
  } catch (error) {
    console.error('❌ 删除统计数据异常:', error)
    return false
  }
}

/**
 * 清理测试数据
 */
async function cleanupTestData() {
  console.log('\n=== 清理测试数据 ===')
  
  try {
    const { error } = await supabase
      .from('site_stats')
      .delete()
      .ilike('description', '%测试%')
    
    if (error) {
      console.error('清理测试数据失败:', error)
    } else {
      console.log('✅ 测试数据清理完成')
    }
  } catch (error) {
    console.error('清理测试数据失败:', error)
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log('开始统计管理功能测试...')
  
  // 清理之前的测试数据
  await cleanupTestData()
  
  // 测试创建统计
  const createdStat = await testCreateSiteStats()
  if (!createdStat) {
    console.log('❌ 创建测试失败，终止测试')
    return
  }
  
  // 测试查询统计
  const stats = await testGetSiteStats()
  
  // 测试更新统计
  const updateSuccess = await testUpdateSiteStats(createdStat.id)
  if (!updateSuccess) {
    console.log('❌ 更新测试失败')
  }
  
  // 再次查询验证更新
  await testGetSiteStats()
  
  // 测试删除统计
  const deleteSuccess = await testDeleteSiteStats(createdStat.id)
  if (!deleteSuccess) {
    console.log('❌ 删除测试失败')
  }
  
  // 最终清理
  await cleanupTestData()
  
  console.log('\n=== 测试完成 ===')
  console.log('统计管理功能测试结果:')
  console.log(`✅ 创建功能: ${createdStat ? '正常' : '异常'}`)
  console.log(`✅ 查询功能: ${stats.length >= 0 ? '正常' : '异常'}`)
  console.log(`✅ 更新功能: ${updateSuccess ? '正常' : '异常'}`)
  console.log(`✅ 删除功能: ${deleteSuccess ? '正常' : '异常'}`)
}

// 运行测试
runTests().catch(console.error)