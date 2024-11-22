import React, { useState } from 'react';
import { TranslateSVG } from './svgs';

const Translate: React.FC = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [language, setLanguage] = useState('es'); // Default to Spanish
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }
  ];

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      // Placeholder for actual translation API
      const response = await new Promise<string>((resolve) => 
        setTimeout(() => resolve(`Translated text in ${language}`), 1500)
      );
      setTranslatedText(response);
    } catch (error) {
      console.error('Translation error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <TranslateSVG className="mr-2" />
        <h2 className="text-xl font-bold">Webpage Translator</h2>
      </div>

      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <button 
        onClick={handleTranslate}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 
          disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? 'Translating...' : 'Translate Current Page'}
      </button>

      {translatedText && (
        <div className="bg-gray-100 p-3 rounded">
          <h3 className="font-semibold mb-2">Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default Translate;