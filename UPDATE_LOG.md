# REForum 更新日志

## 更新内容总览

本文档记录了 REForum 论坛系统的所有功能更新和修复。

---

## 最新更新：资料页移动端布局优化

### 修复内容
- ✅ **资料页响应式优化**：在手机和平板设备上，头像、统计信息与文案按列排布并居中显示
- ✅ **统计数据换行**：统计项在窄屏支持自动换行，避免文字拥挤或重叠
- ✅ **操作按钮位置调整**：删除按钮在小屏上保持合适边距，不遮挡帖子内容

### 修改文件
- `frontend/src/pages/UserProfile.css` - 新增响应式布局样式，优化统计区域与按钮位置
- `frontend/src/pages/Fixes.jsx` - 记录本次修复
- `frontend/src/pages/Changelog.jsx` - 更新版本日志

### 对用户的影响
- 移动端访问个人资料页时，内容排版更紧凑、易读，操作区域不再遮挡主要内容

---

## 最新更新：夜间模式开关

### 新增内容
- ✅ **夜间模式按钮**：在顶部导航的“发布”按钮旁新增夜间模式开关
- ✅ **主题记忆**：自动记住上次选择，刷新或切换页面后保持当前主题
- ✅ **局部优化**：夜间模式下优化导航栏、卡片、下拉菜单等对比度

### 修改文件
- `frontend/src/components/Header.jsx` - 添加夜间模式切换按钮、主题状态管理
- `frontend/src/components/Header.css` - 调整导航栏样式、增加夜间模式按钮样式
- `frontend/src/index.css` - 定义日间/夜间两套主题变量

### 使用说明
- 在导航栏点击“夜间模式/日间模式”按钮即可切换主题
- 切换后主题会立即生效，并保存在浏览器本地

---

## 最新更新：搜索结果命中率修复

### 修复内容
- ✅ **搜索结果命中率**：修复后端搜索接口在统计总数时缺少用户表关联，导致任何关键词都返回空列表的问题
- ✅ **查询一致性**：列表查询与总数统计共用同一套 `FROM + JOIN` 语句，确保标题、内容、作者搜索条件生效

### 修改文件
- `backend/models/Post.js` - 调整 `findAll` 方法，复用基础查询片段
- `frontend/src/pages/Fixes.jsx` - 新增搜索修复记录
- `frontend/src/pages/Changelog.jsx` - 新增搜索修复相关更新

### 对用户的影响
- 搜索框再次可用，输入任意关键词都会返回匹配的帖子列表
- 搜索排序、分页能力保持不变，体验更加可靠

---

## 最新更新：问题修复板块与图片地址修复

### 新增内容
- ✅ **问题修复板块**：在侧边栏新增“问题修复”，集中展示面向用户的缺陷修复说明
- ✅ **图片地址修复**：修复线上图片地址可能变成 `https://uploads/...` 导致无法加载的问题
- ✅ **清晰说明**：每个修复包含修复内容、细节与影响范围

### 修改文件
- `frontend/src/components/Sidebar.jsx` - 新增“问题修复”导航项
- `frontend/src/pages/Fixes.jsx` - 新建问题修复页面
- `frontend/src/pages/Fixes.css` - 问题修复页面样式
- `frontend/src/App.jsx` - 新增“问题修复”路由
- `frontend/src/components/ImageUpload.jsx`、`frontend/src/components/PostCard.jsx`、`frontend/src/pages/PostDetail.jsx` - 统一修复图片 URL 构造逻辑

### 修复说明（对用户）
- 现在发帖或浏览帖子时，图片能稳定显示；不会再出现图片地址以 `https://uploads/` 开头的情况
- “问题修复”页面会持续更新，便于了解近期修复的缺陷与影响范围

---

## 搜索功能

### 新增内容
- ✅ **搜索功能**：用户可以通过搜索框搜索帖子标题、内容和作者用户名
- ✅ **搜索结果页面**：创建了专门的搜索结果页面，显示搜索关键词和结果数量
- ✅ **搜索排序**：搜索结果支持按时间或热门排序
- ✅ **搜索分页**：搜索结果支持分页加载

### 技术实现
- **后端**：
  - 在 `Post.findAll` 方法中添加 `search` 参数支持
  - 使用 PostgreSQL 的 `ILIKE` 进行不区分大小写的模糊搜索
  - 搜索范围包括：帖子标题、帖子内容、作者用户名
- **前端**：
  - 创建 `Search.jsx` 搜索结果页面
  - 更新 `Header.jsx` 实现搜索跳转
  - 添加搜索相关的样式

