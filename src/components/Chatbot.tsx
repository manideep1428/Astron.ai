import  { useState } from 'react';
import { MessageSquare, RefreshCcw, FileText, Send } from 'lucide-react';

export default function  ChatInterface() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-[600px] bg-gray-900">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2 p-2 border-b border-gray-700">
        <button className="flex items-center justify-center gap-1.5 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white">
          <FileText size={16} />
          <span className="text-xs">Summarize</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white">
          <RefreshCcw size={16} />
          <span className="text-xs">Rewriter</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white">
          <MessageSquare size={16} />
          <span className="text-xs">Translate</span>
        </button>
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
};
