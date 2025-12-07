-- 添加用户称号(tag)字段
-- 用于存储用户自定义称号

ALTER TABLE users
ADD COLUMN IF NOT EXISTS tag VARCHAR(20) DEFAULT NULL;

-- 添加注释
COMMENT ON COLUMN users.tag IS '用户称号，可自定义，最多20个字符';

