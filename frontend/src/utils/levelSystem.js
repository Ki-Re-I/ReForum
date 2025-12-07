// 等级系统工具函数

// 计算从 level 到 level+1 所需的经验值
export const getExpForNextLevel = (level) => {
  if (level === 0) return 30
  // 每级递增：30, 35, 40, 45, 50...
  return 30 + (level * 5)
}

// 计算从 1 级到指定等级所需的总经验值
export const getTotalExpForLevel = (targetLevel) => {
  let totalExp = 0
  for (let level = 1; level < targetLevel; level++) {
    totalExp += getExpForNextLevel(level - 1)
  }
  return totalExp
}

// 根据经验值计算当前等级
export const getLevelFromExp = (exp) => {
  if (exp < 30) return 1
  
  let level = 1
  let currentExp = exp
  let requiredExp = getExpForNextLevel(0) // 1->2 需要 30
  
  while (currentExp >= requiredExp && level < 70) {
    currentExp -= requiredExp
    level++
    requiredExp = getExpForNextLevel(level - 1)
  }
  
  return Math.min(level, 70)
}

// 计算当前等级的经验进度（0-1）
export const getLevelProgress = (exp) => {
  const level = getLevelFromExp(exp)
  if (level >= 70) return 1
  
  const expForCurrentLevel = getTotalExpForLevel(level)
  const expForNextLevel = getTotalExpForLevel(level + 1)
  const currentLevelExp = exp - expForCurrentLevel
  const neededExp = expForNextLevel - expForCurrentLevel
  
  return currentLevelExp / neededExp
}

// 获取当前等级到下一级还需要的经验值
export const getExpToNextLevel = (exp) => {
  const level = getLevelFromExp(exp)
  if (level >= 70) return 0
  
  const expForCurrentLevel = getTotalExpForLevel(level)
  const expForNextLevel = getTotalExpForLevel(level + 1)
  const currentLevelExp = exp - expForCurrentLevel
  
  return expForNextLevel - expForCurrentLevel - currentLevelExp
}

// 彩虹颜色定义
const RAINBOW_COLORS = {
  red: { start: [255, 200, 200], end: [255, 0, 0] },
  orange: { start: [255, 220, 180], end: [255, 165, 0] },
  yellow: { start: [255, 255, 200], end: [255, 255, 0] },
  green: { start: [200, 255, 200], end: [0, 255, 0] },
  blue: { start: [200, 220, 255], end: [0, 0, 255] },
  indigo: { start: [200, 200, 255], end: [75, 0, 130] },
  violet: { start: [240, 200, 255], end: [138, 43, 226] },
}

// 获取等级对应的颜色区间
const getColorRange = (level) => {
  if (level <= 10) return 'red'
  if (level <= 20) return 'orange'
  if (level <= 30) return 'yellow'
  if (level <= 40) return 'green'
  if (level <= 50) return 'blue'
  if (level <= 60) return 'indigo'
  return 'violet'
}

// 计算等级在颜色区间内的进度（0-1）
const getColorProgress = (level) => {
  if (level <= 10) return (level - 1) / 9
  if (level <= 20) return (level - 11) / 9
  if (level <= 30) return (level - 21) / 9
  if (level <= 40) return (level - 31) / 9
  if (level <= 50) return (level - 41) / 9
  if (level <= 60) return (level - 51) / 9
  return (level - 61) / 9
}

// 根据等级获取颜色（RGB数组）
export const getLevelColor = (level) => {
  if (level >= 70) {
    // 70级使用彩虹渐变，需要动态计算
    return null // 返回null表示需要使用动态彩虹渐变
  }
  
  const colorRange = getColorRange(level)
  const progress = getColorProgress(level)
  const colorDef = RAINBOW_COLORS[colorRange]
  
  // 在颜色区间内从淡色渐变到深色
  const r = Math.round(colorDef.start[0] + (colorDef.end[0] - colorDef.start[0]) * progress)
  const g = Math.round(colorDef.start[1] + (colorDef.end[1] - colorDef.start[1]) * progress)
  const b = Math.round(colorDef.start[2] + (colorDef.end[2] - colorDef.start[2]) * progress)
  
  return `rgb(${r}, ${g}, ${b})`
}

// 生成70级的彩虹渐变CSS（动态）
export const getRainbowGradient = (time = Date.now()) => {
  // 使用时间创建动态彩虹效果，每16.67ms改变1度，约6秒完成一次360度循环，单向变化
  const hue = (time / 16.67) % 360
  return `linear-gradient(135deg, 
    hsl(${hue}, 100%, 50%), 
    hsl(${(hue + 60) % 360}, 100%, 50%), 
    hsl(${(hue + 120) % 360}, 100%, 50%), 
    hsl(${(hue + 180) % 360}, 100%, 50%), 
    hsl(${(hue + 240) % 360}, 100%, 50%), 
    hsl(${(hue + 300) % 360}, 100%, 50%))`
}

// 任务经验值奖励
export const TASK_EXP = {
  POST: 5,
  LIKE: 5,
  COMMENT: 5,
}

