import React from 'react';
import { KeyIcon, ExclamationTriangleIcon } from './icons';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
  apiKeyError: boolean;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected, apiKeyError }) => {

  const handleSelectKey = async () => {
    // The window.aistudio.openSelectKey function is provided by the environment.
    // It opens a dialog for the user to select their API key.
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // As per guidelines, we assume the key selection was successful after the dialog closes.
      onKeySelected();
    } else {
      // Fallback for development or if the function isn't available
      alert("API key selection is not available in this environment.");
    }
  };

  return (
    <div className="w-full max-w-lg text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200 animate-fade-in">
      <div className="flex justify-center items-center mb-4">
        <KeyIcon className="w-16 h-16 text-indigo-500"/>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Set Your API Key</h2>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        Roopix AI requires a Google Gemini API key to generate your personalized style recommendations. Please select your key to continue.
      </p>

      {apiKeyError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-left" role="alert">
          <div className="flex">
            <div className="py-1"><ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-4"/></div>
            <div>
              <p className="font-bold">Invalid API Key</p>
              <p className="text-sm">The previously selected API key is invalid or lacks permissions. Please select a different key.</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSelectKey}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors shadow-lg"
      >
        Select Your Gemini API Key
      </button>
      <p className="text-xs text-slate-500 mt-4">
        This application uses the Gemini API. Standard billing rates may apply. For more information, please see <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">Gemini API billing documentation</a>.
      </p>
    </div>
  );
};

export default ApiKeySelector;
