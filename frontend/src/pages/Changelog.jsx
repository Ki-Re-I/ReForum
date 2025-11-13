import React from 'react'
import { format } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import './Changelog.css'

const Changelog = () => {
  const updates = [
    {
      date: '2025-11-13',
      version: '1.2.5',
      title: '问题修复页排版统一',
      description: '优化问题修复列表在不同屏幕下的排版，并移除多余的“对你的影响”描述。',
      features: [
        '卡片改为自适应网格布局，桌面与移动端间距一致',
        '统一卡片内标题、正文、要点的行高与留白',
        '移除冗余的影响说明，让内容更聚焦修复本身'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.2.4',
      title: '夜间模式卡片与下拉可读性修复',
      description: '确保夜间主题下的问题修复页面与发帖页板块选择器内容保持清晰对比。',
      features: [
        '问题修复卡片、日期条、备注等组件使用主题变量渲染，适配深浅色背景',
        '板块下拉选项继承主题文字颜色，在夜间模式下也能正常阅读'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.2.3',
      title: '夜间模式表单可读性优化',
      description: '调整发帖页在夜间模式下的输入框颜色，让文字与占位提示在深色背景上保持对比度。',
      features: [
        '输入框、下拉框文字切换为夜间主题主色，避免出现“黑底黑字”',
        '占位提示使用次级文本色，确保提示信息仍可辨认',
        '统一表单控件的响应式样式，夜间、日间切换更自然'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.2.2',
      title: '导航按钮响应式修复',
      description: '针对移动端优化顶部导航按钮排布，避免按钮挤成竖排或文字竖向显示。',
      features: [
        '按钮支持在中小屏自动换行居中，保证手指操作空间',
        '夜间模式按钮保持横向排版，小屏仅显示图标以节省空间',
        '整体导航在 576px 以下自动收窄，但仍保留搜索入口'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.2.1',
      title: '资料页移动端布局优化',
      description: '针对移动端做了资料页的排版调整，统计信息和头像在窄屏上也能整齐展示。',
      features: [
        '资料页头部在小屏自动堆叠并居中，信息读取更轻松',
        '统计卡片支持换行排列，不再出现拥挤或重叠',
        '删除按钮位置微调，避免遮挡帖子内容'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.2.0',
      title: '一键夜间模式',
      description: '在发布按钮旁新增夜间模式开关，可在日间/夜间视觉之间随时切换。',
      features: [
        '新增夜间模式按钮，支持记住上次选择并跨页面生效',
        '夜间模式优化页面背景、文字、卡片与导航栏对比度',
        '同样适用于未登录用户，体验一致'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.1.1',
      title: '搜索结果命中率修复',
      description: '修复搜索接口统计逻辑，确保输入任意关键词都能返回匹配的帖子。',
      features: [
        '统一查询与统计的 JOIN 语句，避免遗漏作者信息导致的空结果',
        '保留标题、内容、作者用户名的模糊匹配能力，搜索体验更准确'
      ]
    },
    {
      date: '2025-11-13',
      version: '1.1.0',
      title: '新增「问题修复」板块',
      description: '在侧边栏新增“问题修复”入口，集中展示近期的缺陷修复。',
      features: [
        '清晰说明每次修复的内容与影响范围',
        '首批收录：图片地址异常（https://uploads/ 开头）已修复；删除帖子后标签仍显示已修复'
      ]
    },
    {
      date: '2025-11-12',
      version: '1.0.0',
      title: '搜索功能上线',
      description: '现在你可以通过搜索框快速找到感兴趣的帖子了！',
      features: [
        '支持搜索帖子标题、内容和作者用户名',
        '搜索结果页面显示匹配的帖子数量',
        '支持按"最新"或"热门"排序搜索结果',
        '搜索结果支持分页加载'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.9.0',
      title: '图片上传功能',
      description: '发帖时可以上传图片，让内容更生动！',
      features: [
        '支持选择和拖拽上传图片',
        '最多可上传10张图片',
        '实时预览上传的图片',
        '可以删除已上传的图片',
        '支持 JPEG、PNG、GIF、WebP 格式',
        '单张图片大小限制 5MB'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.8.0',
      title: '帖子点赞功能',
      description: '为你喜欢的帖子点个赞吧！',
      features: [
        '可以点赞或取消点赞帖子',
        '实时显示点赞数量',
        '已点赞的帖子会显示红色心形图标',
        '防止重复点赞'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.7.0',
      title: '帖子管理功能',
      description: '更好的帖子管理体验',
      features: [
        '可以在个人资料页面删除自己发布的帖子',
        '删除前需要确认，防止误操作',
        '删除后自动更新统计数据'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.6.0',
      title: '邮箱验证注册',
      description: '注册更安全，需要邮箱验证码',
      features: [
        '注册时需要邮箱验证码',
        '验证码有效期5分钟',
        '60秒内只能发送一次验证码',
        '防止恶意注册'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.5.0',
      title: '界面优化',
      description: '更美观、更易用的界面',
      features: [
        '全新的现代化设计风格',
        '更好的响应式布局',
        '优化字体显示，提升可读性',
        '更流畅的交互动画'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.4.0',
      title: '浏览统计优化',
      description: '更准确的浏览量统计',
      features: [
        '同一用户或IP在24小时内只计算一次浏览量',
        '防止浏览量虚高',
        '更真实的数据统计'
      ]
    },
    {
      date: '2025-11-12',
      version: '0.3.0',
      title: '用户协议和隐私政策',
      description: '完善的法律条款',
      features: [
        '新增用户协议页面',
        '新增隐私政策页面',
        '注册时需要同意相关条款'
      ]
    }
  ]

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: zhCN })
    } catch {
      return dateString
    }
  }

  return (
    <div className="changelog-page">
      <div className="changelog-header">
        <h1>更新日志</h1>
        <p className="changelog-intro">
          这里记录了 REForum 的所有功能更新和改进。我们会持续优化，为你带来更好的使用体验。
        </p>
      </div>

      <div className="changelog-list">
        {updates.map((update, index) => (
          <div key={index} className="changelog-item">
            <div className="changelog-item-header">
              <div className="changelog-item-title-section">
                <h2 className="changelog-item-title">{update.title}</h2>
                <span className="changelog-item-version">v{update.version}</span>
              </div>
              <span className="changelog-item-date">{formatDate(update.date)}</span>
            </div>
            <p className="changelog-item-description">{update.description}</p>
            <ul className="changelog-item-features">
              {update.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="changelog-footer">
        <p>感谢使用 REForum！如有问题或建议，欢迎通过"联系我们"页面反馈。</p>
      </div>
    </div>
  )
}

export default Changelog

