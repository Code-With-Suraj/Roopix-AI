import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon, ArrowPathIcon } from './icons';

interface ImageModalProps {
  src: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 4);
    setScale(newScale);
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 }); // Reset position when zoomed out
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
      const newX = e.clientX - startPan.x;
      const newY = e.clientY - startPan.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  const handleMouseLeave = () => {
    setIsPanning(false);
  }

  const resetTransform = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const zoomIn = () => setScale(s => Math.min(s + 0.2, 4));
  const zoomOut = () => {
      const newScale = Math.max(scale - 0.2, 0.5);
      setScale(newScale);
      if (newScale <= 1) resetTransform();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={imageContainerRef}
        className="relative bg-white p-2 rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <img 
          src={src} 
          alt="Enlarged view" 
          className="object-contain max-w-full max-h-[calc(90vh-1rem)]"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
        />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 rounded-full p-1.5 flex items-center space-x-2 text-white">
          <button onClick={zoomOut} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" aria-label="Zoom out"><MinusIcon className="w-5 h-5" /></button>
          <button onClick={resetTransform} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" aria-label="Reset zoom"><ArrowPathIcon className="w-5 h-5" /></button>
          <button onClick={zoomIn} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" aria-label="Zoom in"><PlusIcon className="w-5 h-5" /></button>
        </div>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-slate-800 hover:bg-slate-200 transition-colors"
          aria-label="Close image viewer"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;