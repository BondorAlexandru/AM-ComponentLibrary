import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'
import { DEFAULT_THEME, applyTheme, type ThemeId } from './themes.ts'

// Apply the stored theme before first paint so specimens never flash the wrong palette.
applyTheme((localStorage.getItem('am-ui-docs-theme') as ThemeId | null) ?? DEFAULT_THEME)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
