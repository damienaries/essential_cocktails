import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RequireAdmin } from './components/RequireAdmin'
import { RequireAuth } from './components/RequireAuth'
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
import { AccountLayout } from './pages/AccountLayout'
import { AccountProfilePage } from './pages/AccountProfile'
import { AccountSavedPage } from './pages/AccountSaved'
import { AccountMenusPage } from './pages/AccountMenus'

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
          path="account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<AccountProfilePage />} />
          <Route path="saved" element={<AccountSavedPage />} />
          <Route path="menus" element={<AccountMenusPage />} />
        </Route>
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
