import React, { useState, useCallback } from 'react';
import { OutfitSuggestion, OutfitVariation } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SuggestionCard from './components/SuggestionCard';
import { ArrowPathIcon, ExclamationTriangleIcon } from './components/icons';
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
      const fetchedSuggestions = await getOutfitSuggestions(base64, file.type, selectedSeason, occasion);

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
  }, [pendingImage, selectedSeason]);

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
          <OccasionSelector onOccasionSelect={handleOccasionSelect} />
        </div>
      );
    }
    
    if (appState === 'loadingSuggestions') {
      return <ProgressTracker />;
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