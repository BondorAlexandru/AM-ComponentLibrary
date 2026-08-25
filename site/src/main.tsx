import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AmUiMotionConfig } from '@am/ui'
import './styles.css'
import App from './App.tsx'
import { DEFAULT_THEME, applyTheme, type ThemeId } from './themes.ts'

// Apply the stored theme before first paint so specimens never flash the wrong palette.
applyTheme((localStorage.getItem('am-ui-docs-theme') as ThemeId | null) ?? DEFAULT_THEME)

// The whole consumer integration, and the site is a consumer: `AmUiMotionConfig`
// renders Motion's `<MotionConfig reducedMotion="user">`, so every specimen on
// every page honours the OS preference without a conditional per component.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AmUiMotionConfig>
      <App />
    </AmUiMotionConfig>
  </StrictMode>,
)
