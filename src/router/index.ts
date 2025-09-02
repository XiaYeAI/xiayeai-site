import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/pages/Home.vue'

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '夏叶AI加油站 - AI技术分享与交流平台',
      description: '专注AI技术分享，提供最新的人工智能资讯、技术文章和学习资源'
    }
  },
  {
    path: '/social',
    name: 'social',
    component: () => import('@/pages/Social.vue'),
    meta: {
      title: '自媒体矩阵 - 夏叶AI加油站',
      description: '关注夏叶AI加油站的各大社交媒体平台，获取最新AI技术动态'
    }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/pages/Articles.vue'),
    meta: {
      title: '公众号文章 - 夏叶AI加油站',
      description: '阅读夏叶AI加油站的技术文章，深入了解AI前沿技术'
    }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('@/pages/ArticleDetail.vue'),
    meta: {
      title: '文章详情 - 夏叶AI加油站',
      description: 'AI技术文章详细内容'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
    meta: {
      title: '关于我 - 夏叶AI加油站',
      description: '了解夏叶AI加油站的技术背景和专业经历'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/Contact.vue'),
    meta: {
      title: '联系合作 - 夏叶AI加油站',
      description: '商务合作与技术交流联系方式'
    }
  },

  // 管理员后台路由
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/pages/AdminLogin.vue'),
    meta: {
      title: '管理员登录 - 夏叶AI加油站',
      description: '管理员登录页面'
    }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/pages/AdminDashboard.vue'),
    meta: {
      title: '管理员仪表板 - 夏叶AI加油站',
      description: '管理员后台仪表板',
      requiresAuth: true
    }
  },
  {
    path: '/admin/articles',
    name: 'admin-articles',
    component: () => import('@/pages/AdminArticles.vue'),
    meta: {
      title: '文章管理 - 夏叶AI加油站',
      description: '管理员文章管理页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/articles/new',
    name: 'admin-article-new',
    component: () => import('@/pages/AdminArticleEdit.vue'),
    meta: {
      title: '新建文章 - 夏叶AI加油站',
      description: '管理员新建文章页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/articles/edit/:id',
    name: 'admin-article-edit',
    component: () => import('@/pages/AdminArticleEdit.vue'),
    meta: {
      title: '编辑文章 - 夏叶AI加油站',
      description: '管理员编辑文章页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/social-platforms',
    name: 'admin-social-platforms',
    component: () => import('@/pages/AdminSocialPlatforms.vue'),
    meta: {
      title: '社交平台管理 - 夏叶AI加油站',
      description: '管理员社交平台管理页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/social-platforms/new',
    name: 'admin-social-platform-new',
    component: () => import('@/pages/AdminSocialPlatforms.vue'),
    meta: {
      title: '添加社交平台 - 夏叶AI加油站',
      description: '管理员添加社交平台页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/social-platforms/edit/:id',
    name: 'admin-social-platform-edit',
    component: () => import('@/pages/AdminSocialPlatforms.vue'),
    meta: {
      title: '编辑社交平台 - 夏叶AI加油站',
      description: '管理员编辑社交平台页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/stats',
    name: 'admin-stats',
    component: () => import('@/pages/AdminStats.vue'),
    meta: {
      title: '网站统计管理 - 夏叶AI加油站',
      description: '管理员网站统计管理页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin/profile',
    name: 'admin-profile',
    component: () => import('@/pages/AdminProfile.vue'),
    meta: {
      title: '个人信息管理 - 夏叶AI加油站',
      description: '管理员个人信息管理页面',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: '页面未找到 - 夏叶AI加油站',
      description: '您访问的页面不存在'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），则恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 如果有锚点，则滚动到锚点位置
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // 否则滚动到页面顶部
    return { top: 0, behavior: 'smooth' }
  }
})

/**
 * 路由前置守卫
 * 功能：处理页面标题、描述等SEO信息，以及权限验证
 * 创建日期：2024-12-19
 */
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  // 设置页面描述
  if (to.meta?.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description as string)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = to.meta.description as string
      document.head.appendChild(meta)
    }
  }
  
  // 管理员权限验证
  if (to.meta?.requiresAuth) {
    try {
      // 动态导入认证模块以避免循环依赖
      const { checkAdminPermission } = await import('@/lib/auth')
      
      if (!checkAdminPermission()) {
        // 未登录或权限不足，重定向到登录页
        next('/admin/login')
        return
      }
    } catch (error) {
      console.error('权限验证失败:', error)
      next('/admin/login')
      return
    }
  }
  
  next()
})

/**
 * 路由后置守卫
 * 功能：页面加载完成后的处理
 * 创建日期：2024-12-19
 */
router.afterEach((to, from) => {
  // 页面切换完成后的处理
  // 页面切换日志已移除
})

export default router
