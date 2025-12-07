import Notification from '../models/Notification.js';

class NotificationController {
  // 获取用户的通知列表
  static async getNotifications(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: '未授权访问',
        });
      }
      const { limit = 50, offset = 0, unreadOnly = false } = req.query;

      const notifications = await Notification.findByUserId(userId, {
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        unreadOnly: unreadOnly === 'true',
      });

      return res.status(200).json({
        data: notifications,
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          total: notifications.length,
        },
      });
    } catch (error) {
      console.error('获取通知列表错误:', error);
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '获取通知列表失败',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // 获取未读通知数量
  static async getUnreadCount(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: '未授权访问',
        });
      }
      const count = await Notification.getUnreadCount(userId);

      return res.status(200).json({ count });
    } catch (error) {
      console.error('获取未读通知数量错误:', error);
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '获取未读通知数量失败',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // 标记通知为已读
  static async markAsRead(req, res) {
    try {
      const userId = req.userId;
      const { notificationId } = req.params;

      const notification = await Notification.markAsRead(parseInt(notificationId, 10), userId);

      if (!notification) {
        return res.status(404).json({
          error: 'NOTIFICATION_NOT_FOUND',
          message: '通知不存在',
        });
      }

      return res.status(200).json(notification);
    } catch (error) {
      console.error('标记通知为已读错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '标记通知为已读失败',
      });
    }
  }

  // 标记所有通知为已读
  static async markAllAsRead(req, res) {
    try {
      const userId = req.userId;
      const count = await Notification.markAllAsRead(userId);

      return res.status(200).json({
        message: '已标记所有通知为已读',
        count,
      });
    } catch (error) {
      console.error('标记所有通知为已读错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '标记所有通知为已读失败',
      });
    }
  }

  // 删除通知
  static async deleteNotification(req, res) {
    try {
      const userId = req.userId;
      const { notificationId } = req.params;

      const notification = await Notification.delete(parseInt(notificationId, 10), userId);

      if (!notification) {
        return res.status(404).json({
          error: 'NOTIFICATION_NOT_FOUND',
          message: '通知不存在',
        });
      }

      return res.status(200).json({
        message: '通知已删除',
      });
    } catch (error) {
      console.error('删除通知错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '删除通知失败',
      });
    }
  }
}

export default NotificationController;

