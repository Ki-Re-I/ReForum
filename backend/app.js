import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import pool from './config/database.js';

// 导入路由
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import categoryRoutes from './routes/categories.js';
import tagRoutes from './routes/tags.js';
import uploadRoutes from './routes/upload.js';
import notificationRoutes from './routes/notifications.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 加载环境变量
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// 信任代理（用于正确获取客户端真实IP地址）
app.set('trust proxy', true);

// 安全中间件（允许跨域加载资源，如图片）
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  // 关闭 COEP，避免与跨域资源加载冲突
  crossOriginEmbedderPolicy: false
}));

// CORS 配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（用于提供上传的图片）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 速率限制 - 放宽限制以避免正常使用时的误拦截
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 500, // 限制每个 IP 15 分钟内最多 500 个请求（从100增加到500）
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: '请求过于频繁，请稍后再试',
  },
  standardHeaders: true, // 返回速率限制信息到 `RateLimit-*` 头
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 头
});
app.use('/api/', limiter);

// 健康检查
app.get('/health', async (req, res) => {
  try {
    // 测试数据库连接
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      message: '服务运行正常',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: '数据库连接失败',
      database: 'disconnected',
    });
  }
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes); // 评论路由：/api/posts/:postId/comments 和 /api/comments/:commentId/reply
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: '请求的资源不存在',
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  
  // 如果是验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: '请求参数验证失败',
      details: err.message,
    });
  }

  // 如果是数据库错误
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      error: 'DATABASE_ERROR',
      message: '数据操作失败',
      details: '请检查数据格式和约束',
    });
  }

  // 默认错误响应
  res.status(err.status || 500).json({
    error: 'INTERNAL_ERROR',
    message: err.message || '服务器内部错误',
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📡 API 地址: http://localhost:${PORT}/api`);
  console.log(`💚 健康检查: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  await pool.end();
  process.exit(0);
});

export default app;

