import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  // 根据 ID 查找用户
  static async findById(id) {
    try {
      // 尝试查询包含新字段的完整信息
    const result = await query(
        'SELECT id, username, email, avatar, bio, tag, exp, join_date, created_at, updated_at, username_updated_at, tag_updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
    } catch (error) {
      // 如果新字段不存在（数据库迁移未执行），回退到基本查询
      if (error.code === '42703' || error.message.includes('column') || error.message.includes('does not exist')) {
        console.warn('新字段不存在，使用向后兼容查询:', error.message);
        const result = await query(
          'SELECT id, username, email, avatar, bio, tag, join_date, created_at, updated_at FROM users WHERE id = $1',
          [id]
        );
        const user = result.rows[0] || null;
        if (user) {
          // 为缺失的字段设置默认值
          user.exp = 0;
          user.username_updated_at = null;
          user.tag_updated_at = null;
        }
        return user;
      }
      throw error;
    }
  }

  // 根据用户名查找用户
  static async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  // 根据称号查找用户
  static async findByTag(tag) {
    if (!tag) return null;
    try {
      const result = await query(
        'SELECT id, username, email, avatar, bio, tag, exp, join_date, created_at, updated_at, username_updated_at, tag_updated_at FROM users WHERE tag = $1',
        [tag]
      );
      return result.rows[0] || null;
    } catch (error) {
      // 如果 tag 字段不存在（向后兼容）
      if (error.code === '42703' || error.message.includes('column') || error.message.includes('does not exist')) {
        return null;
      }
      throw error;
    }
  }

  // 根据用户名或邮箱查找用户（用于登录）
  static async findByUsernameOrEmail(login) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [login]
    );
    return result.rows[0] || null;
  }

  // 创建新用户
  static async create({ username, email, password }) {
    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (username, email, password_hash, exp) 
       VALUES ($1, $2, $3, 0) 
       RETURNING id, username, email, avatar, bio, tag, exp, join_date, created_at, updated_at`,
      [username, email, passwordHash]
    );
    return result.rows[0];
  }

  // 检查是否可以修改用户名或称号（30天限制）
  static canModifyUsernameOrTag(updatedAt) {
    if (!updatedAt) {
      // 如果从未修改过，可以修改
      return { canModify: true, daysRemaining: null };
    }
    
    const lastUpdate = new Date(updatedAt);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
    const daysRemaining = 30 - daysSinceUpdate;
    
    return {
      canModify: daysRemaining <= 0,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    };
  }

  // 更新用户资料
  static async update(id, { avatar, bio, username, tag }) {
    const updates = [];
    const values = [];
    let paramCount = 1;
    let hasNewFields = false;

    // 检查新字段是否存在
    try {
      const checkResult = await query('SELECT username_updated_at, tag_updated_at FROM users WHERE id = $1 LIMIT 1', [id]);
      if (checkResult.rows.length > 0) {
        hasNewFields = checkResult.rows[0].hasOwnProperty('username_updated_at');
      }
    } catch (error) {
      // 字段不存在，使用向后兼容模式
      hasNewFields = false;
    }

    if (avatar !== undefined) {
      updates.push(`avatar = $${paramCount++}`);
      values.push(avatar);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }
    if (username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
      if (hasNewFields) {
      updates.push(`username_updated_at = CURRENT_TIMESTAMP`);
      }
    }
    if (tag !== undefined) {
      updates.push(`tag = $${paramCount++}`);
      values.push(tag);
      if (hasNewFields) {
      updates.push(`tag_updated_at = CURRENT_TIMESTAMP`);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    try {
    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
         RETURNING id, username, email, avatar, bio, tag, exp, join_date, created_at, updated_at, username_updated_at, tag_updated_at`,
      values
    );
    return result.rows[0];
    } catch (error) {
      // 如果新字段不存在，使用基本查询
      if (error.code === '42703' || error.message.includes('column') || error.message.includes('does not exist')) {
        console.warn('新字段不存在，使用向后兼容更新:', error.message);
        // 移除新字段的更新
        const basicUpdates = updates.filter(u => !u.includes('username_updated_at') && !u.includes('tag_updated_at'));
        if (basicUpdates.length === 0) {
          return await this.findById(id);
        }
        const basicValues = values.slice(0, -1); // 移除最后的 id
        basicValues.push(id);
        const result = await query(
          `UPDATE users 
           SET ${basicUpdates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $${basicValues.length} 
           RETURNING id, username, email, avatar, bio, tag, join_date, created_at, updated_at`,
          basicValues
        );
        const user = result.rows[0] || null;
        if (user) {
          user.exp = 0;
          user.username_updated_at = null;
          user.tag_updated_at = null;
        }
        return user;
      }
      throw error;
    }
  }

  // 验证密码
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  // 获取用户统计信息（帖子数、评论数和获赞数）
  static async getStats(userId) {
    try {
      const result = await query(
        `SELECT 
          COALESCE(us.post_count, 0) as post_count,
          COALESCE(us.comment_count, 0) as comment_count,
          COALESCE(url.received_likes, 0) as received_likes
         FROM users u
         LEFT JOIN user_stats us ON u.id = us.id
         LEFT JOIN user_received_likes url ON u.id = url.user_id
         WHERE u.id = $1`,
        [userId]
      );
      return result.rows[0] || { post_count: 0, comment_count: 0, received_likes: 0 };
    } catch (error) {
      // 如果 user_received_likes 视图不存在（数据库迁移未执行），回退到基本查询
      if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation')) {
        console.warn('user_received_likes 视图不存在，使用向后兼容查询:', error.message);
    const result = await query(
          `SELECT 
            COALESCE(us.post_count, 0) as post_count,
            COALESCE(us.comment_count, 0) as comment_count,
            0 as received_likes
           FROM users u
           LEFT JOIN user_stats us ON u.id = us.id
           WHERE u.id = $1`,
      [userId]
    );
        return result.rows[0] || { post_count: 0, comment_count: 0, received_likes: 0 };
      }
      throw error;
    }
  }

  // 获取用户完整资料（包含统计信息）
  static async getProfile(userId) {
    const user = await this.findById(userId);
    if (!user) return null;

    const stats = await this.getStats(userId);
    return {
      ...user,
      exp: parseInt(user.exp) || 0,
      postCount: parseInt(stats.post_count) || 0,
      commentCount: parseInt(stats.comment_count) || 0,
      receivedLikes: parseInt(stats.received_likes) || 0,
      usernameUpdatedAt: user.username_updated_at,
      tagUpdatedAt: user.tag_updated_at,
    };
  }

  // 获取公开用户资料（不包含邮箱）
  static async getPublicProfile(userId) {
    try {
      const result = await query(
        `SELECT u.id, u.username, u.avatar, u.bio, u.tag, u.exp, u.join_date,
                COALESCE(us.post_count, 0) as post_count,
                COALESCE(us.comment_count, 0) as comment_count,
                COALESCE(url.received_likes, 0) as received_likes
         FROM users u
         LEFT JOIN user_stats us ON u.id = us.id
         LEFT JOIN user_received_likes url ON u.id = url.user_id
         WHERE u.id = $1`,
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      // 如果新字段或视图不存在（数据库迁移未执行），回退到基本查询
      if (error.code === '42703' || error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('column')) {
        console.warn('新字段或视图不存在，使用向后兼容查询:', error.message);
    const result = await query(
      `SELECT u.id, u.username, u.avatar, u.bio, u.tag, u.join_date,
              COALESCE(us.post_count, 0) as post_count,
                  COALESCE(us.comment_count, 0) as comment_count,
                  0 as received_likes
       FROM users u
       LEFT JOIN user_stats us ON u.id = us.id
       WHERE u.id = $1`,
      [userId]
    );
        const user = result.rows[0] || null;
        if (user) {
          // 为缺失的字段设置默认值
          user.exp = 0;
        }
        return user;
      }
      throw error;
    }
  }
}

export default User;

