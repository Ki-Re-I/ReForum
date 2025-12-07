-- 添加用户名和称号的修改时间跟踪字段
-- 用于实现30天修改限制功能

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username_updated_at TIMESTAMP DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tag_updated_at TIMESTAMP DEFAULT NULL;

-- 为现有用户设置初始值（如果字段为NULL，表示从未修改过，可以立即修改）
-- 这里不需要更新现有数据，NULL值表示可以修改

-- 添加注释
COMMENT ON COLUMN users.username_updated_at IS '用户名最后修改时间，用于30天修改限制';
COMMENT ON COLUMN users.tag_updated_at IS '称号最后修改时间，用于30天修改限制';

