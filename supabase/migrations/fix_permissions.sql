-- 为skills表授予权限
GRANT ALL PRIVILEGES ON skills TO authenticated;
GRANT SELECT ON skills TO anon;

-- 为profiles表授予权限
GRANT ALL PRIVILEGES ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- 创建RLS策略允许authenticated用户删除自己的技能
CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (true);

-- 创建RLS策略允许authenticated用户更新自己的个人资料
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (true);

-- 创建RLS策略允许authenticated用户插入技能
CREATE POLICY "Users can insert skills" ON skills
  FOR INSERT WITH CHECK (true);

-- 创建RLS策略允许authenticated用户查看技能
CREATE POLICY "Users can view skills" ON skills
  FOR SELECT USING (true);

-- 创建RLS策略允许匿名用户查看技能
CREATE POLICY "Anonymous users can view skills" ON skills
  FOR SELECT USING (true);

-- 创建RLS策略允许匿名用户查看个人资料
CREATE POLICY "Anonymous users can view profiles" ON profiles
  FOR SELECT USING (true);