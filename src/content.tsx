
// src/content.tsx
import React, { useEffect, useState } from 'react'
import SelectionPopup from './components/SelectionPopup'
export const App: React.FC = () => {
  const [selection, setSelection] = useState({
    text: '',
    position: { x: 0, y: 0 }
  })

  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString().trim()
      
      if (selectedText && selectedText.length > 0) {
        const range = window.getSelection()?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        
        if (rect) {
          const scrollX = window.scrollX || window.pageXOffset
          const scrollY = window.scrollY || window.pageYOffset
          
          setSelection({
            text: selectedText,
            position: {
              x: rect.left + scrollX,
              y: rect.top + scrollY
            }
          })
        }
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleClose = () => {
    setSelection({ text: '', position: { x: 0, y: 0 } })
  }

  return selection.text ? (
    <SelectionPopup
      selectedText={selection.text}
      position={selection.position}
      onClose={handleClose}
    />
  ) : null
}