import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './AgeVerification.css'

const MIN_AGE = 18

const AgeVerification = () => {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // 检查是否已经验证过年龄
    const ageVerified = localStorage.getItem('age-verified')
    if (!ageVerified) {
      setShow(true)
    }
  }, [])

  const calculateAge = (birthYear, birthMonth, birthDay) => {
    const today = new Date()
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleVerify = () => {
    setError('')
    
    if (!year || !month || !day) {
      setError(t('age.error.required'))
      return
    }

    const yearNum = parseInt(year, 10)
    const monthNum = parseInt(month, 10)
    const dayNum = parseInt(day, 10)

    if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
      setError(t('age.error.invalid'))
      return
    }

    // 验证日期有效性
    const date = new Date(yearNum, monthNum - 1, dayNum)
    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getDate() !== dayNum
    ) {
      setError(t('age.error.invalid'))
      return
    }

    // 验证年份范围（不能是未来，也不能太早）
    const currentYear = new Date().getFullYear()
    if (yearNum > currentYear || yearNum < currentYear - 120) {
      setError(t('age.error.invalid'))
      return
    }

    const age = calculateAge(yearNum, monthNum, dayNum)

    if (age < MIN_AGE) {
      setError(t('age.error.underage'))
      return
    }

    // 年龄验证通过
    localStorage.setItem('age-verified', 'true')
    localStorage.setItem('age-verified-date', new Date().toISOString())
    setShow(false)
  }

  const handleExit = () => {
    // 如果用户选择退出，可以重定向到其他页面或显示提示
    window.location.href = 'https://www.google.com'
  }

  if (!show) return null

  // 生成年份选项（当前年份往前120年）
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 120; i--) {
    years.push(i)
  }

  // 生成月份选项
  const months = []
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }

  // 生成日期选项（1-31）
  const days = []
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-modal">
        <div className="age-verification-content">
          <div className="age-verification-icon">🔞</div>
          <h2 className="age-verification-title">{t('age.title')}</h2>
          <p className="age-verification-description">{t('age.description')}</p>
          
          <div className="age-verification-form">
            <div className="age-form-group">
              <label className="age-form-label">{t('age.birthDate')}</label>
              <div className="age-date-inputs">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="age-date-select"
                >
                  <option value="">{t('age.year')}</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="age-date-select"
                >
                  <option value="">{t('age.month')}</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="age-date-select"
                >
                  <option value="">{t('age.day')}</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {String(d).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="age-error">{error}</div>}

            <div className="age-verification-actions">
              <button
                onClick={handleExit}
                className="age-button age-button-exit"
              >
                {t('age.exit')}
              </button>
              <button
                onClick={handleVerify}
                className="age-button age-button-verify"
              >
                {t('age.verify')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgeVerification









