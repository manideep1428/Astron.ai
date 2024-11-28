import React, { useState, useEffect, useRef } from "react"
import { RewriteSVG, SummarizesSVG, TranslateSVG } from "./svgs"
import ActionPopup from "./ActionPopup"
import { BookA, X } from "lucide-react"

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
  const [activeAction, setActiveAction] = useState<'summarize' | 'define' | 'translate' | 'rewrite' | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = document.documentElement.classList.contains('dark') || 
                  document.body.classList.contains('dark') ||
                  mediaQuery.matches

    setIsDarkMode(isDark)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    const isClosedUntilRefresh = localStorage.getItem("popupClosedUntilRefresh") === "true"
    
    if (!isClosedUntilRefresh) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible])

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
    handleClose()
  }

  const handleActionClick = (action: 'summarize' | 'define' | 'translate' | 'rewrite') => {
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

  const baseTheme = isDarkMode ? {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    buttonBg: 'bg-gray-100',
    buttonHover: 'hover:bg-gray-200',
    buttonText: 'text-gray-900'
  } : {
    bg: 'bg-gray-900',
    text: 'text-white',
    border: 'border-gray-700',
    buttonBg: 'bg-gray-800',
    buttonHover: 'hover:bg-gray-700',
    buttonText: 'text-white'
  }

  return (
    <>
      <div
        ref={popupRef}
        className={`fixed rounded-md shadow-lg border backdrop-blur-sm p-2.5 z-[2147483647] transition-all duration-200 ${baseTheme.bg} ${baseTheme.text} ${baseTheme.border}`}
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          minWidth: "160px",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {showCloseOptions ? (
          <div className="flex flex-row items-center gap-1.5 text-xs">
            <button
              onClick={handleClose}
              className={`px-2 py-1 rounded ${baseTheme.buttonBg} ${baseTheme.buttonText} ${baseTheme.buttonHover} transition-colors duration-150`}
            >
              Close
            </button>
            <button
              onClick={handleCloseUntilRefresh}
              className="px-2 py-1 rounded bg-red-500/90 text-white hover:bg-red-600/90 transition-colors duration-150"
            >
              Until Refresh
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleCloseClick}
              className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full ${baseTheme.buttonBg} ${baseTheme.buttonText} ${baseTheme.buttonHover} transition-all duration-150 shadow-md hover:scale-110 border ${baseTheme.border}`}
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex flex-wrap gap-1.5">
              {[
                { action: 'summarize', icon: <SummarizesSVG className="w-3 h-3" />, label: 'Summarize' },
                { action: 'define', icon: <BookA className="w-3 h-3" />, label: 'Define' },
                { action: 'translate', icon: <TranslateSVG className="w-3 h-3" />, label: 'Translate' },
                { action: 'rewrite', icon: <RewriteSVG className="w-3 h-3" />, label: 'Rewrite' },
              ].map(({ action, icon, label }) => (
                <button
                  key={action}
                  onClick={() => handleActionClick(action as any)}
                  className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded ${baseTheme.buttonBg} ${baseTheme.buttonText} ${baseTheme.buttonHover} transition-all duration-150 hover:scale-105 hover:shadow-sm`}
                >
                  {icon}
                  {label}
                </button>
              ))}
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