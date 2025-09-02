<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- 背景图片 -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${heroData.backgroundImage})` }"
    >
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
    </div>

    <!-- 内容区域 -->
    <div class="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <!-- 头像 -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <img 
            :src="heroData.avatar" 
            :alt="heroData.name"
            class="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white/20 shadow-2xl object-cover"
            loading="lazy"
          />
          <!-- 头像光环效果 -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/30 to-purple-400/30 animate-pulse"></div>
        </div>
      </div>

      <!-- 标题区域 -->
      <div class="mb-6">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
          {{ heroData.name }}
        </h1>
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-medium text-blue-100 mb-6">
          {{ heroData.title }}
        </h2>
      </div>

      <!-- 描述文本 -->
      <p class="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto">
        {{ heroData.description }}
      </p>

      <!-- 行动按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          @click="scrollToContent"
          class="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <span>探索更多</span>
          <ChevronDown class="w-5 h-5 group-hover:animate-bounce" />
        </button>
        
        <button 
          @click="navigateToContact"
          class="px-8 py-4 border-2 border-white/30 hover:border-white/50 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
        >
          联系合作
        </button>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
      <ChevronDown class="w-6 h-6" />
    </div>

    <!-- 装饰性元素 -->
    <div class="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
    <div class="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 right-20 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { useHomeStore } from '@/stores/home'

/**
 * HeroSection 英雄区域组件
 * 功能：展示网站主要信息，包括头像、标题、描述和行动按钮
 * 创建日期：2024-12-19
 */

// 路由实例
const router = useRouter()

// 状态管理
const homeStore = useHomeStore()

// 计算属性
const heroData = computed(() => homeStore.heroData)

/**
 * 滚动到内容区域
 * 功能：平滑滚动到页面内容区域
 * 创建日期：2024-12-19
 */
const scrollToContent = (): void => {
  const nextSection = document.querySelector('#stats-section') || document.querySelector('main > section:nth-child(2)')
  if (nextSection) {
    nextSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  } else {
    // 如果没有找到目标元素，滚动到视口高度位置
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }
}

/**
 * 导航到联系页面
 * 功能：跳转到联系合作页面
 * 创建日期：2024-12-19
 */
const navigateToContact = (): void => {
  router.push('/contact')
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 响应式字体大小优化 */
@media (max-width: 640px) {
  h1 {
    line-height: 1.1;
  }
}

/* 背景图片优化 */
.bg-cover {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

@media (max-width: 768px) {
  .bg-cover {
    background-attachment: scroll;
  }
}
</style>