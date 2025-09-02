-- 数据库迁移文件：更新管理员用户名
-- 创建时间：2025-01-13
-- 功能：为admin@xiayeai.com账户设置username为'admin'

-- 更新管理员用户名
UPDATE admin 
SET username = 'admin'
WHERE email = 'admin@xiayeai.com';

-- 验证更新结果
SELECT email, username, password_hash, created_at, updated_at 
FROM admin 
WHERE email = 'admin@xiayeai.com';

-- 输出确认信息
-- 管理员用户名已成功更新为 'admin'