import express from 'express';
import NotificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 所有通知路由都需要认证
router.use(authenticate);

// 获取通知列表
router.get('/', NotificationController.getNotifications);

// 获取未读通知数量
router.get('/unread-count', NotificationController.getUnreadCount);

// 标记通知为已读
router.put('/:notificationId/read', NotificationController.markAsRead);

// 标记所有通知为已读
router.put('/read-all', NotificationController.markAllAsRead);

// 删除通知
router.delete('/:notificationId', NotificationController.deleteNotification);

export default router;

