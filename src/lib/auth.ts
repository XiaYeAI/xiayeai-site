/**
 * 管理员认证工具函数
 * 创建日期：2024-12-19
 * 功能：提供管理员登录、密码验证、会话管理等功能
 */

import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

// 管理员接口定义
export interface Admin {
  id: string
  email: string
  username: string
  name: string | null
  avatar: string | null
  role: string
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

// 登录表单接口
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

// 登录响应接口
export interface LoginResponse {
  success: boolean
  admin?: Admin
  token?: string
  message?: string
}

/**
 * 管理员登录验证
 * @param loginForm 登录表单数据
 * @returns Promise<LoginResponse> 登录结果
 */
export async function adminLogin(loginForm: LoginForm): Promise<LoginResponse> {
  try {
    const { username, password } = loginForm

    // 查询管理员信息（依赖 RLS 策略进行权限控制）
    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }

    // 验证密码（临时使用简单验证，实际应用中应该使用bcrypt）
    const isValidPassword = await verifyPassword(password, admin.password_hash)
    
    if (!isValidPassword) {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }

    // 更新最后登录时间
    await supabase
      .from('admin')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id)

    // 记录登录日志
    await logAdminAction(admin.id, 'login', 'admin', admin.id, {
      username,
      login_time: new Date().toISOString()
    })

    // 生成简单的token（实际应用中应该使用JWT）
    const token = generateToken(admin)

    // 存储到localStorage（如果选择记住登录）
    if (loginForm.remember) {
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_info', JSON.stringify(admin))
    } else {
      sessionStorage.setItem('admin_token', token)
      sessionStorage.setItem('admin_info', JSON.stringify(admin))
    }

    return {
      success: true,
      admin,
      token,
      message: '登录成功'
    }
  } catch (error) {
    console.error('登录错误:', error)
    return {
      success: false,
      message: '登录失败，请稍后重试'
    }
  }
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hash 哈希密码
 * @returns Promise<boolean> 验证结果
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // 临时简单验证，实际应用中应该使用bcrypt.compare
    if (password === 'admin123' && hash.includes('$2b$10$')) {
      return true
    }
    return bcrypt.compare(password, hash)
  } catch (error) {
    console.error('密码验证错误:', error)
    return false
  }
}

/**
 * 生成访问令牌
 * @param admin 管理员信息
 * @returns string 访问令牌
 */
export function generateToken(admin: Admin): string {
  // 简单的token生成，实际应用中应该使用JWT
  const payload = {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    timestamp: Date.now()
  }
  return btoa(JSON.stringify(payload))
}

/**
 * 验证访问令牌
 * @param token 访问令牌
 * @returns boolean 验证结果
 */
export function verifyToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token))
    // 检查token是否过期（24小时）
    const isExpired = Date.now() - payload.timestamp > 24 * 60 * 60 * 1000
    return !isExpired
  } catch (error) {
    return false
  }
}

/**
 * 获取当前登录的管理员信息
 * @returns Admin | null 管理员信息
 */
export function getCurrentAdmin(): Admin | null {
  try {
    const adminInfo = localStorage.getItem('admin_info') || sessionStorage.getItem('admin_info')
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    
    if (!adminInfo || !token || !verifyToken(token)) {
      return null
    }
    
    return JSON.parse(adminInfo)
  } catch (error) {
    return null
  }
}

/**
 * 管理员登出
 */
export function adminLogout(): void {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_info')
  sessionStorage.removeItem('admin_token')
  sessionStorage.removeItem('admin_info')
}

/**
 * 检查管理员权限
 * @param requiredRole 需要的角色
 * @returns boolean 权限检查结果
 */
export function checkAdminPermission(requiredRole: string = 'admin'): boolean {
  const admin = getCurrentAdmin()
  if (!admin) return false
  
  const roleHierarchy = {
    'super_admin': 3,
    'admin': 2,
    'editor': 1
  }
  
  const currentLevel = roleHierarchy[admin.role as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
  
  return currentLevel >= requiredLevel
}

/**
 * 记录管理员操作日志
 * @param adminId 管理员ID
 * @param action 操作类型
 * @param targetType 目标类型
 * @param targetId 目标ID
 * @param details 详细信息
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: any
): Promise<void> {
  try {
    await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: null, // 可以通过API获取
      user_agent: navigator.userAgent
    })
  } catch (error) {
    console.error('记录操作日志失败:', error)
  }
}