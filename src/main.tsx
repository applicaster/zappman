import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// navigator.serviceWorker.register("/localhost-sw.js?v1");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
