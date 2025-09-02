<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          管理员登录
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          请使用管理员账号登录后台系统
        </p>
      </div>

      <!-- 登录表单 -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="space-y-4">
            <!-- 用户名输入框 -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="请输入用户名"
                :disabled="loading"
              />
            </div>

            <!-- 密码输入框 -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="请输入密码"
                :disabled="loading"
              />
            </div>

            <!-- 记住登录 -->
            <div class="flex items-center">
              <input
                id="remember"
                v-model="loginForm.remember"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                :disabled="loading"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                记住登录状态
              </label>
            </div>
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 登录按钮 -->
          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading || !loginForm.username || !loginForm.password"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </div>
      </form>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin, getCurrentAdmin, type LoginForm } from '@/lib/auth'

/**
 * 管理员登录页面组件
 * 创建日期：2024-12-19
 * 功能：提供管理员登录界面和认证功能
 */

const router = useRouter()

// 响应式数据
const loading = ref(false)
const errorMessage = ref('')
const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  remember: false
})

/**
 * 处理登录提交
 */
const handleLogin = async () => {
  if (loading.value) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const result = await adminLogin(loginForm.value)
    
    if (result.success) {
      // 登录成功，跳转到管理员仪表板
      await router.push('/admin/dashboard')
    } else {
      errorMessage.value = result.message || '登录失败'
    }
  } catch (error) {
    console.error('登录错误:', error)
    errorMessage.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

/**
 * 检查是否已经登录
 */
const checkExistingLogin = () => {
  const admin = getCurrentAdmin()
  if (admin) {
    // 已经登录，直接跳转到仪表板
    router.push('/admin/dashboard')
  }
}

// 组件挂载时检查登录状态
onMounted(() => {
  checkExistingLogin()
})
</script>

<style scoped>
/* 自定义样式 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>