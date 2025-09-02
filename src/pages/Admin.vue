<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            管理后台
          </h1>
          <p class="text-xl text-gray-600">
            网站内容管理后台
          </p>
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <div class="bg-white rounded-lg shadow-lg p-12">
          <div class="text-6xl mb-6">⚙️</div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            管理后台
          </h2>
          <p class="text-gray-600 mb-8">
            请先登录以访问管理功能
          </p>
          <div class="flex gap-4 justify-center">
            <router-link 
              to="/login" 
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              前往登录
            </router-link>
            <router-link 
              to="/" 
              class="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Admin 管理后台页面
 * 功能：网站内容管理后台
 * 创建日期：2024-12-19
 */

// 页面元信息
const title = '管理后台 - 夏叶AI加油站'
const description = '网站内容管理后台'
</script>

<style scoped>
/* 页面特定样式 */
</style>