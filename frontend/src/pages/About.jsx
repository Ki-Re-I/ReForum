import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './About.css'

const aboutContent = {
  zh: {
    title: '关于我们',
    sections: [
      {
        heading: '欢迎来到 REForum',
        body: '一个交流分享的社区',
      },
      {
        heading: '为什么想造这么一个网站',
        body: '因为想造一个',
      },
      {
        heading: '与我们共建',
        body: '如果你想的话',
        cta: '前往联系我们',
      },
    ],
  },
  en: {
    title: 'About Us',
    sections: [
      {
        heading: 'Welcome to REForum',
        body: 'A community for sharing and discussion',
      },
      {
        heading: 'Why We Built This Website',
        body: 'Because we wanted to build one',
      },
      {
        heading: 'Build With Us',
        body: 'If you want to',
        cta: 'Go to Contact Page',
      },
    ],
  },
  ja: {
    title: '私たちについて',
    sections: [
      {
        heading: 'REForum へようこそ',
        body: '共有と議論のためのコミュニティ',
      },
      {
        heading: 'なぜこのウェブサイトを作ったのか',
        body: '作りたかったから',
      },
      {
        heading: '一緒に作りましょう',
        body: 'もしあなたが望むなら',
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
      <div className="about-header">
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
  )
}

export default About

