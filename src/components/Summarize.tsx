import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const Summarize: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      // Placeholder for actual API call
      const response = await new Promise<string>((resolve) => 
        setTimeout(() => resolve("Summary of the webpage content..."), 1500)
      );
      setSummary(response);
    } catch (error) {
      console.error('Summarization error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Sparkles className="mr-2" />
        <h2 className="text-xl font-bold">Webpage Summarizer</h2>
      </div>

      <button 
        onClick={handleSummarize}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 
          disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? 'Summarizing...' : 'Summarize Current Page'}
      </button>

      {summary && (
        <div className="bg-gray-100 p-3 rounded">
          <h3 className="font-semibold mb-2">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summarize;