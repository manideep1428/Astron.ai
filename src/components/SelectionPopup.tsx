import { BookA, X } from 'lucide-react'
import React, { useState, useEffect } from "react"
import { SummarizesSVG, TranslateSVG } from "./svgs"
import ActionPopup from "./ActionPopup"

interface SelectionPopupProps {
  selectedText: string
  position: { x: number; y: number }
  onClose: () => void
}

const SelectionPopup: React.FC<SelectionPopupProps> = ({
  selectedText,
  position,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showCloseOptions, setShowCloseOptions] = useState(false)
  const [activeAction, setActiveAction] = useState<'summarize' | 'define' | 'translate' | null>(null)

  useEffect(() => {
    const isClosedUntilRefresh = localStorage.getItem("popupClosedUntilRefresh") === "true"
    
    if (!isClosedUntilRefresh) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseClick = () => {
    setShowCloseOptions(true)
  }

  const handleClose = () => {
    setIsVisible(false)
    setShowCloseOptions(false)
    onClose()
  }

  const handleCloseUntilRefresh = () => {
    localStorage.setItem("popupClosedUntilRefresh", "true")
    setIsVisible(false)
    setShowCloseOptions(false)
    onClose()
  }

  const handleActionClick = (action: 'summarize' | 'define' | 'translate') => {
    setActiveAction(action)
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("popupClosedUntilRefresh")
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  if (!isVisible) return null

  return (
    <>
      <div
        className={`fixed rounded-lg shadow-lg border p-2 z-[2147483647] transition-opacity duration-300 ${
          document.documentElement.classList.contains("dark")
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          minWidth: "140px",
          opacity: isVisible ? 1 : 0,
        }}
      >
        {showCloseOptions ? (
          <div className="flex flex-row items-center gap-2 text-xs">
            <button
              onClick={handleClose}
              className="px-2 py-1 rounded bg-black text-white dark:bg-gray-600 dark:hover:bg-gray-500 hover:bg-gray-700"
            >
              Close
            </button>
            <button
              onClick={handleCloseUntilRefresh}
              className="px-2 py-1 rounded bg-red-600 text-white dark:bg-red-500 dark:hover:bg-red-400 hover:bg-red-700"
            >
              Until Refresh
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleCloseClick}
              className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Close"
            >
              <X className="w-2 h-2" />
            </button>

            <div className="flex flex-row gap-1 mt-1">
              <button
                onClick={() => handleActionClick('summarize')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <SummarizesSVG className="w-3 h-3" />
                Summarize
              </button>
              <button
                onClick={() => handleActionClick('define')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <BookA className="w-3 h-3" />
                Define
              </button>
              <button
                onClick={() => handleActionClick('translate')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <TranslateSVG className="w-3 h-3" />
                Translate
              </button>
            </div>
          </>
        )}
      </div>
      {activeAction && (
        <ActionPopup
          action={activeAction}
          selectedText={selectedText}
          onClose={() => setActiveAction(null)}
        />
      )}
    </>
  )
}

export default SelectionPopup

