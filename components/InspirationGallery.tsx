
import React from 'react';
import { INSPIRATIONS } from '../constants';
import { Inspiration } from '../types';

interface InspirationGalleryProps {
  onSelect: (inspiration: Inspiration) => void;
}

const InspirationGallery: React.FC<InspirationGalleryProps> = ({ onSelect }) => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        灵感画廊 (点击复刻)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {INSPIRATIONS.map((item, index) => (
          <div 
            key={index}
            onClick={() => onSelect(item)}
            className="group relative rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
          >
            {/* Image Container - Fixed 4:3 Aspect Ratio for Gallery Consistency */}
            <div className="aspect-[4/3] bg-gray-800 relative">
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-white font-medium mb-1 truncate shadow-black drop-shadow-md">{item.title}</h4>
              <p className="text-gray-300 text-xs line-clamp-2 drop-shadow-md">{item.prompt}</p>
              <div className="mt-2 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                点击试用此风格 →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationGallery;
