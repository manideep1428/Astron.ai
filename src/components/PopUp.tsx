import React, { useState } from 'react';
import Chat from './Chatbot';
import Summarize from './Summarize';
import Translate from './Translate';
import Rewrite from './Rewrite';

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'chat' | 'summarize' | 'translate' | 'rewrite'>('chat');

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <Chat />;
      case 'summarize':
        return <Summarize />;
      case 'translate':
        return <Translate />;
      case 'rewrite':
        return <Rewrite />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-white shadow-lg rounded-md">
      {/* Navigation */}
      <div className="flex justify-around p-3 bg-gray-100 border-b">
        <button
          onClick={() => setCurrentPage('chat')}
          className={`flex flex-col items-center p-2 ${currentPage === 'chat' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <span className="text-xs">Chat</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-4">{renderPage()}</div>
    </div>
  );
};

export default Popup;
