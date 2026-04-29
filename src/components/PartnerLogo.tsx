import React from 'react';

export const PartnerLogo = ({ className = "w-full h-full", useImage = true }: { className?: string; useImage?: boolean }) => {
  if (useImage) {
    return (
      <div className={`${className} relative`}>
        <img 
          src="/assets/partners/logos/logo.png" 
          alt="Partner Logo" 
          className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-300"
          onLoad={(e) => (e.target as HTMLImageElement).classList.remove('opacity-0')}
          onError={(e) => {
            (e.target as HTMLImageElement).classList.add('hidden');
            const placeholder = e.currentTarget.nextElementSibling;
            if (placeholder) placeholder.classList.remove('hidden');
          }}
        />
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full hidden" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Circle Container */}
          <circle cx="50" cy="50" r="48" fill="white" />
          
          {/* Main Red/Crimson Background Shape */}
          <path 
            d="M50 2 C 23.5 2 2 23.5 2 50 C 2 76.5 23.5 98 50 98 C 76.5 98 98 76.5 98 50 C 98 23.5 76.5 2 50 2" 
            fill="#D1164E" 
          />

          {/* Center White Peak Symbol */}
          <path 
            d="M50 25 L80 75 L50 65 L20 75 Z" 
            fill="white" 
          />

          {/* Blue "Waves/Flow" Detail at the Bottom */}
          <path 
            d="M20 75 Q 35 65 50 65 Q 65 65 80 75 L 80 85 Q 50 75 20 85 Z" 
            fill="#00AEEF" 
          />
          
          {/* Additional Stylized Lines inside the Blue Area */}
          <path 
            d="M25 78 Q 50 72 75 78" 
            stroke="white" 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinecap="round"
          />
          <path 
            d="M28 82 Q 50 78 72 82" 
            stroke="white" 
            strokeWidth="1" 
            fill="none" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle Container */}
      <circle cx="50" cy="50" r="48" fill="white" />
      
      {/* Main Red/Crimson Background Shape */}
      <path 
        d="M50 2 C 23.5 2 2 23.5 2 50 C 2 76.5 23.5 98 50 98 C 76.5 98 98 76.5 98 50 C 98 23.5 76.5 2 50 2" 
        fill="#D1164E" 
      />

      {/* Center White Peak Symbol */}
      <path 
        d="M50 25 L80 75 L50 65 L20 75 Z" 
        fill="white" 
      />

      {/* Blue "Waves/Flow" Detail at the Bottom */}
      <path 
        d="M20 75 Q 35 65 50 65 Q 65 65 80 75 L 80 85 Q 50 75 20 85 Z" 
        fill="#00AEEF" 
      />
      
      {/* Additional Stylized Lines inside the Blue Area */}
      <path 
        d="M25 78 Q 50 72 75 78" 
        stroke="white" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round"
      />
      <path 
        d="M28 82 Q 50 78 72 82" 
        stroke="white" 
        strokeWidth="1" 
        fill="none" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export const PartnerTextLogo = () => {
  return (
    <div className="flex flex-col">
       <span className="text-black font-serif font-black text-xl leading-none tracking-tighter" style={{ fontFamily: 'serif' }}>
         鑫光正
       </span>
       <span className="text-black font-black text-[0.55rem] tracking-[0.2em] uppercase mt-1">
         Xinguangzheng
       </span>
    </div>
  );
};
