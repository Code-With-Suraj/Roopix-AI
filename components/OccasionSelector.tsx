import React from 'react';
import { BuildingOffice2Icon, UserGroupIcon, CakeIcon, HeartIcon } from './icons';

interface OccasionSelectorProps {
  onOccasionSelect: (occasion: string) => void;
}

const occasions = [
  { name: 'Office Look', icon: <BuildingOffice2Icon className="w-8 h-8" /> },
  { name: 'Meeting Look', icon: <UserGroupIcon className="w-8 h-8" /> },
  { name: 'Party Look', icon: <CakeIcon className="w-8 h-8" /> },
  { name: 'Marriage Look', icon: <HeartIcon className="w-8 h-8" /> },
];

const OccasionSelector: React.FC<OccasionSelectorProps> = ({ onOccasionSelect }) => {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Select an Occasion</h2>
      <p className="text-slate-600 mb-8">What is the event? This helps us tailor the perfect look.</p>
      <div className="grid grid-cols-2 gap-4">
        {occasions.map((occasion) => (
          <button
            key={occasion.name}
            onClick={() => onOccasionSelect(occasion.name)}
            className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
          >
            <div className="text-indigo-500 mb-3 transition-transform duration-200 group-hover:scale-110">
              {occasion.icon}
            </div>
            <span className="text-lg font-semibold text-slate-700 group-hover:text-indigo-600">{occasion.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OccasionSelector;