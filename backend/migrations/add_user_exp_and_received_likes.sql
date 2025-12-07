-- 添加用户经验值(exp)字段和获赞数统计
-- 用于用户等级系统和统计功能

-- 1. 添加经验值字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS exp INTEGER DEFAULT 0 NOT NULL;

-- 添加注释
COMMENT ON COLUMN users.exp IS '用户经验值，用于等级系统计算';

-- 2. 创建用户获赞数视图（从post_likes表统计）
-- 这个视图会统计每个用户发布的所有帖子收到的点赞总数
CREATE OR REPLACE VIEW user_received_likes AS
SELECT 
    p.author_id as user_id,
    COUNT(pl.id) as received_likes
FROM posts p
LEFT JOIN post_likes pl ON p.id = pl.post_id
GROUP BY p.author_id;

-- 添加注释
COMMENT ON VIEW user_received_likes IS '用户获赞数统计视图，统计用户所有帖子收到的点赞总数';

-- 3. 为现有用户设置默认经验值（如果为NULL则设为0）
UPDATE users 
SET exp = 0 
WHERE exp IS NULL;

-- 4. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_users_exp ON users(exp DESC);

-- 5. 添加注释
COMMENT ON INDEX idx_users_exp IS '用户经验值索引，用于等级排行榜查询优化';

