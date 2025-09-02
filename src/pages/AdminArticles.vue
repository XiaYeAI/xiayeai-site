<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/admin/dashboard" class="text-indigo-600 hover:text-indigo-500 mr-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </router-link>
            <h1 class="text-xl font-semibold text-gray-900">文章管理</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/admin/articles/new"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              新建文章
            </router-link>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 搜索和筛选 -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章标题或内容..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="statusFilter"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">所有状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
            <button
              @click="loadArticles"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              搜索
            </button>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-sm text-gray-500">加载中...</p>
          </div>

          <div v-else-if="filteredArticles.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">暂无文章</p>
            <router-link
              to="/admin/articles/new"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              创建第一篇文章
            </router-link>
          </div>

          <div v-else class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文章信息
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-16 w-16">
                        <img
                          v-if="article.cover_image"
                          :src="article.cover_image"
                          :alt="article.title"
                          class="h-16 w-16 rounded-lg object-cover"
                        />
                        <div
                          v-else
                          class="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                        >
                          <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                        <div class="text-sm text-gray-500 line-clamp-2">{{ article.summary || '暂无摘要' }}</div>
                        <div class="text-xs text-gray-400 mt-1">
                          阅读量: {{ article.read_count || 0 }} | 点赞: {{ article.like_count || 0 }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': article.status === 'published',
                        'bg-yellow-100 text-yellow-800': article.status === 'draft'
                      }"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ article.status === 'published' ? '已发布' : '草稿' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(article.published_at || article.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <router-link
                        :to="`/admin/articles/edit/${article.id}`"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        编辑
                      </router-link>
                      <button
                        @click="toggleStatus(article)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        {{ article.status === 'published' ? '下线' : '发布' }}
                      </button>
                      <button
                        @click="deleteArticle(article)"
                        class="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">确认删除</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              确定要删除文章 "{{ articleToDelete?.title }}" 吗？此操作不可撤销。
            </p>
          </div>
          <div class="flex justify-center space-x-4 mt-4">
            <button
              @click="showDeleteDialog = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              取消
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogout, checkAdminPermission, logAdminAction, getCurrentAdmin } from '@/lib/auth'
import { getArticles, updateArticle, deleteArticle as deleteArticleFromDB } from '@/lib/supabase'
import type { Article } from '@/lib/supabase'
import { formatAdminDate } from '@/utils/dateFormat'

/**
 * 文章管理页面组件
 * 创建日期：2024-12-19
 * 功能：管理文章的增删改查操作
 */

const router = useRouter()

// 响应式数据
const articles = ref<Article[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const showDeleteDialog = ref(false)
const articleToDelete = ref<Article | null>(null)

// 计算属性：过滤后的文章列表
const filteredArticles = computed(() => {
  let filtered = articles.value

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      (article.content && article.content.toLowerCase().includes(query)) ||
      (article.summary && article.summary.toLowerCase().includes(query))
    )
  }

  // 按状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(article => article.status === statusFilter.value)
  }

  return filtered
})

/**
 * 处理登出
 */
const handleLogout = () => {
  adminLogout()
  router.push('/admin/login')
}

/**
 * 格式化日期（使用管理后台格式）
 * 功能：将日期字符串格式化为管理后台表格显示的格式
 * 参数：dateString - 日期字符串
 * 返回值：管理后台日期时间字符串
 * 创建日期：2025-01-31
 */
const formatDate = (dateString: string) => {
  return formatAdminDate(dateString)
}

/**
 * 加载文章列表
 */
const loadArticles = async () => {
  loading.value = true
  try {
    articles.value = await getArticles()
  } catch (error) {
    console.error('加载文章失败:', error)
    alert('加载文章失败，请重试')
  } finally {
    loading.value = false
  }
}

/**
 * 切换文章状态（发布/下线）
 * @param article 文章对象
 */
const toggleStatus = async (article: Article) => {
  try {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    const updateData: Partial<Article> = {
      status: newStatus
    }
    
    // 如果是发布，设置发布时间
    if (newStatus === 'published') {
      updateData.published_at = new Date().toISOString()
    }
    
    await updateArticle(article.id, updateData)
    
    // 更新本地数据
    const index = articles.value.findIndex(a => a.id === article.id)
    if (index !== -1) {
      articles.value[index] = { ...articles.value[index], ...updateData }
    }
    
    // 记录操作日志
    const currentAdmin = getCurrentAdmin()
    await logAdminAction(currentAdmin?.id || '', `${newStatus === 'published' ? '发布' : '下线'}文章: ${article.title}`, 'article', article.id, { status: newStatus })
    
    alert(`文章已${newStatus === 'published' ? '发布' : '下线'}`)
  } catch (error) {
    console.error('更新文章状态失败:', error)
    alert('操作失败，请重试')
  }
}

/**
 * 删除文章
 * @param article 文章对象
 */
const deleteArticle = (article: Article) => {
  articleToDelete.value = article
  showDeleteDialog.value = true
}

/**
 * 确认删除文章
 */
const confirmDelete = async () => {
  if (!articleToDelete.value) return
  
  try {
    await deleteArticleFromDB(articleToDelete.value.id)
    
    // 从本地列表中移除
    articles.value = articles.value.filter(a => a.id !== articleToDelete.value!.id)
    
    // 记录操作日志
    const currentAdmin = getCurrentAdmin()
    await logAdminAction(currentAdmin?.id || '', `删除文章: ${articleToDelete.value.title}`, 'article', articleToDelete.value.id, { title: articleToDelete.value.title })
    
    alert('文章已删除')
  } catch (error) {
    console.error('删除文章失败:', error)
    alert('删除失败，请重试')
  } finally {
    showDeleteDialog.value = false
    articleToDelete.value = null
  }
}

/**
 * 检查管理员权限
 */
const checkPermission = () => {
  if (!checkAdminPermission()) {
    router.push('/admin/login')
    return
  }
}

// 组件挂载时执行
onMounted(() => {
  checkPermission()
  loadArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>