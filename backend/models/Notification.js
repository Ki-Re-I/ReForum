import { query, getClient } from '../config/database.js';

class Notification {
  // 创建通知
  static async create({ userId, type = 'new_post', title, content, relatedPostId, relatedUserId }) {
    const result = await query(
      `INSERT INTO notifications (user_id, type, title, content, related_post_id, related_user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, type, title, content || null, relatedPostId || null, relatedUserId || null]
    );
    return result.rows[0];
  }

  // 为用户创建新帖子通知（给所有其他用户）
  static async createNewPostNotifications(postId, authorId, authorUsername, postTitle) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 检查 notifications 表是否存在
      const tableCheck = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'notifications'
        )`
      );

      if (!tableCheck.rows[0].exists) {
        console.warn('⚠️  notifications 表不存在，跳过创建通知。请运行数据库迁移脚本。');
        await client.query('ROLLBACK');
        return [];
      }

      // 获取所有用户（除了发帖人）
      const usersResult = await client.query(
        'SELECT id FROM users WHERE id != $1',
        [authorId]
      );

      // 如果没有其他用户，直接返回
      if (usersResult.rows.length === 0) {
        await client.query('COMMIT');
        return [];
      }

      // 为每个用户创建通知
      const notifications = [];
      for (const user of usersResult.rows) {
        try {
          const notification = await client.query(
            `INSERT INTO notifications (user_id, type, title, content, related_post_id, related_user_id)
             VALUES ($1, 'new_post', $2, $3, $4, $5)
             RETURNING *`,
            [
              user.id,
              `${authorUsername} 发布了新帖子`,
              postTitle,
              postId,
              authorId
            ]
          );
          notifications.push(notification.rows[0]);
        } catch (err) {
          console.error(`为用户 ${user.id} 创建通知失败:`, err.message);
          // 继续为其他用户创建通知
        }
      }

      await client.query('COMMIT');
      console.log(`✅ 成功为 ${notifications.length} 个用户创建通知`);
      return notifications;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('创建通知事务失败:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  // 获取用户的通知列表
  static async findByUserId(userId, { limit = 50, offset = 0, unreadOnly = false } = {}) {
    let queryText = `
      SELECT n.*,
             p.title as post_title,
             u.username as related_username,
             u.avatar as related_user_avatar
      FROM notifications n
      LEFT JOIN posts p ON n.related_post_id = p.id
      LEFT JOIN users u ON n.related_user_id = u.id
      WHERE n.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (unreadOnly) {
      queryText += ` AND n.is_read = FALSE`;
    }

    queryText += ` ORDER BY n.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  // 获取未读通知数量
  static async getUnreadCount(userId) {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  // 标记通知为已读
  static async markAsRead(notificationId, userId) {
    const result = await query(
      `UPDATE notifications 
       SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [notificationId, userId]
    );
    return result.rows[0] || null;
  }

  // 标记所有通知为已读
  static async markAllAsRead(userId) {
    const result = await query(
      `UPDATE notifications 
       SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND is_read = FALSE
       RETURNING id`,
      [userId]
    );
    return result.rowCount;
  }

  // 删除通知
  static async delete(notificationId, userId) {
    const result = await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    );
    return result.rows[0] || null;
  }
}

export default Notification;

