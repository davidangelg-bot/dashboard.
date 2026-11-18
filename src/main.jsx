import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'

window.addEventListener('error', (e) => {
  document.body.innerHTML = `<pre style="padding:16px;color:red;white-space:pre-wrap">${e.message}</pre>`
})

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} catch (e) {
  document.body.innerHTML = `<pre style="padding:16px;color:red;white-space:pre-wrap">${e.message}</pre>`
}