### 修改文件
- `backend/models/Post.js` - 添加搜索参数支持
- `backend/controllers/postController.js` - 处理搜索参数
- `frontend/src/pages/Search.jsx` - 新建搜索结果页面
- `frontend/src/components/Header.jsx` - 实现搜索跳转
- `frontend/src/pages/Home.css` - 添加搜索结果样式
- `frontend/src/App.jsx` - 添加搜索路由
- `openapi.yaml` - 更新API文档，添加search参数

### 使用方法
1. 在顶部搜索框输入关键词
2. 按回车或点击搜索图标
3. 跳转到搜索结果页面，显示匹配的帖子
4. 可以切换"最新"或"热门"排序
5. 支持分页加载更多结果

---

## 1. 关于我们页面优化

### 修改内容
- ✅ 将"我们的使命"改为"初衷"
- ✅ 删除"技术栈"部分
- ✅ 修复"加入我们"板块排版
- ✅ 修复"联系我们"按钮的悬浮和点击样式

### 修改文件
- `frontend/src/pages/About.jsx`
- `frontend/src/pages/About.css`

---

## 2. 字体系统更新

### 修改内容
- ✅ 应用 Open Sans（正文）和 Poppins（标题）字体
- ✅ 整体字体加粗，提升可读性
  - 正文：font-weight 500
  - 标题：font-weight 700
  - 分隔符：font-weight 300 → 400

### 修改文件
- `frontend/index.html` - 添加 Google Fonts 链接
- `frontend/src/index.css` - 应用字体样式
- `frontend/src/components/Header.css` - Logo 字体

---

## 3. 帖子浏览和评论功能修复

### 修复内容
- ✅ **浏览次数去重**：同一用户或同一IP在24小时内只计算一次
- ✅ **评论数显示修复**：首页和详情页评论数显示一致
- ✅ **评论列表显示修复**：所有评论（包括回复）正确显示

### 技术实现
- 创建 `post_views` 表记录浏览历史
- 已登录用户：基于 user_id 去重
- 未登录用户：基于 IP 地址24小时内去重

### 新增文件
- `backend/migrations/add_post_views_table.sql` - 浏览记录表迁移脚本
- `backend/migrations/README.md` - 迁移说明

### 修改文件
- `backend/models/Post.js` - 添加 `comment_count` 计算，更新 `incrementViewCount` 方法
- `backend/controllers/postController.js` - 传递用户ID和IP地址
- `frontend/src/pages/PostDetail.jsx` - 使用 `post.commentCount` 显示评论数

---

## 4. 评论回复层级调整

### 修改内容
- ✅ 最大回复层级从 3 层改为 1 层
- ✅ 提示信息改为"别套娃了"

### 修改文件
- `frontend/src/components/CommentList.jsx` - maxDepth 改为 1
- `backend/models/Comment.js` - getReplies 方法 maxDepth 改为 1
- `backend/controllers/commentController.js` - 深度检查改为 >= 1

---

## 5. 用户协议和隐私政策页面

### 新增内容
- ✅ 创建用户协议页面（`/terms`）
- ✅ 创建隐私政策页面（`/privacy`）
- ✅ 更新注册模态框中的链接，指向实际页面

### 新增文件
- `frontend/src/pages/Terms.jsx` - 用户协议页面
- `frontend/src/pages/Terms.css` - 用户协议样式
- `frontend/src/pages/Privacy.jsx` - 隐私政策页面
- `frontend/src/pages/Privacy.css` - 隐私政策样式

### 修改文件
- `frontend/src/App.jsx` - 添加用户协议和隐私政策路由
- `frontend/src/components/RegisterModal.jsx` - 更新链接指向实际页面

### 页面内容
- **用户协议**：包含账户注册、用户行为规范、内容发布、知识产权、免责声明等条款
- **隐私政策**：包含信息收集、信息使用、信息共享、数据安全、Cookie使用、用户权利等内容

---

## 6. 图片上传功能

### 功能特点
- ✅ 支持选择和拖拽上传图片
- ✅ 支持多张图片上传（最多10张）
- ✅ 图片格式：JPEG、PNG、GIF、WebP
- ✅ 单张图片大小限制：5MB
- ✅ 实时预览上传的图片
- ✅ 支持删除已上传的图片
- ✅ 图片自动插入到帖子内容中（Markdown格式）
- ✅ 帖子详情页自动显示图片

### 新增文件
- `backend/middleware/upload.js` - Multer 文件上传中间件
- `backend/controllers/uploadController.js` - 图片上传控制器
- `backend/routes/upload.js` - 图片上传路由
- `frontend/src/components/ImageUpload.jsx` - 图片上传组件
- `frontend/src/components/ImageUpload.css` - 图片上传样式

