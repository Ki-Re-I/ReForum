import React, { useRef, useState } from 'react'
import { FaTimes, FaUpload } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './ImageUpload.css'

const formatWithParams = (template, params = {}) => {
  if (!template) return ''
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? params[key] : `{${key}}`
  )
}

const ImageUpload = ({ images = [], onChange, maxImages = 10 }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { t } = useLanguage()

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      alert(t('image.alertSelect'))
      return
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(formatWithParams(t('image.alertMax'), { max: maxImages }))
      return
    }

    // 检查文件大小（5MB）
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(t('image.alertSize'))
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
              // 生产环境：根据 API 基础地址解析出 origin，避免出现 "https://uploads" 之类的错误
              const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
              let origin
              try {
                origin = new URL(apiBase, window.location.origin).origin
              } catch {
                origin = window.location.origin
              }
              imageUrl = `${origin}${data.url}`
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
          console.error('Image upload failed:', error)
          // 标记为上传失败，但保留预览
          const imageIndex = images.length + i
          updatedImagesList[imageIndex] = {
            ...updatedImagesList[imageIndex],
            uploading: false,
            error: true,
          }
          onChange([...updatedImagesList])
          alert(
            formatWithParams(t('image.uploadFail'), {
              name: newImages[i].file.name,
              message: error.message,
            })
          )
        }
      }
    } catch (error) {
      console.error('Failed to process images:', error)
      alert(t('image.processFail'))
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
      <label className="image-upload-label">{t('image.label')}</label>
      
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
            {uploading ? t('image.uploading') : t('image.cta')}
          </p>
          <p className="upload-hint">
            {formatWithParams(t('image.hint'), { max: maxImages })}
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
                  <span>{t('image.previewUploading')}</span>
                </div>
              ) : image.error ? (
                <div className="image-preview-error">
                  <span>{t('image.previewError')}</span>
                  <button
                    type="button"
                    className="image-remove-button"
                    onClick={() => handleRemove(index)}
                    title={t('image.delete')}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={image.url || image.preview}
                    alt={formatWithParams(t('image.alt'), { index: index + 1 })}
                    className="image-preview"
                    onError={(e) => {
                      console.error('Preview image failed to load:', image.url || image.preview)
                      e.target.style.display = 'none'
                    }}
                  />
                  <button
                    type="button"
                    className="image-remove-button"
                    onClick={() => handleRemove(index)}
                    title={t('image.delete')}
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

