-- 清理数据库中的模拟数据
-- 创建日期：2024-12-19
-- 功能：删除articles、social_platforms、site_stats表中的测试数据，保留表结构

-- 删除文章表中的模拟数据
DELETE FROM articles;

-- 删除社交平台表中的模拟数据
DELETE FROM social_platforms;

-- 删除网站统计表中的模拟数据
DELETE FROM site_stats;

-- 重置序列（如果有的话）
-- 注意：UUID类型不需要重置序列

-- 添加注释说明数据已清理
COMMENT ON TABLE articles IS '文章表 - 模拟数据已清理，准备录入真实数据';
COMMENT ON TABLE social_platforms IS '社交平台表 - 模拟数据已清理，准备录入真实数据';
COMMENT ON TABLE site_stats IS '网站统计表 - 模拟数据已清理，准备录入真实数据';