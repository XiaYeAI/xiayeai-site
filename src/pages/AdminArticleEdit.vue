<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/admin/articles" class="text-indigo-600 hover:text-indigo-500 mr-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </router-link>
            <h1 class="text-xl font-semibold text-gray-900">
              {{ isEditing ? '编辑文章' : '新建文章' }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="saveDraft"
              :disabled="saving"
              class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {{ saving ? '保存中...' : '保存草稿' }}
            </button>
            <button
              @click="publishArticle"
              :disabled="saving || !canPublish"
              class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {{ saving ? '发布中...' : '发布文章' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <form @submit.prevent="saveDraft">
            <!-- 文章标题 -->
            <div class="mb-6">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                placeholder="请输入文章标题"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 文章摘要 -->
            <div class="mb-6">
              <label for="summary" class="block text-sm font-medium text-gray-700 mb-2">
                文章摘要
              </label>
              <textarea
                id="summary"
                v-model="form.summary"
                rows="3"
                placeholder="请输入文章摘要（可选）"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- 封面图片 -->
            <div class="mb-6">
              <label for="cover_image" class="block text-sm font-medium text-gray-700 mb-2">
                封面图片
              </label>
              <div class="flex items-center space-x-4">
                <input
                  id="cover_image"
                  v-model="form.cover_image"
                  type="url"
                  placeholder="请输入图片URL"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="generateCoverImage"
                  class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                  AI生成
                </button>
              </div>
              <div v-if="form.cover_image" class="mt-2">
                <img
                  :src="form.cover_image"
                  alt="封面预览"
                  class="w-32 h-20 object-cover rounded-md border border-gray-200"
                  @error="handleImageError"
                />
              </div>
            </div>

            <!-- 文章内容 -->
            <div class="mb-6">
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                文章内容 *
              </label>
              <textarea
                id="content"
                v-model="form.content"
                rows="20"
                required
                placeholder="请输入文章内容（支持Markdown格式）"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">支持Markdown语法</p>
            </div>

            <!-- 文章标签 -->
            <div class="mb-6">
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                文章标签
              </label>
              <input
                id="tags"
                v-model="tagsInput"
                type="text"
                placeholder="请输入标签，用逗号分隔"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div v-if="form.tags && form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(tag)"
                    class="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <!-- SEO设置 -->
            <div class="mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">SEO设置</h3>
              
              <!-- SEO字段已移除，因为数据库表中不存在这些字段 -->
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { checkAdminPermission, logAdminAction, getCurrentAdmin } from '@/lib/auth'
import { getArticleById, createArticle, updateArticle } from '@/lib/supabase'
import type { Article } from '@/lib/supabase'

/**
 * 文章编辑页面组件
 * 创建日期：2024-12-19
 * 功能：创建和编辑文章
 */

const router = useRouter()
const route = useRoute()

// 响应式数据
const saving = ref(false)
const isEditing = computed(() => !!route.params.id)
const tagsInput = ref('')

// 表单数据
const form = ref<Partial<Article>>({
  title: '',
  content: '',
  summary: null,
  cover_image: null,
  tags: null
})

// 计算属性：是否可以发布
const canPublish = computed(() => {
  return form.value.title && form.value.content
})

/**
 * 处理图片加载错误
 */
const handleImageError = () => {
  form.value.cover_image = ''
}

/**
 * 生成封面图片
 */
const generateCoverImage = () => {
  if (!form.value.title) {
    alert('请先输入文章标题')
    return
  }
  
  // 使用文章标题生成图片
  const prompt = encodeURIComponent(`${form.value.title} article cover image, modern design, professional`)
  form.value.cover_image = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_16_9`
}

/**
 * 移除标签
 * @param tagToRemove 要移除的标签
 */
const removeTag = (tagToRemove: string) => {
  if (form.value.tags) {
    form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove)
    updateTagsInput()
  }
}

/**
 * 更新标签输入框
 */
const updateTagsInput = () => {
  tagsInput.value = form.value.tags?.join(', ') || ''
}

/**
 * 解析标签输入
 */
const parseTagsInput = () => {
  if (tagsInput.value) {
    form.value.tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  } else {
    form.value.tags = []
  }
}

/**
 * 保存草稿
 */
const saveDraft = async () => {
  if (!form.value.title || !form.value.content) {
    alert('请填写标题和内容')
    return
  }
  
  saving.value = true
  
  try {
    parseTagsInput()
    
    const articleData = {
      title: form.value.title || '',
      summary: form.value.summary || '',
      content: form.value.content || '',
      cover_image: form.value.cover_image || '',
      wechat_url: form.value.wechat_url || '',
      tags: form.value.tags || [],
      status: (form.value.status || 'draft') as 'draft' | 'published',
      read_count: form.value.read_count || 0,
      like_count: form.value.like_count || 0,
      published_at: form.value.published_at || null
    }
    
    if (isEditing.value) {
      await updateArticle(route.params.id as string, articleData)
      const currentAdmin = getCurrentAdmin()
      if (currentAdmin) {
        await logAdminAction(currentAdmin.id, 'update_draft', 'article', route.params.id as string, {
          title: form.value.title
        })
      }
      alert('草稿已保存')
    } else {
      const newArticle = await createArticle(articleData)
      const currentAdmin = getCurrentAdmin()
      if (currentAdmin) {
        await logAdminAction(currentAdmin.id, 'create_draft', 'article', newArticle.id, {
          title: form.value.title
        })
      }
      alert('草稿已保存')
      router.replace(`/admin/articles/edit/${newArticle.id}`)
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

/**
 * 发布文章
 */
const publishArticle = async () => {
  if (!canPublish.value) {
    alert('请填写完整的文章信息')
    return
  }
  
  saving.value = true
  
  try {
    parseTagsInput()
    
    const articleData = {
      title: form.value.title || '',
      summary: form.value.summary || '',
      content: form.value.content || '',
      cover_image: form.value.cover_image || '',
      wechat_url: form.value.wechat_url || '',
      tags: form.value.tags || [],
      status: 'published' as 'draft' | 'published',
      read_count: form.value.read_count || 0,
      like_count: form.value.like_count || 0,
      published_at: new Date().toISOString()
    }
    
    if (isEditing.value) {
      await updateArticle(route.params.id as string, articleData)
      const currentAdmin = getCurrentAdmin()
      if (currentAdmin) {
        await logAdminAction(currentAdmin.id, 'publish', 'article', route.params.id as string, {
          title: form.value.title
        })
      }
      alert('文章已发布')
    } else {
      const newArticle = await createArticle(articleData)
      const currentAdmin = getCurrentAdmin()
      if (currentAdmin) {
        await logAdminAction(currentAdmin.id, 'create_and_publish', 'article', newArticle.id, {
          title: form.value.title
        })
      }
      alert('文章已发布')
      router.replace(`/admin/articles/edit/${newArticle.id}`)
    }
    
    router.push('/admin/articles')
  } catch (error) {
    console.error('发布文章失败:', error)
    alert('发布失败，请重试')
  } finally {
    saving.value = false
  }
}

/**
 * 加载文章数据（编辑模式）
 */
const loadArticle = async () => {
  if (!isEditing.value) return
  
  try {
    const article = await getArticleById(route.params.id as string)
    if (article) {
      form.value = { ...article }
      updateTagsInput()
    } else {
      alert('文章不存在')
      router.push('/admin/articles')
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    alert('加载文章失败')
    router.push('/admin/articles')
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

// 监听标签输入变化
watch(tagsInput, () => {
  parseTagsInput()
})

// 组件挂载时执行
onMounted(() => {
  checkPermission()
  loadArticle()
})
</script>