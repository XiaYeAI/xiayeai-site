<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/admin/dashboard" class="text-indigo-600 hover:text-indigo-800 mr-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </router-link>
            <h1 class="text-xl font-semibold text-gray-900">个人信息管理</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="saveProfile"
              :disabled="saving"
              class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {{ saving ? '保存中...' : '保存更改' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- 个人基本信息 -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">基本信息</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 头像上传 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">头像</label>
              <div class="flex items-center space-x-4">
                <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="头像" class="w-full h-full object-cover">
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <input
                    type="file"
                    ref="avatarInput"
                    @change="handleAvatarUpload"
                    accept="image/*"
                    class="hidden"
                  >
                  <button
                    @click="avatarInput?.click()"
                    class="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    更换头像
                  </button>
                </div>
              </div>
            </div>

            <!-- 姓名 -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
              <input
                id="name"
                v-model="profile.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入姓名"
              >
            </div>

            <!-- 职位 -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">职位 *</label>
              <input
                id="title"
                v-model="profile.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入职位"
              >
            </div>

            <!-- 邮箱 -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                id="email"
                v-model="profile.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入邮箱地址"
              >
            </div>

            <!-- 微信 -->
            <div>
              <label for="wechat" class="block text-sm font-medium text-gray-700 mb-2">微信二维码</label>
              <input
                id="wechat"
                v-model="profile.wechat_qr_url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入微信二维码图片链接"
              >
            </div>

            <!-- 简介 -->
            <div class="md:col-span-2">
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
              <textarea
                id="bio"
                v-model="profile.bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入个人简介"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能管理 -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">技能管理</h2>
          <button
            @click="showAddSkillModal = true"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            添加技能
          </button>
        </div>
        <div class="p-6">
          <div v-if="skills.length === 0" class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <p>暂无技能信息</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="skill in skills"
              :key="skill.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center">
                  <span v-if="skill.icon" class="text-2xl mr-2">{{ skill.icon }}</span>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ skill.name }}</h3>
                    <p v-if="skill.category" class="text-sm text-gray-500">{{ skill.category }}</p>
                  </div>
                </div>
                <div class="flex space-x-1">
                  <button
                    @click="editSkill(skill)"
                    class="text-indigo-600 hover:text-indigo-800 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteSkill(skill.id)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p v-if="skill.description" class="text-sm text-gray-600 mb-2">{{ skill.description }}</p>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">熟练度:</span>
                <div class="flex space-x-1">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="w-3 h-3 rounded-full"
                    :class="i <= skill.proficiency_level ? 'bg-indigo-500' : 'bg-gray-200'"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑技能模态框 -->
    <div v-if="showAddSkillModal || editingSkill" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingSkill ? '编辑技能' : '添加技能' }}
        </h3>
        <form @submit.prevent="saveSkill">
          <div class="space-y-4">
            <div>
              <label for="skillName" class="block text-sm font-medium text-gray-700 mb-1">技能名称 *</label>
              <input
                id="skillName"
                v-model="skillForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入技能名称"
              >
            </div>
            <div>
              <label for="skillCategory" class="block text-sm font-medium text-gray-700 mb-1">技能分类</label>
              <input
                id="skillCategory"
                v-model="skillForm.category"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入技能分类"
              >
            </div>
            <div>
              <label for="skillIcon" class="block text-sm font-medium text-gray-700 mb-1">图标</label>
              <input
                id="skillIcon"
                v-model="skillForm.icon"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入图标（如：💻）"
              >
            </div>
            <div>
              <label for="skillDescription" class="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                id="skillDescription"
                v-model="skillForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入技能描述"
              ></textarea>
            </div>
            <div>
              <label for="skillProficiency" class="block text-sm font-medium text-gray-700 mb-1">熟练度 (1-5)</label>
              <select
                id="skillProficiency"
                v-model="skillForm.proficiency_level"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="1">1 - 初学者</option>
                <option value="2">2 - 入门</option>
                <option value="3">3 - 中级</option>
                <option value="4">4 - 高级</option>
                <option value="5">5 - 专家</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="cancelSkillEdit"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="skillSaving"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {{ skillSaving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { checkAdminPermission } from '@/lib/auth'

/**
 * 管理员个人信息管理页面组件
 * 创建日期：2024-12-22
 * 功能：管理个人基本信息和技能信息
 */

const router = useRouter()

// 响应式数据
const saving = ref(false)
const skillSaving = ref(false)
const showAddSkillModal = ref(false)
const editingSkill = ref<any>(null)
const avatarInput = ref<HTMLInputElement>()

// 个人信息表单
const profile = ref({
  id: '',
  name: '',
  title: '',
  bio: '',
  avatar_url: '',
  email: '',
  wechat_qr_url: ''
})

// 技能列表
const skills = ref<any[]>([])

// 技能表单
const skillForm = ref({
  name: '',
  category: '',
  icon: '',
  description: '',
  proficiency_level: 3
})

/**
 * 检查管理员权限
 * 创建日期：2024-12-22
 */
const checkPermission = () => {
  if (!checkAdminPermission()) {
    router.push('/admin/login')
    return false
  }
  return true
}

/**
 * 加载个人信息
 * 创建日期：2024-12-22
 */
const loadProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (data) {
      profile.value = { ...data }
    }
  } catch (error) {
    console.error('加载个人信息失败:', error)
  }
}

