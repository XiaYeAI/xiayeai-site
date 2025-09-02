/**
 * Supabase客户端配�?
 * 功能：初始化Supabase客户端实例，提供数据库和认证服务
 * 创建日期�?024-12-19
 * @returns {SupabaseClient} Supabase客户端实�?
 */

import { createClient } from '@supabase/supabase-js'

// Supabase项目配置 - 使用环境变量确保安全
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 安全检查：确保必要的环境变量已配置
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少必要�?Supabase 配置。请检查环境变�?VITE_SUPABASE_URL �?VITE_SUPABASE_ANON_KEY')
}

// 创建Supabase客户端实例（仅使用安全的 ANON_KEY�?
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 注意：管理员操作已移�?Service Role Key，改为依�?RLS 策略和用户认�?
// 如需管理员权限，请通过 Supabase Auth 登录具有相应权限的用户账�?

// 数据库表名常�?
export const TABLES = {
  ARTICLES: 'articles',
  SOCIAL_PLATFORMS: 'social_platforms',
  ADMINS: 'admins',
  ADMIN_LOGS: 'admin_logs',
  SYSTEM_CONFIG: 'system_config',
  SITE_STATS: 'site_stats'
} as const

// 类型定义
export interface Article {
  id: string
  title: string
  summary: string | null
  content: string | null
  cover_image: string | null
  wechat_url: string | null
  tags: string[] | null
  status: 'draft' | 'published'
  read_count: number
  like_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface SocialPlatform {
  id: string
  name: string
  platform_type: string
  url: string | null
  qr_code: string | null
  follower_count: number
  description: string | null
  username: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  username: string
  email: string
  password_hash: string
  name: string
  avatar: string | null
  role: string
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface SiteStats {
  id: string
  stat_type: string
  current_value: number
  growth_rate: number
  unit: string
  description: string | null
  created_at: string
  updated_at: string
}

// 原有的统计数据接口，用于首页展示
export interface SiteSummaryStats {
  id: string
  total_followers: number
  total_articles: number
  total_partners: number
  total_platforms: number
  updated_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type: string | null
  target_id: string | null
  details: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

/**
 * 获取文章列表
 * 功能：从数据库获取文章列表，支持分页和排�?
 * 创建日期�?024-12-19
 * @param limit 限制返回数量
 * @param offset 偏移�?
 * @returns Promise<Article[]> 文章列表
 */
export async function getArticles(limit = 10, offset = 0): Promise<Article[]> {
  const { data, error } = await supabase
    .from(TABLES.ARTICLES)
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('获取文章列表失败:', error)
    throw error
  }

  return data || []
}

/**
 * 获取社交平台列表
 * 功能：从数据库获取所有社交平台信�?
 * 创建日期�?024-12-19
 * @returns Promise<SocialPlatform[]> 社交平台列表
 */
export async function getSocialPlatforms(): Promise<SocialPlatform[]> {
  const { data, error } = await supabase
    .from(TABLES.SOCIAL_PLATFORMS)
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('获取社交平台列表失败:', error)
    throw error
  }

  return data || []
}

/**
 * 获取统计数据
 * 功能：计算总粉丝数、文章数量等统计信息
 * 创建日期�?024-12-19
 * @returns Promise<StatsData> 统计数据
 */
export async function getStatsData() {
  try {
    // 并行获取各项统计数据
    const [articlesResult, platformsResult] = await Promise.all([
      supabase.from(TABLES.ARTICLES).select('id', { count: 'exact' }),
      supabase.from(TABLES.SOCIAL_PLATFORMS).select('follower_count')
    ])

    if (articlesResult.error) throw articlesResult.error
    if (platformsResult.error) throw platformsResult.error

    // 计算总粉丝数
    const totalFollowers = platformsResult.data?.reduce(
      (sum, platform) => sum + (platform.follower_count || 0),
      0
    ) || 0

    return {
      totalFollowers,
      articleCount: articlesResult.count || 0,
      partnerCount: 15, // ??�硬�� ��续�������?
      platformCount: platformsResult.data?.length || 0,
      videoCount: 0, // ??�硬�� ��续�������?
      projectCount: 0, // ??�硬�� ��续�������?
      totalViews: 0 // ??�硬�� ��续�������?
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    throw error
  }
}

// ==================== 管理员后�?CRUD 操作函数 ====================

/**
 * 获取单篇文章详情
 * 功能：根据ID获取文章详细信息
 * 创建日期�?024-12-19
 * @param id 文章ID
 * @returns Promise<Article | null> 文章详情
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from(TABLES.ARTICLES)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('获取文章详情失败:', error)
    return null
  }

  return data
}

/**
 * 创建新文�?
 * 功能：在数据库中创建新文章记�?
 * 创建日期�?024-12-19
 * @param article 文章数据
 * @returns Promise<Article> 创建的文�?
 */
export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> {
  const { data, error } = await supabase
    .from(TABLES.ARTICLES)
    .insert({
      ...article,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('创建文章失败:', error)
    throw error
  }

  return data
}

/**
 * 更新文章
 * 功能：更新现有文章的信息
 * 创建日期�?024-12-19
 * @param id 文章ID
 * @param updates 更新的字�?
 * @returns Promise<Article> 更新后的文章
 */
export async function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'created_at'>>): Promise<Article> {
  const { data, error } = await supabase
    .from(TABLES.ARTICLES)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('更新文章失败:', error)
    throw error
  }

  return data
}

/**
 * 删除文章
 * 功能：从数据库中删除文章
 * 创建日期�?024-12-19
 * @param id 文章ID
 * @returns Promise<boolean> 删除是否成功
 */
export async function deleteArticleFromDB(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLES.ARTICLES)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('删除文章失败:', error)
    return false
  }

  return true
}

/**
 * 创建社交平台
 * 功能：在数据库中创建新的社交平台记录
 * 创建日期�?024-12-19
 * @param platform 社交平台数据
 * @returns Promise<SocialPlatform> 创建的社交平�?
 */
export async function createSocialPlatform(platform: Omit<SocialPlatform, 'id' | 'created_at' | 'updated_at'>): Promise<SocialPlatform> {
  const { data, error } = await supabase
    .from(TABLES.SOCIAL_PLATFORMS)
    .insert({
      ...platform,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('创建社交平台失败:', error)
    throw error
  }

  return data
}

/**
 * 更新社交平台
 * 功能：更新现有社交平台的信息
 * 创建日期�?024-12-19
 * @param id 社交平台ID
 * @param updates 更新的字�?
 * @returns Promise<SocialPlatform> 更新后的社交平台
 */
export async function updateSocialPlatform(id: string, updates: Partial<Omit<SocialPlatform, 'id' | 'created_at'>>): Promise<SocialPlatform> {
  const { data, error } = await supabase
    .from(TABLES.SOCIAL_PLATFORMS)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('更新社交平台失败:', error)
    throw error
  }

  return data
}

/**
 * 删除社交平台
 * 功能：从数据库中删除社交平台
 * 创建日期�?024-12-19
 * @param id 社交平台ID
 * @returns Promise<boolean> 删除是否成功
 */
export async function deleteSocialPlatform(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLES.SOCIAL_PLATFORMS)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('删除社交平台失败:', error)
    return false
  }

  return true
}

/**
 * 获取网站统计数据
 * 功能：从数据库获取所有网站统计信�?
 * 创建日期�?024-12-19
 * @returns Promise<SiteStats[]> 统计数据列表
 */
export async function getSiteStats(): Promise<SiteStats[]> {
  const { data, error } = await supabase
    .from(TABLES.SITE_STATS)
    .select('id, stat_type, current_value, growth_rate, unit, description, created_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('获取网站统计失败:', error)
    throw error
  }

  return data || []
}

/**
 * 创建网站统计
 * 功能：在数据库中创建新的统计记录
 * 创建日期�?024-12-19
 * @param stats 统计数据
 * @returns Promise<SiteStats> 创建的统计记�?
 */
export async function createSiteStats(stats: Omit<SiteStats, 'id' | 'created_at' | 'updated_at'>): Promise<SiteStats> {
  const { data, error } = await supabase
    .from(TABLES.SITE_STATS)
    .insert({
      ...stats,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id, stat_type, current_value, growth_rate, unit, description, created_at, updated_at')
    .single()

  if (error) {
    console.error('创建网站统计失败:', error)
    throw error
  }

  return data
}

/**
 * 更新网站统计
 * 功能：更新现有统计记录的信息
 * 创建日期�?024-12-19
 * @param id 统计记录ID
 * @param updates 更新的字�?
 * @returns Promise<SiteStats> 更新后的统计记录
 */
export async function updateSiteStats(id: string, updates: Partial<Omit<SiteStats, 'id' | 'created_at'>>): Promise<SiteStats> {
  const { data, error } = await supabase
    .from(TABLES.SITE_STATS)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('id, stat_type, current_value, growth_rate, unit, description, created_at, updated_at')
    .single()

  if (error) {
    console.error('更新网站统计失败:', error)
    throw error
  }

  return data
}

/**
 * 删除网站统计
 * 功能：从数据库中删除统计记录
 * 创建日期�?024-12-19
 * @param id 统计记录ID
 * @returns Promise<boolean> 删除是否成功
 */
export async function deleteSiteStats(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLES.SITE_STATS)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('删除网站统计失败:', error)
    return false
  }

  return true
}

/**
 * 获取管理员信�?
 * 功能：根据用户名或邮箱获取管理员信息
 * 创建日期�?024-12-19
 * @param identifier 用户名或邮箱
 * @returns Promise<Admin | null> 管理员信�?
 */
export async function getAdminByIdentifier(identifier: string): Promise<Admin | null> {
  const { data, error } = await supabase
    .from(TABLES.ADMINS)
    .select('*')
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('获取管理员信息失�?', error)
    return null
  }

  return data
}

/**
 * 更新管理员最后登录时�?
 * 功能：更新管理员的最后登录时�?
 * 创建日期�?024-12-19
 * @param adminId 管理员ID
 * @returns Promise<boolean> 更新是否成功
 */
export async function updateAdminLastLogin(adminId: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLES.ADMINS)
    .update({ 
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', adminId)

  if (error) {
    console.error('更新管理员登录时间失�?', error)
    return false
  }

  return true
}

/**
 * 记录管理员操作日�?
 * 功能：在数据库中记录管理员的操作行为
 * 创建日期�?024-12-19
 * @param log 日志数据
 * @returns Promise<boolean> 记录是否成功
 */
export async function createAdminLog(log: Omit<AdminLog, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase
    .from(TABLES.ADMIN_LOGS)
    .insert({
      ...log,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('记录管理员日志失�?', error)
    return false
  }

  return true
}

// ==================== 别名导出（兼容性） ====================

/**
 * 获取单篇文章详情（别名）
 * 功能：getArticleById的别名，用于兼容现有代码
 * 创建日期�?024-12-19
 */
export const getArticle = getArticleById

/**
 * 删除文章（别名）
 * 功能：deleteArticleFromDB的别名，用于兼容现有代码
 * 创建日期�?024-12-19
 */
export const deleteArticle = deleteArticleFromDB

/**
 * 创建网站统计（别名）
 * 功能：createSiteStats的别名，用于兼容现有代码
 * 创建日期�?024-12-19
 */
export const createSiteStat = createSiteStats

/**
 * 更新网站统计（别名）
 * 功能：updateSiteStats的别名，用于兼容现有代码
 * 创建日期�?024-12-19
 */
export const updateSiteStat = updateSiteStats

/**
 * 删除网站统计（别名）
 * 功能：deleteSiteStats的别名，用于兼容现有代码
 * 创建日期�?024-12-19
 */
export const deleteSiteStat = deleteSiteStats

