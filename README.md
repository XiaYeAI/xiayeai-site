# 夏夜AI网站

一个基于 Vue 3 + TypeScript + Vite + Supabase 构建的现代化个人网站，专注于AI技术分享和内容展示。

## 🌟 项目特色

- **现代化技术栈**：采用 Vue 3 Composition API + TypeScript + Vite 构建
- **响应式设计**：基于 Tailwind CSS 的移动端优先设计
- **内容管理**：完整的文章发布和管理系统
- **用户体验**：流畅的页面切换和加载体验
- **数据驱动**：基于 Supabase 的实时数据库
- **安全可靠**：完善的权限控制和数据验证

## 🚀 功能特性

### 前台功能
- 📖 **文章展示**：支持 Markdown 格式的文章阅读
- 🏷️ **标签分类**：文章标签分类和筛选
- 🔍 **搜索功能**：全文搜索文章内容
- 📱 **响应式布局**：完美适配各种设备
- 🌙 **夜间模式**：护眼的深色主题
- 📊 **统计展示**：网站访问统计和数据展示
- 🔗 **社交链接**：多平台社交媒体链接

### 后台管理
- 🔐 **安全登录**：基于 bcrypt 的密码加密
- ✍️ **文章管理**：创建、编辑、删除文章
- 🏷️ **标签管理**：文章标签的增删改查
- 📊 **统计管理**：网站数据统计管理
- 🔗 **平台管理**：社交平台链接管理
- 👤 **用户管理**：管理员账户管理

## 🛠️ 技术栈

### 前端技术
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 状态管理库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide Vue** - 美观的图标库

### 后端服务
- **Supabase** - 开源的 Firebase 替代方案
  - PostgreSQL 数据库
  - 实时订阅
  - 行级安全策略 (RLS)
  - 身份验证
  - 存储服务

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查
- **Vite DevTools** - 开发调试工具

## 📦 安装步骤

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 1. 克隆项目
```bash
git clone <repository-url>
cd xiayeai-site
```

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 3. 环境配置
创建 `.env` 文件并配置以下环境变量：

```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. 数据库初始化
执行数据库迁移文件：
```bash
# 在 Supabase 控制台中执行 supabase/migrations/ 目录下的 SQL 文件
# 或使用 Supabase CLI
supabase db push
```

### 5. 启动开发服务器
```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:5173` 查看网站。

## 🔧 开发指南

### 项目结构
```
xiayeai-site/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   ├── stores/             # Pinia 状态管理
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── assets/             # 静态资源
│   └── main.ts             # 应用入口
├── supabase/
│   └── migrations/         # 数据库迁移文件
├── test/                   # 测试文件
├── public/                 # 公共静态文件
└── dist/                   # 构建输出目录
```

### 开发命令
```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run check

# 代码检查
npm run lint

# 代码格式化
npm run lint:fix

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 和 Prettier 保持代码一致性
- 组件文件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

## 🚀 部署指南

### 构建生产版本
```bash
npm run build
```

### 部署到 Vercel
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 部署到其他平台
1. 构建项目：`npm run build`
2. 将 `dist/` 目录上传到服务器
3. 配置 Web 服务器（Nginx/Apache）
4. 设置环境变量

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📊 数据库设计

### 主要数据表
- **articles** - 文章表
- **admin** - 管理员表
- **social_platforms** - 社交平台表
- **site_stats** - 网站统计表

### 权限控制
- 使用 Supabase RLS (Row Level Security)
- 匿名用户只能读取公开内容
- 管理员拥有完整的 CRUD 权限

## 🧪 测试

### 运行测试
```bash
# 进入测试目录
cd test

# 安装测试依赖
npm install

# 运行管理员功能测试
node admin-test.js

# 运行文章创建测试
node article-creation-test.js

# 运行统计功能测试
node admin-stats-test.js
```

### 测试覆盖
- 管理员登录认证
- 文章 CRUD 操作
- 社交平台管理
- 统计数据管理
- 数据库权限验证

## 🔒 安全性

### 数据安全
- 密码使用 bcrypt 加密存储
- 使用 Supabase RLS 进行数据访问控制
- API 密钥通过环境变量管理
- 输入数据验证和清理

### 最佳实践
- 定期更新依赖包
- 使用 HTTPS 传输
- 定期备份数据库
- 监控异常访问

## 📝 更新日志

### v1.0.0 (2025-01-19)
- ✨ 初始版本发布
- 🎉 完整的文章管理系统
- 🔐 安全的管理员后台
- 📱 响应式前台界面
- 📊 网站统计功能
- 🔗 社交平台集成

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 网站：[夏夜AI](https://www.xiayeai.cn)
- 邮箱：contact@xiayeai.cn
- GitHub：[项目仓库](https://github.com/your-username/xiayeai-site)

## 🙏 致谢

感谢以下开源项目和服务：
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Supabase](https://supabase.com/) - 开源的 Firebase 替代方案
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库

---

**夏夜AI网站** - 专注于AI技术分享的现代化个人网站 🌙✨
