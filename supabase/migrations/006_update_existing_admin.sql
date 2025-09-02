-- 数据库迁移文件：更新现有管理员账户
-- 创建时间：2025-01-13
-- 功能：将现有的admin用户名账户更新为正确的信息

-- 首先查看当前的管理员账户
SELECT email, username, name, is_active FROM admin ORDER BY created_at;

-- 更新现有的username='admin'的账户为正确的信息
UPDATE admin 
SET 
  email = 'admin@xiayeai.com',
  password_hash = '$2b$10$pv3RnGJc5PWCsWkehHPWDuk9B5WnjFqtuKoJdjesMVP.I44vJgS9u',
  name = '夏夜AI管理员',
  updated_at = now()
WHERE username = 'admin';

-- 删除重复的admin@xiayeai.com账户（如果username为null的那个）
DELETE FROM admin 
WHERE email = 'admin@xiayeai.com' AND username IS NULL;

-- 验证更新结果
SELECT email, username, name, password_hash, is_active, created_at, updated_at 
FROM admin 
WHERE username = 'admin';

-- 输出确认信息
-- 管理员账户已成功更新