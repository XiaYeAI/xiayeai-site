<template>
  <section :class="compact ? '' : 'py-16 bg-white'">
    <div :class="compact ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'">
      <!-- 标题区域 -->
      <div v-if="!compact" class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          最新文章
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          分享最新的AI技术洞察与实践经验
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="article-skeleton">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-meta"></div>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-else-if="latestArticles.length > 0" :class="compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'">
        <article 
          v-for="article in displayArticles" 
          :key="article.id"
          :class="compact ? 'article-card-compact group cursor-pointer' : 'article-card group cursor-pointer'"
          @click="handleArticleClick(article)"
        >
          <!-- 紧凑模式布局 -->
          <template v-if="compact">
            <!-- 文章封面 -->
            <div class="article-image-container w-20 h-20 flex-shrink-0">
              <img 
                :src="article.coverImage || '/images/default-article.jpg'"
                :alt="article.title"
                class="article-image w-full h-full object-cover rounded-lg"
                @error="handleImageError"
                loading="lazy"
              />
            </div>
            
            <!-- 文章内容 -->
            <div class="flex-1 ml-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                {{ article.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-2 line-clamp-2">
                {{ article.summary || '暂无摘要' }}
              </p>
              <div class="flex items-center text-xs text-gray-500">
                <Calendar class="w-3 h-3 mr-1" />
                <span>{{ formatDate(article.publishedAt) }}</span>
              </div>
            </div>
          </template>
          
          <!-- 标准模式布局 -->
          <template v-else>
            <!-- 文章封面 -->
            <div class="article-image-container">
              <img 
                :src="article.coverImage" 
                :alt="article.title"
                class="article-image"
                loading="lazy"
                @error="handleImageError"
              />
              <!-- 悬停遮罩 -->
              <div class="article-overlay">
                <div class="flex items-center justify-center h-full">
                  <div class="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <ExternalLink class="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 文章内容 -->
            <div class="article-content">
              <!-- 发布时间 -->
              <div class="article-meta">
                <time :datetime="article.publishedAt" class="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar class="w-4 h-4" />
                  {{ formatDate(article.publishedAt) }}
                </time>
              </div>

              <!-- 文章标题 -->
              <h3 class="article-title">
                {{ article.title }}
              </h3>

              <!-- 文章摘要 -->
              <p class="article-summary">
                {{ article.summary }}
              </p>

              <!-- 阅读更多 -->
              <div class="article-footer">
                <span class="read-more-link">
                  阅读全文
                  <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </template>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <FileText class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">暂无文章</h3>
        <p class="text-gray-600">精彩内容即将发布，敬请期待</p>
      </div>

      <!-- 查看更多按钮 -->
      <div v-if="latestArticles.length > 0" class="text-center mt-12">
        <button 
          @click="navigateToArticles"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span>查看更多文章</span>
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-3 text-red-700 mb-2">
          <AlertCircle class="w-6 h-6" />
          <span class="font-medium text-lg">文章加载失败</span>
        </div>
        <p class="text-red-600 mb-4">{{ errorMessage }}</p>
        <button 
          @click="handleRetry"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
        >
          <RefreshCw class="w-4 h-4" />
          <span>重试</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, ExternalLink, ArrowRight, FileText, AlertCircle, RefreshCw } from 'lucide-vue-next'
import { useHomeStore, type ArticlePreview } from '@/stores/home'
import { formatRelativeDate } from '@/utils/dateFormat'

/**
 * LatestArticles 最新文章组件
 * 功能：展示最新发布的文章列表，支持点击跳转和错误处理，支持紧凑模式
 * 创建日期：2024-12-19
 * 更新日期：2025-01-31
 */

