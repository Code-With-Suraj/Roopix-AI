import React, { useState } from 'react';
import { HeartIconSolid, XMarkIcon } from './icons';
import ImageModal from './ImageModal';

interface FavoritesGalleryProps {
    favorites: string[];
    onRemove: (imageUrl: string) => void;
}

const FavoritesGallery: React.FC<FavoritesGalleryProps> = ({ favorites, onRemove }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div className="w-full mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
                <div className="flex items-center mb-4">
                    <HeartIconSolid className="w-6 h-6 text-red-500 mr-2" />
                    <h3 className="text-xl font-bold text-slate-800">My Favorite Looks</h3>
                </div>
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {favorites.map((image, index) => (
                            <div 
                                key={index}
                                className="relative rounded-lg overflow-hidden shadow-md border border-slate-200 cursor-pointer group"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img 
                                    src={image} 
                                    alt={`Favorite outfit ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(image);
                                    }}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75"
                                    aria-label="Remove from favorites"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-center">You haven't saved any looks yet.</p>
                )}
            </div>
            {selectedImage && (
                <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </>
    );
};

export default FavoritesGallery;