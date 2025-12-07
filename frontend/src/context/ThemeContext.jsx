import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState(() => {
    if (typeof window === 'undefined') return '#2563eb'
    return localStorage.getItem('themeColor') || '#2563eb'
  })

  // 根据选择的颜色生成主题变量
  const generateThemeColors = (color) => {
    const root = document.documentElement
    
    // 检测当前是否为暗色主题
    const isDarkMode = root.classList.contains('theme-dark')
    
    // 将颜色转换为RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // 计算HSL值以便生成变体
    const hsl = rgbToHsl(r, g, b)
    const h = hsl[0]
    const s = hsl[1]
    const l = hsl[2]
    
    // 生成主色调变体（根据暗色/亮色模式调整）
    let primaryColor, primaryHover, primaryLight, primaryDark
    
    if (isDarkMode) {
      // 暗色模式下，主色应该更亮
      primaryColor = hslToHex(h, s, Math.min(1, l + 0.2))
      primaryHover = hslToHex(h, s, Math.min(1, l + 0.3))
      primaryLight = hslToHex(h, Math.max(0, s - 0.1), Math.min(1, l + 0.35))
      primaryDark = hslToHex(h, s, Math.max(0, l + 0.1))
    } else {
      // 亮色模式下，保持原色或稍暗
      primaryColor = color
      primaryHover = hslToHex(h, s, Math.max(0, l - 0.1))
      primaryLight = hslToHex(h, Math.max(0, s - 0.2), Math.min(1, l + 0.15))
      primaryDark = hslToHex(h, s, Math.max(0, l - 0.2))
    }
    
    // 生成辅助色（色相偏移）
    const secondaryH = (h + 0.1) % 1
    const secondaryColor = hslToHex(secondaryH, s, isDarkMode ? Math.min(1, l + 0.2) : l)
    const secondaryHover = hslToHex(secondaryH, s, isDarkMode ? Math.min(1, l + 0.3) : Math.max(0, l - 0.1))
    
    // 根据暗色/亮色模式决定背景色
    let background, backgroundAlt, cardBackground, textPrimary, textSecondary, textTertiary
    let borderColor, borderLight, divider, hoverBackground, activeBackground
    
    if (isDarkMode) {
      // 深色主题 - 使用选择的颜色作为基调
      background = `hsl(${h * 360}, ${Math.min(30, s * 30)}%, 8%)`
      backgroundAlt = `hsl(${h * 360}, ${Math.min(30, s * 30)}%, 12%)`
      cardBackground = `hsl(${h * 360}, ${Math.min(35, s * 35)}%, 15%)`
      textPrimary = '#f8fafc'
      textSecondary = '#cbd5f5'
      textTertiary = '#94a3b8'
      borderColor = `hsl(${h * 360}, ${Math.min(30, s * 30)}%, 20%)`
      borderLight = `hsl(${h * 360}, ${Math.min(30, s * 30)}%, 18%)`
      divider = `hsl(${h * 360}, ${Math.min(30, s * 30)}%, 20%)`
      hoverBackground = `hsla(${h * 360}, ${Math.min(40, s * 40)}%, 25%, 0.65)`
      activeBackground = `hsla(${h * 360}, ${Math.min(40, s * 40)}%, 30%, 0.7)`
    } else {
      // 浅色主题 - 添加明显的色调到整体背景
      // 根据选择的颜色生成淡色调背景，让整体界面背景有明显色调
      // 增强饱和度，让色调更明显
      const bgSaturation = Math.min(40, Math.max(15, s * 0.4)) // 饱和度15-40%，更明显
      const bgLightness = 97 // 保持高亮度但稍微降低以显示色调
      const altSaturation = Math.min(35, Math.max(12, s * 0.35))
      const altLightness = 95
      
      background = `hsl(${h * 360}, ${bgSaturation}%, ${bgLightness}%)`
      backgroundAlt = `hsl(${h * 360}, ${altSaturation}%, ${altLightness}%)`
      cardBackground = `hsl(${h * 360}, ${Math.min(15, s * 0.15)}%, 100%)`
      textPrimary = '#1a1a1a'
      textSecondary = '#6b7280'
      textTertiary = '#9ca3af'
      borderColor = `hsl(${h * 360}, ${Math.min(20, s * 0.2)}%, 88%)`
      borderLight = `hsl(${h * 360}, ${Math.min(15, s * 0.15)}%, 94%)`
      divider = `hsl(${h * 360}, ${Math.min(20, s * 0.2)}%, 88%)`
      hoverBackground = `hsl(${h * 360}, ${Math.min(25, s * 0.25)}%, 94%)`
      activeBackground = `hsl(${h * 360}, ${Math.min(30, s * 0.3)}%, 90%)`
    }
    
    // 应用CSS变量
    root.style.setProperty('--primary-color', primaryColor)
    root.style.setProperty('--primary-hover', primaryHover)
    root.style.setProperty('--primary-light', primaryLight)
    root.style.setProperty('--primary-dark', primaryDark)
    root.style.setProperty('--secondary-color', secondaryColor)
    root.style.setProperty('--secondary-hover', secondaryHover)
    root.style.setProperty('--background', background)
    root.style.setProperty('--background-alt', backgroundAlt)
    root.style.setProperty('--card-background', cardBackground)
    root.style.setProperty('--text-primary', textPrimary)
    root.style.setProperty('--text-secondary', textSecondary)
    root.style.setProperty('--text-tertiary', textTertiary)
    root.style.setProperty('--border-color', borderColor)
    root.style.setProperty('--border-light', borderLight)
    root.style.setProperty('--divider', divider)
    root.style.setProperty('--hover-background', hoverBackground)
    root.style.setProperty('--active-background', activeBackground)
    root.style.setProperty('--button-primary', primaryColor)
    root.style.setProperty('--button-primary-hover', primaryHover)
    root.style.setProperty('--focus-ring', primaryColor)
    
    // 更新header和dropdown背景
    if (isDarkMode) {
      root.style.setProperty('--header-background', `rgba(${Math.round(r * 0.1)}, ${Math.round(g * 0.1)}, ${Math.round(b * 0.1)}, 0.9)`)
      root.style.setProperty('--dropdown-background', `rgba(${Math.round(r * 0.15)}, ${Math.round(g * 0.15)}, ${Math.round(b * 0.15)}, 0.95)`)
    } else {
      // 使用HSL生成带色调的header背景，与整体背景色调一致
      const headerSaturation = Math.min(35, Math.max(12, s * 0.35))
      const headerLightness = 96
      root.style.setProperty('--header-background', `hsla(${h * 360}, ${headerSaturation}%, ${headerLightness}%, 0.85)`)
      root.style.setProperty('--dropdown-background', `hsla(${h * 360}, ${Math.min(20, s * 0.2)}%, 100%, 0.95)`)
    }
  }
  
  // RGB转HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
        default: h = 0
      }
    }
    
    return [h, s, l]
  }
  
  // HSL转Hex
  const hslToHex = (h, s, l) => {
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  
  useEffect(() => {
    generateThemeColors(themeColor)
    localStorage.setItem('themeColor', themeColor)
  }, [themeColor])

  // 监听主题变化（暗色/亮色切换）
  useEffect(() => {
    const observer = new MutationObserver(() => {
      generateThemeColors(themeColor)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [themeColor])
  
  const value = {
    themeColor,
    setThemeColor,
  }
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