### 修改文件
- `backend/package.json` - 添加 multer 依赖
- `backend/app.js` - 添加静态文件服务和上传路由
- `backend/Dockerfile` - 创建上传目录
- `docker-compose.yml` - 添加上传目录卷映射
- `frontend/src/pages/CreatePost.jsx` - 集成图片上传组件
- `frontend/src/pages/PostDetail.jsx` - 支持显示Markdown格式图片
- `frontend/src/pages/PostDetail.css` - 添加图片显示样式

### API 端点
```
POST /api/upload/image - 上传单个图片（需要认证）
POST /api/upload/images - 上传多个图片（需要认证）
GET /uploads/:filename - 访问上传的图片
```

### 技术实现
- 使用 Multer 处理文件上传
- 图片存储在 `backend/uploads` 目录
- 图片以 Markdown 格式 `![alt](url)` 插入到帖子内容中
- 前端解析 Markdown 图片语法并显示

---

## 7. 邮箱验证码注册功能

### 功能特点
- ✅ 6位数字验证码
- ✅ 验证码有效期5分钟
- ✅ 60秒内只能发送一次（防刷）
- ✅ 最多验证尝试5次
- ✅ 自动检查邮箱是否已注册
- ✅ 前端倒计时显示

### 新增文件
- `backend/services/verificationCodeService.js` - 验证码服务
- `backend/controllers/verificationController.js` - 验证码控制器

### 修改文件
- `backend/services/emailService.js` - 添加发送验证码邮件方法
- `backend/controllers/authController.js` - 注册时验证验证码
- `backend/routes/auth.js` - 添加发送验证码路由
- `backend/middleware/validation.js` - 添加验证码字段验证
- `frontend/src/components/RegisterModal.jsx` - 添加验证码输入和发送功能
- `frontend/src/services/api.js` - 添加发送验证码 API

### API 端点
```
POST /api/auth/send-verification-code - 发送验证码
POST /api/auth/register - 注册（需要验证码）
```

---

## 配置要求

### 环境变量
```env
# Resend 邮件服务（用于发送验证码）
RESEND_API_KEY=re_your_resend_api_key
```

### 数据库迁移
运行以下 SQL 脚本创建浏览记录表：
```bash
psql -U your_username -d forum_db -f backend/migrations/add_post_views_table.sql
```

---

## 注意事项

1. **验证码存储**：当前使用内存存储，服务重启后会丢失。生产环境建议使用 Redis
2. **邮件服务**：需要在 Resend 控制台配置发件域名
3. **数据库迁移**：部署前需要运行浏览记录表的迁移脚本

---

## 8. 数据库管理脚本

### 新增内容
- ✅ 创建清空所有数据的 SQL 脚本
- ✅ 提供多种执行方式（直接 SQL、Bash、PowerShell、Docker）
- ✅ 自动重置序列和恢复初始分类

### 新增文件
- `backend/scripts/clear_all_data.sql` - 核心 SQL 脚本
- `backend/scripts/clear_all_data.sh` - Bash 执行脚本
- `backend/scripts/clear_all_data.ps1` - PowerShell 执行脚本
- `backend/scripts/clear_all_data_docker.sh` - Docker 执行脚本
- `backend/scripts/README.md` - 使用说明文档

### 功能说明
- 按外键依赖顺序删除所有表的数据
- 保留表结构，只清空数据
- 自动重置所有序列（ID 从 1 开始）
- 自动恢复默认的 4 个分类
- 提供交互式确认，防止误操作

### 使用方法
```bash
# 方法 1: 直接执行 SQL
psql -U HuangWeiLong -d forum_db -f backend/scripts/clear_all_data.sql

# 方法 2: 使用 Docker
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/scripts/clear_all_data.sql

# 方法 3: 使用脚本（需要执行权限）
chmod +x backend/scripts/clear_all_data.sh
./backend/scripts/clear_all_data.sh
```

### ⚠️ 警告
**此脚本会永久删除所有数据，请谨慎使用！建议先备份数据库。**

---

## 9. 帖子点赞功能

### 功能特点
- ✅ 用户可以点赞/取消点赞帖子
- ✅ 防止重复点赞（同一用户对同一帖子只能点赞一次）
- ✅ 实时更新点赞数
- ✅ 显示用户是否已点赞（已点赞显示红色实心图标）
- ✅ 在首页和详情页都可以点赞
- ✅ 未登录用户提示需要登录

### 新增文件
- `backend/migrations/add_post_likes_table.sql` - 点赞记录表迁移脚本

