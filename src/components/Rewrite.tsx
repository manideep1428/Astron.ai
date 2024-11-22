import React, { useState } from 'react';
import { Edit } from 'lucide-react';

const Rewrite: React.FC = () => {
  const [rewrittenText, setRewrittenText] = useState('');
  const [tone, setTone] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'academic', label: 'Academic' },
    { value: 'creative', label: 'Creative' }
  ];

  const handleRewrite = async () => {
    setIsLoading(true);
    try {
      // Placeholder for actual rewriting API
      const response = await new Promise<string>((resolve) => 
        setTimeout(() => resolve(`Rewritten text in ${tone} tone`), 1500)
      );
      setRewrittenText(response);
    } catch (error) {
      console.error('Rewriting error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Edit className="mr-2" />
        <h2 className="text-xl font-bold">Text Rewriter</h2>
      </div>

      <select 
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        {tones.map(t => (
          <option key={t.value} value={t.value}>
            {t.label} Tone
          </option>
        ))}
      </select>

      <button 
        onClick={handleRewrite}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 
          disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? 'Rewriting...' : 'Rewrite Current Page'}
      </button>

      {rewrittenText && (
        <div className="bg-gray-100 p-3 rounded">
          <h3 className="font-semibold mb-2">Rewritten Text:</h3>
          <p>{rewrittenText}</p>
        </div>
      )}
    </div>
  );
};

export default Rewrite;