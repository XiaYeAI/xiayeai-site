/**
 * 首页状态管理Store
 * 功能：管理首页相关数据状态，包括英雄区域、统计数据和最新文章
 * 创建日期：2024-12-19
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Article, SocialPlatform } from '@/lib/supabase'

// 英雄区域数据接口
export interface HeroData {
  avatar: string
  name: string
  title: string
  description: string
  backgroundImage: string
}

// 统计数据接口
export interface StatsData {
  totalFollowers: number
  articleCount: number
  partnerCount: number
  platformCount: number
}

// 文章预览接口
export interface ArticlePreview {
  id: string
  title: string
  summary: string
  coverImage: string
  publishedAt: string
  wechatUrl: string
}

/**
 * 首页数据Store
 * 功能：管理首页所有数据状态和操作方法
 * 创建日期：2024-12-19
 */
export const useHomeStore = defineStore('home', () => {
  // 状态定义
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 英雄区域数据
  const heroData = ref<HeroData>({
    avatar: '',
    name: '',
    title: '',
    description: '',
    backgroundImage: ''
  })
  
  // 统计数据
  const statsData = ref<StatsData>({
    totalFollowers: 0,
    articleCount: 0,
    partnerCount: 0,
    platformCount: 0
  })
  
  // 最新文章列表
  const latestArticles = ref<ArticlePreview[]>([])
  
  // 社交平台列表
  const socialPlatforms = ref<SocialPlatform[]>([])

  // 计算属性
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const errorMessage = computed(() => error.value)

  /**
   * 转换文章数据格式
   * 功能：将数据库文章数据转换为前端展示格式
   * 创建日期：2024-12-19
   * @param articles 数据库文章数据
   * @returns ArticlePreview[] 前端文章预览数据
   */
  const transformArticles = (articles: Article[]): ArticlePreview[] => {
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      summary: article.summary || '暂无摘要',
      coverImage: article.cover_image || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20technology%20article%20cover%20modern%20design&image_size=landscape_4_3',
      publishedAt: article.published_at || article.created_at,
      wechatUrl: article.wechat_url || ''
    }))
  }

  /**
   * 获取首页数据
   * 功能：从Supabase获取首页所需的所有数据
   * 参数：无
   * 返回值：Promise<void>
   * 创建日期：2025-01-31
   */
  const fetchHomeData = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      // 并行获取所有数据
      const [profileResponse, statsResponse, articlesResponse, platformsResponse] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('site_stats').select('*').single(),
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('social_platforms').select('*').eq('is_active', true)
      ])

      // 处理个人资料数据
      if (profileResponse.data) {
        heroData.value = {
          avatar: profileResponse.data.avatar_url || '',
          name: profileResponse.data.full_name || '',
          title: profileResponse.data.title || '',
          description: profileResponse.data.bio || '',
          backgroundImage: profileResponse.data.background_image || ''
        }
      }

      // 处理统计数据
      if (statsResponse.data) {
        statsData.value = statsResponse.data
      }

      // 处理文章数据
      if (articlesResponse.data) {
        latestArticles.value = transformArticles(articlesResponse.data)
      }

      // 处理社交平台数据
      if (platformsResponse.data) {
        socialPlatforms.value = platformsResponse.data
      }

    } catch (err) {
      console.error('获取首页数据失败:', err)
      error.value = err instanceof Error ? err.message : '获取数据失败'
      
      // 设置默认的英雄区域数据
      if (!heroData.value.name) {
        heroData.value = {
          avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20AI%20expert%20avatar%20portrait%20friendly%20smile%20tech%20background&image_size=square',
          name: '夏叶AI加油站',
          title: 'AI技术专家 & 内容创作者',
          description: '专注于人工智能技术分享，致力于让AI技术更易懂、更实用',
          backgroundImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tech%20background%20AI%20neural%20network%20blue%20gradient&image_size=landscape_16_9'
        }
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新统计数据
   * 功能：单独刷新统计数据
   * 创建日期：2024-12-19
   * @returns Promise<void>
   */
  const refreshStats = async (): Promise<void> => {
    try {
      const statsResponse = await supabase.from('site_stats').select('*').single()
      if (statsResponse.data) {
        statsData.value = statsResponse.data
      }
    } catch (err) {
      console.error('刷新统计数据失败:', err)
      error.value = err instanceof Error ? err.message : '刷新统计数据失败'
    }
  }

  /**
   * 清除错误状态
   * 功能：清除当前错误信息
   * 创建日期：2024-12-19
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * 重置Store状态
   * 功能：重置所有状态到初始值
   * 创建日期：2024-12-19
   */
  const resetStore = (): void => {
    loading.value = false
    error.value = null
    statsData.value = {
      totalFollowers: 0,
      articleCount: 0,
      partnerCount: 0,
      platformCount: 0
    }
    latestArticles.value = []
    socialPlatforms.value = []
  }

  return {
    // 状态
    loading: isLoading,
    error: hasError,
    errorMessage,
    heroData,
    statsData,
    latestArticles,
    socialPlatforms,
    
    // 方法
    fetchHomeData,
    refreshStats,
    clearError,
    resetStore
  }
})