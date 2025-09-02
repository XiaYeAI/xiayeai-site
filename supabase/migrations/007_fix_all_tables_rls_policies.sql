-- 修复所有管理员相关表的 RLS 策略
-- 创建日期：2025-01-02
-- 功能：修复 social_platforms 和 site_stats 表的 RLS 策略，确保管理员操作正常

-- 修复 social_platforms 表
-- 删除现有的 RLS 策略
DROP POLICY IF EXISTS "Social platforms are editable by authenticated users" ON social_platforms;
DROP POLICY IF EXISTS "Social platforms are viewable by everyone" ON social_platforms;

-- 重新创建 RLS 策略
-- 允许所有人查看社交平台
CREATE POLICY "Social platforms are viewable by everyone" ON social_platforms
    FOR SELECT 
    USING (true);

-- 允许匿名用户进行所有操作（用于管理员后台）
CREATE POLICY "Social platforms are manageable by anon" ON social_platforms
    FOR ALL 
    TO anon
    USING (true)
    WITH CHECK (true);

-- 允许已认证用户进行所有操作
CREATE POLICY "Social platforms are manageable by authenticated" ON social_platforms
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 确保权限正确设置
GRANT SELECT ON social_platforms TO anon;
GRANT ALL PRIVILEGES ON social_platforms TO anon;
GRANT ALL PRIVILEGES ON social_platforms TO authenticated;

-- 修复 site_stats 表
-- 删除现有的 RLS 策略
DROP POLICY IF EXISTS "Site stats are editable by authenticated users" ON site_stats;
DROP POLICY IF EXISTS "Site stats are viewable by everyone" ON site_stats;

-- 重新创建 RLS 策略
-- 允许所有人查看网站统计
CREATE POLICY "Site stats are viewable by everyone" ON site_stats
    FOR SELECT 
    USING (true);

-- 允许匿名用户进行所有操作（用于管理员后台）
CREATE POLICY "Site stats are manageable by anon" ON site_stats
    FOR ALL 
    TO anon
    USING (true)
    WITH CHECK (true);

-- 允许已认证用户进行所有操作
CREATE POLICY "Site stats are manageable by authenticated" ON site_stats
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 确保权限正确设置
GRANT SELECT ON site_stats TO anon;
GRANT ALL PRIVILEGES ON site_stats TO anon;
GRANT ALL PRIVILEGES ON site_stats TO authenticated;

-- 检查当前权限状态
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated') 
    AND table_name IN ('social_platforms', 'site_stats')
ORDER BY table_name, grantee;