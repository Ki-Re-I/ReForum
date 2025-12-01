import React from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './About.css'

const aboutContent = {
  zh: {
    title: '关于我们',
    sections: [
      {
        heading: '欢迎来到 REForum',
        body:
          'REForum 是一个现代化的交流社区，聚焦于“分享、讨论、共创”。我们相信每一个灵感都值得被看见，也相信友好而开放的讨论氛围能够激发更多可能。',
      },
      {
        heading: '我们的初衷',
        body:
          '构建一个安全、尊重、多元的线上社区。无论你是技术爱好者、创作者，还是只是想记录想法的普通用户，都能在这里找到共鸣。',
      },
      {
        heading: '与我们同行',
        body:
          '如果你愿意与我们一起改进产品、共建社区，欢迎随时联系。我们乐于听见每一条建议，并会尽快回复。',
        cta: '前往联系我们',
      },
    ],
  },
  en: {
    title: 'About Us',
    sections: [
      {
        heading: 'Welcome to REForum',
        body:
          'REForum is a modern community forum where sharing, discussion, and co‑creation happen every day. Every perspective matters, and we aim to provide a calm, thoughtful place to exchange ideas.',
      },
      {
        heading: 'Why We Built It',
        body:
          'We want a respectful, inclusive, and helpful community space. Whether you are into technology, creativity, or simply documenting your thoughts, you can always find like‑minded people here.',
      },
      {
        heading: 'Build With Us',
        body:
          'Have feedback, questions, or want to shape the roadmap together? Reach out anytime—we review every message carefully and respond as quickly as we can.',
        cta: 'Go to Contact Page',
      },
    ],
  },
  ja: {
    title: '私たちについて',
    sections: [
      {
        heading: 'REForum へようこそ',
        body:
          'REForum は、共有・議論・共創のためのモダンなコミュニティです。ひとつひとつのアイデアに価値があると信じ、落ち着いて意見交換できる場所を目指しています。',
      },
      {
        heading: '立ち上げた理由',
        body:
          '安心・尊重・多様性を大切にするオンラインコミュニティを作りたい。テクノロジーが好きな方も、クリエイターも、ちょっとしたメモを書きたい人も、ここで仲間を見つけられます。',
      },
      {
        heading: '一緒に成長しましょう',
        body:
          'プロダクトへの提案やご質問があればいつでもご連絡ください。皆さまの声を丁寧に受け止め、できるだけ早くお返事します。',
        cta: 'お問い合わせページへ',
      },
    ],
  },
}

const About = () => {
  const { language } = useLanguage()
  const copy = aboutContent[language] || aboutContent.zh

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <FaInfoCircle className="about-icon" />
          <h1>{copy.title}</h1>
        </div>

        <div className="about-content">
          {copy.sections.map((section, index) => (
            <section className="about-section" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.cta && (
                <div className="contact-button-container">
                  <a href="/contact" className="contact-button">
                    {section.cta}
                  </a>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About

