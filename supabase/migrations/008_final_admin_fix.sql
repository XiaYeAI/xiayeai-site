-- 数据库迁移文件：最终修复管理员账户
-- 创建时间：2025-01-13
-- 功能：彻底解决管理员账户冲突

-- 查看当前状态
SELECT id, email, username, name, is_active FROM admin ORDER BY created_at;

-- 第一步：将现有的username='admin'改为临时值
UPDATE admin 
SET username = 'temp_admin'
WHERE username = 'admin';

-- 第二步：为admin@xiayeai.com设置正确的username
UPDATE admin 
SET username = 'admin', updated_at = now()
WHERE email = 'admin@xiayeai.com';

-- 第三步：删除临时账户的相关日志
DELETE FROM admin_logs 
WHERE admin_id IN (SELECT id FROM admin WHERE username = 'temp_admin');

-- 第四步：删除临时账户
DELETE FROM admin WHERE username = 'temp_admin';

-- 验证最终结果
SELECT id, email, username, name, password_hash, is_active, created_at, updated_at 
FROM admin;

-- 确认只有一个管理员账户
SELECT COUNT(*) as admin_count FROM admin;

-- 输出确认信息
-- 管理员账户已成功修复，现在可以使用 admin / G>]PnmOD051i}X,8 登录