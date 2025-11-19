import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [key, setKey] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSaveClick = () => {
    onSave(key);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Your Gemini API Key</h2>
        <p className="text-gray-600 mb-6">
          To use the AI chat assistant, please provide your Google Gemini API key. Your key will be stored locally in your browser.
        </p>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your key here"
            aria-required="true"
          />
        </div>
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-green-600 hover:underline mb-6 block"
        >
          Get your API key from Google AI Studio
        </a>
        <button
          onClick={handleSaveClick}
          disabled={!key.trim()}
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;