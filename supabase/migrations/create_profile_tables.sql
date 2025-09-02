-- 创建个人信息相关数据表
-- 作者：SOLO Coding
-- 日期：2025-01-22
-- 功能：存储个人基本信息、技能、工作经历、教育背景等数据

-- 个人基本信息表
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(100),
    website_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    wechat_qr_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 技能表
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- emoji或图标类名
    category VARCHAR(50), -- 技能分类：技术、工具、语言等
    proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5), -- 熟练程度1-5
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 工作经历表
CREATE TABLE IF NOT EXISTS work_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL表示当前工作
    description TEXT,
    achievements TEXT[], -- 工作成就数组
    technologies TEXT[], -- 使用的技术栈
    location VARCHAR(100),
    company_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 教育背景表
CREATE TABLE IF NOT EXISTS educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    school_name VARCHAR(200) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    major VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    gpa DECIMAL(3,2), -- 学分绩点
    description TEXT,
    achievements TEXT[], -- 学术成就
    location VARCHAR(100),
    school_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 项目经历表
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    technologies TEXT[], -- 使用的技术栈
    github_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    highlights TEXT[], -- 项目亮点
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE, -- 是否为特色项目
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 社交媒体链接表
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 平台名称：wechat, github, linkedin等
    url TEXT NOT NULL,
    username VARCHAR(100),
    follower_count INTEGER DEFAULT 0,
    description TEXT,
    icon VARCHAR(50), -- 图标类名或emoji
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_skills_profile_id ON skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_work_experiences_profile_id ON work_experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_work_experiences_start_date ON work_experiences(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_educations_profile_id ON educations(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON social_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_links_platform ON social_links(platform);

-- 启用行级安全策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略（允许所有人读取，只有认证用户可以修改）
CREATE POLICY "Allow public read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON profiles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON profiles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON work_experiences FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON work_experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON work_experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON work_experiences FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON educations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON educations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON educations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON educations FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON social_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON social_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON social_links FOR DELETE USING (auth.role() = 'authenticated');

-- 授权给anon和authenticated角色
GRANT SELECT ON profiles TO anon;
GRANT ALL PRIVILEGES ON profiles TO authenticated;

GRANT SELECT ON skills TO anon;
GRANT ALL PRIVILEGES ON skills TO authenticated;

GRANT SELECT ON work_experiences TO anon;
GRANT ALL PRIVILEGES ON work_experiences TO authenticated;

GRANT SELECT ON educations TO anon;
GRANT ALL PRIVILEGES ON educations TO authenticated;

GRANT SELECT ON projects TO anon;
GRANT ALL PRIVILEGES ON projects TO authenticated;

GRANT SELECT ON social_links TO anon;
GRANT ALL PRIVILEGES ON social_links TO authenticated;

-- 插入示例数据
INSERT INTO profiles (id, name, title, bio, email, github_url, linkedin_url) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '夏叶',
    'AI技术专家 & 内容创作者',
    '专注于人工智能技术研究与应用，致力于通过优质内容分享AI前沿技术，帮助更多人了解和掌握AI技术。拥有丰富的机器学习、深度学习项目经验，在自然语言处理、计算机视觉等领域有深入研究。',
    'contact@xiayeai.com',
    'https://github.com/xiayeai',
    'https://linkedin.com/in/xiayeai'
) ON CONFLICT (id) DO NOTHING;

-- 插入技能数据
INSERT INTO skills (profile_id, name, description, icon, category, proficiency_level, sort_order) VALUES 
('00000000-0000-0000-0000-000000000001', '机器学习', '深度学习、神经网络、模型训练与优化', '🤖', '技术', 5, 1),
('00000000-0000-0000-0000-000000000001', '自然语言处理', '文本分析、语言模型、对话系统', '💬', '技术', 5, 2),
('00000000-0000-0000-0000-000000000001', '计算机视觉', '图像识别、目标检测、图像生成', '👁️', '技术', 4, 3),
('00000000-0000-0000-0000-000000000001', 'Python开发', '数据科学、Web开发、自动化脚本', '🐍', '编程', 5, 4),
('00000000-0000-0000-0000-000000000001', '云计算', 'AWS、Azure、模型部署与运维', '☁️', '技术', 4, 5),
('00000000-0000-0000-0000-000000000001', '技术写作', '技术博客、教程制作、知识分享', '✍️', '软技能', 5, 6)
ON CONFLICT DO NOTHING;

-- 插入工作经历数据
INSERT INTO work_experiences (profile_id, company_name, position, start_date, end_date, description, achievements, technologies, sort_order) VALUES 
('00000000-0000-0000-0000-000000000001', '某知名科技公司', 'AI技术专家', '2022-01-01', NULL, '负责AI产品的技术架构设计和核心算法开发', 
 ARRAY['负责AI产品的技术架构设计和核心算法开发', '领导团队完成多个机器学习项目，提升业务效率30%+', '建立完善的模型训练和部署流程，缩短上线周期50%'], 
 ARRAY['Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'AWS'], 1),
('00000000-0000-0000-0000-000000000001', '某互联网公司', '算法工程师', '2020-01-01', '2021-12-31', '专注于推荐系统和NLP算法开发', 
 ARRAY['开发推荐系统算法，提升用户点击率15%', '优化深度学习模型，降低推理延迟40%', '参与多个NLP项目，包括文本分类和情感分析'], 
 ARRAY['Python', 'Spark', 'Redis', 'Docker'], 2)
ON CONFLICT DO NOTHING;

-- 插入教育背景数据
INSERT INTO educations (profile_id, school_name, degree, major, start_date, end_date, description, sort_order) VALUES 
('00000000-0000-0000-0000-000000000001', '某知名大学', '计算机科学硕士', '人工智能与机器学习', '2018-09-01', '2020-06-30', '专业方向：人工智能与机器学习', 1)
ON CONFLICT DO NOTHING;

-- 插入社交媒体链接数据
INSERT INTO social_links (profile_id, platform, url, username, description, icon, sort_order) VALUES 
('00000000-0000-0000-0000-000000000001', 'wechat', '#', 'xiayeai', '夏叶AI加油站公众号', '💬', 1),
('00000000-0000-0000-0000-000000000001', 'github', 'https://github.com/xiayeai', 'xiayeai', 'GitHub开源项目', '🐙', 2),
('00000000-0000-0000-0000-000000000001', 'linkedin', 'https://linkedin.com/in/xiayeai', 'xiayeai', 'LinkedIn专业档案', '💼', 3)
ON CONFLICT DO NOTHING;