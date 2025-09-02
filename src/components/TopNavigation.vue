<template>
  <nav class="top-navigation">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-logo">
        <router-link to="/" class="logo-link">
          <img src="/favicon.svg" alt="夏叶AI加油站" class="logo-image" />
          <span class="logo-text">夏叶AI加油站</span>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <div class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">首页</span>
        </router-link>
        
        <router-link to="/social" class="nav-item" :class="{ active: $route.path === '/social' }">
          <span class="nav-icon">📱</span>
          <span class="nav-text">媒体</span>
        </router-link>
        
        <div class="nav-item disabled">
          <span class="nav-icon">📦</span>
          <span class="nav-text">产品</span>
          <span class="coming-soon">敬请期待</span>
        </div>
        
        <router-link to="/articles" class="nav-item" :class="{ active: $route.path.startsWith('/articles') }">
          <span class="nav-icon">📝</span>
          <span class="nav-text">文章</span>
        </router-link>
        
        <router-link to="/about" class="nav-item" :class="{ active: $route.path === '/about' }">
          <span class="nav-icon">👤</span>
          <span class="nav-text">关于我</span>
        </router-link>
      </div>

      <!-- 移动端菜单按钮 -->
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
      <router-link to="/" class="mobile-nav-item" @click="closeMobileMenu">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      
      <router-link to="/social" class="mobile-nav-item" @click="closeMobileMenu">
        <span class="nav-icon">📱</span>
        <span class="nav-text">媒体</span>
      </router-link>
      
      <div class="mobile-nav-item disabled">
        <span class="nav-icon">📦</span>
        <span class="nav-text">产品</span>
        <span class="coming-soon">敬请期待</span>
      </div>
      
      <router-link to="/articles" class="mobile-nav-item" @click="closeMobileMenu">
        <span class="nav-icon">📝</span>
        <span class="nav-text">文章</span>
      </router-link>
      
      <router-link to="/about" class="mobile-nav-item" @click="closeMobileMenu">
        <span class="nav-icon">👤</span>
        <span class="nav-text">关于我</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 顶部导航栏组件
 * 功能：提供网站主要页面的导航功能
 * 创建日期：2025-01-31
 * 作者：SOLO Coding
 */

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

/**
 * 切换移动端菜单显示状态
 * 功能：控制移动端菜单的显示和隐藏
 * 参数：无
 * 返回值：无
 * 创建日期：2025-01-31
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * 关闭移动端菜单
 * 功能：隐藏移动端菜单
 * 参数：无
 * 返回值：无
 * 创建日期：2025-01-31
 */
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.top-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
  object-fit: cover;
}

.logo-text {
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.nav-item:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-1px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-icon {
  font-size: 1rem;
}

.nav-text {
  font-size: 0.9rem;
}

.coming-soon {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  margin-left: 0.3rem;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  margin: 2px 0;
  transition: all 0.3s ease;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mobile-nav-item:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.mobile-nav-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .nav-container {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    height: 50px;
    padding: 0 0.75rem;
  }
  
  .logo-image {
    width: 28px;
    height: 28px;
  }
  
  .logo-text {
    font-size: 0.9rem;
  }
}

/* 为页面内容添加顶部间距 */
body {
  padding-top: 60px;
}

@media (max-width: 480px) {
  body {
    padding-top: 50px;
  }
}
</style>