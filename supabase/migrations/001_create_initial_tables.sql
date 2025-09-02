-- 创建文章表
-- 日期: 2025-01-28
-- 功能: 存储公众号文章信息
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL, -- 文章标题
  summary TEXT, -- 文章摘要
  content TEXT, -- 文章内容
  cover_image VARCHAR(500), -- 封面图片URL
  wechat_url VARCHAR(500), -- 微信公众号文章链接
  external_url VARCHAR(500), -- 外部链接
  published_at TIMESTAMP WITH TIME ZONE, -- 发布时间
  view_count INTEGER DEFAULT 0, -- 阅读量
  like_count INTEGER DEFAULT 0, -- 点赞数
  is_featured BOOLEAN DEFAULT FALSE, -- 是否为精选文章
  status VARCHAR(20) DEFAULT 'published', -- 文章状态: draft, published, archived
  tags TEXT[], -- 文章标签数组
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建社交平台表
-- 日期: 2025-01-28
-- 功能: 存储自媒体平台信息
CREATE TABLE IF NOT EXISTS social_platforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- 平台名称
  platform_type VARCHAR(50) NOT NULL, -- 平台类型: wechat, weibo, douyin, xiaohongshu, zhihu等
  url VARCHAR(500), -- 平台链接
  qr_code VARCHAR(500), -- 二维码图片URL
  follower_count INTEGER DEFAULT 0, -- 粉丝数量
  description TEXT, -- 平台描述
  is_active BOOLEAN DEFAULT TRUE, -- 是否激活显示
  sort_order INTEGER DEFAULT 0, -- 排序权重
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建管理员表
-- 日期: 2025-01-28
-- 功能: 存储管理员账户信息
CREATE TABLE IF NOT EXISTS admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL, -- 管理员邮箱
  password_hash VARCHAR(255) NOT NULL, -- 密码哈希
  name VARCHAR(100), -- 管理员姓名
  avatar VARCHAR(500), -- 头像URL
  role VARCHAR(50) DEFAULT 'admin', -- 角色: admin, super_admin
  is_active BOOLEAN DEFAULT TRUE, -- 是否激活
  last_login_at TIMESTAMP WITH TIME ZONE, -- 最后登录时间
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建网站统计表
-- 日期: 2025-01-28
-- 功能: 存储网站统计数据
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_followers INTEGER DEFAULT 0, -- 总粉丝数
  total_articles INTEGER DEFAULT 0, -- 文章总数
  total_partners INTEGER DEFAULT 0, -- 合作伙伴数
  total_platforms INTEGER DEFAULT 0, -- 平台数量
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_social_platforms_platform_type ON social_platforms(platform_type);
CREATE INDEX IF NOT EXISTS idx_social_platforms_is_active ON social_platforms(is_active);
CREATE INDEX IF NOT EXISTS idx_social_platforms_sort_order ON social_platforms(sort_order);

-- 启用行级安全策略 (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 文章表策略: 所有人可读，只有认证用户可写
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Articles are editable by authenticated users" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

-- 社交平台表策略: 所有人可读，只有认证用户可写
CREATE POLICY "Social platforms are viewable by everyone" ON social_platforms
  FOR SELECT USING (true);

CREATE POLICY "Social platforms are editable by authenticated users" ON social_platforms
  FOR ALL USING (auth.role() = 'authenticated');

-- 管理员表策略: 只有认证用户可访问
CREATE POLICY "Admin data is accessible by authenticated users only" ON admin
  FOR ALL USING (auth.role() = 'authenticated');

-- 网站统计表策略: 所有人可读，只有认证用户可写
CREATE POLICY "Site stats are viewable by everyone" ON site_stats
  FOR SELECT USING (true);

CREATE POLICY "Site stats are editable by authenticated users" ON site_stats
  FOR ALL USING (auth.role() = 'authenticated');

-- 授权给anon和authenticated角色
GRANT SELECT ON articles TO anon;
GRANT ALL PRIVILEGES ON articles TO authenticated;

GRANT SELECT ON social_platforms TO anon;
GRANT ALL PRIVILEGES ON social_platforms TO authenticated;

GRANT ALL PRIVILEGES ON admin TO authenticated;

GRANT SELECT ON site_stats TO anon;
GRANT ALL PRIVILEGES ON site_stats TO authenticated;