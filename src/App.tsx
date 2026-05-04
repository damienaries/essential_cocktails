import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/Home'
import { AdminLayout } from './pages/AdminLayout'
import { AdminAddPage } from './pages/AdminAddPage'
import { AdminListPage } from './pages/AdminListPage'
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
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="list" replace />} />
          <Route path="list" element={<AdminListPage />} />
          <Route path="add" element={<AdminAddPage />} />
        </Route>
      </Route>
      <Route path="home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
