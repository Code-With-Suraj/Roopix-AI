import React, { useState, useEffect } from 'react';
import { CameraIcon, UserIcon, SparklesIcon, CheckCircleIcon } from './icons';

interface ProgressTrackerProps {
  isExpertMode?: boolean;
}

const STEPS = [
  { text: 'Analyzing Photo', icon: <CameraIcon className="w-6 h-6" /> },
  { text: 'Defining Style Profile', icon: <UserIcon className="w-6 h-6" /> },
  { text: 'Curating Outfit Ideas', icon: <SparklesIcon className="w-6 h-6" /> },
  { text: 'Finalizing Looks', icon: <CheckCircleIcon className="w-6 h-6" /> },
];

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ isExpertMode = false }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const title = isExpertMode ? "Nayara is Weaving Her Magic..." : "Styling in Progress...";
  const subtitle = isExpertMode 
    ? "This hyper-personalized consultation takes a little more time, but it's worth the wait!" 
    : "Our AI is crafting your personalized lookbook. Please wait a moment.";

  useEffect(() => {
    // This is a cosmetic animation. The actual API call might be faster or slower.
    const totalDuration = isExpertMode ? 20000 : 10000; // Longer duration for expert mode
    const intervalTime = totalDuration / STEPS.length;

    const interval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep < STEPS.length - 1) {
          return prevStep + 1;
        }
        clearInterval(interval);
        return prevStep;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isExpertMode]);

  return (
    <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">{title}</h2>
      <p className="text-slate-600 mb-8 text-center">{subtitle}</p>
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex items-center space-x-4 transition-opacity duration-500" style={{ opacity: isActive || isCompleted ? 1 : 0.5 }}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-indigo-600 text-white' : 
                isActive ? 'bg-indigo-100 text-indigo-600 ring-4 ring-indigo-200' : 
                'bg-slate-200 text-slate-500'
              }`}>
                {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : step.icon}
              </div>
              <span className={`font-medium transition-all duration-300 ${
                isCompleted ? 'text-slate-500 line-through' : 
                isActive ? 'text-indigo-700 font-bold' : 
                'text-slate-600'
              }`}>
                {step.text}
              </span>
              {isActive && (
                <div className="flex items-center ml-auto">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute opacity-75"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;