import User from '../models/User.js';

class UserController {
  // 获取当前用户资料
  static async getProfile(req, res) {
    try {
      const userId = req.userId;
      const userProfile = await User.getProfile(userId);

      if (!userProfile) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: '用户不存在',
        });
      }

      return res.status(200).json(userProfile);
    } catch (error) {
      console.error('获取用户资料错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '获取用户资料失败',
      });
    }
  }

  // 更新用户资料
  static async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const { avatar, bio, username, tag } = req.body;

      // 获取当前用户信息
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: '用户不存在',
        });
      }

      // 检查用户名修改限制（30天）- 只有在字段存在时才检查
      if (username !== undefined && username !== currentUser.username) {
        if (currentUser.username_updated_at !== undefined && currentUser.username_updated_at !== null) {
        const usernameCheck = User.canModifyUsernameOrTag(currentUser.username_updated_at);
        if (!usernameCheck.canModify) {
          return res.status(400).json({
            error: 'USERNAME_UPDATE_LIMIT',
            message: `用户名只能每30天修改一次，还需等待 ${usernameCheck.daysRemaining} 天`,
            daysRemaining: usernameCheck.daysRemaining,
          });
          }
        }

        // 检查用户名是否已被使用
        const existingUser = await User.findByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({
            error: 'USERNAME_EXISTS',
            message: '该用户名已被使用',
          });
        }
      }

      // 检查称号修改限制（30天）- 只有在字段存在时才检查
      if (tag !== undefined && tag !== currentUser.tag) {
        if (currentUser.tag_updated_at !== undefined && currentUser.tag_updated_at !== null) {
        const tagCheck = User.canModifyUsernameOrTag(currentUser.tag_updated_at);
        if (!tagCheck.canModify) {
          return res.status(400).json({
            error: 'TAG_UPDATE_LIMIT',
            message: `称号只能每30天修改一次，还需等待 ${tagCheck.daysRemaining} 天`,
            daysRemaining: tagCheck.daysRemaining,
          });
          }
        }

        // 检查称号是否已被使用（如果提供了非空 tag）
        if (tag && tag.trim() !== '') {
          const existingUser = await User.findByTag(tag);
          if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({
              error: 'TAG_EXISTS',
              message: '该称号已被使用',
            });
          }
        }
      }

      const updatedUser = await User.update(userId, { avatar, bio, username, tag });
      
      if (!updatedUser) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: '用户不存在',
        });
      }

      // 获取用户统计信息
      const stats = await User.getStats(userId);
      const userProfile = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        tag: updatedUser.tag,
        exp: parseInt(updatedUser.exp) || 0,
        joinDate: updatedUser.join_date,
        postCount: parseInt(stats.post_count) || 0,
        commentCount: parseInt(stats.comment_count) || 0,
        receivedLikes: parseInt(stats.received_likes) || 0,
        usernameUpdatedAt: updatedUser.username_updated_at,
        tagUpdatedAt: updatedUser.tag_updated_at,
      };

      return res.status(200).json(userProfile);
    } catch (error) {
      console.error('更新用户资料错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '更新用户资料失败',
      });
    }
  }

  // 获取指定用户公开资料
  static async getPublicProfile(req, res) {
    try {
      const { userId } = req.params;
      const publicProfile = await User.getPublicProfile(parseInt(userId));

      if (!publicProfile) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: '用户不存在',
        });
      }

      return res.status(200).json({
        id: publicProfile.id,
        username: publicProfile.username,
        avatar: publicProfile.avatar,
        bio: publicProfile.bio,
        tag: publicProfile.tag,
        exp: parseInt(publicProfile.exp) || 0,
        joinDate: publicProfile.join_date,
        postCount: parseInt(publicProfile.post_count) || 0,
        commentCount: parseInt(publicProfile.comment_count) || 0,
        receivedLikes: parseInt(publicProfile.received_likes) || 0,
      });
    } catch (error) {
      console.error('获取公开用户资料错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '获取用户资料失败',
      });
    }
  }
}

export default UserController;

