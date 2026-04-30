import { SvgIcon } from '../components/atoms/SvgIcon'

export function AdminPage() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Admin</h1>
      <p>Placeholder for CRUD (add/edit/delete cocktails, manage images).</p>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <SvgIcon icon="delete" />
        <span style={{ fontSize: 14, color: 'var(--text)' }}>Icon smoke test</span>
      </div>
    </div>
  )
}

