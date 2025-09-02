-- 数据库迁移文件：修复管理员账户冲突
-- 创建时间：2025-01-13
-- 功能：删除旧的admin@example.com账户，为admin@xiayeai.com设置正确的用户名

-- 首先查看当前的管理员账户
SELECT email, username, name, is_active FROM admin ORDER BY created_at;

-- 删除旧的admin@example.com账户（如果存在）
DELETE FROM admin WHERE email = 'admin@example.com';

-- 为admin@xiayeai.com账户设置username为'admin'
UPDATE admin 
SET username = 'admin', updated_at = now()
WHERE email = 'admin@xiayeai.com';

-- 验证更新结果
SELECT email, username, name, password_hash, is_active, created_at, updated_at 
FROM admin 
WHERE email = 'admin@xiayeai.com';

-- 输出确认信息
-- 管理员账户已成功修复，用户名设置为 'admin'