<template>
  <!-- 微信二维码弹窗 -->
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="handleClose">
    <div class="bg-white rounded-lg p-6 max-w-sm mx-4" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">微信二维码</h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- 有二维码时显示 -->
      <div v-if="qrUrl" class="text-center">
        <img :src="qrUrl" alt="微信二维码" class="w-48 h-48 mx-auto mb-4 rounded-lg">
        <p class="text-sm text-gray-600">扫描二维码添加微信</p>
      </div>
      
      <!-- 没有二维码时显示提示 -->
      <div v-else class="text-center py-8">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.732L13.732 4.268c-.77-1.064-2.694-1.064-3.464 0L3.34 16.268C2.57 17.333 3.532 19 5.072 19z"></path>
        </svg>
        <p class="text-gray-500 mb-4">暂未设置微信二维码</p>
        <p class="text-sm text-gray-400">请通过邮箱联系</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 微信二维码弹窗组件
 * 功能：统一的微信二维码显示弹窗，支持有无二维码的不同状态
 * 创建日期：2025-01-31
 */

interface Props {
  show: boolean
  qrUrl?: string | null
}

interface Emits {
  close: []
}

// 定义props
const props = withDefaults(defineProps<Props>(), {
  show: false,
  qrUrl: null
})

// 定义emits
const emit = defineEmits<Emits>()

/**
 * 处理关闭弹窗
 * 功能：触发关闭事件
 * 创建日期：2025-01-31
 */
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
/* 组件特定样式 */
</style>