<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Markdown渲染测试</h1>
    
    <div class="bg-white rounded-lg shadow-sm p-8">
      <h2 class="text-xl font-semibold mb-4">测试内容：</h2>
      <div class="markdown-content" v-html="testContent"></div>
    </div>
    
    <div class="mt-8">
      <router-link 
        to="/" 
        class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'

/**
 * Markdown渲染测试页面
 * 功能：测试Markdown渲染功能是否正常工作
 * 作者：SOLO Coding
 * 日期：2025-01-22
 */

const markdownText = `# 标题测试

## 二级标题

### 三级标题

这是一段**粗体文本**和*斜体文本*，还有\`行内代码\`。

## 代码块测试

\`\`\`javascript
function hello() {
  // Markdown测试页面
  return "success";
}
\`\`\`

## 列表测试

- 第一项
- 第二项
- 第三项

1. 有序列表1
2. 有序列表2
3. 有序列表3

## 引用测试

> 这是一个引用块
> 包含多行内容

## 链接测试

[这是一个链接](https://www.example.com)

---

**测试完成！**`

// 计算属性：渲染Markdown内容
const testContent = computed(() => {
  try {
    // 渲染Markdown内容
    const result = renderMarkdown(markdownText)
    // Markdown内容已成功渲染
    return result
  } catch (error) {
    console.error('Markdown渲染失败:', error)
    return '<p class="text-red-500">Markdown渲染失败</p>'
  }
})
</script>

<style>
/* 导入Markdown样式 */
@import '../styles/markdown.css';
</style>