<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="animate-pulse">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="w-32 h-32 bg-gray-300 rounded-full"></div>
            <div class="flex-1 space-y-4">
              <div class="h-8 bg-gray-300 rounded w-1/3"></div>
              <div class="h-6 bg-gray-300 rounded w-1/2"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-300 rounded"></div>
                <div class="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div class="text-red-600 mb-4">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchProfileData" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          重试
        </button>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <!-- 个人简介卡片 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <!-- 头像 -->
          <div class="flex-shrink-0">
            <div v-if="profile?.avatar_url" class="w-32 h-32 rounded-full overflow-hidden">
              <img :src="profile.avatar_url" :alt="profile.name" class="w-full h-full object-cover">
            </div>
            <div v-else class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {{ profile?.name?.charAt(0) || '夏' }}
            </div>
          </div>
          
          <!-- 基本信息 -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ profile?.name || '夏叶' }}</h2>
            <p class="text-lg text-blue-600 mb-4">{{ profile?.title || 'AI技术专家 & 内容创作者' }}</p>
            <p v-if="profile?.bio" class="text-gray-600 leading-relaxed mb-4">
              {{ profile.bio }}
            </p>
            <p v-else class="text-gray-600 leading-relaxed mb-4">
              专注于人工智能技术研究与应用，致力于通过技术创新推动行业发展。
            </p>
            
            <!-- 基本信息 -->
            <div v-if="profile?.location || profile?.phone" class="mb-6">
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <div v-if="profile?.location" class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ profile.location }}
                </div>
                <div v-if="profile?.phone" class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {{ profile.phone }}
                </div>
              </div>
            </div>
            
            <!-- 联系方式 -->
            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
              <!-- 邮箱 -->
              <a v-if="profile?.email" :href="`mailto:${profile.email}`" class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                邮箱
              </a>
              
              <!-- 微信 -->
              <button @click="showWechatQR" class="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.900 7.852.194.468-.78.730-1.673.730-2.615 0-4.054-3.891-7.342-8.691-7.342zm-2.363 5.156a.802.802 0 1 1 0-1.604.802.802 0 0 1 0 1.604zm4.726 0a.802.802 0 1 1 0-1.604.802.802 0 0 1 0 1.604z"/>
                  <path d="M15.724 9.91c-2.573 0-4.658 1.727-4.658 3.857 0 2.129 2.085 3.857 4.658 3.857.474 0 .935-.07 1.371-.184a.79.79 0 0 1 .653.089l1.379.806a.3.3 0 0 0 .153.05c.147 0 .265-.118.265-.265 0-.067-.026-.13-.044-.194l-.355-1.355a.538.538 0 0 1 .194-.607c1.677-1.222 2.75-3.045 2.75-5.057 0-2.13-2.085-3.857-4.658-3.857zm-2.363 4.658a.802.802 0 1 1 0-1.604.802.802 0 0 1 0 1.604zm4.726 0a.802.802 0 1 1 0-1.604.802.802 0 0 1 0 1.604z"/>
                </svg>
                微信
              </button>
              
              <!-- GitHub -->
              <a href="https://github.com/XiaYeAI" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                </svg>
                GitHub
              </a>
            </div>
            
            <!-- 微信二维码弹窗 -->
            <WechatQRModal 
              :show="showWechatModal" 
              :qr-url="profile?.wechat_qr_url" 
              @close="closeWechatModal" 
            />
          </div>
        </div>
      </div>
      
      <!-- 技能专长 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">技能专长</h3>
        <div v-if="skills.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="skill in skills" :key="skill.id" :class="`bg-gradient-to-br ${getSkillCategoryColor(skill.category)} rounded-lg p-6`">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900">{{ skill.name }}</h4>
            </div>
            <p class="text-gray-600 text-sm">{{ skill.description }}</p>
            <div v-if="skill.proficiency_level" class="mt-3">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>熟练度</span>
                <span>{{ skill.proficiency_level * 20 }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" :style="{ width: (skill.proficiency_level * 20) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p>暂无技能信息</p>
        </div>
      </div>
      

      
      <!-- 联系我 -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-center text-white">
        <h3 class="text-2xl font-bold mb-4">联系我</h3>
        <p class="text-purple-100 mb-6">
          如果您对AI技术有任何问题，或者想要合作交流，
          欢迎通过以下方式联系我！
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a href="#" class="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            关注公众号
          </a>
          <a :href="`mailto:${profile?.email || 'contact@xiayeai.com'}`" class="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            发送邮件
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import WechatQRModal from '@/components/WechatQRModal.vue'

/**
 * About 关于我页面
 * 功能：展示个人技术背景和专业经历，从数据库获取真实数据
 * 作者：SOLO Coding
 * 日期：2025-01-22
 */

// 响应式数据
const profile = ref(null)
const skills = ref([])
const socialLinks = ref([])
const loading = ref(true)
const error = ref('')

// 微信二维码弹窗相关
const showWechatModal = ref(false)

/**
 * 获取个人资料数据
 * 功能：从Supabase数据库获取个人信息、技能、工作经历等数据
 * 修改：移除硬编码的profile_id，获取数据库中的第一个profile记录
 */
const fetchProfileData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // 获取个人基本信息 - 获取第一个profile记录
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
    
    if (profileError) {
      console.error('获取个人信息失败:', profileError)
      // 设置默认个人信息
      profile.value = {
        name: '夏叶',
        title: 'AI技术专家 & 内容创作者',
        bio: '专注于人工智能技术研究与应用，致力于通过技术创新推动行业发展。',
        email: 'contact@xiayeai.com',
        avatar_url: null
      }
    } else if (profileData && profileData.length > 0) {
      profile.value = profileData[0]
    } else {
      // 数据库中没有profile记录时的默认信息
      profile.value = {
        name: '夏叶',
        title: 'AI技术专家 & 内容创作者',
        bio: '专注于人工智能技术研究与应用，致力于通过技术创新推动行业发展。',
        email: 'contact@xiayeai.com',
        avatar_url: null
      }
    }
    
    // 获取技能数据（获取所有技能，不限制profile_id）
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (skillsError) {
      console.error('获取技能数据失败:', skillsError)
      skills.value = []
    } else {
      skills.value = skillsData || []
    }
    
    // 获取社交媒体链接（如果有profile数据）
    if (profile.value && profile.value.id) {
      const profileId = profile.value.id
      
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('sort_order')
      
      if (socialError) {
        console.error('获取社交链接失败:', socialError)
        socialLinks.value = []
      } else {
        socialLinks.value = socialData || []
      }
    } else {
      socialLinks.value = []
    }
    
  } catch (err: any) {
    console.error('获取数据失败:', err)
    error.value = err.message || '获取数据失败，请稍后重试'
    // 即使出错也设置默认信息
    profile.value = {
      name: '夏叶',
      title: 'AI技术专家 & 内容创作者',
      bio: '专注于人工智能技术研究与应用，致力于通过技术创新推动 activations。',
      email: 'contact@xiayeai.com',
      avatar_url: null
    }
    skills.value = []
    socialLinks.value = []
  } finally {
    loading.value = false
  }
}



/**
 * 显示微信二维码弹窗
 * 功能：点击微信按钮时显示二维码弹窗
 * 创建日期：2025-01-31
 */
const showWechatQR = () => {
  showWechatModal.value = true
}

/**
 * 关闭微信二维码弹窗
 * 功能：关闭二维码弹窗
 * 创建日期：2025-01-31
 */
const closeWechatModal = () => {
  showWechatModal.value = false
}

/**
 * 获取技能分类的背景色
 * @param {string} category - 技能分类
 * @returns {string} CSS类名
 */
const getSkillCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    '技术': 'from-blue-50 to-blue-100',
    '编程': 'from-green-50 to-green-100',
    '软技能': 'from-purple-50 to-purple-100',
    '工具': 'from-yellow-50 to-yellow-100',
    '云计算': 'from-red-50 to-red-100'
  }
  return colorMap[category] || 'from-gray-50 to-gray-100'
}

// 组件挂载时获取数据
onMounted(() => {
  fetchProfileData()
})

// 页面元信息
const title = '关于我 - 夏叶AI加油站'
const description = '了解夏叶的技术背景和专业经历，AI技术专家与内容创作者'
</script>

<style scoped>
/* 页面特定样式 */
</style>