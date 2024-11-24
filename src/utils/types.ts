export interface Message {
    role: 'user' | 'assistant'
    content: string
  }
  
  export interface SuggestionButtonProps {
    icon: React.ReactNode
    label: string
    sublabel?: string
    onClick: () => void
  }
  
  