// Props定义
interface Props {
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

// 路由实例
const router = useRouter()

// 状态管理
const homeStore = useHomeStore()

// 计算属性
const loading = computed(() => homeStore.loading)
const error = computed(() => homeStore.error)
const errorMessage = computed(() => homeStore.errorMessage)
const latestArticles = computed(() => homeStore.latestArticles)

/**
 * 显示的文章列表
 * 功能：根据compact模式决定显示的文章数量
 * 参数：无
 * 返回值：文章列表
 * 创建日期：2025-01-31
 */
const displayArticles = computed(() => {
  if (props.compact) {
    return latestArticles.value.slice(0, 3)
  }
  return latestArticles.value
})

/**
 * 格式化日期（使用相对时间）
 * 功能：将ISO日期字符串格式化为相对时间显示
 * 参数：dateString - ISO日期字符串
 * 返回值：相对时间字符串
 * 创建日期：2025-01-31
 */
const formatDate = (dateString: string): string => {
  return formatRelativeDate(dateString)
}

/**
 * 处理文章点击事件
 * 功能：点击文章卡片时的处理逻辑
 * 创建日期：2024-12-19
 * @param article 文章数据
 */
const handleArticleClick = (article: ArticlePreview): void => {
  // 如果有微信链接，优先跳转到微信文章
  if (article.wechatUrl) {
    window.open(article.wechatUrl, '_blank')
  } else {
    // 否则跳转到内部文章详情页
    router.push(`/article/${article.id}`)
  }
}

/**
 * 处理图片加载错误
 * 功能：当文章封面图片加载失败时显示默认图片
 * 创建日期：2024-12-19
 * @param event 图片错误事件
 */
const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement
  img.src = 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20technology%20article%20cover%20modern%20design%20placeholder&image_size=landscape_4_3'
}

/**
 * 导航到文章列表页
 * 功能：跳转到完整的文章列表页面
 * 创建日期：2024-12-19
 */
const navigateToArticles = (): void => {
  router.push('/articles')
}

/**
 * 处理重试操作
 * 功能：清除错误状态并重新获取数据
 * 创建日期：2024-12-19
 */
const handleRetry = async (): Promise<void> => {
  homeStore.clearError()
  await homeStore.fetchHomeData()
}

// 组件挂载时获取数据
onMounted(() => {
  // 如果文章列表为空，则获取数据
  if (latestArticles.value.length === 0) {
    homeStore.fetchHomeData()
  }
})
</script>

<style scoped>
/* 文章卡片样式 */
.article-card {
  @apply bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2;
}

/* 紧凑模式文章卡片样式 */
.article-card-compact {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 flex items-center p-4;
}

.article-image-container {
  @apply relative overflow-hidden;
}

.article-image {
  @apply w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105;
}

.article-overlay {
  @apply absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

.article-content {
  @apply p-6;
}

.article-meta {
  @apply mb-3;
}

.article-title {
  @apply text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200;
}

.article-summary {
  @apply text-gray-600 mb-4 line-clamp-3 leading-relaxed;
}

.article-footer {
  @apply flex items-center justify-between;
}

.read-more-link {
  @apply inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200;
}

/* 骨架屏样式 */
.article-skeleton {
  @apply bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100;
}

.skeleton-image {
  @apply w-full h-48 bg-gray-200 animate-pulse;
}

.skeleton-content {
  @apply p-6;
}

.skeleton-title {
  @apply h-6 bg-gray-200 rounded mb-3 animate-pulse;
}

.skeleton-text {
  @apply h-4 bg-gray-200 rounded mb-2 animate-pulse;
}

.skeleton-text.short {
  @apply w-3/4;
}

.skeleton-meta {
  @apply h-4 w-1/3 bg-gray-200 rounded animate-pulse;
}

/* 文本截断样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .article-content {
    @apply p-4;
  }
  
  .article-title {
    @apply text-lg;
  }
}

/* 悬停效果增强 */
.article-card:hover .article-title {
  @apply text-blue-600;
}

.article-card:hover .read-more-link {
  @apply text-blue-700;
}
</style>