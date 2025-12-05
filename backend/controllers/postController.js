import Post from '../models/Post.js';
import Category from '../models/Category.js';
import Notification from '../models/Notification.js';
import EmailService from '../services/emailService.js';

class PostController {
  // 获取帖子列表
  static async getPosts(req, res) {
    try {
      const { page = 1, limit = 20, sort = 'time', category, tag, author, search, date } = req.query;

      const result = await Post.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        category: category ? parseInt(category) : undefined,
        tag,
        author: author ? parseInt(author) : undefined,
        search: search ? search.trim() : undefined,
        date: date || undefined,
      });

      // 格式化帖子数据
      const userId = req.userId || null;
      const formattedPosts = await Promise.all(
        result.data.map(post => Post.formatPostListItem(post, userId))
      );

      return res.status(200).json({
        data: formattedPosts,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('获取帖子列表错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '获取帖子列表失败',
      });
    }
  }

  // 获取帖子详情
  static async getPostById(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.userId || null; // 可能为 undefined，转换为 null
      
      // 改进IP地址获取逻辑
      let ipAddress = null;
      if (req.ip) {
        ipAddress = req.ip;
      } else if (req.headers['x-forwarded-for']) {
        // 从代理头获取真实IP（取第一个IP）
        ipAddress = req.headers['x-forwarded-for'].split(',')[0].trim();
      } else if (req.connection && req.connection.remoteAddress) {
        ipAddress = req.connection.remoteAddress;
      } else if (req.socket && req.socket.remoteAddress) {
        ipAddress = req.socket.remoteAddress;
      }

      const post = await Post.findById(parseInt(postId));

      if (!post) {
        return res.status(404).json({
          error: 'POST_NOT_FOUND',
          message: '帖子不存在',
        });
      }

      // 增加浏览量（去重：同一用户或同一IP在24小时内只计算一次）
      try {
        await Post.incrementViewCount(parseInt(postId), userId, ipAddress);
      } catch (viewError) {
        // 浏览量增加失败不应该影响帖子详情获取
        console.error('增加浏览量失败:', viewError);
      }

      // 重新获取帖子以获取最新的浏览量
      const updatedPost = await Post.findById(parseInt(postId));

      // 获取标签
      const { query } = await import('../config/database.js');
      const tagsResult = await query(
        `SELECT t.id, t.name 
         FROM tags t
         JOIN post_tags pt ON t.id = pt.tag_id
         WHERE pt.post_id = $1`,
        [postId]
      );

      const formattedPost = await Post.formatPostDetail({
        ...updatedPost,
        tags: tagsResult.rows,
      }, userId);

      return res.status(200).json(formattedPost);
    } catch (error) {
      console.error('获取帖子详情错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '获取帖子详情失败',
      });
    }
  }

  // 创建帖子
  static async createPost(req, res) {
    try {
      const userId = req.userId;
      const { title, content, categoryId, tags } = req.body;

      // 验证分类是否存在
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          error: 'CATEGORY_NOT_FOUND',
          message: '分类不存在',
        });
      }

      // 生成摘要
      const excerpt = Post.generateExcerpt(content);

      // 创建帖子
      const post = await Post.create({
        title,
        content,
        excerpt,
        authorId: userId,
        categoryId,
        tags: tags || [],
      });

      // 获取标签
      const { query } = await import('../config/database.js');
      const tagsResult = await query(
        `SELECT t.id, t.name 
         FROM tags t
         JOIN post_tags pt ON t.id = pt.tag_id
         WHERE pt.post_id = $1`,
        [post.id]
      );

      // 获取需要邮件通知的用户
      const recipientResult = await query(
        `SELECT username, email 
         FROM users 
         WHERE id != $1 AND email IS NOT NULL AND email <> ''`,
        [userId]
      );

      const formattedPost = await Post.formatPostDetail({
        ...post,
        tags: tagsResult.rows,
      }, userId);

      // 异步创建通知（不阻塞响应）
      // 获取作者信息
      const authorResult = await query(
        'SELECT username FROM users WHERE id = $1',
        [userId]
      );
      const authorUsername = authorResult.rows[0]?.username || '用户';

      // 为所有其他用户创建新帖子通知
      Notification.createNewPostNotifications(
        post.id,
        userId,
        authorUsername,
        title
      ).catch(err => {
        console.error('创建通知失败:', err);
        console.error('错误详情:', err.message);
        console.error('错误堆栈:', err.stack);
        // 通知创建失败不影响帖子创建
      });

      // 异步站外邮件通知
      EmailService.sendNewPostNotificationEmails({
        recipients: recipientResult.rows,
        postTitle: title,
        postId: post.id,
        authorUsername,
        excerpt,
      }).catch(err => {
        console.error('发送站外新帖邮件失败:', err);
      });

      return res.status(201).json(formattedPost);
    } catch (error) {
      console.error('创建帖子错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '创建帖子失败',
      });
    }
  }

  // 更新帖子
  static async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      const { title, content, categoryId, tags } = req.body;

      // 检查帖子是否存在
      const post = await Post.findById(parseInt(postId));
      if (!post) {
        return res.status(404).json({
          error: 'POST_NOT_FOUND',
          message: '帖子不存在',
        });
      }

      // 检查权限（只有作者可以编辑）
      if (post.author_id !== userId) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: '无权限编辑此帖子',
        });
      }

      // 如果更新了分类，验证分类是否存在
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(400).json({
            error: 'CATEGORY_NOT_FOUND',
            message: '分类不存在',
          });
        }
      }

      // 更新帖子
      const updatedPost = await Post.update(parseInt(postId), {
        title,
        content,
        categoryId,
        tags,
      });

      // 获取标签
      const { query } = await import('../config/database.js');
      const tagsResult = await query(
        `SELECT t.id, t.name 
         FROM tags t
         JOIN post_tags pt ON t.id = pt.tag_id
         WHERE pt.post_id = $1`,
        [postId]
      );

      const formattedPost = await Post.formatPostDetail({
        ...updatedPost,
        tags: tagsResult.rows,
      }, userId);

      return res.status(200).json(formattedPost);
    } catch (error) {
      console.error('更新帖子错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '更新帖子失败',
      });
    }
  }

  // 点赞/取消点赞帖子
  static async toggleLike(req, res) {
    try {
      const userId = req.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: '请先登录',
        });
      }

      const post = await Post.findById(parseInt(postId));
      if (!post) {
        return res.status(404).json({
          error: 'POST_NOT_FOUND',
          message: '帖子不存在',
        });
      }

      const result = await Post.toggleLike(parseInt(postId), userId);

      return res.status(200).json({
        message: result.liked ? '点赞成功' : '已取消点赞',
        liked: result.liked,
        likeCount: result.likeCount,
      });
    } catch (error) {
      console.error('点赞操作错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '操作失败',
      });
    }
  }

  // 检查用户是否已点赞
  static async checkLikeStatus(req, res) {
    try {
      const userId = req.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(200).json({ liked: false });
      }

      const liked = await Post.hasUserLiked(parseInt(postId), userId);
      return res.status(200).json({ liked });
    } catch (error) {
      console.error('检查点赞状态错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '检查失败',
      });
    }
  }

  // 删除帖子
  static async deletePost(req, res) {
    try {
      const userId = req.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: '请先登录',
        });
      }

      // 检查帖子是否存在
      const post = await Post.findById(parseInt(postId));
      if (!post) {
        return res.status(404).json({
          error: 'POST_NOT_FOUND',
          message: '帖子不存在',
        });
      }

      // 检查权限（只有作者可以删除）
      if (post.author_id !== userId) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: '无权限删除此帖子',
        });
      }

      // 删除帖子
      await Post.delete(parseInt(postId));

      return res.status(200).json({
        message: '帖子删除成功',
      });
    } catch (error) {
      console.error('删除帖子错误:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: '删除帖子失败',
      });
    }
  }
}

export default PostController;

