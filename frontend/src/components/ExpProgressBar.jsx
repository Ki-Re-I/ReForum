import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getLevelProgress, getExpToNextLevel, getLevelFromExp } from '../utils/levelSystem'
import { getUserExp } from '../utils/dailyTasks'
import './ExpProgressBar.css'

const ExpProgressBar = ({ user = null }) => {
  const { t } = useLanguage()
  const userExp = getUserExp(user)
  const level = getLevelFromExp(userExp)
  const progress = getLevelProgress(userExp)
  const expToNext = getExpToNextLevel(userExp)

  // 如果是70级，显示满级状态
  if (level >= 70) {
    return (
      <div className="exp-progress-bar">
        <div className="exp-progress-header">
          <span className="exp-label">{t('profile.exp')}</span>
          <span className="exp-status">{t('profile.maxLevel')}</span>
        </div>
        <div className="exp-progress-container">
          <div className="exp-progress-fill" style={{ width: '100%' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="exp-progress-bar">
      <div className="exp-progress-header">
        <span className="exp-label">{t('profile.exp')}</span>
        <span className="exp-status">
          {expToNext} {t('profile.expToNext')}
        </span>
      </div>
      <div className="exp-progress-container">
        <div 
          className="exp-progress-fill" 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <div className="exp-progress-text">
        {Math.round(progress * 100)}% {t('profile.toNextLevel')}
      </div>
    </div>
  )
}

export default ExpProgressBar

