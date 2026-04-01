/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { solarSystem, CelestialBody } from './data';
import Header from '../../../shared/Header';

export default function App() {
  const [planetIndex, setPlanetIndex] = useState(0);
  const [moonIndex, setMoonIndex] = useState(0); // 0 means the planet itself, 1+ means moons
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');

  const currentPlanet = solarSystem[planetIndex];
  const hasMoons = currentPlanet.moons && currentPlanet.moons.length > 0;
  const totalVerticalItems = 1 + (currentPlanet.moons?.length || 0);
  
  const currentBody: CelestialBody = moonIndex === 0 
    ? currentPlanet 
    : (currentPlanet.moons?.[moonIndex - 1] || currentPlanet);

  const goLeft = () => {
    if (planetIndex > 0) {
      setDirection('left');
      setPlanetIndex(p => p - 1);
      setMoonIndex(0);
    }
  };

  const goRight = () => {
    if (planetIndex < solarSystem.length - 1) {
      setDirection('right');
      setPlanetIndex(p => p + 1);
      setMoonIndex(0);
    }
  };

  const goUp = () => {
    if (moonIndex > 0) {
      setDirection('up');
      setMoonIndex(m => m - 1);
    }
  };

  const goDown = () => {
    if (moonIndex < totalVerticalItems - 1) {
      setDirection('down');
      setMoonIndex(m => m + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goLeft();
      if (e.key === 'ArrowRight') goRight();
      if (e.key === 'ArrowUp') goUp();
      if (e.key === 'ArrowDown') goDown();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [planetIndex, moonIndex, totalVerticalItems]);

  // Swipe handling
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 50) { // minimum swipe distance
      if (absDx > absDy) {
        // Horizontal swipe
        if (dx > 0) goLeft();
        else goRight();
      } else {
        // Vertical swipe
        if (dy > 0) goUp();
        else goDown();
      }
    }
    setTouchStart(null);
  };

  const variants = {
    enter: (dir: string) => {
      if (dir === 'right') return { x: 1000, opacity: 0 };
      if (dir === 'left') return { x: -1000, opacity: 0 };
      if (dir === 'down') return { y: 1000, opacity: 0 };
      if (dir === 'up') return { y: -1000, opacity: 0 };
      return { opacity: 0 };
    },
    center: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: (dir: string) => {
      if (dir === 'right') return { x: -1000, opacity: 0 };
      if (dir === 'left') return { x: 1000, opacity: 0 };
      if (dir === 'down') return { y: -1000, opacity: 0 };
      if (dir === 'up') return { y: 1000, opacity: 0 };
      return { opacity: 0 };
    }
  };

  return (
    <div 
      className="w-full h-screen flex flex-col relative overflow-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header title="Solar System Explorer" />
      <div className="stars"></div>

      {/* Navigation Controls (Visible on larger screens, or tap targets for kids) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-50 pt-20 md:pt-24">
        {/* Top */}
        <div className="flex justify-center h-12 md:h-16">
          {moonIndex > 0 && (
            <button onClick={goUp} className="pointer-events-auto p-2 md:p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all animate-bounce">
              <ChevronUp className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}
        </div>
        
        {/* Middle */}
        <div className="flex justify-between items-center flex-1">
          <div className="w-12 md:w-16">
            {planetIndex > 0 && (
              <button onClick={goLeft} className="pointer-events-auto p-2 md:p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all">
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}
          </div>
          <div className="w-12 md:w-16 flex justify-end">
            {planetIndex < solarSystem.length - 1 && (
              <button onClick={goRight} className="pointer-events-auto p-2 md:p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all">
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-center h-12 md:h-16">
          {moonIndex < totalVerticalItems - 1 && (
            <button onClick={goDown} className="pointer-events-auto p-2 md:p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all animate-bounce">
              <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={`${planetIndex}-${moonIndex}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 mx-auto flex flex-col items-center justify-center w-full max-w-4xl px-4 md:px-8 py-14 md:py-20 z-10"
        >
          {/* Breadcrumb / Context */}
          <div className="flex-shrink-0 mb-2 md:mb-4 text-center">
            <h2 className="text-base md:text-2xl font-bold text-white/60 tracking-widest uppercase">
              {currentPlanet.name} {moonIndex > 0 ? 'System' : ''}
            </h2>
            {moonIndex > 0 && (
              <p className="text-xs md:text-sm text-white/40 mt-1">
                Featured Moon {moonIndex} of {currentPlanet.moons?.length}
                {currentPlanet.totalKnownMoons && currentPlanet.totalKnownMoons > (currentPlanet.moons?.length || 0) && (
                  <span className="opacity-75"> (out of {currentPlanet.totalKnownMoons} known)</span>
                )}
              </p>
            )}
          </div>

          {/* The Celestial Body Illustration */}
          <motion.div 
            className="relative flex-1 min-h-0 w-full flex items-center justify-center my-2 md:my-6"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="relative flex items-center justify-center" style={{ width: `min(${currentBody.size}px, 35vw, 25vh)`, height: `min(${currentBody.size}px, 35vw, 25vh)` }}>
              {/* Glow effect */}
              <div 
                className={`absolute rounded-full blur-3xl opacity-30 bg-gradient-to-br ${currentBody.gradient}`}
                style={{ 
                  width: '150%', 
                  height: '150%' 
                }}
              />
            
            {/* --- BACK RINGS (Behind the planet) --- */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              {currentBody.id === 'saturn' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '260%', height: '260%',
                    border: '20px solid rgba(253, 224, 71, 0.2)',
                    boxShadow: '0 0 0 12px rgba(253, 224, 71, 0.1), inset 0 0 0 12px rgba(253, 224, 71, 0.1)',
                    transform: 'rotateX(75deg) rotateZ(-15deg)' 
                  }}
                />
              )}
              {currentBody.id === 'uranus' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '200%', height: '200%',
                    border: '4px solid rgba(165, 243, 252, 0.3)',
                    boxShadow: '0 0 0 2px rgba(165, 243, 252, 0.1), inset 0 0 0 2px rgba(165, 243, 252, 0.1)',
                    transform: 'rotateY(75deg) rotateZ(-15deg)' 
                  }}
                />
              )}
              {currentBody.id === 'jupiter' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '180%', height: '180%',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.05), inset 0 0 0 4px rgba(255, 255, 255, 0.05)',
                    transform: 'rotateX(80deg) rotateZ(10deg)' 
                  }}
                />
              )}
              {currentBody.id === 'neptune' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '220%', height: '220%',
                    border: '4px solid rgba(165, 243, 252, 0.1)',
                    transform: 'rotateX(70deg) rotateZ(-20deg)' 
                  }}
                />
              )}
            </div>

            {/* The Body */}
            <div 
              className={`absolute inset-0 rounded-full shadow-2xl shadow-black/50 bg-gradient-to-br ${currentBody.gradient} overflow-hidden border-4 border-white/10`}
              style={{ 
                boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.5)',
                zIndex: 10
              }}
            >
              {/* Add some craters/texture for moons and rocky planets */}
              {(currentBody.type === 'moon' || currentBody.id === 'mercury' || currentBody.id === 'mars') && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-black/20 rounded-full blur-[2px]"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/4 bg-black/15 rounded-full blur-[3px]"></div>
                  <div className="absolute top-1/2 left-2/3 w-1/6 h-1/6 bg-black/20 rounded-full blur-[1px]"></div>
                </>
              )}
            </div>

            {/* --- FRONT RINGS (In front of the planet, clipped to not show the back) --- */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none" 
              style={{ 
                zIndex: 20, 
                clipPath: currentBody.id === 'uranus'
                  ? 'polygon(-200% -200%, 50% -200%, 50% 300%, -200% 300%)'
                  : 'polygon(-200% 50%, 300% 50%, 300% 300%, -200% 300%)'
              }}
            >
              {currentBody.id === 'saturn' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '260%', height: '260%',
                    border: '20px solid rgba(253, 224, 71, 0.5)',
                    boxShadow: '0 0 0 12px rgba(253, 224, 71, 0.2), inset 0 0 0 12px rgba(253, 224, 71, 0.2)',
                    transform: 'rotateX(75deg) rotateZ(-15deg)' 
                  }}
                />
              )}
              {currentBody.id === 'uranus' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '200%', height: '200%',
                    border: '4px solid rgba(165, 243, 252, 0.6)',
                    boxShadow: '0 0 0 2px rgba(165, 243, 252, 0.2), inset 0 0 0 2px rgba(165, 243, 252, 0.2)',
                    transform: 'rotateY(75deg) rotateZ(-15deg)' 
                  }}
                />
              )}
              {currentBody.id === 'jupiter' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '180%', height: '180%',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1), inset 0 0 0 4px rgba(255, 255, 255, 0.1)',
                    transform: 'rotateX(80deg) rotateZ(10deg)' 
                  }}
                />
              )}
              {currentBody.id === 'neptune' && (
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '220%', height: '220%',
                    border: '4px solid rgba(165, 243, 252, 0.25)',
                    transform: 'rotateX(70deg) rotateZ(-20deg)' 
                  }}
                />
              )}
            </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-8 w-full max-w-2xl text-center border border-white/20 shadow-2xl">
            <h1 className="text-2xl md:text-6xl font-black mb-1 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              {currentBody.name}
            </h1>
            
            <p className="text-xs md:text-xl mb-3 md:mb-8 text-white/90 leading-relaxed font-medium">
              {currentBody.description}
            </p>

            <div className="grid grid-cols-2 gap-2 md:gap-4 text-left">
              <div className="bg-black/30 rounded-xl md:rounded-2xl p-2 md:p-4">
                <p className="text-white/50 text-[9px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-1">Distance from Sun</p>
                <p className="text-sm md:text-xl font-bold">{currentBody.distanceAU} AU</p>
                <p className="text-[10px] md:text-sm text-white/70">{currentBody.distanceKm} km</p>
              </div>
              <div className="bg-black/30 rounded-xl md:rounded-2xl p-2 md:p-4">
                <p className="text-white/50 text-[9px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-1">Weight</p>
                <p className="text-sm md:text-xl font-bold">{currentBody.mass}</p>
                <p className="text-[10px] md:text-sm text-white/70">Compared to Earth!</p>
              </div>
            </div>
            {moonIndex === 0 && currentBody.totalKnownMoons && currentBody.totalKnownMoons > 0 && (
              <div className="mt-3 md:mt-4 pt-2 md:pt-4 border-t border-white/10 text-white/60 text-[10px] md:text-sm font-medium">
                Has {currentBody.totalKnownMoons} known moon{currentBody.totalKnownMoons !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Instructions for kids */}
          <div className="flex-shrink-0 mt-3 md:mt-8 text-white/40 text-[9px] md:text-sm font-bold tracking-widest uppercase flex flex-col md:flex-row items-center gap-1 md:gap-4">
            <span>Swipe Left/Right for Planets</span>
            {hasMoons && <span className="hidden md:inline">•</span>}
            {hasMoons && <span>Swipe Up/Down for Moons</span>}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
