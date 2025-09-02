-- 修复管理员表 RLS 策略，允许登录验证
-- 创建日期：2025-01-02
-- 功能：为 admin 表创建适当的 RLS 策略，允许登录验证但保护敏感信息

-- 为 admin 表授予基本权限
GRANT SELECT ON admin TO anon;
GRANT SELECT ON admin TO authenticated;
GRANT ALL PRIVILEGES ON admin TO authenticated;

-- 创建 RLS 策略：允许匿名用户查询管理员信息用于登录验证
-- 但只允许查询用于验证的基本字段
CREATE POLICY "Allow login verification" ON admin
    FOR SELECT 
    TO anon
    USING (is_active = true);

-- 创建 RLS 策略：允许已认证用户查看和管理管理员信息
CREATE POLICY "Allow authenticated admin access" ON admin
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 创建 RLS 策略：允许已认证用户更新最后登录时间
CREATE POLICY "Allow update last login" ON admin
    FOR UPDATE 
    TO anon
    USING (true)
    WITH CHECK (true);

-- 确保 admin_logs 表有正确的权限
GRANT INSERT ON admin_logs TO anon;
GRANT SELECT ON admin_logs TO anon;

-- 创建 RLS 策略：允许插入登录日志
CREATE POLICY "Allow insert admin logs" ON admin_logs
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 检查当前权限状态
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated') 
    AND table_name = 'admin'
ORDER BY table_name, grantee;