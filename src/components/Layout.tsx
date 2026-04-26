import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>Essential Cocktails</div>
        <nav style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '24px 20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

