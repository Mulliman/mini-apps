import React, { useEffect, useState } from 'react';

interface KeyDisplayProps {
  lastPressed: string | null;
}

export const KeyDisplay: React.FC<KeyDisplayProps> = ({ lastPressed }) => {
  const [visible, setVisible] = useState(false);
  const [char, setChar] = useState('');

  useEffect(() => {
    if (lastPressed) {
      setChar(lastPressed);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [lastPressed]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-10 right-10 pointer-events-none animate-pop">
      <div className="bg-white/90 backdrop-blur border-4 border-blue-400 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
        <span className="text-5xl font-bold text-blue-600 font-plate">
          {char}
        </span>
      </div>
    </div>
  );
};