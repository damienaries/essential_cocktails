import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RequireAdmin } from './components/RequireAdmin'
import { HomePage } from './pages/Home'
import { AdminLayout } from './pages/AdminLayout'
import { AdminAddPage } from './pages/AdminAddPage'
import { AdminListPage } from './pages/AdminListPage'
import { NotFoundPage } from './pages/NotFound'
import { FamiliesIndexPage } from './pages/FamiliesIndex'
import { FamilyDrinksPage } from './pages/FamilyDrinks'
import { GlossaryPage } from './pages/Glossary'
import { AboutPage } from './pages/About'
import { SignInPage } from './pages/SignIn'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="families" element={<FamiliesIndexPage />} />
        <Route path="families/:slug" element={<FamilyDrinksPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route
          path="admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }>
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
