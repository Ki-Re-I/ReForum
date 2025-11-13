import React from 'react'
import './Fixes.css'

const fixes = [
  {
    date: '2025-11-13',
    title: '图片地址异常（https://uploads/ 开头）',
    description: '修复生产环境下图片地址拼接错误，导致图片无法加载的问题。',
    details: [
      '统一使用后端域名的 origin 拼接图片路径，避免出现 https://uploads/... 错误地址',
      '适配开发/生产两种环境，开发走 Vite 代理，生产走 API 基址',
    ],
    impact: '现在发帖或预览中的图片都能正常显示了。',
  },
  {
    date: '2025-11-12',
    title: '删除帖子后标签仍显示',
    description: '在删除帖子后，标签列表会自动刷新并过滤掉无帖子标签。',
    details: [
      '在个人主页删除帖子后分发 postDeleted 事件',
      '右侧栏监听事件并重新拉取标签，过滤 postCount=0 的标签',
    ],
    impact: '标签列表与实际帖子数量保持一致。',
  },
]

export default function Fixes() {
  return (
    <div className="fixes-page">
      <h1 className="fixes-title">问题修复</h1>
      <p className="fixes-subtitle">这里汇总每次已对用户产生影响的缺陷修复，用通俗易懂的方式说明修复内容与影响范围。</p>

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
            {fix.impact && (
              <div className="fix-impact">
                <strong>对你的影响：</strong>{' '}
                <span>{fix.impact}</span>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}


