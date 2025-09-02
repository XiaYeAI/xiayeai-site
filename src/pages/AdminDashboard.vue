<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">管理员后台</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">欢迎，{{ currentAdmin?.name || currentAdmin?.username }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="mt-8">
          <div class="px-4 space-y-2">
            <router-link
              to="/admin/dashboard"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="$route.path === '/admin/dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              仪表板
            </router-link>
            
            <router-link
              to="/admin/articles"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="$route.path.startsWith('/admin/articles') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              文章管理
            </router-link>
            
            <router-link
              to="/admin/social-platforms"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="$route.path.startsWith('/admin/social-platforms') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
              </svg>
              社交平台
            </router-link>
            
            <router-link
              to="/admin/stats"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="$route.path.startsWith('/admin/stats') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              统计管理
            </router-link>
            
            <router-link
              to="/admin/profile"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="$route.path.startsWith('/admin/profile') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              个人信息
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 p-8">
        <!-- 仪表板概览 -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">数据概览</h2>
          
          <!-- 统计卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">文章总数</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ stats.totalArticles }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">总粉丝数</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ stats.totalFollowers.toLocaleString() }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">社交平台</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ stats.totalPlatforms }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">合作伙伴</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ stats.totalPartners }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              to="/admin/articles/new"
              class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-indigo-300"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">新建文章</p>
                  <p class="text-sm text-gray-500">创建新的文章内容</p>
                </div>
              </div>
            </router-link>
            
            <router-link
              to="/admin/social-platforms/new"
              class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-indigo-300"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">添加平台</p>
                  <p class="text-sm text-gray-500">添加新的社交平台</p>
                </div>
              </div>
            </router-link>
            
            <router-link
              to="/admin/stats"
              class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-indigo-300"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">查看统计</p>
                  <p class="text-sm text-gray-500">查看详细数据统计</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- 最近活动 -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <div class="text-center text-gray-500 py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p class="mt-2 text-sm">暂无最近活动</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentAdmin, adminLogout, checkAdminPermission } from '@/lib/auth'
import { getArticles, getSocialPlatforms, getSiteStats } from '@/lib/supabase'

/**
 * 管理员仪表板页面组件
 * 创建日期：2024-12-19
 * 功能：提供管理员后台主界面，显示数据概览和快速操作
 */

const router = useRouter()

// 响应式数据
const currentAdmin = ref(getCurrentAdmin())
const stats = ref({
  totalArticles: 0,
  totalFollowers: 0,
  totalPlatforms: 0,
  totalPartners: 0
})

/**
 * 处理登出
 */
const handleLogout = () => {
  adminLogout()
  router.push('/admin/login')
}

/**
 * 加载统计数据
 */
const loadStats = async () => {
  try {
    // 获取文章数量
    const articles = await getArticles()
    stats.value.totalArticles = articles.length

    // 获取社交平台数量和总粉丝数
    const platforms = await getSocialPlatforms()
    stats.value.totalPlatforms = platforms.length
    stats.value.totalFollowers = platforms.reduce((total, platform) => total + (platform.follower_count || 0), 0)

    // 获取网站统计数据
    const siteStats = await getSiteStats()
    const partnersStat = siteStats.find(stat => stat.stat_type === 'total_partners')
    stats.value.totalPartners = partnersStat?.current_value || 0
  } catch (error) {
    console.error('加载统计数据失败:', error)
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

// 组件挂载时执行
onMounted(() => {
  checkPermission()
  loadStats()
})
</script>