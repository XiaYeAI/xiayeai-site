<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/admin/dashboard" class="text-indigo-600 hover:text-indigo-500 mr-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </router-link>
            <h1 class="text-xl font-semibold text-gray-900">社交平台管理</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showAddDialog = true"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              添加平台
            </button>
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

    <!-- 主内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 平台列表 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-sm text-gray-500">加载中...</p>
          </div>

          <div v-else-if="platforms.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">暂无社交平台</p>
            <button
              @click="showAddDialog = true"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              添加第一个平台
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="platform in platforms"
              :key="platform.id"
              class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <!-- 平台图标和名称 -->
              <div class="flex items-center mb-4">
                <div class="flex-shrink-0">
                  <component
                    :is="getPlatformIcon(platform.platform_type)"
                    class="w-8 h-8 text-gray-600"
                  />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-medium text-gray-900">{{ getPlatformName(platform.platform_type) }}</h3>
                  <p class="text-sm text-gray-500">{{ platform.name || platform.platform_type }}</p>
                </div>
              </div>

              <!-- 平台信息 -->
              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">粉丝数:</span>
                  <span class="font-medium">{{ (platform.follower_count || 0).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">链接:</span>
                  <a
                    :href="platform.url"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-500 truncate max-w-32"
                  >
                    {{ platform.url }}
                  </a>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">状态:</span>
                  <span
                    :class="{
                      'text-green-600': platform.is_active,
                      'text-red-600': !platform.is_active
                    }"
                  >
                    {{ platform.is_active ? '启用' : '禁用' }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex space-x-2">
                <button
                  @click="editPlatform(platform)"
                  class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  编辑
                </button>
                <button
                  @click="togglePlatformStatus(platform)"
                  :class="{
                    'bg-green-600 hover:bg-green-700': !platform.is_active,
                    'bg-yellow-600 hover:bg-yellow-700': platform.is_active
                  }"
                  class="flex-1 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {{ platform.is_active ? '禁用' : '启用' }}
                </button>
                <button
                  @click="deletePlatform(platform)"
                  class="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加/编辑平台对话框 -->
    <div v-if="showAddDialog || showEditDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditDialog ? '编辑平台' : '添加平台' }}
          </h3>
          
          <form @submit.prevent="savePlatform">
            <!-- 平台类型 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">平台类型 *</label>
              <select
                v-model="platformForm.platform_type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">请选择平台</option>
                <option value="weibo">微博</option>
                <option value="wechat">微信</option>
                <option value="wechat_official">微信公众号</option>
                <option value="douyin">抖音</option>
                <option value="xiaohongshu">小红书</option>
                <option value="bilibili">哔哩哔哩</option>
                <option value="zhihu">知乎</option>
                <option value="github">GitHub</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="other">其他</option>
              </select>
            </div>

            <!-- 显示名称 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
              <input
                v-model="platformForm.name"
                type="text"
                placeholder="自定义显示名称（可选）"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 平台链接 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">平台链接 *</label>
              <input
                v-model="platformForm.url"
                type="url"
                required
                placeholder="https://..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 粉丝数 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">粉丝数</label>
              <input
                v-model.number="platformForm.follower_count"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 描述 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
              <textarea
                v-model="platformForm.description"
                rows="3"
                placeholder="平台描述（可选）"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- 是否启用 -->
            <div class="mb-6">
              <label class="flex items-center">
                <input
                  v-model="platformForm.is_active"
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">启用此平台</span>
              </label>
            </div>

            <!-- 按钮 -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeDialogAndNavigate"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-200"
              >
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">确认删除</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              确定要删除平台 "{{ getPlatformName(platformToDelete?.platform_type) }}" 吗？此操作不可撤销。
            </p>
          </div>
          <div class="flex justify-center space-x-4 mt-4">
            <button
              @click="showDeleteDialog = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              取消
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminLogout, checkAdminPermission, logAdminAction, getCurrentAdmin } from '@/lib/auth'
import { getSocialPlatforms, createSocialPlatform, updateSocialPlatform, deleteSocialPlatform } from '@/lib/supabase'
import type { SocialPlatform } from '@/lib/supabase'

/**
 * 社交平台管理页面组件
 * 创建日期：2024-12-19
 * 功能：管理社交平台的增删改查操作
 */

const router = useRouter()
const route = useRoute()

// 响应式数据
const platforms = ref<SocialPlatform[]>([])
const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const platformToDelete = ref<SocialPlatform | null>(null)
const editingPlatform = ref<SocialPlatform | null>(null)

// 表单数据
const platformForm = ref<Partial<SocialPlatform>>({
  platform_type: '',
  name: '',
  url: '',
  follower_count: 0,
  description: '',
  is_active: true
})

/**
 * 获取平台图标组件
 * @param platformType 平台类型
 * @returns 图标组件名
 */
const getPlatformIcon = (platformType: string) => {
  const iconMap: Record<string, string> = {
    weibo: 'Globe',
    wechat: 'MessageCircle',
    wechat_official: 'Megaphone',
    douyin: 'Video',
    xiaohongshu: 'Heart',
    bilibili: 'Play',
    zhihu: 'BookOpen',
    github: 'Github',
    twitter: 'Twitter',
    linkedin: 'Linkedin',
    youtube: 'Youtube'
  }
  return iconMap[platformType] || 'Globe'
}

/**
 * 获取平台名称
 * @param platformType 平台类型
 * @returns 平台名称
 */
const getPlatformName = (platformType: string) => {
  const nameMap: Record<string, string> = {
    weibo: '微博',
    wechat: '微信',
    wechat_official: '微信公众号',
    douyin: '抖音',
    xiaohongshu: '小红书',
    bilibili: '哔哩哔哩',
    zhihu: '知乎',
    github: 'GitHub',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    other: '其他'
  }
  return nameMap[platformType] || platformType
}

/**
 * 处理登出
 */
const handleLogout = () => {
  adminLogout()
  router.push('/admin/login')
}

/**
 * 加载平台列表
 */
const loadPlatforms = async () => {
  loading.value = true
  try {
    platforms.value = await getSocialPlatforms()
  } catch (error) {
    console.error('加载平台失败:', error)
    alert('加载平台失败，请重试')
  } finally {
    loading.value = false
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  platformForm.value = {
    platform_type: '',
    name: '',
    url: '',
    follower_count: 0,
    description: '',
    is_active: true
  }
}

/**
 * 编辑平台
 * @param platform 平台对象
 */
const editPlatform = (platform: SocialPlatform) => {
  editingPlatform.value = platform
  platformForm.value = { ...platform }
  showEditDialog.value = true
}

/**
 * 保存平台
 */
const savePlatform = async () => {
  if (!platformForm.value.platform_type || !platformForm.value.url) {
    alert('请填写必填字段')
    return
  }
  
  saving.value = true
  
  try {
    if (showEditDialog.value && editingPlatform.value) {
      // 更新平台
      await updateSocialPlatform(editingPlatform.value.id, platformForm.value)
      const currentAdmin = getCurrentAdmin()
      await logAdminAction(currentAdmin?.id || '', `更新社交平台: ${getPlatformName(platformForm.value.platform_type!)}`, 'social_platform', editingPlatform.value.id, { platform_type: platformForm.value.platform_type, name: platformForm.value.name })
      alert('平台已更新')
    } else {
      // 创建平台
      await createSocialPlatform(platformForm.value as Omit<SocialPlatform, 'id' | 'created_at' | 'updated_at'>)
      const currentAdmin = getCurrentAdmin()
      await logAdminAction(currentAdmin?.id || '', `添加社交平台: ${getPlatformName(platformForm.value.platform_type!)}`, 'social_platform', undefined, { platform_type: platformForm.value.platform_type, name: platformForm.value.name })
      alert('平台已添加')
    }
    
    closeDialog()
    loadPlatforms()
  } catch (error) {
    console.error('保存平台失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

/**
 * 切换平台状态
 * @param platform 平台对象
 */
const togglePlatformStatus = async (platform: SocialPlatform) => {
  try {
    const newStatus = !platform.is_active
    await updateSocialPlatform(platform.id, { is_active: newStatus })
    
    // 更新本地数据
    const index = platforms.value.findIndex(p => p.id === platform.id)
    if (index !== -1) {
      platforms.value[index].is_active = newStatus
    }
    
    const currentAdmin = getCurrentAdmin()
    await logAdminAction(currentAdmin?.id || '', `${newStatus ? '启用' : '禁用'}社交平台: ${getPlatformName(platform.platform_type)}`, 'social_platform', platform.id, { is_active: newStatus })
    alert(`平台已${newStatus ? '启用' : '禁用'}`)
  } catch (error) {
    console.error('更新平台状态失败:', error)
    alert('操作失败，请重试')
  }
}

/**
 * 删除平台
 * @param platform 平台对象
 */
const deletePlatform = (platform: SocialPlatform) => {
  platformToDelete.value = platform
  showDeleteDialog.value = true
}

/**
 * 确认删除平台
 */
const confirmDelete = async () => {
  if (!platformToDelete.value) return
  
  try {
    await deleteSocialPlatform(platformToDelete.value.id)
    
    // 从本地列表中移除
    platforms.value = platforms.value.filter(p => p.id !== platformToDelete.value!.id)
    
    const currentAdmin = getCurrentAdmin()
    await logAdminAction(currentAdmin?.id || '', `删除社交平台: ${getPlatformName(platformToDelete.value.platform_type)}`, 'social_platform', platformToDelete.value.id, { platform_type: platformToDelete.value.platform_type })
    alert('平台已删除')
  } catch (error) {
    console.error('删除平台失败:', error)
    alert('删除失败，请重试')
  } finally {
    showDeleteDialog.value = false
    platformToDelete.value = null
  }
}

/**
 * 关闭对话框
 */
const closeDialog = () => {
  closeDialogAndNavigate()
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

/**
 * 处理路由变化
 */
const handleRouteChange = () => {
  const routeName = route.name as string
  
  if (routeName === 'admin-social-platform-new') {
    // 新建平台模式
    resetForm()
    showAddDialog.value = true
  } else if (routeName === 'admin-social-platform-edit' && route.params.id) {
    // 编辑平台模式
    const platformId = route.params.id as string
    const platform = platforms.value.find(p => p.id === platformId)
    if (platform) {
      editPlatform(platform)
    }
  }
}

/**
 * 关闭对话框并返回列表页
 */
const closeDialogAndNavigate = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  editingPlatform.value = null
  resetForm()
  
  // 如果当前不在列表页，则导航回列表页
  if (route.name !== 'admin-social-platforms') {
    router.push('/admin/social-platforms')
  }
}

// 监听路由变化
watch(() => route.name, () => {
  handleRouteChange()
}, { immediate: true })

// 组件挂载时执行
onMounted(() => {
  checkPermission()
  loadPlatforms()
})
</script>