/**
 * 加载技能列表
 * 创建日期：2024-12-22
 */
const loadSkills = async () => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    skills.value = data || []
  } catch (error) {
    console.error('加载技能列表失败:', error)
  }
}

/**
 * 保存个人信息
 * 创建日期：2024-12-22
 */
const saveProfile = async () => {
  if (!profile.value.name || !profile.value.title) {
    alert('请填写必填字段')
    return
  }

  saving.value = true
  try {
    const profileData = {
      name: profile.value.name,
      title: profile.value.title,
      bio: profile.value.bio,
      avatar_url: profile.value.avatar_url,
      email: profile.value.email,
      wechat_qr_url: profile.value.wechat_qr_url,
      updated_at: new Date().toISOString()
    }

    if (profile.value.id) {
      // 更新现有记录
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profile.value.id)

      if (error) throw error
    } else {
      // 创建新记录
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()

      if (error) throw error
      profile.value.id = data.id
    }

    alert('个人信息保存成功！')
  } catch (error) {
    console.error('保存个人信息失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

/**
 * 处理头像上传
 * 创建日期：2024-12-22
 * @param event - 文件选择事件
 */
const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 这里可以实现文件上传逻辑
    // 暂时使用本地预览
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar_url = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

/**
 * 编辑技能
 * 创建日期：2024-12-22
 * @param skill - 技能对象
 */
const editSkill = (skill: any) => {
  editingSkill.value = skill
  skillForm.value = { ...skill }
}

/**
 * 取消技能编辑
 * 创建日期：2024-12-22
 */
const cancelSkillEdit = () => {
  showAddSkillModal.value = false
  editingSkill.value = null
  skillForm.value = {
    name: '',
    category: '',
    icon: '',
    description: '',
    proficiency_level: 3
  }
}

/**
 * 保存技能
 * 创建日期：2024-12-22
 */
const saveSkill = async () => {
  if (!skillForm.value.name) {
    alert('请填写技能名称')
    return
  }

  skillSaving.value = true
  try {
    const skillData = {
      name: skillForm.value.name,
      category: skillForm.value.category,
      icon: skillForm.value.icon,
      description: skillForm.value.description,
      proficiency_level: parseInt(skillForm.value.proficiency_level.toString()),
      profile_id: profile.value.id || null
    }

    if (editingSkill.value) {
      // 更新技能
      const { error } = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', editingSkill.value.id)

      if (error) throw error
    } else {
      // 添加新技能
      const { error } = await supabase
        .from('skills')
        .insert([skillData])

      if (error) throw error
    }

    await loadSkills()
    cancelSkillEdit()
    alert('技能保存成功！')
  } catch (error) {
    console.error('保存技能失败:', error)
    alert('保存失败，请重试')
  } finally {
    skillSaving.value = false
  }
}

/**
 * 删除技能
 * 创建日期：2024-12-22
 * @param skillId - 技能ID
 */
const deleteSkill = async (skillId: string) => {
  if (!confirm('确定要删除这个技能吗？')) {
    return
  }

  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId)

    if (error) throw error

    await loadSkills()
    alert('技能删除成功！')
  } catch (error) {
    console.error('删除技能失败:', error)
    alert('删除失败，请重试')
  }
}

// 组件挂载时执行
onMounted(() => {
  if (checkPermission()) {
    loadProfile()
    loadSkills()
  }
})
</script>