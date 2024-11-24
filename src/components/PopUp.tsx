import { useState, } from 'react';
import { MessageSquare, RefreshCcw, FileText, Send, } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Popup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText('');
      handleUserInput(inputText);
    }
  };

  const handleUserInput = async (input: string) => {
    setIsLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (input.toLowerCase().includes('rewrite')) {
      setMessages(prev => [...prev, { text: "What would you like me to rewrite? I can use the current page or your bookmarks.", isUser: false }]);
    } else {
      setMessages(prev => [...prev, { text: "I've processed your request. Here's a simulated response.", isUser: false }]);
    }
    setIsLoading(false);
  };

  const handleAction = async (action: 'summarize' | 'rewrite' | 'translate') => {
    setIsLoading(true);
    // Simulating getting current tab's content
    const tabContent = "This is the content of the current tab.";
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = '';
    switch (action) {
      case 'summarize':
        response = `Here's a summary of the current page: ${tabContent.substring(0, 50)}...`;
        break;
      case 'rewrite':
        setMessages(prev => [...prev, { text: "What would you like me to rewrite? I can use the current page or your bookmarks.", isUser: false }]);
        setIsLoading(false);
        return;
      case 'translate':
        response = `Here's the translated content: ${tabContent.substring(0, 50)}...`;
        break;
    }
    
    setMessages(prev => [...prev, { text: response, isUser: false }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-gray-900">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h1 className="text-lg font-semibold text-white">Astron</h1>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2 p-2 border-b border-gray-700">
        <div
          onClick={() => handleAction('summarize')}
          className="flex items-center justify-center gap-1.5 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white cursor-pointer"
        >
          <FileText size={16} />
          <span className="text-xs">Summarize the Page</span>
        </div>
        <div
          onClick={() => handleAction('translate')}
          className="flex items-center justify-center gap-1.5 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white cursor-pointer"
        >
          <MessageSquare size={16} />
          <span className="text-xs">Translate the Page</span>
        </div>
        <div
          onClick={() => handleAction('rewrite')}
          className="flex items-center justify-center gap-1.5 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white cursor-pointer"
        >
          <RefreshCcw size={16} />
          <span className="text-xs">Rewriter</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-2 rounded-lg bg-gray-800 text-white">
              <Skeleton />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex items-center space-x-2 animate-pulse">
      <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
      <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
      <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
    </div>
  );
}

