import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import './index.css'
import App from './App.tsx'
import { createAppQueryClient, QUERY_GC_TIME_MS } from './lib/queryClient'

const queryClient = createAppQueryClient()

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'ec:v1:rq',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: QUERY_GC_TIME_MS,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] === 'drinks',
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistQueryClientProvider>
  </StrictMode>,
)
