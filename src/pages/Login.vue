<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-lg shadow-xl p-8">
        <!-- 头部 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            管理员登录
          </h1>
          <p class="text-gray-600">
            请输入您的登录凭据
          </p>
        </div>
        
        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址
            </label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入邮箱地址"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入密码"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="loginForm.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                记住我
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </form>
        
        <!-- 底部链接 -->
        <div class="mt-6 text-center">
          <router-link 
            to="/" 
            class="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            返回首页
          </router-link>
        </div>
        
        <!-- 提示信息 -->
        <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-sm text-yellow-800">
            💡 提示：登录功能正在开发中，暂时无法使用
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Login 登录页面
 * 功能：管理员登录界面
 * 创建日期：2024-12-19
 */

// 路由实例
const router = useRouter()

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

// 加载状态
const isLoading = ref(false)

/**
 * 处理登录提交
 * 功能：处理用户登录请求
 * 创建日期：2024-12-19
 */
const handleLogin = async (): Promise<void> => {
  isLoading.value = true
  
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该调用实际的登录API
    // 处理登录表单数据
    
    // 登录成功后跳转到管理后台
    // router.push('/admin')
    
    alert('登录功能正在开发中，敬请期待！')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 页面元信息
const title = '登录 - 夏叶AI加油站'
const description = '管理员登录页面'
</script>

<style scoped>
/* 页面特定样式 */
</style>