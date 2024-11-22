import  { useEffect, useState } from 'react'
import SelectionPopup from './SelectionPopup'

const ContentScript = () => {
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
          setSelection({
            text: selectedText,
            position: {
              x: rect.left + window.scrollX,
              y: rect.bottom + window.scrollY
            }
          })
        }
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
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

export default ContentScript