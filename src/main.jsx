import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './registerSW.js'
import App from './App.jsx'
import LoginGate from './LoginGate.jsx'
import InstallGate from './InstallGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InstallGate>
      <LoginGate>
        <App />
      </LoginGate>
    </InstallGate>
  </StrictMode>,
)
