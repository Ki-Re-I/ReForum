import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { categoryAPI } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import { mockTagAPI, mockTags } from '../data/mockData'
import { format } from 'date-fns'
import Matter from 'matter-js'
import './RightSidebar.css'

// 是否使用假数据（通过 .env 文件中的 VITE_USE_MOCK_DATA 环境变量控制）
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

const RightSidebar = () => {
  const location = useLocation()
  const { t } = useLanguage()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const domLayerRef = useRef(null)
  const engineRef = useRef(null)
  const runnerRef = useRef(null)
  const tagBodiesRef = useRef([])
  const previousTagsRef = useRef([])
  const initializedRef = useRef(false)

  const fetchData = async () => {
    try {
      if (USE_MOCK_DATA) {
        const response = await mockTagAPI.getTags({ limit: 15 })
        setTags(response.data.filter(tag => tag.postCount > 0))
      } else {
        const tagsRes = await categoryAPI.getTags({ limit: 15 })
        setTags(tagsRes.data.filter(tag => tag.postCount > 0))
      }
    } catch (error) {
      console.error('Failed to fetch sidebar data:', error)
      if (!USE_MOCK_DATA) {
        setTags(mockTags.filter(tag => tag.postCount > 0))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    const handlePostCreated = () => {
      fetchData()
    }
    
    const handlePostDeleted = () => {
      fetchData()
    }
    
    window.addEventListener('postCreated', handlePostCreated)
    window.addEventListener('postDeleted', handlePostDeleted)
    
    return () => {
      window.removeEventListener('postCreated', handlePostCreated)
      window.removeEventListener('postDeleted', handlePostDeleted)
    }
  }, [location.pathname])

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return format(date, 'MM/dd')
    } catch (e) {
      return ''
    }
  }

  // 根据标签次数生成重复数组
  const generateTagItems = (tags) => {
    const items = []
    tags.forEach(tag => {
      const count = Math.max(tag.postCount || 1, 1)
      // 增加重复次数，提高密度
      const repeatCount = Math.min(count, 50) // 最多50次
      for (let i = 0; i < repeatCount; i++) {
        items.push({ 
          ...tag, 
          uniqueId: `${tag.id}-${i}`,
        })
      }
    })
    return items
  }


  // 初始化物理引擎
  useEffect(() => {
    if (loading || tags.length === 0) return
    
    // 如果已经初始化，先清理
    if (initializedRef.current) {
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current)
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
      }
      tagBodiesRef.current.forEach(tb => {
        if (tb.el.parentNode) {
          tb.el.parentNode.removeChild(tb.el)
        }
      })
      tagBodiesRef.current = []
      initializedRef.current = false
    }

    const container = containerRef.current
    const canvasHost = canvasRef.current
    const domLayer = domLayerRef.current

    if (!container || !canvasHost || !domLayer) return

    // 清理之前的引擎
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current)
    }
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current)
    }

    // 配置
    const pad = 2
    const margin = 1
    const noRotate = false
    const scaleFactor = 0.75

    // 容器尺寸
    let { width: cw, height: ch } = container.getBoundingClientRect()
    let W = Math.max(cw - pad, 100)
    let H = Math.max(ch - pad, 100)

    // 创建物理引擎
    const engine = Matter.Engine.create()
    engine.world.gravity.y = 0.5 // 重力
    engineRef.current = engine

    // 鼠标拖拽
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: Matter.Mouse.create(canvasHost),
      constraint: { 
        render: { visible: false }, 
        stiffness: 1 
      },
    })
    Matter.World.add(engine.world, mouseConstraint)

    // 边界（底部和两侧）
    const ground = Matter.Bodies.rectangle(W / 2, H - margin, W, 14, { 
      isStatic: true,
      render: { visible: false }
    })
    const wallL = Matter.Bodies.rectangle(margin, H / 2, 14, H, { 
      isStatic: true,
      render: { visible: false }
    })
    const wallR = Matter.Bodies.rectangle(W - margin, H / 2, 14, H, { 
      isStatic: true,
      render: { visible: false }
    })
    Matter.World.add(engine.world, [ground, wallL, wallR])

    // 生成标签项
    const tagItems = generateTagItems(tags)
    const tagBodies = []

    // 计算标签尺寸范围（更小的标签，提高密度）
    const baseArea = W * H
    const areaMin = Math.max(baseArea / 100, 1000) // 进一步减小最小面积
    const areaMax = Math.max(baseArea / 50, 4000) // 进一步减小最大面积

    // 创建标签物理体
    tagItems.forEach((item, index) => {
      // 随机起始位置（在容器上方）
      const x = Math.random() * W
      const y = -H * (0.5 + Math.random() * 0.5) // 从上方掉落

      // 标签尺寸（基于面积，进一步减小）
      const A = areaMin + Math.random() * (areaMax - areaMin)
      const aspectRatio = 1.6 // 标签宽高比
      let w = Math.sqrt(A * aspectRatio)
      let h = w / aspectRatio
      w *= scaleFactor * 0.8 // 进一步缩小
      h *= scaleFactor * 0.8

      // 创建物理体
      const body = Matter.Bodies.rectangle(x, y, w, h, {
        restitution: 0.35, // 弹性
        friction: 0.1, // 摩擦
        frictionAir: 0.02, // 空气阻力
        density: Math.max((w * h) / 40000, 0.001),
        inertia: noRotate ? Infinity : undefined,
      })

      // 创建DOM元素
      const el = document.createElement('div')
      el.className = 'tag-physics-item'
      el.style.width = `${w}px`
      el.style.height = `${h}px`
      
      // 标签内容
      el.innerHTML = `
        <div class="tag-date">${formatDate(item.latestPostDate)}</div>
        <span class="tag-item-text">${item.name}</span>
      `
      
      domLayer.appendChild(el)

      tagBodies.push({
        body,
        el,
        tag: item,
        w,
        h
      })
    })

    tagBodiesRef.current = tagBodies
    Matter.World.add(engine.world, tagBodies.map(tb => tb.body))

    // 启动引擎
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    runnerRef.current = runner

    // 同步DOM位置
    Matter.Events.on(engine, 'afterUpdate', () => {
      tagBodies.forEach(tb => {
        const { x, y } = tb.body.position
        const angle = tb.body.angle
        if (noRotate) {
          tb.el.style.transform = `translate(${x - tb.w / 2}px, ${y - tb.h / 2}px)`
        } else {
          tb.el.style.transform = `translate(${x - tb.w / 2}px, ${y - tb.h / 2}px) rotate(${angle}rad)`
        }
      })
    })

    // 响应式调整（使用防抖优化性能）
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const rect = container.getBoundingClientRect()
        W = Math.max(rect.width - pad, 100)
        H = Math.max(rect.height - pad, 100)
        
        // 更新边界位置
        Matter.Body.setPosition(ground, Matter.Vector.create(W / 2, H - margin))
        Matter.Body.setPosition(wallL, Matter.Vector.create(margin, H / 2))
        Matter.Body.setPosition(wallR, Matter.Vector.create(W - margin, H / 2))
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    initializedRef.current = true

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current)
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
      }
      // 清理DOM元素
      tagBodies.forEach(tb => {
        if (tb.el.parentNode) {
          tb.el.parentNode.removeChild(tb.el)
        }
      })
      tagBodiesRef.current = []
      initializedRef.current = false
    }
  }, [tags, loading])

  // 检测新标签并触发掉落
  useEffect(() => {
    if (loading || tags.length === 0 || !initializedRef.current || !engineRef.current) return

    const previousTags = previousTagsRef.current
    if (previousTags.length === 0) {
      previousTagsRef.current = tags
      return
    }

    const currentTagMap = new Map(tags.map(tag => [tag.id, tag.postCount]))
    const previousTagMap = new Map(previousTags.map(tag => [tag.id, tag.postCount]))

    // 找出新增的标签
    tags.forEach(tag => {
      const prevCount = previousTagMap.get(tag.id) || 0
      const currentCount = currentTagMap.get(tag.id) || 0
      
      if (currentCount > prevCount) {
        // 添加新标签到物理世界
        const addedCount = Math.min(currentCount - prevCount, 5) // 最多一次添加5个
        
        for (let i = 0; i < addedCount; i++) {
          const container = containerRef.current
          if (!container) return
          
          const { width: W } = container.getBoundingClientRect()
          const x = Math.random() * (W - 100) + 50
          const y = -50 - Math.random() * 50
          
          const w = 25 + Math.random() * 20 // 进一步减小尺寸
          const h = 15 + Math.random() * 12
          
          const body = Matter.Bodies.rectangle(x, y, w, h, {
            restitution: 0.35,
            friction: 0.1,
            frictionAir: 0.02,
            density: 0.001,
          })
          
          const el = document.createElement('div')
          el.className = 'tag-physics-item tag-falling'
          el.style.width = `${w}px`
          el.style.height = `${h}px`
          el.innerHTML = `
            <div class="tag-date">${formatDate(tag.latestPostDate)}</div>
            <span class="tag-item-text">${tag.name}</span>
          `
          
          domLayerRef.current?.appendChild(el)
          
          tagBodiesRef.current.push({
            body,
            el,
            tag: { ...tag, uniqueId: `${tag.id}-new-${Date.now()}-${i}` },
            w,
            h
          })
          
          Matter.World.add(engineRef.current.world, body)
        }
      }
    })

    previousTagsRef.current = tags
  }, [tags, loading])


  return (
    <aside className="right-sidebar">
      {loading ? (
        <div className="tags-skeleton-container">
          <div className="tag-skeleton-hint">
            <div className="skeleton-line skeleton-line-sm" style={{ width: '80%', height: '0.9rem', marginBottom: '1rem' }}></div>
          </div>
          <div className="tag-skeleton-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="tag-skeleton-item">
                <div className="skeleton-line skeleton-line-sm" style={{ width: '60px', height: '24px', borderRadius: '12px' }}></div>
              </div>
            ))}
          </div>
        </div>
      ) : tags.length === 0 ? (
        <div className="tags-empty-container">
          <p className="tags-empty">{t('right.emptyTags')}</p>
        </div>
      ) : (
        <>
          {/* 提示文字 */}
          <div className="tag-container-header">
            <p className="tag-container-hint">{t('right.containerFullHint')}</p>
          </div>
          
          {/* 物理容器 */}
          <div className="tag-container" ref={containerRef}>
            <div className="tricks-canvas" ref={canvasRef} />
            <div className="tricks-elements" ref={domLayerRef} />
          </div>
        </>
      )}
    </aside>
  )
}

export default RightSidebar
