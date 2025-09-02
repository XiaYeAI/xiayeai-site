-- 插入初始数据
-- 创建时间: 2025-01-29
-- 描述: 为网站添加初始数据，包括社交媒体平台、示例文章、网站统计和管理员账户

-- 插入社交媒体平台数据
INSERT INTO social_platforms (name, platform_type, url, follower_count, description, is_active, sort_order) VALUES
('夏夜AI', 'wechat', 'https://mp.weixin.qq.com/s/example', 5000, '专注AI技术分享的微信公众号', true, 1),
('夏夜AI知乎', 'zhihu', 'https://www.zhihu.com/people/xiayeai', 3200, '知乎AI技术专栏作者', true, 2),
('夏夜AI小红书', 'xiaohongshu', 'https://www.xiaohongshu.com/user/profile/xiayeai', 2800, '小红书AI科普博主', true, 3),
('夏夜AI抖音', 'douyin', 'https://www.douyin.com/user/xiayeai', 8500, '抖音AI技术短视频创作者', true, 4),
('夏夜AI B站', 'bilibili', 'https://space.bilibili.com/xiayeai', 12000, 'B站AI技术UP主', true, 5);

-- 插入示例文章数据
INSERT INTO articles (title, summary, content, cover_image, wechat_url, published_at, view_count, like_count, is_featured, status, tags) VALUES
('AI大模型的未来发展趋势', 
 '探讨人工智能大模型在未来几年的发展方向和应用前景，分析技术突破点和商业化路径。', 
 '随着ChatGPT、GPT-4等大模型的出现，人工智能领域迎来了新的发展机遇。本文将从技术发展、应用场景、商业模式等多个角度分析AI大模型的未来发展趋势...', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20artificial%20intelligence%20future%20technology%20digital%20brain%20neural%20network%20blue%20gradient&image_size=landscape_16_9', 
 'https://mp.weixin.qq.com/s/ai-future-trends', 
 '2025-01-25 10:00:00+00', 
 1250, 
 89, 
 true, 
 'published', 
 ARRAY['AI', '大模型', '技术趋势']),

('从零开始学习机器学习', 
 '适合初学者的机器学习入门指南，涵盖基础概念、算法原理和实践案例。', 
 '机器学习作为人工智能的核心技术之一，正在改变着我们的生活和工作方式。本文将为初学者提供一个系统的学习路径...', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20education%20books%20computer%20code%20algorithms%20study%20modern%20clean&image_size=landscape_16_9', 
 'https://mp.weixin.qq.com/s/ml-beginner-guide', 
 '2025-01-22 14:30:00+00', 
 980, 
 67, 
 true, 
 'published', 
 ARRAY['机器学习', '入门教程', '算法']),

('深度学习在计算机视觉中的应用', 
 '详细介绍深度学习技术在图像识别、目标检测、图像生成等计算机视觉任务中的应用。', 
 '计算机视觉是人工智能领域最活跃的分支之一，深度学习技术的发展为计算机视觉带来了革命性的变化...', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=computer%20vision%20deep%20learning%20neural%20network%20image%20recognition%20technology%20futuristic&image_size=landscape_16_9', 
 'https://mp.weixin.qq.com/s/cv-deep-learning', 
 '2025-01-20 09:15:00+00', 
 756, 
 45, 
 false, 
 'published', 
 ARRAY['深度学习', '计算机视觉', '图像识别']),

('自然语言处理技术解析', 
 'NLP技术的发展历程、核心算法和实际应用场景分析。', 
 '自然语言处理(NLP)是让计算机理解和处理人类语言的技术。从早期的规则系统到现在的大语言模型，NLP技术经历了巨大的发展...', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20language%20processing%20text%20analysis%20chatbot%20communication%20AI%20technology&image_size=landscape_16_9', 
 'https://mp.weixin.qq.com/s/nlp-technology', 
 '2025-01-18 16:45:00+00', 
 623, 
 38, 
 false, 
 'published', 
 ARRAY['NLP', '自然语言处理', '文本分析']),

('AI创业者的成功之路', 
 '分享AI领域创业的经验和教训，为有志于AI创业的朋友提供参考。', 
 'AI创业既充满机遇也面临挑战。作为一名AI领域的创业者，我想分享一些实战经验和思考...', 
 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20startup%20entrepreneur%20success%20business%20innovation%20technology%20growth&image_size=landscape_16_9', 
 'https://mp.weixin.qq.com/s/ai-startup-journey', 
 '2025-01-15 11:20:00+00', 
 892, 
 72, 
 true, 
 'published', 
 ARRAY['AI创业', '创业经验', '商业模式']);

-- 插入网站统计数据
INSERT INTO site_stats (total_followers, total_articles, total_partners, total_platforms) VALUES
(31500, 5, 12, 5);

-- 插入管理员账户数据
-- 注意：这里使用的是示例密码hash，实际使用时应该使用真实的密码hash
INSERT INTO admin (email, password_hash, name, role, is_active) VALUES
('admin@xiayeai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', '夏夜AI管理员', 'admin', true);

-- 更新时间戳
UPDATE site_stats SET updated_at = now();
UPDATE social_platforms SET updated_at = now();
UPDATE articles SET updated_at = now();
UPDATE admin SET updated_at = now();