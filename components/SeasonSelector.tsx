import React from 'react';
import { SunIcon, SnowflakeIcon, CloudRainIcon, CycleIcon } from './icons';

interface SeasonSelectorProps {
  onSeasonSelect: (season: string) => void;
}

const seasons = [
  { name: 'Summer', icon: <SunIcon className="w-8 h-8" /> },
  { name: 'Winter', icon: <SnowflakeIcon className="w-8 h-8" /> },
  { name: 'Monsoon', icon: <CloudRainIcon className="w-8 h-8" /> },
  { name: 'All Year', icon: <CycleIcon className="w-8 h-8" /> },
];

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ onSeasonSelect }) => {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Select a Season</h2>
      <p className="text-slate-600 mb-8">For which season should the outfits be styled?</p>
      <div className="grid grid-cols-2 gap-4">
        {seasons.map((season) => (
          <button
            key={season.name}
            onClick={() => onSeasonSelect(season.name)}
            className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
          >
            <div className="text-indigo-500 mb-3 transition-transform duration-200 group-hover:scale-110">
              {season.icon}
            </div>
            <span className="text-lg font-semibold text-slate-700 group-hover:text-indigo-600">{season.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonSelector;
