<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-lg p-12 text-center">
        <div class="text-6xl mb-6">❌</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">文章加载失败</h2>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <div class="flex gap-4 justify-center">
          <button 
            @click="fetchArticle" 
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
          <router-link 
            to="/articles" 
            class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            返回文章列表
          </router-link>
        </div>
      </div>
    </div>

    <!-- 文章内容 -->
    <div v-else-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 文章头部 -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <!-- 面包屑导航 -->
        <nav class="flex mb-6" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/" class="text-gray-700 hover:text-blue-600">
                首页
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <router-link to="/articles" class="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                  文章列表
                </router-link>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-1 text-gray-500 md:ml-2">{{ article.title }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- 文章标题 -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>
        
        <!-- 文章摘要 -->
        <p v-if="article.summary" class="text-xl text-gray-600 mb-6">{{ article.summary }}</p>
        
        <!-- 文章元信息 -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            发布时间：{{ formatDate(article.published_at) }}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
            </svg>
            阅读量：{{ article.view_count || 0 }}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            点赞数：{{ article.like_count || 0 }}
          </div>
        </div>
        
        <!-- 文章标签 -->
        <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
          <span 
            v-for="tag in article.tags" 
            :key="tag" 
            class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- 文章封面 -->
        <div v-if="article.cover_image" class="mb-6">
          <img 
            :src="article.cover_image" 
            :alt="article.title" 
            class="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>
      
      <!-- 文章正文 -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div class="article-content markdown-content" v-html="formattedContent"></div>
      </div>
      
      <!-- 文章操作 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div class="flex gap-4">
            <button 
              @click="likeArticle" 
              :disabled="liking"
              class="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
              {{ liking ? '点赞中...' : '点赞' }}
            </button>
            <button class="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
              </svg>
              分享
            </button>
          </div>
          <div class="flex gap-2">
            <a 
              v-if="article.wechat_url" 
              :href="article.wechat_url" 
              target="_blank" 
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              微信阅读
            </a>
            <a 
              v-if="article.external_url" 
              :href="article.external_url" 
              target="_blank" 
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              原文链接
            </a>
          </div>
        </div>
      </div>
      
      <!-- 导航按钮 -->
      <div class="flex gap-4 justify-center">
        <router-link 
          to="/articles" 
          class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回文章列表
        </router-link>
        <router-link 
          to="/" 
          class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { renderMarkdown } from '../utils/markdown'
import { formatAbsoluteDate } from '@/utils/dateFormat'

/**
 * 文章详情页面组件
 * 功能：显示文章的详细内容，包括标题、内容、标签、发布时间等信息
 * 作者：SOLO Coding
 * 日期：2025-01-22
 */

const route = useRoute()

// 响应式数据
const article = ref(null)
const loading = ref(true)
const error = ref('')
const liking = ref(false)

// 计算属性：格式化文章内容
const formattedContent = computed(() => {
  if (!article.value?.content) return ''
  
  try {
    // 使用markdown-it渲染器处理内容
    const htmlContent = renderMarkdown(article.value.content)
    
    // 调试日志：打印渲染后的HTML内容
    // Markdown内容已成功渲染
    
    return htmlContent
  } catch (error) {
    console.error('文章内容渲染失败:', error)
    return '<p class="text-red-500">文章内容加载失败</p>'
  }
})

/**
 * 格式化日期（使用绝对时间）
 * 功能：将日期字符串格式化为绝对时间显示
 * 参数：dateString - 日期字符串
 * 返回值：绝对时间字符串
 * 创建日期：2025-01-31
 */
const formatDate = (dateString: string): string => {
  return formatAbsoluteDate(dateString, true)
}

/**
 * 获取文章详情
 * 功能：从Supabase数据库获取指定ID的文章详情
 */
const fetchArticle = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const articleId = route.params.id as string
    
    if (!articleId) {
      throw new Error('文章ID不能为空')
    }
    
    // 从Supabase获取文章数据
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single()
    
    if (fetchError) {
      throw new Error(fetchError.message)
    }
    
    if (!data) {
      throw new Error('文章不存在')
    }
    
    article.value = data
    
    // 增加阅读量
    await incrementViewCount(articleId)
    
  } catch (err: any) {
    console.error('获取文章失败:', err)
    error.value = err.message || '获取文章失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

/**
 * 增加文章阅读量
 * @param {string} articleId - 文章ID
 */
const incrementViewCount = async (articleId: string) => {
  try {
    const { error } = await supabase
      .from('articles')
      .update({ 
        view_count: (article.value?.view_count || 0) + 1 
      })
      .eq('id', articleId)
    
    if (error) {
      console.error('更新阅读量失败:', error)
    } else if (article.value) {
      article.value.view_count = (article.value.view_count || 0) + 1
    }
  } catch (err) {
    console.error('更新阅读量失败:', err)
  }
}

/**
 * 点赞文章
 * 功能：增加文章的点赞数
 */
const likeArticle = async () => {
  if (!article.value || liking.value) return
  
  try {
    liking.value = true
    
    const { error } = await supabase
      .from('articles')
      .update({ 
        like_count: (article.value.like_count || 0) + 1 
      })
      .eq('id', article.value.id)
    
    if (error) {
      throw new Error(error.message)
    }
    
    // 更新本地数据
    article.value.like_count = (article.value.like_count || 0) + 1
    
  } catch (err: any) {
    console.error('点赞失败:', err)
    alert('点赞失败，请稍后重试')
  } finally {
    liking.value = false
  }
}

// 组件挂载时获取文章数据
onMounted(() => {
  fetchArticle()
})
</script>

<style>
/* 导入Markdown样式 */
@import '../styles/markdown.css';
</style>

<style scoped>
/* 文章详情页面样式 */
.article-detail {
  min-height: 100vh;
}

.article-content {
  line-height: 1.8;
}

.article-meta {
  color: #666;
}

.article-actions {
  border-top: 1px solid #e5e7eb;
}

.navigation-buttons {
  border-top: 1px solid #e5e7eb;
}
</style>