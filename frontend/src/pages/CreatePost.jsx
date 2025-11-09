import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { postAPI, categoryAPI } from '../services/api'
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
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
      setError('请填写所有必填字段')
      return
    }

    setSubmitting(true)
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        categoryId: parseInt(formData.categoryId),
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      }

      const response = await postAPI.createPost(postData)
      navigate(`/post/${response.data.id}`)
    } catch (error) {
      setError(
        error.response?.data?.message || '发布失败，请检查输入信息'
      )
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
        <h1 className="create-post-title">发布新帖子</h1>

        {error && <div className="create-post-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">标题 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={200}
              placeholder="请输入帖子标题（5-200个字符）"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">版块 *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">请选择版块</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">内容 *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              minLength={10}
              rows={10}
              placeholder="请输入帖子内容（至少10个字符）"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">标签（可选）</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="用逗号分隔多个标签，例如：技术,编程,Python"
              className="form-input"
            />
            <small className="form-hint">
              标签之间用逗号分隔
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? '发布中...' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost


