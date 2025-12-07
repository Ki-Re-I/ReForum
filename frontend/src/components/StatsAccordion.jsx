import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import './StatsAccordion.css'

const StatsAccordion = ({ stats }) => {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="stats-accordion">
      <button
        className="stats-accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="stats-accordion-title">{t('profile.stats')}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <div className="stats-accordion-content">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.postCount || 0}</span>
              <span className="stat-label">{t('profile.posts')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.commentCount || 0}</span>
              <span className="stat-label">{t('profile.comments')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.receivedLikes || stats.likeCount || 0}</span>
              <span className="stat-label">{t('profile.likes')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {(() => {
                  const date = new Date(stats.joinDate)
                  const year = date.getFullYear()
                  const month = date.getMonth() + 1
                  const day = date.getDate()
                  return `${year}/${month}/${day}`
                })()}
              </span>
              <span className="stat-label">{t('profile.joinTime')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsAccordion

