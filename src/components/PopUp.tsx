import { useState, useEffect } from 'react';
import { MessageSquare, RefreshCcw, FileText, Send, X, ChevronDown } from 'lucide-react';
import { chatWithAI } from '../api/services';
import { summarizeText } from '../api/summarize';
import { supportedLanguages, translateText } from '../api/translate';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Popup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [pageContent, setPageContent] = useState('');

  useEffect(() => {
    // Simulating getting current tab's content
    // In a real extension, you'd use chrome.tabs.query to get the active tab and its content
    setPageContent("This is the content of the current tab. It would be much longer in a real scenario.");
  }, []);

  const handleSend = async () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText('');
      await handleUserInput(inputText);
    }
  };

  const handleUserInput = async (input: string) => {
    setIsLoading(true);
    try {
      const response = await chatWithAI(input);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { text: `Error: ${error.message}`, isUser: false }]);
    }
    setIsLoading(false);
  };

  const handleAction = async (action: 'summarize' | 'translate' | 'rewrite') => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'summarize':
          const summary = await summarizeText(pageContent);
          setMessages(prev => [...prev, { text: `Summary: ${summary}`, isUser: false }]);
          break;
        case 'translate':
          setShowLanguageSelect(true);
          break;
        case 'rewrite':
          setMessages(prev => [...prev, { text: "What would you like me to rewrite? I can use the current page or your bookmarks.", isUser: false }]);
          break;
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { text: `Error: ${error.message}`, isUser: false }]);
    }
    setIsLoading(false);
  };

  const handleTranslate = async () => {
    if (selectedLanguage) {
      setIsLoading(true);
      try {
        const translatedContent = await translateText(pageContent, selectedLanguage);
        setMessages(prev => [...prev, { text: `Translated content: ${translatedContent.substring(0, 100)}...`, isUser: false }]);
      } catch (error: any) {
        setMessages(prev => [...prev, { text: `Translation error: ${error.message}`, isUser: false }]);
      }
      setIsLoading(false);
      setShowLanguageSelect(false);
      setSelectedLanguage('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Astron
        </h1>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-3 p-3 border-b border-gray-700 bg-gray-800/50">
        {['summarize', 'translate', 'rewrite'].map((action) => (
          <button
            key={action}
            onClick={() => handleAction(action as 'summarize' | 'translate' | 'rewrite')}
            className="flex flex-col items-center justify-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {action === 'summarize' && <FileText size={20} className="mb-1 text-blue-400" />}
            {action === 'translate' && <MessageSquare size={20} className="mb-1 text-green-400" />}
            {action === 'rewrite' && <RefreshCcw size={20} className="mb-1 text-purple-400" />}
            <span className="text-xs font-medium capitalize">{action} Page</span>
          </button>
        ))}
      </div>

      {/* Language Select Modal */}
      {showLanguageSelect && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80 transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-400">Select Target Language</h2>
              <button 
                onClick={() => setShowLanguageSelect(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select a language</option>
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={handleTranslate}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Translate
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              } shadow-md transition-all duration-300 hover:shadow-lg`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-white shadow-md">
              <Skeleton />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
}

