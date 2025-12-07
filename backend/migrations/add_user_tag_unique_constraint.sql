-- 添加用户称号(tag)的唯一性约束
-- 确保每个用户的称号都是唯一的
-- 
-- 注意：此脚本依赖 add_user_tag_column.sql，请确保先执行该脚本

-- 1. 首先清理可能存在的重复 tag（保留最早的用户的 tag，其他用户设为 NULL）
-- 注意：这个操作会将被重复使用的 tag 保留给最早创建的用户
UPDATE users u1
SET tag = NULL
WHERE tag IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM users u2
    WHERE u2.tag = u1.tag
      AND u2.id < u1.id
  );

-- 2. 添加唯一性约束（允许 NULL 值，因为 PostgreSQL 的唯一约束允许多个 NULL）
-- 如果 tag 为 NULL，则不检查唯一性；如果 tag 不为 NULL，则必须唯一
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_tag_unique 
ON users(tag) 
WHERE tag IS NOT NULL;

-- 添加注释
COMMENT ON INDEX idx_users_tag_unique IS '用户称号唯一性约束，允许多个用户没有称号（NULL），但不允许多个用户使用相同的非空称号';