### 修改文件
- `backend/models/Post.js` - 添加点赞相关方法（toggleLike, getLikeCount, hasUserLiked），更新formatPostListItem和formatPostDetail支持点赞状态
- `backend/controllers/postController.js` - 添加点赞和检查点赞状态的控制器方法
- `backend/routes/posts.js` - 添加点赞相关路由
- `frontend/src/services/api.js` - 添加点赞API方法
- `frontend/src/components/PostCard.jsx` - 添加点赞按钮和逻辑
- `frontend/src/components/PostCard.css` - 添加点赞按钮样式
- `frontend/src/pages/PostDetail.jsx` - 添加点赞按钮和逻辑
- `frontend/src/pages/PostDetail.css` - 添加点赞按钮样式
- `openapi.yaml` - 添加点赞API文档

### API 端点
```
POST /api/posts/:postId/like - 点赞/取消点赞帖子（需要认证）
GET /api/posts/:postId/like - 检查用户是否已点赞（需要认证）
```

### 数据库迁移
运行以下 SQL 脚本创建点赞记录表：
```bash
psql -U your_username -d forum_db -f backend/migrations/add_post_likes_table.sql
```

### 技术实现
- 使用 `post_likes` 表记录点赞关系，通过唯一约束防止重复点赞
- 点赞时自动更新帖子的 `like_count` 字段
- 前端实时显示点赞状态和数量
- 已点赞的帖子显示红色实心心形图标，未点赞显示空心图标

---

## 10. 帖子删除功能

### 功能特点
- ✅ 用户可以在自己的资料页面删除自己发布的帖子
- ✅ 只有帖子作者可以删除自己的帖子
- ✅ 删除前需要确认，防止误操作
- ✅ 删除成功后自动更新帖子列表和用户统计
- ✅ 删除帖子后自动刷新标签列表（隐藏没有关联帖子的标签）

### 修改文件
- `backend/controllers/postController.js` - 添加 `deletePost` 方法
- `backend/routes/posts.js` - 启用删除帖子路由
- `frontend/src/services/api.js` - 添加 `deletePost` API 方法
- `frontend/src/pages/UserProfile.jsx` - 添加删除按钮和功能
- `frontend/src/pages/UserProfile.css` - 添加删除按钮样式
- `frontend/src/components/RightSidebar.jsx` - 添加删除帖子后自动刷新标签列表的功能
- `openapi.yaml` - 添加删除帖子API文档

### API 端点
```
DELETE /api/posts/:postId - 删除帖子（需要认证，仅限作者）
```

### 技术实现
- 后端验证用户身份和帖子所有权
- 前端在用户资料页面显示删除按钮（仅对自己的帖子）
- 删除成功后触发 `postDeleted` 事件，通知其他组件刷新
- 标签列表自动过滤掉 `postCount` 为 0 的标签

---

## 11. 热门排序优化

### 修改内容
- ✅ 热门排序改为按照点赞数量降序排列
- ✅ 点赞数相同的按创建时间降序排列

### 修改文件
- `backend/models/Post.js` - 修改热门排序逻辑

### 排序规则
- **原逻辑**：`(view_count + like_count * 2) DESC`（综合浏览量和点赞数）
- **新逻辑**：`like_count DESC, created_at DESC`（仅按点赞数，相同点赞数按时间）

---

## 12. 联系我们页面优化

### 修改内容
- ✅ 将 GitHub 和 LinkedIn 替换为 QQ 和微信联系方式
- ✅ 添加管理员头像显示功能（支持实际照片）
- ✅ 统一图标样式为空心图标
- ✅ 优化排版对齐

### 修改文件
- `frontend/src/pages/Contact.jsx` - 更新联系方式数据，添加头像显示逻辑
- `frontend/src/pages/Contact.css` - 添加头像图片样式
- `frontend/src/index.css` - 添加错误颜色变量

### 图标使用
- 邮箱：`FaRegEnvelope`（空心）
- 用户：`FaRegUser`（空心）
- QQ：`RiQqLine`（Remix Icon 空心）
- 微信：`FaRegComments`（空心）

### 头像配置
- 头像图片路径：`/avatars/admin1.jpg` 和 `/avatars/admin2.jpg`
- 图片应放置在 `frontend/public/avatars/` 目录
- 如果图片加载失败，自动显示默认用户图标

---

## 13. 界面优化

### 修改内容
- ✅ 删除右侧边栏中的"数据加载中，请稍候"提示文本
- ✅ 简化空状态显示

### 修改文件
- `frontend/src/components/RightSidebar.jsx` - 移除多余的加载提示文本

---

## 更新日期

2025/11/13

