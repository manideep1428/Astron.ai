import React from 'react'
import ReactDOM from 'react-dom/client'
import ContentScript from './components/contentScript'
import './index.css'
import Popup from './components/PopUp'

const MOUNT_ELEMENT_ID = 'root'

if (!document.getElementById("root")) {
  const mountPoint = document.createElement('div')
  mountPoint.id = MOUNT_ELEMENT_ID
  document.body.appendChild(mountPoint)
}

const root = ReactDOM.createRoot(document.getElementById(MOUNT_ELEMENT_ID)!)

// Render different components based on the context
if (window.location.protocol === 'chrome-extension:') {
  // Popup context
  root.render(
    <React.StrictMode>
      <Popup/>
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <ContentScript />
    </React.StrictMode>
  )
}
