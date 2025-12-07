import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { postAPI, categoryAPI } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import { useLanguage } from '../context/LanguageContext'
import { updateTask } from '../utils/dailyTasks'
import './CreatePost.css'

const CreatePost = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    tags: '',
  })
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [errorKey, setErrorKey] = useState(null) // 存储错误键而不是翻译后的文本
  const [submitting, setSubmitting] = useState(false)
  const { t, getCategoryName } = useLanguage()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchCategories()
  }, [isAuthenticated, navigate])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.content || !formData.categoryId) {
      setError(t('create.errorRequired'))
      return
    }

    setSubmitting(true)
    try {
      // 将图片URL插入到内容中
      let contentWithImages = formData.content.trim()
      if (images.length > 0) {
        const imageUrls = images
          .filter(img => img.url) // 只包含已上传的图片
          .map(img => `![图片](${img.url})`)
          .join('\n\n')
        
        if (imageUrls) {
          contentWithImages = contentWithImages 
            ? `${contentWithImages}\n\n${imageUrls}`
            : imageUrls
        }
      }

      const postData = {
        title: formData.title.trim(),
        content: contentWithImages,
        categoryId: parseInt(formData.categoryId, 10),
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : [],
      }

      // 验证 categoryId
      if (isNaN(postData.categoryId) || postData.categoryId <= 0) {
        setError(t('create.errorCategory'))
        setSubmitting(false)
        return
      }

      const response = await postAPI.createPost(postData)
      
      // 更新每日任务：发布帖子
      updateTask('post')
      
      // 触发自定义事件，通知标签组件有新帖子创建
      window.dispatchEvent(new CustomEvent('postCreated', { 
        detail: { postId: response.data.id, tags: postData.tags } 
      }))
      
      navigate(`/post/${response.data.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
      
      if (error.response?.data) {
        // 处理验证错误
        if (error.response.data.details && Array.isArray(error.response.data.details)) {
          const details = error.response.data.details
            .map(d => d.message || d)
            .join('; ')
          // 存储验证错误详情
          setError(`${t('create.errorValidationPrefix')}${details}`)
          setErrorKey(null)
        } else if (error.response.data.message) {
          // 后端返回的错误消息直接显示
          setError(error.response.data.message)
          setErrorKey(null)
        } else {
          // 使用默认错误键
          setErrorKey('create.errorSubmit')
          setError('')
        }
      } else {
        // 使用默认错误键
        setErrorKey('create.errorSubmit')
        setError('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="create-post">
      <div className="create-post-card">
        <h1 className="create-post-title">{t('create.title')}</h1>

        {(error || errorKey) && (
          <div className="create-post-error">
            {errorKey ? t(errorKey) : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">{t('create.fieldTitle')}</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={200}
              placeholder={t('create.placeholderTitle')}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">{t('create.fieldCategory')}</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">{t('create.fieldCategory')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">{t('create.fieldContent')}</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              minLength={10}
              rows={10}
              placeholder={t('create.placeholderContent')}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={10}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">{t('create.fieldTags')}</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder={t('create.placeholderTags')}
              className="form-input"
            />
            <small className="form-hint">
              {t('create.tagsHint')}
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button"
            >
              {t('create.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? t('create.submitting') : t('create.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost




