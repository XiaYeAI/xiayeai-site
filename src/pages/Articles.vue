<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            公众号文章
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            阅读最新的AI技术文章，深入了解人工智能前沿技术
          </p>
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">加载文章中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-8">
          <div class="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">加载失败</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchArticles" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-else-if="articles.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article 
          v-for="article in articles" 
          :key="article.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- 文章封面 -->
          <div class="aspect-video bg-gray-200 relative overflow-hidden">
            <img 
              v-if="article.cover_image" 
              :src="article.cover_image" 
              :alt="article.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500">
              <span class="text-white text-4xl">📝</span>
            </div>
            <!-- 特色标签 -->
            <div v-if="article.is_featured" class="absolute top-2 left-2">
              <span class="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                精选
              </span>
            </div>
          </div>

          <!-- 文章内容 -->
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {{ article.title }}
            </h2>
            <p v-if="article.summary" class="text-gray-600 mb-4 line-clamp-3">
              {{ article.summary }}
            </p>
            
            <!-- 标签 -->
            <div v-if="article.tags && article.tags.length > 0" class="mb-4">
              <span 
                v-for="tag in article.tags.slice(0, 3)" 
                :key="tag"
                class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 文章信息 -->
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div class="flex items-center space-x-4">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ article.view_count || 0 }}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                  </svg>
                  {{ article.like_count || 0 }}
                </span>
              </div>
              <span v-if="article.published_at">
                {{ formatDate(article.published_at) }}
              </span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex space-x-2">
              <a 
                v-if="article.wechat_url" 
                :href="article.wechat_url" 
                target="_blank"
                class="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                阅读原文
              </a>
              <router-link 
                v-else
                :to="`/article/${article.id}`"
                class="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                查看详情
              </router-link>
              <a 
                v-if="article.external_url" 
                :href="article.external_url" 
                target="_blank"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                外链
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <div class="bg-white rounded-lg shadow-lg p-12">
          <div class="text-6xl mb-6">📚</div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            暂无文章
          </h2>
          <p class="text-gray-600 mb-8">
            还没有发布任何文章，敬请期待！
          </p>
          <router-link 
            to="/" 
            class="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { formatAbsoluteDate } from '@/utils/dateFormat'

/**
 * Articles 公众号文章页面
 * 功能：展示公众号文章列表，从Supabase数据库获取文章数据
 * 创建日期：2024-12-19
 * 更新日期：2025-01-31
 */

// 文章数据类型定义
interface Article {
  id: string
  title: string
  summary?: string
  content?: string
  cover_image?: string
  wechat_url?: string
  external_url?: string
  published_at?: string
  view_count?: number
  like_count?: number
  is_featured?: boolean
  status?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
}



// 响应式数据
const articles = ref<Article[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

/**
 * 获取文章列表
 * 功能：从Supabase数据库获取已发布的文章列表
 * 参数：无
 * 返回值：无
 * 创建日期：2025-01-31
 */
const fetchArticles = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      throw fetchError
    }
    
    articles.value = data || []
  } catch (err) {
    console.error('获取文章列表失败:', err)
    error.value = err instanceof Error ? err.message : '获取文章列表失败'
  } finally {
    loading.value = false
  }
}

/**
 * 格式化日期（使用绝对时间）
 * 功能：将ISO日期字符串格式化为绝对时间显示
 * 参数：dateString - ISO日期字符串
 * 返回值：绝对时间字符串
 * 创建日期：2025-01-31
 */
const formatDate = (dateString: string): string => {
  return formatAbsoluteDate(dateString, false)
}

// 组件挂载时获取文章列表
onMounted(() => {
  fetchArticles()
})

// 页面元信息
const title = '公众号文章 - 夏叶AI加油站'
const description = '阅读夏叶AI加油站的技术文章，深入了解AI前沿技术'
</script>

<style scoped>
/* 页面特定样式 */
</style>