import React from 'react'
import { useLanguage } from '../context/LanguageContext'

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} t={this.props.t} />
    }

    return this.props.children
  }
}

// 错误显示组件（使用函数组件以使用 hook）
const ErrorDisplay = ({ error, t }) => {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>{t('error.occurred')}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        {error?.message || t('error.pageLoadError')}
      </p>
      <button
        onClick={() => {
          window.location.reload()
        }}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0079d3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        {t('error.refreshPage')}
      </button>
    </div>
  )
}

// 包装组件以使用 hook
const ErrorBoundary = ({ children }) => {
  const { t } = useLanguage()
  return <ErrorBoundaryClass t={t}>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary









