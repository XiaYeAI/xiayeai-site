import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import markdownItHighlightjs from 'markdown-it-highlightjs'
import type { Token, Renderer } from 'markdown-it'

/**
 * Markdown渲染工具类
 * 功能：配置并提供Markdown到HTML的渲染功能
 * 作者：SOLO Coding
 * 日期：2025-01-22
 */
class MarkdownRenderer {
  private md: MarkdownIt

  /**
   * 构造函数
   * 功能：初始化Markdown渲染器实例
   * 参数：无
   * 返回值：无
   * 日期：2025-01-22
   */
  constructor() {
    // 初始化markdown-it实例
    this.md = new MarkdownIt({
      html: true,         // 允许HTML标签
      linkify: true,      // 自动识别链接
      typographer: true,  // 启用排版功能
      breaks: true        // 将换行符转换为<br>
    })

    // 配置代码高亮插件
    this.md.use(markdownItHighlightjs, {
      hljs,
      auto: true,
      code: true
    })

    // 自定义图片渲染规则
    this.setupImageRenderer()
    
    // 自定义链接渲染规则
    this.setupLinkRenderer()
  }

  /**
   * 设置图片渲染规则
   * 功能：为图片添加响应式样式和懒加载
   * 参数：无
   * 返回值：无
   * 日期：2025-01-22
   */
  private setupImageRenderer(): void {
    const defaultRender = this.md.renderer.rules.image || function(tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) {
      return renderer.renderToken(tokens, idx, options)
    }

    this.md.renderer.rules.image = function(tokens: Token[], idx: number, options: any, env: any, renderer: Renderer): string {
      const token = tokens[idx]
      const srcIndex = token.attrIndex('src')
      
      if (srcIndex >= 0) {
        // 添加响应式样式类
        token.attrPush(['class', 'markdown-image max-w-full h-auto rounded-lg shadow-md'])
        token.attrPush(['loading', 'lazy'])
      }
      
      return defaultRender(tokens, idx, options, env, renderer)
    }
  }

  /**
   * 设置链接渲染规则
   * 功能：为外部链接添加target="_blank"属性
   * 参数：无
   * 返回值：无
   * 日期：2025-01-22
   */
  private setupLinkRenderer(): void {
    const defaultRender = this.md.renderer.rules.link_open || function(tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) {
      return renderer.renderToken(tokens, idx, options)
    }

    this.md.renderer.rules.link_open = function(tokens: Token[], idx: number, options: any, env: any, renderer: Renderer): string {
      const token = tokens[idx]
      const hrefIndex = token.attrIndex('href')
      
      if (hrefIndex >= 0 && token.attrs) {
        const href = token.attrs[hrefIndex][1]
        // 如果是外部链接，添加target="_blank"
        if (href.startsWith('http://') || href.startsWith('https://')) {
          token.attrPush(['target', '_blank'])
          token.attrPush(['rel', 'noopener noreferrer'])
        }
        // 添加样式类
        token.attrPush(['class', 'text-blue-600 hover:text-blue-800 underline'])
      }
      
      return defaultRender(tokens, idx, options, env, renderer)
    }
  }

  /**
   * 渲染Markdown内容为HTML
   * 功能：将Markdown文本转换为HTML字符串
   * 参数：markdown - Markdown格式的文本内容
   * 返回值：HTML字符串
   * 日期：2025-01-22
   */
  public render(markdown: string): string {
    if (!markdown || typeof markdown !== 'string') {
      return ''
    }
    
    try {
      return this.md.render(markdown)
    } catch (error) {
      console.error('Markdown渲染错误:', error)
      return `<p class="text-red-500">内容渲染失败</p>`
    }
  }
}

// 创建单例实例
const markdownRenderer = new MarkdownRenderer()

/**
 * 渲染Markdown内容
 * 功能：提供全局的Markdown渲染函数
 * 参数：markdown - Markdown格式的文本内容
 * 返回值：HTML字符串
 * 日期：2025-01-22
 */
export function renderMarkdown(markdown: string): string {
  return markdownRenderer.render(markdown)
}

// 导出渲染器实例（用于高级配置）
export { markdownRenderer }

// 默认导出
export default renderMarkdown