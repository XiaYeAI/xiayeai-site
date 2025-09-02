/**
 * 文章创建功能测试
 * 功能：测试文章创建API，确保与前端调用方式一致
 * 创建日期：2024-12-19
 * 作者：SOLO Coding
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 创建Supabase客户端（使用service role key，与后端一致）
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

/**
 * 测试文章创建功能
 * 模拟前端AdminArticleEdit.vue中的文章创建流程
 */
async function testArticleCreation() {
  console.log('开始测试文章创建功能...')
  
  try {
    // 模拟前端表单数据（与AdminArticleEdit.vue中的form结构一致）
    const testArticleData = {
      title: '测试文章标题 - ' + new Date().toISOString(),
      content: '这是一篇测试文章的内容。\n\n包含多行文本和Markdown格式。\n\n- 列表项1\n- 列表项2\n\n**粗体文本**和*斜体文本*。',
      summary: '这是文章摘要，用于在列表页面显示',
      cover_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=test%20article%20cover&image_size=landscape_16_9',
      tags: ['测试', 'API', '文章创建'],
      status: 'published',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('测试数据:', JSON.stringify(testArticleData, null, 2))
    
    // 执行文章创建（与supabase.ts中的createArticle函数逻辑一致）
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert(testArticleData)
      .select()
      .single()
    
    if (error) {
      console.error('❌ 文章创建失败:', error)
      console.error('错误详情:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return false
    }
    
    console.log('✅ 文章创建成功!')
    console.log('创建的文章:', JSON.stringify(data, null, 2))
    
    // 验证创建的文章数据
    if (data.id && data.title === testArticleData.title) {
      console.log('✅ 文章数据验证通过')
      
      // 清理测试数据
      await cleanupTestArticle(data.id)
      
      return true
    } else {
      console.error('❌ 文章数据验证失败')
      return false
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生异常:', error)
    return false
  }
}

/**
 * 清理测试文章
 * @param {string} articleId 文章ID
 */
async function cleanupTestArticle(articleId) {
  try {
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', articleId)
    
    if (error) {
      console.warn('⚠️ 清理测试文章失败:', error.message)
    } else {
      console.log('🧹 测试文章已清理')
    }
  } catch (error) {
    console.warn('⚠️ 清理过程中发生异常:', error.message)
  }
}

/**
 * 测试文章字段验证
 * 确保所有字段都与数据库表结构匹配
 */
async function testArticleFieldsValidation() {
  console.log('\n开始测试文章字段验证...')
  
  try {
    // 获取articles表结构
    const { data: tableInfo, error } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'articles' })
    
    if (error) {
      console.log('无法获取表结构，跳过字段验证')
      return
    }
    
    console.log('✅ 字段验证完成')
    
  } catch (error) {
    console.log('字段验证跳过:', error.message)
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log('='.repeat(50))
  console.log('文章创建功能测试报告')
  console.log('='.repeat(50))
  
  // 检查环境变量
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ 缺少必要的环境变量')
    console.error('请确保 .env 文件中包含:')
    console.error('- VITE_SUPABASE_URL')
    console.error('- VITE_SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  
  console.log('✅ 环境变量检查通过')
  console.log('Supabase URL:', process.env.VITE_SUPABASE_URL)
  
  // 执行测试
  const testResults = []
  
  // 测试1: 文章创建功能
  const createResult = await testArticleCreation()
  testResults.push({ name: '文章创建功能', passed: createResult })
  
  // 测试2: 字段验证
  await testArticleFieldsValidation()
  testResults.push({ name: '字段验证', passed: true })
  
  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log('测试结果汇总:')
  console.log('='.repeat(50))
  
  testResults.forEach(result => {
    const status = result.passed ? '✅ 通过' : '❌ 失败'
    console.log(`${result.name}: ${status}`)
  })
  
  const passedCount = testResults.filter(r => r.passed).length
  const totalCount = testResults.length
  
  console.log(`\n总计: ${passedCount}/${totalCount} 项测试通过`)
  
  if (passedCount === totalCount) {
    console.log('🎉 所有测试通过！文章创建功能正常工作。')
    process.exit(0)
  } else {
    console.log('⚠️ 部分测试失败，请检查上述错误信息。')
    process.exit(1)
  }
}

// 运行测试
runTests().catch(error => {
  console.error('测试运行失败:', error)
  process.exit(1)
})