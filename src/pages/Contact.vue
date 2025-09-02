<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            联系合作
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            商务合作与技术交流联系方式
          </p>
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- 联系方式 -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span class="text-3xl mr-3">📞</span>
            联系方式
          </h2>
          
          <div class="space-y-6">
            <!-- 邮箱联系 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">邮箱联系</h3>
                <p class="text-gray-600 mb-3">商务合作、技术交流、内容授权等事宜</p>
                <a :href="`mailto:${profile?.email || 'contact@xiayeai.com'}`" 
                   class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  发送邮件
                </a>
              </div>
            </div>
            
            <!-- 微信联系 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.5 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm5 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">微信联系</h3>
                <p class="text-gray-600 mb-3">扫码添加微信，快速沟通交流</p>
                <button @click="showWechatQR" 
                        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  查看微信二维码
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 合作类型 -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span class="text-3xl mr-3">🤝</span>
            合作类型
          </h2>
          
          <div class="space-y-6">
            <!-- 商务合作 -->
            <div class="border-l-4 border-orange-500 pl-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">商务合作</h3>
              <ul class="text-gray-600 space-y-1">
                <li>• 品牌推广与营销合作</li>
                <li>• 产品评测与体验分享</li>
                <li>• 广告投放与内容赞助</li>
              </ul>
            </div>
            
            <!-- 技术交流 -->
            <div class="border-l-4 border-blue-500 pl-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">技术交流</h3>
              <ul class="text-gray-600 space-y-1">
                <li>• AI技术研讨与分享</li>
                <li>• 开源项目合作开发</li>
                <li>• 技术咨询与解决方案</li>
              </ul>
            </div>
            
            <!-- 内容合作 -->
            <div class="border-l-4 border-purple-500 pl-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">内容合作</h3>
              <ul class="text-gray-600 space-y-1">
                <li>• 文章转载与内容授权</li>
                <li>• 联合创作与跨平台发布</li>
                <li>• 课程合作与知识分享</li>
              </ul>
            </div>
            
            <!-- 其他合作 -->
            <div class="border-l-4 border-green-500 pl-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">其他合作</h3>
              <ul class="text-gray-600 space-y-1">
                <li>• 活动策划与联合举办</li>
                <li>• 社群建设与运营合作</li>
                <li>• 定制化服务与咨询</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 合作流程 -->
      <div class="mt-12 bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
          <span class="text-3xl mr-3">📋</span>
          合作流程
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-orange-600">1</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">初步沟通</h3>
            <p class="text-gray-600 text-sm">通过邮件或微信联系，说明合作意向和具体需求</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">方案制定</h3>
            <p class="text-gray-600 text-sm">根据需求制定详细的合作方案和时间安排</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">合同签署</h3>
            <p class="text-gray-600 text-sm">确认合作细节，签署正式合作协议</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-green-600">4</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">项目执行</h3>
            <p class="text-gray-600 text-sm">按照约定时间和标准执行合作项目</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 微信二维码弹窗 -->
  <WechatQRModal 
    :show="showWechatModal" 
    :qr-code="profile?.wechat_qr_code" 
    @close="closeWechatModal" 
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import WechatQRModal from '@/components/WechatQRModal.vue'

/**
 * Contact 联系合作页面
 * 功能：展示联系方式和合作信息
 * 创建日期：2024-12-19
 * 更新日期：2025-01-31
 */

// 响应式数据
const profile = ref<any>(null)
const showWechatModal = ref(false)

/**
 * 获取个人资料
 * 功能：从Supabase获取个人资料信息
 * 参数：无
 * 返回值：Promise<void>
 * 创建日期：2025-01-31
 */
const fetchProfile = async (): Promise<void> => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
    
    if (data && data.length > 0) {
      profile.value = data[0]
    } else {
      profile.value = { email: 'contact@xiayeai.com' }
    }
  } catch (err) {
    console.error('获取个人资料失败:', err)
    profile.value = { email: 'contact@xiayeai.com' }
  }
}

/**
 * 显示微信二维码
 * 功能：显示微信联系二维码弹窗
 * 参数：无
 * 返回值：无
 * 创建日期：2025-01-31
 */
const showWechatQR = (): void => {
  showWechatModal.value = true
}

/**
 * 关闭微信二维码弹窗
 * 功能：关闭微信联系二维码弹窗
 * 参数：无
 * 返回值：无
 * 创建日期：2025-01-31
 */
const closeWechatModal = (): void => {
  showWechatModal.value = false
}

// 组件挂载时获取个人资料
onMounted(() => {
  fetchProfile()
})

// 页面元信息
const title = '联系合作 - 夏叶AI加油站'
const description = '商务合作与技术交流联系方式'
</script>

<style scoped>
/* 页面特定样式 */
</style>