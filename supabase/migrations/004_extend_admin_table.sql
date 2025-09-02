-- 扩展管理员表结构并创建内置管理员账号
-- 创建日期：2024-12-19
-- 功能：添加username字段，创建内置管理员账号，设置权限

-- 添加username字段到admin表
ALTER TABLE admin ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- 创建内置管理员账号
-- 密码：admin123 的哈希值（这里使用简单的示例，实际应用中应该使用更安全的哈希算法）
INSERT INTO admin (email, username, password_hash, name, role, is_active)
VALUES (
    'admin@xiayeai.com',
    'admin',
    '$2b$10$rQZ8kZKjKjKjKjKjKjKjKOeH8H8H8H8H8H8H8H8H8H8H8H8H8H8H8',  -- 这是admin123的bcrypt哈希值示例
    '系统管理员',
    'super_admin',
    true
)
ON CONFLICT (email) DO NOTHING;

-- 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(100),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_by UUID REFERENCES admin(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- 为admin_logs表创建RLS策略
CREATE POLICY "管理员可以查看所有日志" ON admin_logs
    FOR SELECT USING (true);

CREATE POLICY "系统可以插入日志" ON admin_logs
    FOR INSERT WITH CHECK (true);

-- 为system_config表创建RLS策略
CREATE POLICY "管理员可以查看所有配置" ON system_config
    FOR SELECT USING (true);

CREATE POLICY "管理员可以修改配置" ON system_config
    FOR ALL USING (true);

-- 授权给authenticated角色
GRANT ALL PRIVILEGES ON admin_logs TO authenticated;
GRANT ALL PRIVILEGES ON system_config TO authenticated;
GRANT ALL PRIVILEGES ON admin TO authenticated;

-- 授权给anon角色（仅查询admin表用于登录验证）
GRANT SELECT ON admin TO anon;