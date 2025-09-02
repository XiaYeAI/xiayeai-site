-- 数据库迁移文件：分步修复管理员账户
-- 创建时间：2025-01-13
-- 功能：分步解决管理员账户冲突问题

-- 第一步：查看所有管理员账户
SELECT id, email, username, name, is_active, created_at FROM admin ORDER BY created_at;

-- 第二步：临时更改admin@example.com的邮箱以避免冲突
UPDATE admin 
SET email = 'temp_admin@example.com'
WHERE email = 'admin@example.com';

-- 第三步：为admin@xiayeai.com设置username
UPDATE admin 
SET username = 'admin', updated_at = now()
WHERE email = 'admin@xiayeai.com' AND username IS NULL;

-- 第四步：删除临时账户
DELETE FROM admin_logs WHERE admin_id IN (SELECT id FROM admin WHERE email = 'temp_admin@example.com');
DELETE FROM admin WHERE email = 'temp_admin@example.com';

-- 验证最终结果
SELECT id, email, username, name, password_hash, is_active, created_at, updated_at 
FROM admin 
ORDER BY created_at;

-- 输出确认信息
-- 管理