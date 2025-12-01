import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { postAPI, categoryAPI } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import { useLanguage } from '../context/LanguageContext'
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
  const [submitting, setSubmitting] = useState(false)
  const { t } = useLanguage()

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
      navigate(`/post/${response.data.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
      let errorMessage = t('create.errorSubmit')
      
      if (error.response?.data) {
        // 处理验证错误
        if (error.response.data.details && Array.isArray(error.response.data.details)) {
          const details = error.response.data.details
            .map(d => d.message || d)
            .join('; ')
          errorMessage = `${t('create.errorValidationPrefix')}${details}`
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      }
      
      setError(errorMessage)
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

        {error && <div className="create-post-error">{error}</div>}

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
                  {category.name}
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




