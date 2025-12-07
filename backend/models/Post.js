import { query, getClient } from '../config/database.js';

class Post {
  // 根据 ID 查找帖子
  static async findById(id) {
    try {
      const result = await query(
        `SELECT p.*, 
                u.id as author_id, u.username as author_username, u.avatar as author_avatar,
                u.exp as author_exp, u.tag as author_tag,
                c.id as category_id, c.name as category_name, c.description as category_description, c.color as category_color,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
         FROM posts p
         LEFT JOIN users u ON p.author_id = u.id
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = $1`,
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      // 如果新字段不存在（数据库迁移未执行），回退到基本查询
      if (error.code === '42703' || error.message.includes('column') || error.message.includes('does not exist')) {
        console.warn('作者 exp 或 tag 字段不存在，使用向后兼容查询:', error.message);
        const result = await query(
          `SELECT p.*, 
                  u.id as author_id, u.username as author_username, u.avatar as author_avatar,
                  c.id as category_id, c.name as category_name, c.description as category_description, c.color as category_color,
                  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
           FROM posts p
           LEFT JOIN users u ON p.author_id = u.id
           LEFT JOIN categories c ON p.category_id = c.id
           WHERE p.id = $1`,
          [id]
        );
        const post = result.rows[0] || null;
        if (post) {
          // 为缺失的字段设置默认值
          post.author_exp = 0;
          post.author_tag = null;
        }
        return post;
      }
      throw error;
    }
  }

  // 创建帖子
  static async create({ title, content, excerpt, authorId, categoryId, tags = [] }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 插入帖子
      const postResult = await client.query(
        `INSERT INTO posts (title, content, excerpt, author_id, category_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [title, content, excerpt || this.generateExcerpt(content), authorId, categoryId]
      );
      const post = postResult.rows[0];

      // 处理标签
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // 查找或创建标签
          let tagResult = await client.query('SELECT id FROM tags WHERE name = $1', [tagName]);
          let tagId;

          if (tagResult.rows.length === 0) {
            const newTagResult = await client.query(
              'INSERT INTO tags (name) VALUES ($1) RETURNING id',
              [tagName]
            );
            tagId = newTagResult.rows[0].id;
          } else {
            tagId = tagResult.rows[0].id;
          }

          // 关联帖子与标签
          await client.query(
            'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [post.id, tagId]
          );
        }
      }

      await client.query('COMMIT');
      return await this.findById(post.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 更新帖子
  static async update(id, { title, content, categoryId, tags }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        values.push(title);
      }
      if (content !== undefined) {
        updates.push(`content = $${paramCount++}`);
        values.push(content);
      }
      if (categoryId !== undefined) {
        updates.push(`category_id = $${paramCount++}`);
        values.push(categoryId);
      }

      if (updates.length > 0) {
        values.push(id);
        await client.query(
          `UPDATE posts 
           SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $${paramCount}`,
          values
        );
      }

      // 更新标签
      if (tags !== undefined) {
        // 删除旧标签关联
        await client.query('DELETE FROM post_tags WHERE post_id = $1', [id]);

        // 添加新标签
        if (tags.length > 0) {
          for (const tagName of tags) {
            let tagResult = await client.query('SELECT id FROM tags WHERE name = $1', [tagName]);
            let tagId;

            if (tagResult.rows.length === 0) {
              const newTagResult = await client.query(
                'INSERT INTO tags (name) VALUES ($1) RETURNING id',
                [tagName]
              );
              tagId = newTagResult.rows[0].id;
            } else {
              tagId = tagResult.rows[0].id;
            }

            await client.query(
              'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [id, tagId]
            );
          }
        }
      }

      await client.query('COMMIT');
      return await this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 删除帖子
  static async delete(id) {
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  }

  // 获取帖子列表（分页、排序、筛选、搜索、按日期过滤）
  static async findAll({ page = 1, limit = 20, sort = 'time', category, tag, author, search, date }) {
    const offset = (page - 1) * limit;
    let orderBy = 'p.created_at DESC';
    
    if (sort === 'hot') {
      // 热门排序：按照点赞数量降序排列，点赞数相同的按创建时间降序
      orderBy = 'p.like_count DESC, p.created_at DESC';
    }

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      whereClause += ` AND p.category_id = $${paramCount++}`;
      params.push(category);
    }

    if (tag) {
      whereClause += ` AND EXISTS (
        SELECT 1 FROM post_tags pt 
        JOIN tags t ON pt.tag_id = t.id 
        WHERE pt.post_id = p.id AND t.name = $${paramCount++}
      )`;
      params.push(tag);
    }

    if (author) {
      whereClause += ` AND p.author_id = $${paramCount++}`;
      params.push(author);
    }

    // 搜索功能：搜索帖子标题、内容和作者用户名
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      // PostgreSQL 允许同一个参数占位符多次使用
      whereClause += ` AND (
        p.title ILIKE $${paramCount} OR 
        p.content ILIKE $${paramCount} OR
        u.username ILIKE $${paramCount}
      )`;
      params.push(searchTerm);
      paramCount++;
    }

    // 按日期过滤（前端传入 YYYY-MM-DD，按「本地日期」匹配 created_at）
    // 注意：前端使用本地时区生成日期键（例如 Asia/Shanghai），
    // 这里通过 AT TIME ZONE 将数据库中的时间转换到相同时区再取 date，
    // 避免出现「10 月 1 日被当成 9 月 30 日」的时区偏移问题。
    if (date) {
      whereClause += ` AND DATE(p.created_at AT TIME ZONE 'Asia/Shanghai') = $${paramCount++}`;
      params.push(date);
    }

    params.push(limit, offset);

    const baseFromClause = `
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
    `;

    let result;
    try {
      result = await query(
        `SELECT p.*,
                u.id as author_id, u.username as author_username, u.avatar as author_avatar,
                u.exp as author_exp, u.tag as author_tag,
                c.id as category_id, c.name as category_name, c.description as category_description, c.color as category_color,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
         ${baseFromClause}
         ${whereClause}
         ORDER BY ${orderBy}
         LIMIT $${paramCount++} OFFSET $${paramCount++}`,
        params
      );
    } catch (error) {
      // 如果新字段不存在（数据库迁移未执行），回退到基本查询
      if (error.code === '42703' || error.message.includes('column') || error.message.includes('does not exist')) {
        console.warn('作者 exp 或 tag 字段不存在，使用向后兼容查询:', error.message);
        result = await query(
          `SELECT p.*,
                  u.id as author_id, u.username as author_username, u.avatar as author_avatar,
                  c.id as category_id, c.name as category_name, c.description as category_description, c.color as category_color,
                  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
           ${baseFromClause}
           ${whereClause}
           ORDER BY ${orderBy}
           LIMIT $${paramCount++} OFFSET $${paramCount++}`,
          params
        );
        // 为缺失的字段设置默认值
        result.rows = result.rows.map(post => ({
          ...post,
          author_exp: 0,
          author_tag: null,
        }));
      } else {
        throw error;
      }
    }

    // 获取总数
    const countResult = await query(
      `SELECT COUNT(*) as total ${baseFromClause} ${whereClause}`,
      params.slice(0, -2)
    );
    const total = parseInt(countResult.rows[0].total);

    // 获取每个帖子的标签
    const posts = await Promise.all(
      result.rows.map(async (post) => {
        const tagsResult = await query(
          `SELECT t.id, t.name 
           FROM tags t
           JOIN post_tags pt ON t.id = pt.tag_id
           WHERE pt.post_id = $1`,
          [post.id]
        );
        return {
          ...post,
          tags: tagsResult.rows,
        };
      })
    );

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 增加浏览量（去重：同一用户或同一IP在24小时内只计算一次）
  static async incrementViewCount(id, userId = null, ipAddress = null) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 检查是否已经浏览过（24小时内）
      let hasViewed = false;

      if (userId) {
        // 已登录用户：检查用户在24小时内是否已经浏览过
        const userViewResult = await client.query(
          `SELECT id FROM post_views 
           WHERE post_id = $1 AND user_id = $2
           AND viewed_at > NOW() - INTERVAL '24 hours'`,
          [id, userId]
        );
        hasViewed = userViewResult.rows.length > 0;
      } else if (ipAddress) {
        // 未登录用户：检查IP地址在24小时内是否已经浏览过
        const ipViewResult = await client.query(
          `SELECT id FROM post_views 
           WHERE post_id = $1 AND ip_address = $2 AND user_id IS NULL
           AND viewed_at > NOW() - INTERVAL '24 hours'`,
          [id, ipAddress]
        );
        hasViewed = ipViewResult.rows.length > 0;
      } else {
        // 既没有userId也没有ipAddress，无法去重，直接增加浏览量
        // 这种情况应该很少见，但为了确保浏览量能增加，我们仍然增加计数
        await client.query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', [id]);
        await client.query('COMMIT');
        return;
      }

      // 如果没有在24小时内浏览过，增加浏览量并记录
      if (!hasViewed) {
        // 先增加浏览量
        await client.query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', [id]);
        
        // 然后记录浏览历史
        try {
          if (userId) {
            // 已登录用户：插入浏览记录
            await client.query(
              `INSERT INTO post_views (post_id, user_id, ip_address) 
               VALUES ($1, $2, $3)
               ON CONFLICT (post_id, user_id) WHERE user_id IS NOT NULL
               DO UPDATE SET viewed_at = NOW()`,
              [id, userId, ipAddress]
            );
          } else if (ipAddress) {
            // 未登录用户：插入浏览记录
            // 注意：这里可能会有并发问题，但数据库的唯一约束会处理
            await client.query(
              `INSERT INTO post_views (post_id, user_id, ip_address) 
               VALUES ($1, NULL, $2)`,
              [id, ipAddress]
            );
          }
        } catch (insertError) {
          // 如果插入失败（可能是并发导致的唯一约束冲突）
          // 检查是否是唯一约束冲突
          if (insertError.code === '23505') {
            // 唯一约束冲突：说明在检查和插入之间，另一个请求已经插入了记录
            // 这是正常的并发情况，我们不需要回滚，因为浏览量已经增加了
            console.log(`浏览记录插入冲突（并发请求）: post_id=${id}, user_id=${userId}, ip=${ipAddress}`);
          } else {
            // 其他错误，回滚并抛出
            await client.query('ROLLBACK');
            throw insertError;
          }
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('增加浏览量错误:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // 切换点赞状态（点赞/取消点赞）
  static async toggleLike(postId, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 检查是否已经点赞
      const likeResult = await client.query(
        'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
        [postId, userId]
      );

      const hasLiked = likeResult.rows.length > 0;

      if (hasLiked) {
        // 取消点赞
        await client.query(
          'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
          [postId, userId]
        );
        await client.query(
          'UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1',
          [postId]
        );
        await client.query('COMMIT');
        return { liked: false, likeCount: await this.getLikeCount(postId) };
      } else {
        // 点赞
        await client.query(
          'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
          [postId, userId]
        );
        await client.query(
          'UPDATE posts SET like_count = like_count + 1 WHERE id = $1',
          [postId]
        );
        await client.query('COMMIT');
        return { liked: true, likeCount: await this.getLikeCount(postId) };
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 获取点赞数
  static async getLikeCount(postId) {
    const result = await query(
      'SELECT like_count FROM posts WHERE id = $1',
      [postId]
    );
    return result.rows[0]?.like_count || 0;
  }

  // 检查用户是否已点赞
  static async hasUserLiked(postId, userId) {
    if (!userId) return false;
    const result = await query(
      'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );
    return result.rows.length > 0;
  }

  // 生成内容摘要
  static generateExcerpt(content, maxLength = 150) {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, ''); // 移除 HTML 标签
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // 格式化帖子数据（用于 API 响应）
  static async formatPostListItem(post, userId = null) {
    const baseData = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content, // 添加完整内容，用于首页显示图片
      author: {
        id: post.author_id,
        username: post.author_username,
        avatar: post.author_avatar,
        exp: post.author_exp !== undefined ? post.author_exp : 0, // 添加经验值，如果不存在则默认为0
        tag: post.author_tag !== undefined ? post.author_tag : null, // 添加称号，如果不存在则默认为null
      },
      category: {
        id: post.category_id,
        name: post.category_name,
        description: post.category_description,
        color: post.category_color,
      },
      tags: post.tags || [],
      viewCount: post.view_count,
      commentCount: parseInt(post.comment_count) || 0,
      likeCount: post.like_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };

    // 如果提供了用户ID，检查是否已点赞
    if (userId) {
      baseData.liked = await this.hasUserLiked(post.id, userId);
    }

    return baseData;
  }

  // 格式化帖子详情（包含完整内容）
  static async formatPostDetail(post, userId = null) {
    const baseData = await this.formatPostListItem(post, userId);
    baseData.commentCount = parseInt(post.comment_count) || 0;
    return baseData;
  }
}

export default Post;

