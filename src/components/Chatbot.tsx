import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTool, setActiveTool] = useState<'chat' | 'summarize' | 'translate' | 'rewrite'>('chat');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = { text: inputMessage, sender: 'user' };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          text: `AI response to: ${inputMessage}`,
          sender: 'ai',
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const applyTool = () => {
    if (messages.length === 0 || messages[messages.length - 1].sender !== 'user') return;

    const lastUserMessage = messages[messages.length - 1].text;
    let toolResponse = '';

    switch (activeTool) {
      case 'summarize':
        toolResponse = `Summarized: ${lastUserMessage.substring(0, 50)}...`; // Simulate summary
        break;
      case 'translate':
        toolResponse = `Translated: [EN → SP]: ${lastUserMessage}`; // Simulate translation
        break;
      case 'rewrite':
        toolResponse = `Rewritten: ${lastUserMessage.replace(/\./g, '!')}`; // Simulate rewrite
        break;
      default:
        return;
    }

    setMessages((prev) => [...prev, { text: toolResponse, sender: 'ai' }]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tools Navigation */}
      <div className="flex justify-around p-2 bg-gray-100 border-b">
        {['chat', 'summarize', 'translate', 'rewrite'].map((tool) => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool as 'chat' | 'summarize' | 'translate' | 'rewrite')}
            className={`p-2 rounded ${
              activeTool === tool ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tool.charAt(0).toUpperCase() + tool.slice(1)}
          </button>
        ))}
        {activeTool !== 'chat' && (
          <button
            onClick={applyTool}
            className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
          >
            Apply
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-[80%] ${
              msg.sender === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-100 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex p-2 border-t">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
