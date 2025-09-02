-- 数据库迁移文件：更新管理员密码
-- 创建时间：2025-01-13
-- 功能：将管理员账户的密码更新为新的强密码

-- 更新管理员密码为新的 bcrypt hash 值
UPDATE admin 
SET password_hash = '$2b$10$pv3RnGJc5PWCsWkehHPWDuk9B5WnjFqtuKoJdjesMVP.I44vJgS9u'
WHERE email = 'admin@xiayeai.com';

-- 验证更新结果
SELECT email, password_hash, created_at, updated_at 
FROM admin 
WHERE email = 'admin@xiayeai.com';

-- 输出确认信息
-- 管理员密码已成功更新