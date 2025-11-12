import React, { useRef, useState } from 'react'
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa'
import './ImageUpload.css'

const ImageUpload = ({ images = [], onChange, maxImages = 10 }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      alert('请选择图片文件')
      return
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`最多只能上传 ${maxImages} 张图片`)
      return
    }

    // 检查文件大小（5MB）
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert('图片大小不能超过 5MB')
      return
    }

    setUploading(true)
    try {
      const newImages = []
      for (const file of imageFiles) {
        // 创建预览URL
        const previewUrl = URL.createObjectURL(file)
        newImages.push({
          file: file,
          preview: previewUrl,
          url: null, // 上传后会有URL
          uploading: true,
        })
      }

      // 先添加预览
      onChange([...images, ...newImages])

      // 上传图片
      const updatedImagesList = [...images, ...newImages]
      
      for (let i = 0; i < newImages.length; i++) {
        const formData = new FormData()
        formData.append('image', newImages[i].file)

        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/upload/image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || '上传失败')
          }

          const data = await response.json()
          // 确保URL是完整的
          let imageUrl = data.url
          if (imageUrl.startsWith('/uploads/')) {
            // 开发环境：使用相对路径，通过 Vite 代理
            if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
              imageUrl = data.url  // 直接使用相对路径，Vite 会代理
            } else {
              // 生产环境：从环境变量获取基础URL
              const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
              let baseUrl = apiBase
              // 如果包含 /api，去掉 /api 及其后面的路径
              if (baseUrl.includes('/api')) {
                baseUrl = baseUrl.split('/api')[0]
              }
              // 如果 baseUrl 为空，使用当前域名
              if (!baseUrl || baseUrl === '') {
                baseUrl = window.location.origin
              }
              imageUrl = `${baseUrl}${data.url}`
            }
          }
          
          // 更新对应图片的状态
          const imageIndex = images.length + i
          updatedImagesList[imageIndex] = {
            ...updatedImagesList[imageIndex],
            url: imageUrl,
            uploading: false,
          }
          
          // 实时更新状态
          onChange([...updatedImagesList])
        } catch (error) {
          console.error('图片上传失败:', error)
          // 标记为上传失败，但保留预览
          const imageIndex = images.length + i
          updatedImagesList[imageIndex] = {
            ...updatedImagesList[imageIndex],
            uploading: false,
            error: true,
          }
          onChange([...updatedImagesList])
          alert(`图片 ${newImages[i].file.name} 上传失败: ${error.message}`)
        }
      }
    } catch (error) {
      console.error('处理图片失败:', error)
      alert('处理图片失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files)
    }
    // 重置input，允许重复选择同一文件
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-upload">
      <label className="image-upload-label">图片（可选）</label>
      
      {/* 上传区域 */}
      {images.length < maxImages && (
        <div
          className={`image-upload-area ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          <FaUpload className="upload-icon" />
          <p className="upload-text">
            {uploading ? '上传中...' : '点击或拖拽图片到这里上传'}
          </p>
          <p className="upload-hint">
            支持 JPEG、PNG、GIF、WebP，单张不超过 5MB，最多 {maxImages} 张
          </p>
        </div>
      )}

      {/* 图片预览 */}
      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              {image.uploading ? (
                <div className="image-preview-loading">
                  <div className="loading-spinner"></div>
                  <span>上传中...</span>
                </div>
              ) : image.error ? (
                <div className="image-preview-error">
                  <span>上传失败</span>
                  <button
                    type="button"
                    className="image-remove-button"
                    onClick={() => handleRemove(index)}
                    title="删除"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={image.url || image.preview}
                    alt={`预览 ${index + 1}`}
                    className="image-preview"
                    onError={(e) => {
                      console.error('图片加载失败:', image.url || image.preview)
                      e.target.style.display = 'none'
                    }}
                  />
                  <button
                    type="button"
                    className="image-remove-button"
                    onClick={() => handleRemove(index)}
                    title="删除"
                  >
                    <FaTimes />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload

