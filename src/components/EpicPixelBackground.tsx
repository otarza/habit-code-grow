import React from 'react';

export function EpicPixelBackground() {
  // Generate static arrays for consistent animations
  const pixelGrid = Array.from({ length: 48 });
  const floatingPixels = Array.from({ length: 20 });
  const pixelTrails = Array.from({ length: 5 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Subtle gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, transparent 50%, rgba(239, 68, 68, 0.03) 100%)',
        }}
      />

      {/* Layer 1: Pixelart Grid Pattern */}
      <div className="absolute inset-0" style={{ opacity: 0.4 }}>
        <div 
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                transparent, 
                transparent 20px, 
                rgba(255, 255, 255, 0.02) 20px, 
                rgba(255, 255, 255, 0.02) 21px
              ),
              repeating-linear-gradient(90deg, 
                transparent, 
                transparent 20px, 
                rgba(255, 255, 255, 0.02) 20px, 
                rgba(255, 255, 255, 0.02) 21px
              )
            `,
            width: '100%',
            height: '100%',
            animation: 'pixel-pulse 15s ease-in-out infinite'
          }}
        />
      </div>

      {/* Layer 2: Animated Pixel Blocks */}
      <div className="absolute inset-0">
        <div className="grid grid-cols-6 md:grid-cols-8 gap-4 p-8 h-full">
          {pixelGrid.map((_, i) => (
            <div
              key={`pixel-${i}`}
              style={{
                width: '8px',
                height: '8px',
                margin: 'auto',
                backgroundColor: i % 3 === 0 
                  ? 'rgba(239, 68, 68, 0.15)' 
                  : i % 3 === 1 
                    ? 'rgba(37, 99, 235, 0.15)' 
                    : 'rgba(34, 197, 94, 0.15)',
                boxShadow: i % 4 === 0 ? '0 0 10px rgba(255, 255, 255, 0.1)' : 'none',
                opacity: Math.random() > 0.5 ? 0.3 : 0.1,
                animation: `pixel-float ${20 + (i % 5) * 4}s ease-in-out infinite`,
                animationDelay: `${(i % 10) * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Layer 3: Floating Pixel Elements */}
      <div className="absolute inset-0">
        {floatingPixels.map((_, i) => {
          const size = 4 + (i % 3) * 4;
          const colors = [
            'rgba(239, 68, 68, 0.2)',   // Red
            'rgba(37, 99, 235, 0.2)',   // Blue
            'rgba(34, 197, 94, 0.2)',   // Green
            'rgba(251, 191, 36, 0.2)'   // Yellow
          ];
          
          return (
            <div
              key={`float-${i}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${5 + (i * 5)}%`,
                top: `${10 + (i * 4)}%`,
                backgroundColor: colors[i % 4],
                border: `1px solid ${colors[i % 4].replace('0.2', '0.4')}`,
                animation: `pixel-float ${25 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          );
        })}
      </div>

      {/* Layer 4: Pixel Trail Effects */}
      <div className="absolute inset-0">
        {pixelTrails.map((_, i) => (
          <div
            key={`trail-${i}`}
            className="absolute"
            style={{
              left: 0,
              top: `${20 + i * 15}%`,
              width: '100%',
              height: '2px',
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.05) 10%,
                rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0.05) 90%,
                transparent
              )`,
              transform: 'translateX(-100%)',
              animation: `pixel-slide ${30 + i * 5}s ease-in-out infinite`,
              animationDelay: `${i * 6}s`
            }}
          >
            {/* Pixel dots along the trail */}
            <div className="absolute top-0 left-[20%] w-2 h-2 bg-white/20" />
            <div className="absolute top-0 left-[40%] w-2 h-2 bg-white/15" />
            <div className="absolute top-0 left-[60%] w-2 h-2 bg-white/15" />
            <div className="absolute top-0 left-[80%] w-2 h-2 bg-white/20" />
          </div>
        ))}
      </div>

      {/* Layer 5: Corner Pixel Decorations */}
      <div>
        {/* Top Left */}
        <div className="absolute top-8 left-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/10"></div>
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/5"></div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/10 animate-pulse" style={{ animationDuration: '4s' }}></div>
          </div>
        </div>

        {/* Top Right */}
        <div className="absolute top-8 right-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/10"></div>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <div className="w-3 h-3 bg-white/10 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="w-3 h-3 bg-white/5"></div>
          </div>
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-8 left-8">
          <div className="flex gap-2 mb-2">
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/10 animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/10"></div>
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/5"></div>
          </div>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-8 right-8">
          <div className="flex gap-2 mb-2 justify-end">
            <div className="w-3 h-3 bg-white/10 animate-pulse" style={{ animationDuration: '4s', animationDelay: '3s' }}></div>
            <div className="w-3 h-3 bg-white/5"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/5"></div>
            <div className="w-3 h-3 bg-white/10"></div>
          </div>
        </div>
      </div>

      {/* Layer 6: Large Subtle Pixel Blocks */}
      <div className="absolute inset-0">
        <div 
          className="absolute"
          style={{
            width: '60px',
            height: '60px',
            top: '20%',
            left: '15%',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), transparent)',
            border: '2px solid rgba(239, 68, 68, 0.15)',
            animation: 'pixel-float 30s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute"
          style={{
            width: '80px',
            height: '80px',
            top: '60%',
            right: '20%',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), transparent)',
            border: '2px solid rgba(37, 99, 235, 0.15)',
            animation: 'pixel-float 35s ease-in-out infinite reverse'
          }}
        />
        <div 
          className="absolute"
          style={{
            width: '50px',
            height: '50px',
            bottom: '30%',
            left: '40%',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), transparent)',
            border: '2px solid rgba(34, 197, 94, 0.15)',
            animation: 'pixel-float 28s ease-in-out infinite'
          }}
        />
      </div>

      {/* Layer 7: Pixelated Scanline */}
      <div className="absolute inset-0">
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
            animation: 'scan-vertical 20s linear infinite'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-4">
            <div className="w-1 h-1 bg-white/20"></div>
            <div className="w-1 h-1 bg-white/30"></div>
            <div className="w-1 h-1 bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Layer 8: Subtle Retro Scanlines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.01) 2px,
            rgba(255, 255, 255, 0.01) 4px
          )`,
          opacity: 0.5
        }}
      />

      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
        }}
      />
    </div>
  );
}