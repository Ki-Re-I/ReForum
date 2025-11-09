import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import UserProfile from './pages/UserProfile'
import CreatePost from './pages/CreatePost'
import './App.css'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}

export default App

