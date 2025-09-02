<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">自媒体矩阵</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          关注我的各大社交媒体平台，获取最新的AI技术分享、行业洞察和原创内容
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-200 rounded-lg animate-pulse mr-4"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
          <div class="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div class="flex items-center justify-between">
            <div class="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div class="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12 mb-12">
        <div class="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-4xl">⚠️</span>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">加载失败</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchSocialData"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>

      <!-- 社交媒体平台网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div 
          v-for="platform in socialPlatforms" 
          :key="platform.id"
          class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex items-center mb-4">
            <div :class="`w-12 h-12 ${getPlatformColor(platform.platform_type || platform.name)} rounded-lg flex items-center justify-center text-white mr-4`">
              <component :is="getPlatformIcon(platform.platform_type || platform.name)" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ platform.name }}</h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ platform.username || platform.name }}</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">{{ platform.description || '分享AI技术内容和行业洞察' }}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ platform.follower_count ? formatFollowerCount(platform.follower_count) + ' 关注者' : '关注获取最新内容' }}
            </span>
            <a 
              v-if="platform.url" 
              :href="platform.url" 
              target="_blank"
              :class="`px-6 py-3 ${getPlatformColor(platform.platform_type || platform.name)} text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105`"
            >
              {{ platform.platform_type === 'github' || platform.name === 'GitHub' ? '访问' : '关注' }}
            </a>
            <button 
              v-else
              :class="`px-6 py-3 ${getPlatformColor(platform.platform_type || platform.name)} text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105`"
            >
              {{ platform.platform_type === 'github' || platform.name === 'GitHub' ? '访问' : '关注' }}
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="socialPlatforms.length === 0" class="col-span-full text-center py-12">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span class="text-4xl">📱</span>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">暂无社交平台</h3>
          <p class="text-gray-600">社交媒体平台信息即将更新</p>
        </div>
      </div>

      <!-- 内容统计 -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">内容统计</h2>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="text-center">
            <div class="h-8 bg-gray-200 rounded animate-pulse mb-2 mx-auto w-16"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse mx-auto w-20"></div>
          </div>
        </div>
        
        <!-- 统计数据 -->
        <div v-else-if="statsData" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ statsData.articles || 0 }}+</div>
            <div class="text-gray-600">原创文章</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ statsData.videos || 0 }}+</div>
            <div class="text-gray-600">视频教程</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ statsData.projects || 0 }}+</div>
            <div class="text-gray-600">开源项目</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">{{ formatFollowerCount(statsData.total_views || 0) }}+</div>
            <div class="text-gray-600">总阅读量</div>
          </div>
        </div>
        
        <!-- 默认状态 -->
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">0+</div>
            <div class="text-gray-600">原创文章</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">0+</div>
            <div class="text-gray-600">视频教程</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">0+</div>
            <div class="text-gray-600">开源项目</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">0+</div>
            <div class="text-gray-600">总阅读量</div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">合作联系</h2>
        <p class="text-blue-100 mb-6">商务合作、技术交流、内容授权等事宜，欢迎联系</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a :href="`mailto:${profile?.email || 'contact@xiayeai.com'}`" class="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            📧 邮箱联系
          </a>
          <button @click="showWechatQR" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium">
            💬 微信联系
          </button>
        </div>
      </div>
    </div>
    
    <!-- 微信二维码弹窗 -->
    <WechatQRModal 
      :show="showWechatModal" 
      :qr-url="profile?.wechat_qr_url" 
      @close="closeWechatModal" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSocialPlatforms, getStatsData, type SocialPlatform, supabase } from '@/lib/supabase'
import WechatQRModal from '@/components/WechatQRModal.vue'
import { 
  Globe, MessageCircle, Megaphone, Video, Heart, Play, 
  BookOpen, Github, Twitter, Linkedin, Youtube, 
  Zap, FileText, Monitor 
} from 'lucide-vue-next'

/**
 * Social 自媒体矩阵页面
 * 功能：展示各大社交媒体平台链接和内容，从数据库动态获取数据
 * 创建日期：2024-12-19
 * 更新日期：2025-01-31
 */

// 响应式数据
const loading = ref(true)
const error = ref<string | null>(null)
const socialPlatforms = ref<SocialPlatform[]>([])
const profile = ref<any>(null)
const statsData = ref({
  articles: 0,
  videos: 0,
  projects: 0,
  total_views: 0
})

// 微信二维码弹窗相关
const showWechatModal = ref(false)

/**
 * 获取社交平台数据
 * 功能：从Supabase获取社交媒体平台信息和个人资料
 * 参数：无
 * 返回值：Promise<void>
 * 创建日期：2025-01-31
 */
const fetchSocialData = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    // 并行获取社交平台、统计数据和个人资料
    const [platforms, stats, profileResult] = await Promise.all([
      getSocialPlatforms(),
      getStatsData(),
      supabase.from('profiles').select('*').order('created_at', { ascending: true }).limit(1)
    ])

    socialPlatforms.value = platforms
    statsData.value = {
      articles: stats.articleCount || 0,
      videos: stats.videoCount || 0,
      projects: stats.projectCount || 0,
      total_views: stats.totalViews || 0
    }
    
    // 设置个人资料
    if (profileResult.data && profileResult.data.length > 0) {
      profile.value = profileResult.data[0]
    } else {
      profile.value = { email: 'contact@xiayeai.com' }
    }
  } catch (err) {
    console.error('获取社交平台数据失败:', err)
    error.value = err instanceof Error ? err.message : '获取数据失败'
    profile.value = { email: 'contact@xiayeai.com' }
  } finally {
    loading.value = false
  }
}

/**
 * 格式化粉丝数量
 * 功能：将数字格式化为易读的字符串
 * 参数：count - 粉丝数量
 * 返回值：格式化后的字符串
 * 创建日期：2025-01-31
 */
const formatFollowerCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}百万+`
  } else if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万+`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`
  }
  return count.toString()
}

/**
 * 获取平台图标
 * 功能：根据平台类型或名称返回对应的Lucide图标组件
 * 参数：platformType - 平台类型或名称
 * 返回值：Lucide图标组件
 * 创建日期：2025-01-31
 */
const getPlatformIcon = (platformType: string) => {
  const iconMap: Record<string, any> = {
    // 平台类型映射
    'weibo': Globe,
    'wechat': MessageCircle,
    'wechat_official': Megaphone,
    'douyin': Video,
    'xiaohongshu': Heart,
    'bilibili': Play,
    'zhihu': BookOpen,
    'github': Github,
    'twitter': Twitter,
    'linkedin': Linkedin,
    'youtube': Youtube,
    // 平台名称映射（兼容旧数据）
    '微信公众号': Megaphone,
    '知乎': BookOpen,
    '哔哩哔哩': Play,
    'B站': Play,
    '小红书': Heart,
    '抖音': Video,
    'GitHub': Github,
    '微博': Globe,
    'CSDN': Monitor,
    '掘金': Zap
  }
  return iconMap[platformType] || Globe
}

/**
 * 获取平台颜色
 * 功能：根据平台类型或名称返回对应的CSS颜色类
 * 参数：platformType - 平台类型或名称
 * 返回值：CSS颜色类名
 * 创建日期：2025-01-31
 */
const getPlatformColor = (platformType: string): string => {
  const colorMap: Record<string, string> = {
    // 平台类型映射
    'weibo': 'bg-orange-500 hover:bg-orange-600',
    'wechat': 'bg-green-500 hover:bg-green-600',
    'wechat_official': 'bg-green-600 hover:bg-green-700',
    'douyin': 'bg-black hover:bg-gray-800',
    'xiaohongshu': 'bg-red-500 hover:bg-red-600',
    'bilibili': 'bg-pink-500 hover:bg-pink-600',
    'zhihu': 'bg-blue-500 hover:bg-blue-600',
    'github': 'bg-gray-800 hover:bg-gray-900',
    'twitter': 'bg-blue-400 hover:bg-blue-500',
    'linkedin': 'bg-blue-700 hover:bg-blue-800',
    'youtube': 'bg-red-600 hover:bg-red-700',
    // 平台名称映射（兼容旧数据）
    '微信公众号': 'bg-green-500 hover:bg-green-600',
    '知乎': 'bg-blue-600 hover:bg-blue-700',
    '哔哩哔哩': 'bg-pink-500 hover:bg-pink-600',
    'B站': 'bg-pink-500 hover:bg-pink-600',
    '小红书': 'bg-red-500 hover:bg-red-600',
    '抖音': 'bg-black hover:bg-gray-800',
    'GitHub': 'bg-gray-800 hover:bg-gray-900',
    '微博': 'bg-orange-500 hover:bg-orange-600',
    'CSDN': 'bg-red-600 hover:bg-red-700',
    '掘金': 'bg-blue-500 hover:bg-blue-600'
  }
  return colorMap[platformType] || 'bg-gray-600 hover:bg-gray-700'
}

/**
 * 显示微信二维码弹窗
 * 功能：点击微信联系按钮时显示二维码弹窗
 * 创建日期：2025-01-31
 */
const showWechatQR = () => {
  showWechatModal.value = true
}

/**
 * 关闭微信二维码弹窗
 * 功能：关闭二维码弹窗
 * 创建日期：2025-01-31
 */
const closeWechatModal = () => {
  showWechatModal.value = false
}

// 组件挂载时获取数据
onMounted(() => {
  fetchSocialData()
})

// 页面元信息
const title = '自媒体矩阵 - 夏叶AI加油站'
const description = '关注夏叶AI加油站的各大社交媒体平台，获取最新AI技术动态'
</script>

<style scoped>
/* 页面特定样式 */
</style>