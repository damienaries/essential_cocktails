import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Layout } from './components/Layout'
import { DrinkRouteModal } from './components/DrinkRouteModal'
import { useDrinkRoute, useRoutedLocation } from './hooks/useDrinkRoute'
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
import { SignUpPage } from './pages/SignUp'
import { AccountLayout } from './pages/AccountLayout'
import { AccountIndexPage } from './pages/AccountIndex'
import { AccountProfilePage } from './pages/AccountProfile'
import { AccountSavedPage } from './pages/AccountSaved'
import { AccountMenusPage } from './pages/AccountMenus'
import { AccountMenuDetailPage } from './pages/AccountMenuDetail'

function App() {
  // A drink URL renders the modal *over* a page rather than as a page, so the routed
  // location is the page behind it rather than the drink's own URL.
  const routedLocation = useRoutedLocation()
  const { isOpen: drinkOpen } = useDrinkRoute()

  return (
    <>
    <Routes location={routedLocation}>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="families" element={<FamiliesIndexPage />} />
        <Route path="families/:slug" element={<FamilyDrinksPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route
          path="account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }>
          <Route index element={<AccountIndexPage />} />
          <Route path="profile" element={<AccountProfilePage />} />
          <Route path="saved" element={<AccountSavedPage />} />
          <Route path="menus" element={<AccountMenusPage />} />
          <Route path="menus/:menuSlug" element={<AccountMenuDetailPage />} />
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

    {/* Keyed once, not per drink: the modal handles its own prev/next slide, and
        remounting it on every slug change would flash instead of animate. */}
    <AnimatePresence>
      {drinkOpen ? <DrinkRouteModal key="drink-modal" /> : null}
    </AnimatePresence>
    </>
  )
}

export default App
