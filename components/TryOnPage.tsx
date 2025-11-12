import React, { useState, useEffect, useCallback } from 'react';
import { generateTryOnImages } from '../services/geminiService';
import GeneratedImageViewer from './GeneratedImageViewer';
import { ArrowLeftIcon, ExclamationTriangleIcon } from './icons';
import { OutfitSuggestion } from '../types';
import ImageGenerationSkeleton from './ImageGenerationSkeleton';

interface TryOnPageProps {
  userImage: string;
  suggestion: OutfitSuggestion;
  initialIndex: number;
  onBack: () => void;
  favorites: string[];
  onAddFavorite: (imageUrl: string) => void;
  onRemoveFavorite: (imageUrl:string) => void;
  isFavorite: (imageUrl: string) => boolean;
}

const TryOnPage: React.FC<TryOnPageProps> = ({ userImage, suggestion, initialIndex, onBack, favorites, onAddFavorite, onRemoveFavorite }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [generatedImagesCache, setGeneratedImagesCache] = useState<Record<number, string[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<number, string | null>>({});

  const performTryOn = useCallback(async (index: number) => {
    // Do not generate if images are already cached
    if (generatedImagesCache[index]) return;

    setLoadingStates(prev => ({ ...prev, [index]: true }));
    setErrorStates(prev => ({ ...prev, [index]: null }));

    try {
      const base64Image = userImage.split(',')[1];
      const mimeType = userImage.split(';')[0].split(':')[1];
      const outfitDescription = suggestion.outfits[index].description;
      
      const images = await generateTryOnImages(base64Image, mimeType, outfitDescription);

      if (images && images.length > 0) {
        setGeneratedImagesCache(prev => ({ ...prev, [index]: images }));
      } else {
        throw new Error("Could not generate try-on images. The AI returned no images.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorStates(prev => ({ ...prev, [index]: `Failed to generate try-on images: ${e.message}. Please try again.`}));
    } finally {
        setLoadingStates(prev => ({ ...prev, [index]: false }));
    }
  }, [userImage, suggestion, generatedImagesCache]);
  
  useEffect(() => {
    performTryOn(currentIndex);
  }, [currentIndex, performTryOn]);

  const renderContent = () => {
    const isLoading = loadingStates[currentIndex];
    const currentError = errorStates[currentIndex];
    const currentImages = generatedImagesCache[currentIndex];

    if (isLoading) {
      return <ImageGenerationSkeleton outfitType={suggestion.type} variationIndex={currentIndex} />;
    }
    
    if (currentError) {
      return (
         <div className="mt-8 flex items-center justify-center h-full">
              <div className="text-center bg-red-100 border border-red-300 text-red-800 rounded-lg p-6 w-full max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-4">
                      <ExclamationTriangleIcon className="w-12 h-12 text-red-500"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Image Generation Failed</h3>
                  <p className="text-md">{currentError}</p>
              </div>
          </div>
      );
    }
    
    if (currentImages) {
        return (
          <GeneratedImageViewer 
            images={currentImages} 
            outfitType={suggestion.type}
            favorites={favorites}
            onAddFavorite={onAddFavorite}
            onRemoveFavorite={onRemoveFavorite}
           />
        );
    }

    return null;
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-slate-600 font-semibold hover:text-indigo-600 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Suggestions
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Your Photo</h2>
          <img src={userImage} alt="User's original upload" className="rounded-2xl shadow-lg object-contain max-h-[500px] w-full" />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{suggestion.type} Look Variations</h3>
             <div className="flex border-b border-slate-200">
                {suggestion.outfits.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`flex-1 py-2 px-1 text-sm font-medium transition-colors ${currentIndex === index ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Outfit {index + 1}
                    </button>
                ))}
            </div>
            <div className="pt-4 animate-fade-in">
                <p className="text-slate-600">{suggestion.outfits[currentIndex].description}</p>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TryOnPage;