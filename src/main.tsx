import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme'
import { AuthProvider } from './hooks/useAuthUser'
import { createAppPersistOptions, createAppQueryClient } from './lib/queryClient'

const queryClient = createAppQueryClient()
const persistOptions = createAppPersistOptions()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PersistQueryClientProvider>
        </MotionConfig>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
