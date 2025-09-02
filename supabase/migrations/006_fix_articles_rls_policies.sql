-- 修复文章表 RLS 策略，允许管理员操作
-- 创建日期：2025-01-02
-- 功能：修复 articles 表的 RLS 策略，解决 PGRST116 错误

-- 删除现有的 RLS 策略
DROP POLICY IF EXISTS "Articles are editable by authenticated users" ON articles;
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON articles;

-- 重新创建 RLS 策略
-- 允许所有人查看文章
CREATE POLICY "Articles are viewable by everyone" ON articles
    FOR SELECT 
    USING (true);

-- 允许匿名用户进行所有操作（用于管理员后台）
CREATE POLICY "Articles are manageable by anon" ON articles
    FOR ALL 
    TO anon
    USING (true)
    WITH CHECK (true);

-- 允许已认证用户进行所有操作
CREATE POLICY "Articles are manageable by authenticated" ON articles
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 确保权限正确设置
GRANT SELECT ON articles TO anon;
GRANT ALL PRIVILEGES ON articles TO anon;
GRANT ALL PRIVILEGES ON articles TO authenticated;

-- 检查当前权限状态
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated') 
    AND table_name = 'articles'
ORDER BY table_name, grantee;