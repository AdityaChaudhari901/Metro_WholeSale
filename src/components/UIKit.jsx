import React from 'react';
import logo from '../assets/logo.png';

// Metro Wholesale avatar icon
export function MetroAvatar({ size = 8 }) {
  const pixelSize = size * 4;
  
  return (
    <div
      className={`w-${size} h-${size} rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden`}
      style={{ minWidth: pixelSize, maxWidth: pixelSize, minHeight: pixelSize, maxHeight: pixelSize }}
    >
      <img 
        src={logo} 
        alt="Metro" 
        className="w-full h-full object-contain rounded-md"
      />
    </div>
  );
}

// Wave bars icon (decorative / stop indicator)
export function WaveBars({ active = false }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-blue-500 ${
            active ? 'wave-bar' : ''
          }`}
          style={{ height: active ? '12px' : `${6 + (i % 3) * 3}px`, opacity: active ? 1 : 0.5 }}
        />
      ))}
    </div>
  );
}

// Typing indicator dots
export function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot w-2 h-2 rounded-full bg-blue-400"
        />
      ))}
    </div>
  );
}
