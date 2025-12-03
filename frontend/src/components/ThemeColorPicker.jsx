import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaEyeDropper } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import './ThemeColorPicker.css'

const ThemeColorPicker = ({ showLabel = false }) => {
  const { themeColor, setThemeColor } = useTheme()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)
  const pickerRef = useRef(null)
  const hueSliderRef = useRef(null)
  const slSliderRef = useRef(null)
  const isInternalUpdate = useRef(false)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })

  // 将hex转换为HSL
  const hexToHsl = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255

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

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }

  // 将HSL转换为hex
  const hslToHex = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100

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

  // 初始化HSL值（只在themeColor从外部改变时更新，避免循环更新）
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    const [h, s, l] = hexToHsl(themeColor)
    setHue(h)
    setSaturation(s)
    setLightness(l)
  }, [themeColor])

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 点击外部关闭（仅桌面端需要）
  useEffect(() => {
    if (!isOpen || isMobile) return
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

      document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isMobile])

  // 打开浮层时锁定滚动
  useEffect(() => {
    if (!isMobile || !isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobile, isOpen])

  // 处理色相滑块
  const handleHueChange = (e) => {
    const newHue = parseInt(e.target.value)
    setHue(newHue)
    const newColor = hslToHex(newHue, saturation, lightness)
    isInternalUpdate.current = true
    setThemeColor(newColor)
  }

  // 处理饱和度/亮度滑块
  const handleSLChange = (e) => {
    if (!slSliderRef.current) return
    const rect = slSliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    const newSaturation = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const newLightness = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100))
    setSaturation(newSaturation)
    setLightness(newLightness)
    const newColor = hslToHex(hue, newSaturation, newLightness)
    isInternalUpdate.current = true
    setThemeColor(newColor)
  }

  // 处理取色器
  const handleEyedropper = async () => {
    try {
      if (!window.EyeDropper) {
        alert('您的浏览器不支持取色器功能')
        return
      }
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      // 取色器选择的是外部颜色，不需要设置isInternalUpdate
      setThemeColor(result.sRGBHex)
    } catch (err) {
      // 用户取消或出错
      console.log('取色器取消或出错:', err)
    }
  }

  // 生成色相渐变
  const hueGradient = `linear-gradient(to right, 
    hsl(0, 100%, 50%), 
    hsl(60, 100%, 50%), 
    hsl(120, 100%, 50%), 
    hsl(180, 100%, 50%), 
    hsl(240, 100%, 50%), 
    hsl(300, 100%, 50%), 
    hsl(360, 100%, 50%))`

  // 生成饱和度/亮度渐变
  const slGradient = `linear-gradient(to top, 
    hsl(${hue}, 100%, 0%), 
    hsl(${hue}, 100%, 50%), 
    hsl(${hue}, 0%, 50%), 
    hsl(${hue}, 0%, 100%))`

  const closePicker = () => setIsOpen(false)

  const pickerContent = (
    <>
          <div className="color-picker-controls">
            <button
              className="eyedropper-button"
              onClick={handleEyedropper}
              title="取色器"
            >
              <FaEyeDropper />
            </button>
            <div className="slider-group">
              <div className="slider-container">
                <div
                  className="hue-slider"
                  style={{ background: hueGradient }}
                  ref={hueSliderRef}
                >
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={handleHueChange}
                    className="slider-input"
                  />
                  <div
                    className="slider-handle"
                    style={{ left: `${(hue / 360) * 100}%` }}
                  />
                </div>
              </div>
              <div className="slider-container">
                <div
                  className="sl-slider"
                  style={{ background: slGradient }}
                  ref={slSliderRef}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSLChange(e)
                    const handleMouseMove = (moveEvent) => {
                      moveEvent.preventDefault()
                      handleSLChange(moveEvent)
                    }
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                >
                  <div
                    className="sl-handle"
                    style={{
                      left: `${saturation}%`,
                      bottom: `${lightness}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
    </>
  )

  const renderPicker = () => {
    if (!isOpen) return null

    if (isMobile) {
      return createPortal(
        <div className="theme-picker-overlay" onClick={closePicker}>
          <div className="theme-picker-modal" onClick={(e) => e.stopPropagation()}>
          <div className="theme-picker-header">
            <span className="theme-picker-title">{t('header.themeColorTitle')}</span>
            <button className="theme-picker-close" onClick={closePicker} aria-label="Close">
              ×
            </button>
          </div>
            {pickerContent}
          </div>
        </div>,
        document.body
      )
    }

    return (
      <div className="theme-color-picker" ref={pickerRef}>
        {pickerContent}
        </div>
    )
  }

  return (
    <div className="theme-color-picker-wrapper" ref={pickerRef}>
      <button
        className={`theme-color-button icon-button ${showLabel ? 'with-label' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t('header.themeColorTitle') || 'Theme color'}
        style={{ backgroundColor: themeColor, color: '#fff' }}
      >
        {showLabel && <span className="theme-color-button-label">{t('header.themeColorTitle')}</span>}
        <FaEyeDropper />
      </button>
      {renderPicker()}
    </div>
  )
}

export default ThemeColorPicker

