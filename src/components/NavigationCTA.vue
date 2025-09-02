<template>
  <section class="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <!-- 主标题 -->
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          探索更多精彩内容
        </h2>
        
        <!-- 副标题 -->
        <p class="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
          深入了解AI技术世界，发现更多学习资源和合作机会
        </p>
        
        <!-- 导航卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <!-- 自媒体矩阵 -->
          <div class="navigation-card group" @click="navigateTo('/social')">
            <div class="navigation-icon bg-gradient-to-br from-pink-500 to-rose-500">
              <Share2 class="w-8 h-8 text-white" />
            </div>
            <h3 class="navigation-title">自媒体矩阵</h3>
            <p class="navigation-description">关注我的各大平台账号</p>
            <div class="navigation-arrow">
              <ArrowRight class="w-5 h-5" />
            </div>
          </div>
          
          <!-- 公众号文章 -->
          <div class="navigation-card group" @click="navigateTo('/articles')">
            <div class="navigation-icon bg-gradient-to-br from-green-500 to-emerald-500">
              <FileText class="w-8 h-8 text-white" />
            </div>
            <h3 class="navigation-title">公众号文章</h3>
            <p class="navigation-description">阅读最新技术文章</p>
            <div class="navigation-arrow">
              <ArrowRight class="w-5 h-5" />
            </div>
          </div>
          
          <!-- 关于我 -->
          <div class="navigation-card group" @click="navigateTo('/about')">
            <div class="navigation-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              <User class="w-8 h-8 text-white" />
            </div>
            <h3 class="navigation-title">关于我</h3>
            <p class="navigation-description">了解我的技术背景</p>
            <div class="navigation-arrow">
              <ArrowRight class="w-5 h-5" />
            </div>
          </div>
          
          <!-- 联系合作 -->
          <div class="navigation-card group" @click="navigateTo('/contact')">
            <div class="navigation-icon bg-gradient-to-br from-orange-500 to-amber-500">
              <Mail class="w-8 h-8 text-white" />
            </div>
            <h3 class="navigation-title">联系合作</h3>
            <p class="navigation-description">商务合作与交流</p>
            <div class="navigation-arrow">
              <ArrowRight class="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <!-- 社交媒体链接 -->
        <div class="flex justify-center items-center gap-6 mb-8">
          <h3 class="text-lg font-medium text-white">关注我的社交媒体：</h3>
          <div class="flex gap-4">
            <a 
              v-for="platform in socialPlatforms.slice(0, 4)" 
              :key="platform.id"
              :href="platform.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :title="`关注我的${platform.platform_type}`"
            >
              <component :is="getSocialIcon(platform.platform_type)" class="w-6 h-6" />
            </a>
          </div>
        </div>
        
        <!-- 底部CTA -->
        <div class="text-center">
          <p class="text-blue-100 mb-6">
            想要获取最新的AI技术资讯？
          </p>
          <button 
            @click="scrollToTop"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <ArrowUp class="w-5 h-5" />
            <span>回到顶部</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Share2, 
  FileText, 
  User, 
  Mail, 
  ArrowRight, 
  ArrowUp,
  MessageCircle,
  Video,
  Rss,
  Globe
} from 'lucide-vue-next'
import { useHomeStore } from '@/stores/home'

/**
 * NavigationCTA 导航行动召唤组件
 * 功能：提供网站各个模块的导航入口和社交媒体链接
 * 创建日期：2024-12-19
 */

// 路由实例
const router = useRouter()

// 状态管理
const homeStore = useHomeStore()

// 计算属性
const socialPlatforms = computed(() => homeStore.socialPlatforms)

/**
 * 获取社交平台图标
 * 功能：根据平台名称返回对应的图标组件
 * 创建日期：2024-12-19
 * @param platformName 平台名称
 * @returns 图标组件
 */
const getSocialIcon = (platformName: string) => {
  const iconMap: Record<string, any> = {
    '微信公众号': MessageCircle,
    '抖音': Video,
    '小红书': Rss,
    '知乎': Globe,
    '微博': Globe,
    'B站': Video,
    '今日头条': Rss,
    '百家号': Globe
  }
  
  return iconMap[platformName] || Globe
}

/**
 * 导航到指定页面
 * 功能：使用路由导航到指定页面
 * 创建日期：2024-12-19
 * @param path 目标路径
 */
const navigateTo = (path: string): void => {
  router.push(path)
}

/**
 * 滚动到页面顶部
 * 功能：平滑滚动到页面顶部
 * 创建日期：2024-12-19
 */
const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
/* 导航卡片样式 */
.navigation-card {
  @apply relative bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-2 hover:shadow-2xl border border-white/20;
}

.navigation-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300;
}

.navigation-title {
  @apply text-lg font-semibold text-white mb-2;
}

.navigation-description {
  @apply text-sm text-blue-100 mb-4;
}

.navigation-arrow {
  @apply absolute bottom-4 right-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300;
}

/* 社交链接样式 */
.social-link {
  @apply w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .navigation-card {
    @apply p-4;
  }
  
  .navigation-icon {
    @apply w-12 h-12 mb-3;
  }
  
  .navigation-title {
    @apply text-base;
  }
  
  .navigation-description {
    @apply text-xs;
  }
}

/* 悬停效果增强 */
.navigation-card:hover .navigation-icon {
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
}

.navigation-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* 背景动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>