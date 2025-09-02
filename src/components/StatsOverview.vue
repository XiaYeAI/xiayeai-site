<template>
  <section id="stats-section" class="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          数据概览
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          用数据说话，见证成长轨迹
        </p>
      </div>

      <!-- 统计卡片网格 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <!-- 总粉丝数 -->
        <div class="stats-card group">
          <div class="stats-icon bg-gradient-to-br from-blue-500 to-blue-600">
            <Users class="w-8 h-8 text-white" />
          </div>
          <div class="stats-content">
            <div class="stats-number" :class="{ 'animate-pulse': loading }">
              {{ loading ? '...' : formatNumber(statsData.totalFollowers) }}
            </div>
            <div class="stats-label">总粉丝数</div>
            <div class="stats-growth">+12.5%</div>
          </div>
        </div>

        <!-- 文章数量 -->
        <div class="stats-card group">
          <div class="stats-icon bg-gradient-to-br from-green-500 to-green-600">
            <FileText class="w-8 h-8 text-white" />
          </div>
          <div class="stats-content">
            <div class="stats-number" :class="{ 'animate-pulse': loading }">
              {{ loading ? '...' : formatNumber(statsData.articleCount) }}
            </div>
            <div class="stats-label">发布文章</div>
            <div class="stats-growth">+8.3%</div>
          </div>
        </div>

        <!-- 合作伙伴 -->
        <div class="stats-card group">
          <div class="stats-icon bg-gradient-to-br from-purple-500 to-purple-600">
            <Handshake class="w-8 h-8 text-white" />
          </div>
          <div class="stats-content">
            <div class="stats-number" :class="{ 'animate-pulse': loading }">
              {{ loading ? '...' : formatNumber(statsData.partnerCount) }}
            </div>
            <div class="stats-label">合作伙伴</div>
            <div class="stats-growth">+15.2%</div>
          </div>
        </div>

        <!-- 平台数量 -->
        <div class="stats-card group">
          <div class="stats-icon bg-gradient-to-br from-orange-500 to-orange-600">
            <Globe class="w-8 h-8 text-white" />
          </div>
          <div class="stats-content">
            <div class="stats-number" :class="{ 'animate-pulse': loading }">
              {{ loading ? '...' : formatNumber(statsData.platformCount) }}
            </div>
            <div class="stats-label">覆盖平台</div>
            <div class="stats-growth">+25.0%</div>
          </div>
        </div>
      </div>

      <!-- 刷新按钮 -->
      <div class="text-center mt-12">
        <button 
          @click="handleRefresh"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
          <span>{{ loading ? '更新中...' : '刷新数据' }}</span>
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2 text-red-700">
          <AlertCircle class="w-5 h-5" />
          <span class="font-medium">数据加载失败</span>
        </div>
        <p class="text-red-600 mt-1">{{ errorMessage }}</p>
        <button 
          @click="handleRetry"
          class="mt-2 text-red-700 hover:text-red-800 underline"
        >
          重试
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Users, FileText, Handshake, Globe, RefreshCw, AlertCircle } from 'lucide-vue-next'
import { useHomeStore } from '@/stores/home'

/**
 * StatsOverview 统计概览组件
 * 功能：展示网站关键统计数据，包括粉丝数、文章数、合作伙伴数和平台数
 * 创建日期：2024-12-19
 */

// 状态管理
const homeStore = useHomeStore()

// 计算属性
const loading = computed(() => homeStore.loading)
const error = computed(() => homeStore.error)
const errorMessage = computed(() => homeStore.errorMessage)
const statsData = computed(() => homeStore.statsData)

/**
 * 格式化数字显示
 * 功能：将数字格式化为易读的形式（如1.2K、1.5M等）
 * 创建日期：2024-12-19
 * @param num 要格式化的数字
 * @returns string 格式化后的字符串
 */
const formatNumber = (num: number): string => {
  if (num === 0) return '0'
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  
  return num.toString()
}

/**
 * 处理刷新操作
 * 功能：刷新统计数据
 * 创建日期：2024-12-19
 */
const handleRefresh = async (): Promise<void> => {
  try {
    await homeStore.refreshStats()
  } catch (err) {
    console.error('刷新统计数据失败:', err)
  }
}

/**
 * 处理重试操作
 * 功能：清除错误状态并重新获取数据
 * 创建日期：2024-12-19
 */
const handleRetry = async (): Promise<void> => {
  homeStore.clearError()
  await handleRefresh()
}

// 组件挂载时获取数据
onMounted(() => {
  // 如果数据为空，则获取数据
  if (statsData.value.totalFollowers === 0 && 
      statsData.value.articleCount === 0 && 
      statsData.value.partnerCount === 0 && 
      statsData.value.platformCount === 0) {
    homeStore.fetchHomeData()
  }
})
</script>

<style scoped>
/* 统计卡片样式 */
.stats-card {
  @apply bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1;
}

.stats-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300;
}

.stats-content {
  @apply text-center;
}

.stats-number {
  @apply text-2xl sm:text-3xl font-bold text-gray-900 mb-1;
}

.stats-label {
  @apply text-sm font-medium text-gray-600 mb-2;
}

.stats-growth {
  @apply text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .stats-card {
    @apply p-4;
  }
  
  .stats-icon {
    @apply w-12 h-12 mb-3;
  }
  
  .stats-number {
    @apply text-xl;
  }
}

/* 加载动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 悬停效果增强 */
.stats-card:hover .stats-icon {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.stats-card:hover .stats-number {
  @apply text-blue-600;
}
</style>