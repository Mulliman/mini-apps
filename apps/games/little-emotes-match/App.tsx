import React, { useState, useEffect, useCallback } from 'react';
import { Tile } from './components/Tile';
import { WinModal } from './components/WinModal';
import { ConfirmModal } from './components/ConfirmModal';
import { generateDeck } from './utils/gameUtils';
import { Card, CategoryId } from './types';
import { DATA_SETS, CATEGORY_LABELS } from './constants';
import { RotateCcw } from 'lucide-react';
import Header from '../../shared/Header';

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('feelings');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [isProcessingMismatch, setIsProcessingMismatch] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State for handling category switch confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<CategoryId | null>(null);

  // Initialize game on mount
  useEffect(() => {
    startNewGame(currentCategory);
    setIsInitialized(true);
  }, []);

  const startNewGame = useCallback((category: CategoryId = currentCategory) => {
    const items = DATA_SETS[category];
    const newDeck = generateDeck(items);
    setCards(newDeck);
    setFlippedCards([]);
    setIsProcessingMismatch(false);
    setGameWon(false);
  }, [currentCategory]);

  const handleCategoryChange = (category: CategoryId) => {
    if (category === currentCategory) return;

    // Check if game is in progress (any matched cards) and not yet won
    const isGameInProgress = cards.some(card => card.isMatched) && !gameWon;

    if (isGameInProgress) {
      setPendingCategory(category);
      setIsConfirmOpen(true);
    } else {
      setCurrentCategory(category);
      startNewGame(category);
    }
  };

  const confirmCategoryChange = () => {
    if (pendingCategory) {
      setCurrentCategory(pendingCategory);
      startNewGame(pendingCategory);
      setPendingCategory(null);
    }
    setIsConfirmOpen(false);
  };

  const handleCardClick = (clickedCard: Card) => {
    // Prevent interaction if we are waiting for the mismatch timer or if card is already flipped
    if (isProcessingMismatch || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    // Flip the clicked card
    const updatedCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // If we have 2 flipped cards, check for match
    if (newFlippedCards.length === 2) {
      checkForMatch(newFlippedCards[0], newFlippedCards[1], updatedCards);
    }
  };

  const checkForMatch = (card1: Card, card2: Card, currentCards: Card[]) => {
    if (card1.matchId === card2.matchId) {
      // It's a match!
      const matchedCards = currentCards.map(card => 
        card.matchId === card1.matchId ? { ...card, isMatched: true, isFlipped: true } : card
      );
      setCards(matchedCards);
      setFlippedCards([]);
      
      // Check for win condition
      const allMatched = matchedCards.every(card => card.isMatched);
      if (allMatched) {
        setTimeout(() => setGameWon(true), 500);
      }
    } else {
      // Not a match
      setIsProcessingMismatch(true);
      // Wait 3 seconds before flipping back
      setTimeout(() => {
        const resetCards = currentCards.map(card => 
          (card.id === card1.id || card.id === card2.id) 
            ? { ...card, isFlipped: false } 
            : card
        );
        setCards(resetCards);
        setFlippedCards([]);
        setIsProcessingMismatch(false);
      }, 2000);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center">
      <Header title="Little Emotes Match" />
      <div className="p-4 sm:p-6 w-full flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 sm:p-3 rounded-2xl shadow-md border-2 border-blue-100">
              <span className="text-2xl sm:text-3xl">🧩</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-sky-900 tracking-tight">
              Little Emotes Match
            </h1>
          </div>
          
          <button 
            onClick={() => startNewGame(currentCategory)}
            className="bg-white hover:bg-sky-50 text-sky-600 font-bold p-2 sm:p-3 rounded-xl shadow-sm border-2 border-sky-100 transition-colors flex items-center gap-2"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-sky-100 mx-auto w-full max-w-2xl">
          {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 rounded-lg font-bold text-sm sm:text-lg transition-all flex flex-col items-center justify-center gap-2 ${
                currentCategory === cat
                  ? 'bg-sky-400 text-white shadow-md'
                  : 'text-gray-500 hover:bg-sky-50'
              }`}
            >
              {/* Mini Grid Preview */}
              <div className={`grid grid-cols-4 gap-px sm:gap-2 p-1 rounded-md`}>
                {DATA_SETS[cat].map((item, i) => (
                  <span key={i} className="text-[15px] sm:text-s leading-none select-none filter drop-shadow-sm">
                    {item.emoji}
                  </span>
                ))}
              </div>
              
              <span>{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Game Grid */}
      <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
          {cards.map(card => (
            <Tile 
              key={card.id} 
              card={card} 
              onClick={handleCardClick} 
              disabled={isProcessingMismatch}
            />
          ))}
        </div>

        {/* Status Indicator for 3yo */}
        <div className="mt-8 text-center h-8">
           {isProcessingMismatch && (
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold animate-pulse">
               <span>👀</span>
               <span>Looking...</span>
             </div>
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center mt-6 text-sky-800/50 text-sm font-medium">
        Match the tiles to win!
      </footer>

      {/* Modals */}
      <WinModal isOpen={gameWon} onRestart={() => startNewGame(currentCategory)} />
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onConfirm={confirmCategoryChange} 
        onCancel={() => setIsConfirmOpen(false)} 
      />
      </div>
    </div>
  );
};

export default App;