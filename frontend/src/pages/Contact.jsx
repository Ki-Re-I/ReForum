import React from 'react'
import { FaRegEnvelope, FaRegUser, FaRegComments } from 'react-icons/fa'
import { RiQqLine } from 'react-icons/ri'
import { useLanguage } from '../context/LanguageContext'
import './Contact.css'

const QqIcon = RiQqLine

const contributors = [
  {
    name: '黄伟隆',
    avatar: '/avatars/admin1.jpg',
    role: {
      zh: '项目负责人',
      en: 'Project Lead',
      ja: 'プロジェクト責任者',
    },
    bio: {
      zh: '负责社区方向规划、核心体验设计与上线节奏。',
      en: 'Oversees community roadmap, UX decisions, and release cadence.',
      ja: 'コミュニティの方向性や体験設計、リリース計画を統括。',
    },
    contacts: {
      email: '3571676852@qq.com',
      qq: '3571676852',
      wechat: 'X15021373202',
    },
  },
  {
    name: '江海鹏',
    avatar: '/avatars/admin2.jpg',
    role: {
      zh: '开发工程师',
      en: 'Software Engineer',
      ja: 'ソフトウェアエンジニア',
    },
    bio: {
      zh: '主导技术评审与主题重构，关注性能与可维护性。',
      en: 'Leads technical reviews and visual refreshes with focus on performance.',
      ja: '技術レビューとテーマ刷新を担当し、パフォーマンス向上に注力。',
    },
    contacts: {
      email: '3242772908@qq.com',
      qq: '3242772908',
      wechat: 'jhp061224',
    },
  },
]

const contactCopy = {
  zh: {
    title: '联系我们',
    contributorsTitle: '项目贡献者',
    description: '如有想法、合作与问题反馈，欢迎使用以下任意方式与我们交流。',
    emailTitle: '发送邮件',
    qqTitle: 'QQ',
    wechatTitle: '微信',
    qqCopied: 'QQ号 {value} 已复制到剪贴板',
    wechatCopied: '微信号 {value} 已复制到剪贴板',
  },
  en: {
    title: 'Contact Us',
    contributorsTitle: 'Core Contributors',
    description:
      'Have feedback, partnership ideas, or bug reports? Reach us through any channel below.',
    emailTitle: 'Send email',
    qqTitle: 'QQ',
    wechatTitle: 'WeChat',
    qqCopied: 'QQ number {value} copied to your clipboard.',
    wechatCopied: 'WeChat ID {value} copied to your clipboard.',
  },
  ja: {
    title: 'お問い合わせ',
    contributorsTitle: '主要メンバー',
    description: 'ご意見やご提案、不具合の報告などがあれば、以下の方法でお気軽にご連絡ください。',
    emailTitle: 'メールを送信',
    qqTitle: 'QQ',
    wechatTitle: 'WeChat',
    qqCopied: 'QQ番号 {value} をクリップボードにコピーしました。',
    wechatCopied: 'WeChat ID {value} をクリップボードにコピーしました。',
  },
}

const formatTemplate = (template, value) => template.replace('{value}', value)

const Contact = () => {
  const { language } = useLanguage()
  const copy = contactCopy[language] || contactCopy.zh

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <FaRegEnvelope className="contact-icon" />
          <h1>{copy.title}</h1>
        </div>

        <div className="contact-content">
          <div className="contributors-section">
            <h2>{copy.contributorsTitle}</h2>
            <p className="section-description">{copy.description}</p>

            <div className="contributors-grid">
              {contributors.map((contributor) => (
                <div key={contributor.name} className="contributor-card">
                  <div className="contributor-avatar">
                    {contributor.avatar ? (
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="avatar-image"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          const icon = e.target.parentElement.querySelector('.avatar-icon')
                          if (icon) {
                            icon.style.display = 'flex'
                          }
                        }}
                      />
                    ) : null}
                    <FaRegUser
                      className="avatar-icon"
                      style={{ display: contributor.avatar ? 'none' : 'flex' }}
                    />
                  </div>
                  <div className="contributor-info">
                    <h3 className="contributor-name">{contributor.name}</h3>
                    <p className="contributor-role">
                      {contributor.role[language] || contributor.role.zh}
                    </p>
                    {contributor.bio?.[language] && (
                      <p className="contributor-bio">
                        {contributor.bio[language] || contributor.bio.zh}
                      </p>
                    )}
                  </div>
                  <div className="contributor-contacts">
                    <a
                      href={`mailto:${contributor.contacts.email}`}
                      className="contact-link"
                      title={copy.emailTitle}
                    >
                      <FaRegEnvelope className="contact-link-icon" />
                      <span>{contributor.contacts.email}</span>
                    </a>
                    {contributor.contacts.qq && (
                      <div
                        className="contact-link"
                        title={copy.qqTitle}
                        onClick={() => {
                          navigator.clipboard.writeText(contributor.contacts.qq)
                          alert(formatTemplate(copy.qqCopied, contributor.contacts.qq))
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <QqIcon className="contact-link-icon" />
                        <span>
                          {copy.qqTitle}: {contributor.contacts.qq}
                        </span>
                      </div>
                    )}
                    {contributor.contacts.wechat && (
                      <div
                        className="contact-link"
                        title={copy.wechatTitle}
                        onClick={() => {
                          navigator.clipboard.writeText(contributor.contacts.wechat)
                          alert(formatTemplate(copy.wechatCopied, contributor.contacts.wechat))
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <FaRegComments className="contact-link-icon" />
                        <span>
                          {copy.wechatTitle}: {contributor.contacts.wechat}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
