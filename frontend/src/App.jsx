import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { refreshAuth } from './store/authSlice'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import BookDetailPage from './pages/BookDetailPage'
import BookReaderPage from './pages/BookReaderPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshAuth())
  }, [dispatch])

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
      <Route path="/books/:id/read" element={<BookReaderPage />} />
      <Route path="/home" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
    </Routes>
  )
}

export default App
