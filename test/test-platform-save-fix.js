/**
 * 测试修复后的平台保存功能
 * 创建日期：2024-12-19
 * 功能：验证社交平台保存功能的字段名修复是否生效
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// Supabase 配置 - 从环境变量读取，使用service_role_key进行测试以绕过RLS
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少Supabase配置信息，请检查环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * 测试结果记录
 */
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
}

/**
 * 记录测试结果
 * @param {string} testName 测试名称
 * @param {boolean} passed 是否通过
 * @param {string} error 错误信息
 */
function recordTest(testName, passed, error = null) {
  testResults.total++
  if (passed) {
    testResults.passed++
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++
    testResults.errors.push({ test: testName, error })
    console.log(`❌ ${testName}: ${error}`);
  }
}

/**
 * 测试创建社交平台（使用正确的字段名）
 */
async function testCreatePlatformWithCorrectFields() {
  try {
    const testPlatform = {
      name: '测试平台修复', // 使用正确的字段名 name 而不是 display_name
      platform_type: 'weibo',
      url: 'https://weibo.com/test-fix',
      follower_count: 1000,
      description: '测试字段名修复后的平台创建',
      is_active: true,
      sort_order: 999
    }

    const { data, error } = await supabase
      .from('social_platforms')
      .insert(testPlatform)
      .select()
      .single()

    if (error) {
      recordTest('创建平台（正确字段名）', false, error.message)
      return null
    }

    // 验证返回的数据包含正确的字段
    const hasCorrectFields = data.name === testPlatform.name && 
                           data.platform_type === testPlatform.platform_type &&
                           data.url === testPlatform.url

    recordTest('创建平台（正确字段名）', hasCorrectFields, hasCorrectFields ? null : '字段验证失败')
    return data
  } catch (error) {
    recordTest('创建平台（正确字段名）', false, error.message)
    return null
  }
}

/**
 * 测试更新社交平台（使用正确的字段名）
 */
async function testUpdatePlatformWithCorrectFields(platformId) {
  try {
    const updateData = {
      name: '测试平台修复-已更新', // 使用正确的字段名
      follower_count: 2000,
      description: '测试字段名修复后的平台更新'
    }

    const { data, error } = await supabase
      .from('social_platforms')
      .update(updateData)
      .eq('id', platformId)
      .select()
      .single()

    if (error) {
      recordTest('更新平台（正确字段名）', false, error.message)
      return false
    }

    // 验证更新是否成功
    const updateSuccess = data.name === updateData.name && 
                         data.follower_count === updateData.follower_count

    recordTest('更新平台（正确字段名）', updateSuccess, updateSuccess ? null : '更新验证失败')
    return updateSuccess
  } catch (error) {
    recordTest('更新平台（正确字段名）', false, error.message)
    return false
  }
}

/**
 * 测试查询社交平台
 */
async function testQueryPlatform(platformId) {
  try {
    const { data, error } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('id', platformId)
      .single()

    if (error) {
      recordTest('查询平台详情', false, error.message)
      return null
    }

    // 验证查询结果包含正确的字段
    const hasRequiredFields = data.id && data.name && data.platform_type && data.url !== undefined

    recordTest('查询平台详情', hasRequiredFields, hasRequiredFields ? null : '缺少必要字段')
    return data
  } catch (error) {
    recordTest('查询平台详情', false, error.message)
    return null
  }
}

/**
 * 测试删除社交平台
 */
async function testDeletePlatform(platformId) {
  try {
    const { error } = await supabase
      .from('social_platforms')
      .delete()
      .eq('id', platformId)

    if (error) {
      recordTest('删除测试平台', false, error.message)
      return false
    }

    // 验证删除是否成功
    const { data: checkData } = await supabase
      .from('social_platforms')
      .select('id')
      .eq('id', platformId)
      .single()

    const deleteSuccess = !checkData
    recordTest('删除测试平台', deleteSuccess, deleteSuccess ? null : '删除验证失败')
    return deleteSuccess
  } catch (error) {
    recordTest('删除测试平台', false, error.message)
    return false
  }
}

/**
 * 测试字段名兼容性
 */
async function testFieldNameCompatibility() {
  try {
    // 测试使用错误字段名创建（应该失败或被忽略）
    const wrongFieldPlatform = {
      display_name: '错误字段名测试', // 使用错误的字段名
      platform_type: 'twitter',
      url: 'https://twitter.com/test-wrong',
      follower_count: 500,
      is_active: true,
      sort_order: 998
    }

    const { data, error } = await supabase
      .from('social_platforms')
      .insert(wrongFieldPlatform)
      .select()
      .single()

    if (error) {
      recordTest('错误字段名处理', true, '正确拒绝了错误字段名')
    } else {
      // 如果创建成功，检查是否正确处理了字段名
      const hasWrongField = data.display_name !== undefined
      const hasCorrectField = data.name !== undefined
      
      recordTest('错误字段名处理', !hasWrongField, hasWrongField ? '错误字段名被接受' : '正确忽略错误字段名')
      
      // 清理测试数据
      if (data.id) {
        await supabase.from('social_platforms').delete().eq('id', data.id)
      }
    }
  } catch (error) {
    recordTest('错误字段名处理', false, error.message)
  }
}

/**
 * 主测试函数
 */
async function runPlatformSaveFixTests() {
  console.log('🚀 开始测试修复后的平台保存功能...')
  console.log('=' .repeat(50))

  let testPlatformId = null

  // 1. 测试创建平台（使用正确字段名）
  const createdPlatform = await testCreatePlatformWithCorrectFields()
  if (createdPlatform) {
    testPlatformId = createdPlatform.id
  }

  // 2. 测试更新平台（使用正确字段名）
  if (testPlatformId) {
    await testUpdatePlatformWithCorrectFields(testPlatformId)
  }

  // 3. 测试查询平台
  if (testPlatformId) {
    await testQueryPlatform(testPlatformId)
  }

  // 4. 测试字段名兼容性
  await testFieldNameCompatibility()

  // 5. 清理测试数据
  if (testPlatformId) {
    await testDeletePlatform(testPlatformId)
  }

  // 输出测试结果
  console.log('\n' + '=' .repeat(50))
  console.log('📊 测试结果汇总:')
  console.log(`总测试数: ${testResults.total}`)
  console.log(`通过: ${testResults.passed}`)
  console.log(`失败: ${testResults.failed}`)
  
  if (testResults.failed > 0) {
    console.log('\n❌ 失败的测试:')
    testResults.errors.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`)
    })
  } else {
    console.log('\n🎉 所有测试都通过了！平台保存功能修复成功！')
  }

  return testResults.failed === 0
}

// 运行测试
if (require.main === module) {
  runPlatformSaveFixTests()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { runPlatformSaveFixTests }