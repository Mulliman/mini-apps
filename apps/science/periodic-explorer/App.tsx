
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ELEMENTS } from './data/elements';
import { PeriodicElement } from './types';
import { CATEGORY_GRADIENTS, getDisplayCategory } from './constants';
import NeighborElement from './components/NeighborElement';
import Header from '../../shared/Header';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentElement = ELEMENTS[currentIndex];

  const getNeighbors = useMemo(() => {
    const left = currentIndex > 0 ? ELEMENTS[currentIndex - 1] : null;
    const right = currentIndex < ELEMENTS.length - 1 ? ELEMENTS[currentIndex + 1] : null;
    const above = ELEMENTS.find(e => e.group === currentElement.group && e.period === currentElement.period - 1);
    const below = ELEMENTS.find(e => e.group === currentElement.group && e.period === currentElement.period + 1);
    return { left, right, above, below };
  }, [currentIndex, currentElement.group, currentElement.period]);

  const navigateTo = useCallback((el: PeriodicElement | null) => {
    if (el) {
      const idx = ELEMENTS.findIndex(e => e.number === el.number);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft': navigateTo(getNeighbors.left); break;
      case 'ArrowRight': navigateTo(getNeighbors.right); break;
      case 'ArrowUp': navigateTo(getNeighbors.above); break;
      case 'ArrowDown': navigateTo(getNeighbors.below); break;
    }
  }, [getNeighbors, navigateTo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) navigateTo(getNeighbors.right);
    if (distance < -50) navigateTo(getNeighbors.left);
  };

  return (
    <div 
      className={`flex flex-col relative w-full h-screen overflow-hidden transition-all duration-700 bg-gradient-to-br ${CATEGORY_GRADIENTS[currentElement.category]}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Header title="Periodic Explorer" />
      {/* Ghost Background Symbol */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-[40rem] md:text-[60rem] font-black opacity-[0.05] select-none leading-none">
          {currentElement.symbol}
        </div>
      </div>

      {/* Main 3x3 Grid Layout: 10% sidebars, 80% center */}
      <div className="grid grid-cols-[10%_80%_10%] grid-rows-[10%_80%_10%] w-full flex-1 relative z-10">
        
        {/* Row 1 - Top Nav Area */}
        <div className="bg-black/50"></div>
        <div className="flex items-center justify-center">
          <NeighborElement element={getNeighbors.above} position="top" onClick={() => navigateTo(getNeighbors.above)} />
        </div>
        <div className="bg-black/50"></div>

        {/* Row 2 - Center Content Area */}
        <div className="flex items-center justify-center">
          <NeighborElement element={getNeighbors.left} position="left" onClick={() => navigateTo(getNeighbors.left)} />
        </div>

        {/* CENTER ELEMENT AREA */}
        <div className="flex flex-col items-center justify-center space-y-8 p-4 md:p-10 text-white overflow-hidden">
          
          {/* Top Integrated Identity Header - Linear Format */}
          <div className="w-full max-w-5xl flex items-center justify-center bg-white/10 backdrop-blur-2xl border border-white/20 px-6 md:px-12 py-4 md:py-8 rounded-[2rem] shadow-2xl">
            <div className="flex items-center space-x-6 md:space-x-12">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-black mono text-white/90 leading-none">#{currentElement.number}</span>
                <span className="text-[9px] uppercase font-bold opacity-40 mt-1 tracking-widest">Number</span>
              </div>
              
              <div className="h-10 md:h-16 w-px bg-white/20"></div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl md:text-8xl font-black leading-none drop-shadow-xl select-none">{currentElement.symbol}</span>
                <span className="text-lg md:text-4xl font-extrabold uppercase tracking-tight opacity-90 mt-1">{currentElement.name}</span>
              </div>

              <div className="h-10 md:h-16 w-px bg-white/20"></div>

              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-5xl font-black mono text-white/90 leading-none">
                  {currentElement.mass > 0 ? currentElement.mass.toFixed(3) : "Synth"}
                </span>
                <span className="text-[9px] uppercase font-bold opacity-40 mt-1 tracking-widest">Mass</span>
              </div>
            </div>
          </div>

          {/* Bottom Card - Detailed Info Section */}
          <div className="w-full max-w-5xl bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/15 p-6 md:p-12 shadow-2xl relative overflow-hidden">            
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="px-5 py-2 rounded-2xl bg-white/15 border border-white/25 text-xs md:text-sm font-black uppercase tracking-[0.15em] shadow-lg">
                    {getDisplayCategory(currentElement.category)}
                  </span>
                  <span className="text-[11px] font-black mono text-white/50 bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl uppercase tracking-wider">
                    G{currentElement.group} • P{currentElement.period}
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2.5">Atomic Summary</h3>
                    <p className="text-base md:text-lg leading-relaxed font-medium text-white/95 text-pretty">
                      {currentElement.summary}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12 flex flex-col space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2.5">Practical & Industrial Usage</h3>
                  <p className="text-base md:text-lg leading-relaxed font-medium text-white/95 text-pretty">
                    {currentElement.usage || "Used in specialized high-energy research and advanced synthesis."}
                  </p>
                </div>

                {currentElement.etymology && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2.5">Origin & Etymology</h3>
                    <p className="text-base md:text-lg leading-relaxed font-medium text-white/95 text-pretty">
                      {currentElement.etymology}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <NeighborElement element={getNeighbors.right} position="right" onClick={() => navigateTo(getNeighbors.right)} />
        </div>

        {/* Row 3 - Bottom Nav Area */}
        <div className="bg-black/50"></div>
        <div className="flex items-center justify-center">
          <NeighborElement element={getNeighbors.below} position="bottom" onClick={() => navigateTo(getNeighbors.below)} />
        </div>
        <div className="bg-black/50"></div>
      </div>
    </div>
  );
};

export default App;
