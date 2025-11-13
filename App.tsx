import React, { useState, useCallback } from 'react';
import { OutfitSuggestion, OutfitVariation } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SuggestionCard from './components/SuggestionCard';
import { ArrowPathIcon, ExclamationTriangleIcon, WandSparklesIcon, QuestionMarkCircleIcon } from './components/icons';
import SeasonSelector from './components/SeasonSelector';
import OccasionSelector from './components/OccasionSelector';
import ProgressTracker from './components/ProgressTracker';
import TryOnPage from './components/TryOnPage';
import { useFavorites } from './hooks/useFavorites';
import FavoritesGallery from './components/FavoritesGallery';
import HomePage from './components/HomePage';
import Footer from './components/Footer';

type AppState = 'home' | 'initial' | 'awaitingSeason' | 'awaitingOccasion' | 'loadingSuggestions' | 'suggestionsReady' | 'viewingTryOn' | 'error';

interface TryOnData {
  userImage: string;
  suggestion: OutfitSuggestion;
  initialIndex: number;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<{ file: File; base64: string } | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [tryOnData, setTryOnData] = useState<TryOnData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inDepthMode, setInDepthMode] = useState<boolean>(false);
  
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();


  const handleImageUpload = useCallback(async (file: File) => {
    setAppState('awaitingSeason');
    setError(null);
    setSuggestions([]);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const fullBase64 = reader.result as string;
      setUserImage(fullBase64);
      setPendingImage({ file, base64: fullBase64.split(',')[1] });
    };
    reader.onerror = () => {
      setError("Failed to read the uploaded file.");
      setAppState('error');
    };
  }, []);

  const handleSeasonSelect = useCallback(async (season: string) => {
    setSelectedSeason(season);
    setAppState('awaitingOccasion');
  }, []);

  const handleOccasionSelect = useCallback(async (occasion: string) => {
    if (!pendingImage || !selectedSeason) return;

    try {
      setAppState('loadingSuggestions');
      const { base64, file } = pendingImage;

      // Lazy import to improve initial load time
      const { getOutfitSuggestions } = await import('./services/geminiService');
      const fetchedSuggestions = await getOutfitSuggestions(base64, file.type, selectedSeason, occasion, inDepthMode);

      if (fetchedSuggestions && fetchedSuggestions.length > 0) {
        setSuggestions(fetchedSuggestions);
        setAppState('suggestionsReady');
      } else {
        throw new Error("Could not generate outfit suggestions. The response was empty.");
      }
    } catch (e: any) {
      console.error(e);
      setError(`Failed to get suggestions: ${e.message}. Please try a different image or prompt.`);
      setAppState('error');
    }
  }, [pendingImage, selectedSeason, inDepthMode]);

  const handleTryOn = useCallback((suggestion: OutfitSuggestion, initialIndex: number) => {
    if (!userImage) return;
    setTryOnData({
      userImage,
      suggestion,
      initialIndex,
    });
    setAppState('viewingTryOn');
  }, [userImage]);

  const handleBackToSuggestions = () => {
    setTryOnData(null);
    setAppState('suggestionsReady');
  };
  
  const handleReset = () => {
    setAppState('home');
    setUserImage(null);
    setPendingImage(null);
    setSelectedSeason(null);
    setSuggestions([]);
    setTryOnData(null);
    setError(null);
    setInDepthMode(false);
  };

  const handleGetStarted = () => {
    setAppState('initial');
  }
  
  const renderContent = () => {
    if (appState === 'home') {
      return <HomePage onGetStarted={handleGetStarted} />
    }
    
    if (appState === 'viewingTryOn' && tryOnData) {
      return (
          <TryOnPage 
            userImage={tryOnData.userImage}
            suggestion={tryOnData.suggestion}
            initialIndex={tryOnData.initialIndex}
            onBack={handleBackToSuggestions}
            favorites={favorites}
            onAddFavorite={addFavorite}
            onRemoveFavorite={removeFavorite}
            isFavorite={isFavorite}
          />
      );
    }

    if (appState === 'initial') {
      return <ImageUploader onImageUpload={handleImageUpload} />;
    }
    
    if (appState === 'awaitingSeason' && userImage) {
      return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Photo</h2>
            <img src={userImage} alt="User upload" className="rounded-2xl shadow-lg object-contain max-h-[500px] w-full" />
          </div>
          <SeasonSelector onSeasonSelect={handleSeasonSelect} />
        </div>
      );
    }
    
    if (appState === 'awaitingOccasion' && userImage) {
      return (
         <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Photo</h2>
            <img src={userImage} alt="User upload" className="rounded-2xl shadow-lg object-contain max-h-[500px] w-full" />
          </div>
          <div className="flex flex-col gap-6">
            <OccasionSelector onOccasionSelect={handleOccasionSelect} />
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-slate-200 self-center">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <WandSparklesIcon className="w-8 h-8 text-indigo-500 mr-4" />
                        <label htmlFor="in-depth-toggle" className="flex flex-col text-left cursor-pointer">
                            <span className="font-semibold text-slate-800">Activate Nayara</span>
                            <span className="text-sm text-slate-500">Get a hyper-personalized consultation.</span>
                        </label>
                         <div className="relative group flex items-center ml-2">
                            <QuestionMarkCircleIcon className="w-5 h-5 text-slate-400 cursor-help" />
                            <div className="absolute bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2 shadow-lg">
                                Activates Nayara's expert mode for hyper-personalized consultations, which may take longer.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                            </div>
                        </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="in-depth-toggle" 
                            className="sr-only peer" 
                            checked={inDepthMode}
                            onChange={(e) => setInDepthMode(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-indigo-500 transition peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                </div>
                {inDepthMode && (
                    <div className="mt-4 text-sm text-indigo-800 bg-indigo-100 rounded-lg p-3 text-center transition-all duration-300 animate-fade-in">
                        <strong>Please note:</strong> A consultation with Nayara takes longer, typically around 1 minute.
                    </div>
                )}
            </div>
          </div>
        </div>
      );
    }
    
    if (appState === 'loadingSuggestions') {
      return <ProgressTracker isExpertMode={inDepthMode} />;
    }

    if (error) {
       return (
         <div className="text-center bg-red-100 border border-red-300 text-red-800 rounded-lg p-6 w-full max-w-2xl mx-auto">
           <div className="flex items-center justify-center mb-4">
             <ExclamationTriangleIcon className="w-12 h-12 text-red-500"/>
           </div>
           <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
           <p className="text-md mb-6">{error}</p>
           <button onClick={handleReset} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto">
             <ArrowPathIcon className="w-5 h-5 mr-2"/>
             Try Again
           </button>
         </div>
       );
    }
    
    if (appState === 'suggestionsReady' && userImage) {
       return (
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Your Photo</h2>
                <img src={userImage} alt="User upload" className="rounded-2xl shadow-lg object-contain max-h-[500px] w-full" />
                <button onClick={handleReset} className="mt-6 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2"/>
                  Start Over
                </button>
                {favorites.length > 0 && (
                    <FavoritesGallery favorites={favorites} onRemove={removeFavorite} />
                )}
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center lg:text-left">Outfit Suggestions</h2>
                <div className="space-y-6">
                  {suggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.type}
                      suggestion={suggestion}
                      onTryOn={handleTryOn}
                      isDisabled={appState !== 'suggestionsReady'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
       );
    }

    return null;
  }
  
  const isHomePage = appState === 'home';
  const mainContent = renderContent();

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'bg-white' : 'bg-slate-100'}`}>
      <Header onHomeClick={handleReset} />
      <main className="flex-grow w-full">
        {isHomePage ? (
          mainContent
        ) : (
          <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
             {mainContent}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;