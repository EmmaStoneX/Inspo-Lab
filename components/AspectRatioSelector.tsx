import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIO_OPTIONS } from '../constants';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ASPECT_RATIO_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all duration-200
            ${selected === option.value 
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
              : 'bg-surface border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}
          `}
        >
          <span className="text-lg leading-none">{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;