<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <p class="copyright">
          © {{ currentYear }} 夏叶AI加油站 版权所有
        </p>
        <p class="icp-filing">
          <a 
            href="https://beian.miit.gov.cn/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="icp-link"
          >
            粤ICP备2025458359号
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * 网站底部组件
 * 功能：显示版权信息和ICP备案号
 * 参数：无
 * 返回值：无
 * 创建日期：2025-01-31
 * 作者：SOLO Coding
 */

// 获取当前年份
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 24px 0;
  margin-top: auto;
  border-top: 1px solid #374151;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copyright {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.icp-filing {
  margin: 0;
}

.icp-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.icp-link:hover {
  color: #e5e7eb;
  text-decoration: underline;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .footer-info {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 16px 0;
  }
  
  .footer-content {
    padding: 0 16px;
  }
  
  .copyright,
  .icp-link {
    font-size: 12px;
  }
}
</style>