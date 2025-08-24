import React from 'react';

export function PixelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating pixel squares */}
      <div className="floating-pixels" style={{ top: '10%', left: '5%' }}></div>
      <div className="floating-pixels" style={{ top: '30%', left: '15%' }}></div>
      <div className="floating-pixels" style={{ top: '60%', left: '8%' }}></div>
      <div className="floating-pixels" style={{ top: '80%', left: '20%' }}></div>
      <div className="floating-pixels" style={{ top: '20%', right: '10%' }}></div>
      <div className="floating-pixels" style={{ top: '50%', right: '5%' }}></div>
      <div className="floating-pixels" style={{ top: '70%', right: '15%' }}></div>
      <div className="floating-pixels" style={{ top: '90%', right: '25%' }}></div>
    </div>
  );
}

export function PixelGrid() {
  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <div className="grid grid-cols-12 h-full">
        {Array.from({ length: 120 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-primary/20 aspect-square"
            style={{
              animationDelay: `${(i % 12) * 0.1}s`,
              animation: `pixel-float ${3 + (i % 3)}s ease-in-out infinite`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}