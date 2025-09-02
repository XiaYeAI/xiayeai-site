<template>
  <div class="home-page">


    <!-- 紧凑的内容区域 -->
    <section class="content-compact">
      <div class="content-container">
        <!-- 最新文章卡片 -->
        <div class="content-section">
          <h2 class="section-title">最新文章</h2>
          <LatestArticles :compact="true" />
        </div>
        
        <!-- 快速导航 -->
        <div class="content-section">
          <h2 class="section-title">快速导航</h2>
          <div class="quick-nav">
            <router-link to="/social" class="nav-card">
              <div class="nav-icon">📱</div>
              <div class="nav-info">
                <h3>自媒体矩阵</h3>
                <p>关注我的各大平台</p>
              </div>
            </router-link>
            
            <router-link to="/articles" class="nav-card">
              <div class="nav-icon">📝</div>
              <div class="nav-info">
                <h3>技术文章</h3>
                <p>分享技术心得</p>
              </div>
            </router-link>
            
            <router-link to="/about" class="nav-card">
              <div class="nav-icon">👤</div>
              <div class="nav-info">
                <h3>关于我</h3>
                <p>了解更多信息</p>
              </div>
            </router-link>
            
            <router-link to="/contact" class="nav-card">
              <div class="nav-icon">📞</div>
              <div class="nav-info">
                <h3>联系合作</h3>
                <p>商务合作与技术交流</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import LatestArticles from '@/components/LatestArticles.vue'
import { useHomeStore } from '@/stores/home'

/**
 * Home 首页组件
 * 功能：提供紧凑的首页布局，整合主要功能模块
 * 创建日期：2025-01-31
 * 作者：SOLO Coding
 */

// 状态管理
const homeStore = useHomeStore()



// SEO配置通过路由守卫处理
// 页面标题和描述已在路由配置中定义

/**
 * 处理页面滚动事件
 * 功能：优化页面滚动性能，添加滚动监听
 * 创建日期：2024-12-19
 */
const handleScroll = (): void => {
  // 可以在这里添加滚动相关的逻辑，如导航栏状态变化等
  const scrollY = window.scrollY
  
  // 示例：当滚动超过视口高度时，可以触发某些效果
  if (scrollY > window.innerHeight) {
    // 可以添加一些滚动效果
  }
}

/**
 * 预加载关键资源
 * 功能：预加载首页关键图片和资源
 * 创建日期：2024-12-19
 */
const preloadResources = (): void => {
  // 可以在这里添加需要预加载的资源
}

// 组件挂载时的初始化
onMounted(() => {
  // 预加载资源
  preloadResources()
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 获取首页数据
  homeStore.fetchHomeData()
})

// 组件卸载时的清理
onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}





/* 内容区域样式 */
.content-compact {
  padding: 3rem 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

/* 快速导航样式 */
.quick-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-card:hover:not(.disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
}

.nav-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-card.disabled:hover {
  transform: none;
  box-shadow: none;
  background: #f8fafc;
}

.nav-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.nav-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.nav-info p {
  font-size: 0.875rem;
  opacity: 0.7;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  
  .content-compact {
    padding: 2rem 0;
  }
  
  .content-section {
    padding: 1.5rem;
  }
  
  .quick-nav {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .content-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}

/* 确保页面滚动流畅 */
.home-page {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>