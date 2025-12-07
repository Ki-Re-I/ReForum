import React, { useEffect } from 'react'

/**
 * Google AdSense 广告组件
 * 
 * 使用方法：
 * <AdSense 
 *   adSlot="1234567890"  // 广告位ID（从AdSense后台获取）
 *   adFormat="auto"      // 广告格式：auto, rectangle, horizontal, vertical
 *   style={{ display: 'block' }}
 * />
 */
const AdSense = ({ 
  adSlot, 
  adFormat = 'auto',
  style = { display: 'block' },
  className = '',
  fullWidthResponsive = true 
}) => {
  useEffect(() => {
    try {
      // 初始化 AdSense
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        return
      }
      
      // 等待 AdSense 脚本加载完成
      const checkAdsbygoogle = setInterval(() => {
        if (window.adsbygoogle) {
          window.adsbygoogle.loaded = true
          clearInterval(checkAdsbygoogle)
        }
      }, 100)
      
      return () => clearInterval(checkAdsbygoogle)
    } catch (error) {
      console.error('AdSense initialization error:', error)
    }
  }, [])

  useEffect(() => {
    try {
      // 推送广告请求
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense push error:', error)
    }
  }, [])

  if (!adSlot) {
    console.warn('AdSense: adSlot is required')
    return null
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-1528835913927311"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  )
}

export default AdSense



















