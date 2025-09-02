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
            <h1 class="text-xl font-semibold text-gray-900">网站统计管理</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showAddDialog = true"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              添加统计
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
      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总统计项目</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总访问量</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ totalViews.toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总用户数</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ totalUsers.toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">平均增长率</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ averageGrowth }}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计列表 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-sm text-gray-500">加载中...</p>
          </div>

          <div v-else-if="stats.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">暂无统计数据</p>
            <button
              @click="showAddDialog = true"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              添加第一个统计项目
            </button>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">统计项目</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">当前值</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">增长率</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="stat in stats" :key="stat.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <component :is="getStatIcon(stat.stat_type)" class="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ getStatName(stat.stat_type) }}</div>
                        <div class="text-sm text-gray-500">{{ stat.description || '暂无描述' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ stat.current_value.toLocaleString() }}</div>
                    <div class="text-sm text-gray-500">{{ stat.unit || '' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'text-green-600': stat.growth_rate > 0,
                        'text-red-600': stat.growth_rate < 0,
                        'text-gray-600': stat.growth_rate === 0
                      }"
                      class="text-sm font-medium"
                    >
                      {{ stat.growth_rate > 0 ? '+' : '' }}{{ stat.growth_rate }}%
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(stat.updated_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      @click="editStat(stat)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      编辑
                    </button>
                    <button
                      @click="deleteStat(stat)"
                      class="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加/编辑统计对话框 -->
    <div v-if="showAddDialog || showEditDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditDialog ? '编辑统计' : '添加统计' }}
          </h3>
          
          <form @submit.prevent="saveStat">
            <!-- 统计类型 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">统计类型 *</label>
              <select
                v-model="statForm.stat_type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">请选择统计类型</option>
                <option value="page_views">页面访问量</option>
                <option value="unique_visitors">独立访客</option>
                <option value="bounce_rate">跳出率</option>
                <option value="avg_session_duration">平均会话时长</option>
                <option value="conversion_rate">转化率</option>
                <option value="user_registrations">用户注册数</option>
                <option value="article_views">文章阅读量</option>
                <option value="social_followers">社交媒体粉丝</option>
                <option value="email_subscribers">邮件订阅者</option>
                <option value="revenue">收入</option>
                <option value="other">其他</option>
              </select>
            </div>

            <!-- 当前值 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">当前值 *</label>
              <input
                v-model.number="statForm.current_value"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 增长率 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">增长率 (%)</label>
              <input
                v-model.number="statForm.growth_rate"
                type="number"
                step="0.01"
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 单位 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">单位</label>
              <input
                v-model="statForm.unit"
                type="text"
                placeholder="例如：次、人、%、元等"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <!-- 描述 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
              <textarea
                v-model="statForm.description"
                rows="3"
                placeholder="统计项目描述（可选）"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- 按钮 -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeDialog"
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
              确定要删除统计项目 "{{ getStatName(statToDelete?.stat_type) }}" 吗？此操作不可撤销。
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogout, checkAdminPermission, logAdminAction, getCurrentAdmin } from '@/lib/auth'
import { getSiteStats, createSiteStat, updateSiteStat, deleteSiteStat } from '@/lib/supabase'
import type { SiteStats } from '@/lib/supabase'

/**
 * 网站统计管理页面组件
 * 创建日期：2024-12-19
 * 功能：管理网站统计数据的增删改查操作
 */

const router = useRouter()

// 响应式数据
const stats = ref<SiteStats[]>([])
const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const statToDelete = ref<SiteStats | null>(null)
const editingStat = ref<SiteStats | null>(null)

// 表单数据
const statForm = ref<Partial<SiteStats>>({
  stat_type: '',
  current_value: 0,
  growth_rate: 0,
  unit: '',
  description: ''
})

// 计算属性
const totalViews = computed(() => {
  const pageViewsStat = stats.value.find(s => s.stat_type === 'page_views')
  return pageViewsStat?.current_value || 0
})

const totalUsers = computed(() => {
  const usersStat = stats.value.find(s => s.stat_type === 'unique_visitors')
  return usersStat?.current_value || 0
})

const averageGrowth = computed(() => {
  if (stats.value.length === 0) return 0
  const totalGrowth = stats.value.reduce((sum, stat) => sum + stat.growth_rate, 0)
  return Math.round((totalGrowth / stats.value.length) * 100) / 100
})

/**
 * 获取统计图标
 * @param statType 统计类型
 * @returns 图标组件名
 */
const getStatIcon = (statType: string) => {
  const iconMap: Record<string, string> = {
    page_views: 'Eye',
    unique_visitors: 'Users',
    bounce_rate: 'TrendingDown',
    avg_session_duration: 'Clock',
    conversion_rate: 'Target',
    user_registrations: 'UserPlus',
    article_views: 'BookOpen',
    social_followers: 'Heart',
    email_subscribers: 'Mail',
    revenue: 'DollarSign'
  }
  return iconMap[statType] || 'BarChart3'
}

/**
 * 获取统计名称
 * @param statType 统计类型
 * @returns 统计名称
 */
const getStatName = (statType: string) => {
  const nameMap: Record<string, string> = {
    page_views: '页面访问量',
    unique_visitors: '独立访客',
    bounce_rate: '跳出率',
    avg_session_duration: '平均会话时长',
    conversion_rate: '转化率',
    user_registrations: '用户注册数',
    article_views: '文章阅读量',
    social_followers: '社交媒体粉丝',
    email_subscribers: '邮件订阅者',
    revenue: '收入',
    other: '其他'
  }
  return nameMap[statType] || statType
}

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

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
  loading.value = true
  try {
    stats.value = await getSiteStats()
  } catch (error) {
    console.error('加载统计数据失败:', error)
    alert('加载统计数据失败，请重试')
  } finally {
    loading.value = false
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  statForm.value = {
    stat_type: '',
    current_value: 0,
    growth_rate: 0,
    unit: '',
    description: ''
  }
}

/**
 * 编辑统计
 * @param stat 统计对象
 */
const editStat = (stat: SiteStats) => {
  editingStat.value = stat
  statForm.value = { ...stat }
  showEditDialog.value = true
}

/**
 * 保存统计
 */
const saveStat = async () => {
  if (!statForm.value.stat_type || statForm.value.current_value === undefined) {
    alert('请填写必填字段')
    return
  }
  
  saving.value = true
  
  try {
    if (showEditDialog.value && editingStat.value) {
      // 更新统计
      await updateSiteStat(editingStat.value.id, statForm.value)
      const currentAdmin = getCurrentAdmin()
      await logAdminAction(currentAdmin?.id || '', `更新网站统计: ${getStatName(statForm.value.stat_type!)}`, 'site_stats', editingStat.value.id, { stat_type: statForm.value.stat_type, current_value: statForm.value.current_value })
      alert('统计已更新')
    } else {
      // 创建统计
      await createSiteStat(statForm.value as Omit<SiteStats, 'id' | 'created_at' | 'updated_at'>)
      const currentAdmin = getCurrentAdmin()
      await logAdminAction(currentAdmin?.id || '', `添加网站统计: ${getStatName(statForm.value.stat_type!)}`, 'site_stats', undefined, { stat_type: statForm.value.stat_type, current_value: statForm.value.current_value })
      alert('统计已添加')
    }
    
    closeDialog()
    loadStats()
  } catch (error) {
    console.error('保存统计失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

/**
 * 删除统计
 * @param stat 统计对象
 */
const deleteStat = (stat: SiteStats) => {
  statToDelete.value = stat
  showDeleteDialog.value = true
}

/**
 * 确认删除统计
 */
const confirmDelete = async () => {
  if (!statToDelete.value) return
  
  try {
    await deleteSiteStat(statToDelete.value.id)
    
    // 从本地列表中移除
    stats.value = stats.value.filter(s => s.id !== statToDelete.value!.id)
    
    const currentAdmin = getCurrentAdmin()
    await logAdminAction(currentAdmin?.id || '', `删除网站统计: ${getStatName(statToDelete.value.stat_type)}`, 'site_stats', statToDelete.value.id, { stat_type: statToDelete.value.stat_type })
    alert('统计已删除')
  } catch (error) {
    console.error('删除统计失败:', error)
    alert('删除失败，请重试')
  } finally {
    showDeleteDialog.value = false
    statToDelete.value = null
  }
}

/**
 * 关闭对话框
 */
const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  editingStat.value = null
  resetForm()
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