import React from 'react'
import './Fixes.css'

const fixes = [
  {
    date: '2025-11-13',
    title: '问题修复列表排版统一',
    description: '针对不同屏幕宽度下卡片间距和内容对齐不一致的问题进行统一调整。',
    details: [
      '列表布局改为自适应网格，保证组件在桌面和移动端都能保持整齐排列',
      '卡片内的标题、描述、要点间距重新梳理，统一行高与留白'
    ],
  },
  {
    date: '2025-11-13',
    title: '夜间模式下问题修复页面与下拉菜单不可见',
    description: '修复夜间主题下问题修复页面卡片与发帖页板块下拉选项的文字对比度过低问题。',
    details: [
      '问题修复卡片与辅助文本改用主题色变量，确保夜间模式下保持对比度',
      '板块下拉菜单的选项继承主题文字颜色，在深色背景上清晰显示'
    ],
  },
  {
    date: '2025-11-13',
    title: '夜间模式下输入内容不易辨认',
    description: '优化发帖页在夜间模式的输入框颜色，确保文字和占位提示清晰可见。',
    details: [
      '调整标题、内容等输入组件的文字与提示色为夜间主题的主次文本色',
      '统一下拉选择器的前景色，避免切换主题后出现暗色背景深色文字'
    ],
  },
  {
    date: '2025-11-13',
    title: '导航按钮在小屏显示异常',
    description: '修复顶部导航在移动端出现按钮排成竖排、文字被压缩的问题。',
    details: [
      '为夜间模式和发布按钮添加白空间控制，避免文字竖排显示',
      '在中小屏幕下让按钮自动换行、居中排列，并在极小屏幕只显示主题图标'
    ],
  },
  {
    date: '2025-11-13',
    title: '移动端资料页排版错乱',
    description: '修复用户资料页在窄屏下的布局问题，统计信息和头像现在会居中并按行排列。',
    details: [
      '为资料页头部和统计数据添加响应式布局，窄屏下自动换行并居中',
      '调整删除按钮间距，确保在小屏幕上不遮挡帖子内容'
    ],
  },
  {
    date: '2025-11-13',
    title: '搜索结果无法匹配关键词',
    description: '修复搜索接口统计总数时缺少用户表关联，导致搜索结果始终为空的问题。',
    details: [
      '统一列表查询与总数统计使用的 FROM/JOIN 语句，确保搜索条件引用的作者信息存在',
      '保持搜索条件支持标题、内容、作者用户名的模糊匹配',
    ],
  },
  {
    date: '2025-11-13',
    title: '图片加载跨域策略导致无法显示',
    description: '修复因安全策略限制导致的图片“NotSameOrigin”报错，图片现在可正常加载。',
    details: [
      '后端调整安全头：允许跨源资源加载（设置 crossOriginResourcePolicy 为 cross-origin，关闭 crossOriginEmbedderPolicy）',
      '规范 Nginx 反向代理写法：为 / 与 /uploads/ 使用带结尾斜杠的 proxy_pass，避免重定向与路径拼接问题'
    ],
  },
  {
    date: '2025-11-13',
    title: '图片地址异常（https://uploads/ 开头）',
    description: '修复生产环境下图片地址拼接错误，导致图片无法加载的问题。',
    details: [
      '统一使用后端域名的 origin 拼接图片路径，避免出现 https://uploads/... 错误地址',
      '适配开发/生产两种环境，开发走 Vite 代理，生产走 API 基址',
    ],
  },
  {
    date: '2025-11-12',
    title: '删除帖子后标签仍显示',
    description: '在删除帖子后，标签列表会自动刷新并过滤掉无帖子标签。',
    details: [
      '在个人主页删除帖子后分发 postDeleted 事件',
      '右侧栏监听事件并重新拉取标签，过滤 postCount=0 的标签',
    ],
  },
]

export default function Fixes() {
  return (
    <div className="fixes-page">
      <h1 className="fixes-title">问题修复</h1>
      <p className="fixes-subtitle">这里汇总近期的缺陷修复，简要说明修复背景与处理方式。</p>

      <div className="fixes-list">
        {fixes.map((fix, idx) => (
          <article className="fix-card" key={idx}>
            <div className="fix-header">
              <span className="fix-date">{fix.date}</span>
              <h2 className="fix-name">{fix.title}</h2>
            </div>
            <p className="fix-desc">{fix.description}</p>
            {fix.details && fix.details.length > 0 && (
              <ul className="fix-details">
                {fix.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}


