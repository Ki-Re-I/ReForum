import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './PWAInstallPrompt.css'

const PWAInstallPrompt = () => {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 检查是否已经安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // 检查是否已经显示过提示
      const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown')
      if (!hasShownPrompt) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // 3秒后显示提示
      }
    }

    // 监听 appinstalled 事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      localStorage.setItem('pwa-install-prompt-shown', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // 显示安装提示
    deferredPrompt.prompt()

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('用户接受了安装提示')
    } else {
      console.log('用户拒绝了安装提示')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
    localStorage.setItem('pwa-install-prompt-shown', 'true')
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-prompt-shown', 'true')
  }

  // 如果已安装或不显示提示，则不渲染
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#2563eb" />
            <path d="M24 14L30 20H26V28H22V20H18L24 14Z" fill="white" />
            <path d="M18 30H30V32H18V30Z" fill="white" />
          </svg>
        </div>
        <div className="pwa-install-text">
          <h3>{t('pwa.installTitle')}</h3>
          <p>{t('pwa.installDescription')}</p>
        </div>
        <div className="pwa-install-actions">
          <button className="pwa-install-button" onClick={handleInstallClick}>
            {t('pwa.installButton')}
          </button>
          <button className="pwa-dismiss-button" onClick={handleDismiss}>
            {t('pwa.dismissButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt

