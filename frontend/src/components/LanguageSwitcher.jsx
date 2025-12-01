import React, { useState, useEffect, useRef } from 'react'
import { FaGlobeAsia } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './LanguageSwitcher.css'

const languages = [
  { code: 'zh', label: '中文', symbol: '文' },
  { code: 'en', label: 'English', symbol: 'A' },
  { code: 'ja', label: '日本語', symbol: 'あ' },
]

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // 点击外部区域时关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (code) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div 
      className={`language-switcher ${isOpen ? 'is-open' : ''}`}
      ref={containerRef}
    >
      <button
        type="button"
        className="language-switcher__toggle"
        onClick={handleToggle}
        onMouseEnter={() => setIsOpen(true)}
        title="Switch language"
      >
        <FaGlobeAsia />
      </button>
      <div 
        className="language-switcher__menu"
        onMouseEnter={() => setIsOpen(true)}
      >
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            type="button"
            className={`language-switcher__option ${
              language === lang.code ? 'is-active' : ''
            } language-switcher__option--${index + 1}`}
            aria-label={lang.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSelect(lang.code)}
          >
            <span className="language-switcher__symbol">{lang.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher

