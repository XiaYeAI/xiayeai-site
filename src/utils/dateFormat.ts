/**
 * 日期格式化工具函数
 * 功能：提供相对时间和绝对时间的格式化方法
 * 创建日期：2025-01-31
 */

/**
 * 格式化为相对时间
 * 功能：将日期格式化为相对时间显示（如：今天、昨天、3天前等）
 * 参数：dateString - ISO日期字符串
 * 返回值：相对时间字符串
 * 创建日期：2025-01-31
 */
export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    
    if (diffMinutes < 1) {
      return '刚刚'
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`
    } else if (diffHours < 24) {
      return `${diffHours}小时前`
    } else if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks}周前`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months}个月前`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years}年前`
    }
  } catch (err) {
    console.error('相对日期格式化失败:', err)
    return '未知时间'
  }
}

/**
 * 格式化为绝对时间
 * 功能：将日期格式化为绝对时间显示（如：2025年1月31日 14:30）
 * 参数：dateString - ISO日期字符串
 * 参数：includeTime - 是否包含时间，默认为true
 * 返回值：绝对时间字符串
 * 创建日期：2025-01-31
 */
export const formatAbsoluteDate = (dateString: string, includeTime: boolean = true): string => {
  try {
    const date = new Date(dateString)
    
    if (includeTime) {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  } catch (err) {
    console.error('绝对日期格式化失败:', err)
    return '未知日期'
  }
}

/**
 * 格式化为简短绝对时间
 * 功能：将日期格式化为简短的绝对时间显示（如：2025-01-31）
 * 参数：dateString - ISO日期字符串
 * 返回值：简短绝对时间字符串
 * 创建日期：2025-01-31
 */
export const formatShortDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (err) {
    console.error('简短日期格式化失败:', err)
    return '未知日期'
  }
}

/**
 * 格式化为管理后台使用的日期时间
 * 功能：将日期格式化为管理后台表格显示的格式
 * 参数：dateString - ISO日期字符串
 * 返回值：管理后台日期时间字符串
 * 创建日期：2025-01-31
 */
export const formatAdminDate = (dateString: string): string => {
  try {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (err) {
    console.error('管理后台日期格式化失败:', err)
    return '-'
  }
}