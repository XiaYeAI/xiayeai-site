-- 检查表权限
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND grantee IN ('anon', 'authenticated') 
  AND table_name IN ('skills', 'profiles') 
ORDER BY table_name, grantee;

-- 检查RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('skills', 'profiles');