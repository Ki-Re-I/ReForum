import React from 'react'
import { FaRegEnvelope, FaRegUser } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './Contact.css'

const contributors = [
  {
    name: {
      zh: '黄伟隆',
      en: 'Huang Weilong',
      ja: '黄偉隆',
    },
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
    },
  },
  {
    name: {
      zh: '江海鹏',
      en: 'Jiang Haipeng',
      ja: '江海鵬',
    },
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
    },
  },
]

const contactCopy = {
  zh: {
    title: '联系我们',
    contributorsTitle: '项目贡献者',
    description: '如有想法、合作与问题反馈，欢迎使用以下方式与我们交流。',
    emailTitle: '发送邮件',
  },
  en: {
    title: 'Contact Us',
    contributorsTitle: 'Core Contributors',
    description:
      'Have feedback, partnership ideas, or bug reports? Reach us through the channel below.',
    emailTitle: 'Send email',
  },
  ja: {
    title: 'お問い合わせ',
    contributorsTitle: '主要メンバー',
    description: 'ご意見やご提案、不具合の報告などがあれば、以下の方法でお気軽にご連絡ください。',
    emailTitle: 'メールを送信',
  },
}

const Contact = () => {
  const { language } = useLanguage()
  const copy = contactCopy[language] || contactCopy.zh

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>{copy.title}</h1>
        <p className="contact-intro">{copy.description}</p>
      </div>

      <div className="contributors-section">
        <h2 className="contributors-title">{copy.contributorsTitle}</h2>
        <div className="contributors-grid">
              {contributors.map((contributor) => {
                const contributorName = typeof contributor.name === 'string' 
                  ? contributor.name 
                  : contributor.name[language] || contributor.name.zh
                const contributorKey = typeof contributor.name === 'string'
                  ? contributor.name
                  : contributor.name.zh
                
                return (
                <div key={contributorKey} className="contributor-card">
                  <div className="contributor-avatar">
                    {contributor.avatar ? (
                      <img
                        src={contributor.avatar}
                        alt={contributorName}
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
                    <h3 className="contributor-name">{contributorName}</h3>
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
                  </div>
                </div>
                )
              })}
        </div>
      </div>
    </div>
  )
}

export default Contact
