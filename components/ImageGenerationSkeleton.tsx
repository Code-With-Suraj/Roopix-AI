import React from 'react';

interface ImageGenerationSkeletonProps {
  outfitType: string;
}

const ImageGenerationSkeleton: React.FC<ImageGenerationSkeletonProps> = ({ outfitType }) => {
  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          Generating <span className="text-indigo-600">{outfitType}</span> Look...
        </h3>
        <p className="text-slate-500 mt-1">Our AI is working its magic, please wait a moment.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="w-full aspect-square bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="w-full aspect-square bg-slate-200 rounded-lg animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-full aspect-square bg-slate-200 rounded-lg animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};

export default ImageGenerationSkeleton;