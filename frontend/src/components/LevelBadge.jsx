import React, { useState, useEffect } from 'react'
import { getLevelFromExp, getLevelColor, getRainbowGradient } from '../utils/levelSystem'
import './LevelBadge.css'

const LevelBadge = ({ exp, size = 'normal' }) => {
  const level = getLevelFromExp(exp)
  const isMaxLevel = level >= 70
  const [rainbowStyle, setRainbowStyle] = useState({})

  // 70级彩虹渐变动画
  useEffect(() => {
    if (!isMaxLevel) return

    let animationFrame
    const startTime = Date.now()
    const updateRainbow = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      // 单向流动：每6秒完成一次360度循环（约60度/秒），加快速度
      const hue = (elapsed / 16.67) % 360
      
      const gradient = `linear-gradient(135deg, 
        hsl(${hue}, 100%, 50%), 
        hsl(${(hue + 60) % 360}, 100%, 50%), 
        hsl(${(hue + 120) % 360}, 100%, 50%), 
        hsl(${(hue + 180) % 360}, 100%, 50%), 
        hsl(${(hue + 240) % 360}, 100%, 50%), 
        hsl(${(hue + 300) % 360}, 100%, 50%))`
      
      setRainbowStyle({
        background: gradient,
      })
      animationFrame = requestAnimationFrame(updateRainbow)
    }

    updateRainbow()
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isMaxLevel])

  const color = isMaxLevel ? null : getLevelColor(level)
  const style = isMaxLevel
    ? rainbowStyle
    : {
        backgroundColor: color,
      }

  return (
    <span
      className={`level-badge level-badge-${size} ${isMaxLevel ? 'level-max' : ''}`}
      style={style}
      title={`等级 ${level}`}
    >
      Lv.{level}
    </span>
  )
}

export default LevelBadge

