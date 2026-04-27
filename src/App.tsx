import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/Home'
import { AdminPage } from './pages/Admin'
import { NotFoundPage } from './pages/NotFound'
import { FamiliesIndexPage } from './pages/FamiliesIndex'
import { FamilyDrinksPage } from './pages/FamilyDrinks'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="families" element={<FamiliesIndexPage />} />
        <Route path="families/:slug" element={<FamilyDrinksPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
