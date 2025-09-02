-- 更新site_stats表结构以支持管理员后台统计管理功能
-- 创建日期：2024-12-19
-- 功能：添加stat_type、current_value、growth_rate、unit、description、created_at字段

-- 添加新字段
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS stat_type VARCHAR(50);
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS current_value NUMERIC DEFAULT 0;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS growth_rate NUMERIC DEFAULT 0;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS unit VARCHAR(20);
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 清空现有数据，因为结构已经改变
DELETE FROM site_stats;

-- 插入一些示例统计数据
INSERT INTO site_stats (stat_type, current_value, growth_rate, unit, description, created_at, updated_at) VALUES
('page_views', 12500, 15.3, '次', '网站页面总访问量', NOW(), NOW()),
('unique_visitors', 3200, 8.7, '人', '独立访客数量', NOW(), NOW()),
('article_views', 8900, 12.1, '次', '文章阅读量', NOW(), NOW()),
('social_followers', 1850, 22.5, '人', '社交媒体粉丝总数', NOW(), NOW());

-- 为新字段添加索引
CREATE INDEX IF NOT EXISTS idx_site_stats_stat_type ON site_stats(stat_type);
CREATE INDEX IF NOT EXISTS idx_site_stats_updated_at ON site_stats(updated_at);

-- 更新表注释
COMMENT ON TABLE site_stats IS '网站统计数据表 - 支持管理员后台统计管理功能';
COMMENT ON COLUMN site_stats.stat_type IS '统计类型：page_views, unique_visitors, article_views, social_followers等';
COMMENT ON COLUMN site_stats.current_value IS '当前统计值';
COMMENT ON COLUMN site_stats.growth_rate IS '增长率（百分比）';
COMMENT ON COLUMN site_stats.unit IS '统计单位：次、人、个等';
COMMENT ON COLUMN site_stats.description IS '统计描述信息';