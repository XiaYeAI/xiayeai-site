<template>
  <div id="app">
    <TopNavigation />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import Footer from '@/components/Footer.vue'

/**
 * 应用主组件
 * 功能：提供应用的整体布局结构，包含顶部导航、主要内容区域和底部信息
 * 创建日期：2025-01-31
 * 更新日期：2025-01-31 - 添加Footer组件显示备案信息
 * 作者：SOLO Coding
 */
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 60px; /* 为固定导航栏留出空间 */
  min-height: calc(100vh - 60px - 80px); /* 减去导航栏和底部Footer的高度 */
}

/* 响应式调整 */
@media (max-width: 480px) {
  .main-content {
    padding-top: 50px;
    min-height: calc(100vh - 50px);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>