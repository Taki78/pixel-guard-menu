import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ItemStoreProvider } from './store/ItemStoreContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ItemStoreProvider>
        <App />
      </ItemStoreProvider>
    </BrowserRouter>
  </StrictMode>
)
