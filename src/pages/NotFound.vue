<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div class="text-center">
      <div class="bg-white rounded-lg shadow-xl p-12 max-w-md mx-auto">
        <!-- 404 图标 -->
        <div class="text-8xl mb-6">🔍</div>
        
        <!-- 错误码 -->
        <h1 class="text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <!-- 错误信息 -->
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          页面未找到
        </h2>
        
        <p class="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        
        <!-- 当前路径显示 -->
        <div class="bg-gray-100 rounded-lg p-4 mb-8">
          <p class="text-sm text-gray-500 mb-1">当前路径：</p>
          <code class="text-sm font-mono text-gray-700">{{ $route.fullPath }}</code>
        </div>
        
        <!-- 操作按钮 -->
        <div class="space-y-4">
          <router-link 
            to="/" 
            class="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            返回首页
          </router-link>
          
          <button 
            @click="goBack"
            class="block w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            返回上一页
          </button>
        </div>
        
        <!-- 建议链接 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 mb-4">您可能想要访问：</p>
          <div class="space-y-2">
            <router-link 
              to="/articles" 
              class="block text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              📚 公众号文章
            </router-link>
            <router-link 
              to="/social" 
              class="block text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              🌐 自媒体矩阵
            </router-link>
            <router-link 
              to="/about" 
              class="block text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              👨‍💻 关于我
            </router-link>
            <router-link 
              to="/contact" 
              class="block text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              📧 联系合作
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div class="absolute top-3/4 left-1/3 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse delay-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

/**
 * NotFound 404页面
 * 功能：处理页面未找到的情况
 * 创建日期：2024-12-19
 */

// 路由实例
const router = useRouter()
const route = useRoute()

/**
 * 返回上一页
 * 功能：使用浏览器历史记录返回上一页
 * 创建日期：2024-12-19
 */
const goBack = (): void => {
  // 如果有历史记录，则返回上一页，否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

// 页面元信息
const title = '页面未找到 - 夏叶AI加油站'
const description = '您访问的页面不存在'
</script>

<style scoped>
/* 动画效果 */
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

/* 响应式优化 */
@media (max-width: 640px) {
  .text-8xl {
    font-size: 4rem;
  }
  
  .text-6xl {
    font-size: 3rem;
  }
}
</style>