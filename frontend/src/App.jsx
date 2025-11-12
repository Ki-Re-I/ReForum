import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import PostDetail from './pages/PostDetail.jsx'
import UserProfile from './pages/UserProfile.jsx'
import CreatePost from './pages/CreatePost.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Changelog from './pages/Changelog.jsx'
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
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
            <Route path="/search" element={<Search />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}

export default App

