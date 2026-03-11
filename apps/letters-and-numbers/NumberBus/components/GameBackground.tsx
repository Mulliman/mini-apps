import React from 'react';

export const GameBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-sky-300">
      {/* Sun */}
      <div className="absolute top-10 right-20 w-24 h-24 bg-yellow-300 rounded-full opacity-90 shadow-[0_0_40px_rgba(253,224,71,0.6)] animate-pulse"></div>

      {/* Clouds */}
      <div className="absolute top-20 left-20 text-white opacity-80 scale-150">
        <Cloud />
      </div>
      <div className="absolute top-40 right-1/4 text-white opacity-60 scale-125">
        <Cloud />
      </div>
      <div className="absolute top-10 left-1/2 text-white opacity-70 scale-100">
        <Cloud />
      </div>

      {/* Distant City Silhouette (Simple) */}
      <div className="absolute bottom-32 left-0 right-0 h-32 flex items-end justify-center space-x-1 opacity-30">
          <div className="w-16 h-24 bg-indigo-900 rounded-t-lg"></div>
          <div className="w-12 h-16 bg-indigo-900 rounded-t-lg"></div>
          <div className="w-20 h-32 bg-indigo-900 rounded-t-lg"></div>
          <div className="w-14 h-20 bg-indigo-900 rounded-t-lg"></div>
          <div className="w-24 h-12 bg-indigo-900 rounded-t-lg"></div>
          <div className="w-16 h-28 bg-indigo-900 rounded-t-lg"></div>
          <div className="w-10 h-14 bg-indigo-900 rounded-t-lg"></div>
      </div>

      {/* Road */}
      <div className="absolute bottom-0 w-full h-32 bg-gray-700 border-t-8 border-gray-600">
        {/* Road markings */}
        <div className="absolute top-1/2 left-0 right-0 h-2 flex justify-between space-x-12 px-4">
             {Array.from({ length: 20 }).map((_, i) => (
                 <div key={i} className="w-24 h-full bg-white opacity-50 rounded-full"></div>
             ))}
        </div>
      </div>

      {/* Grass */}
      <div className="absolute bottom-32 w-full h-8 bg-green-500 flex items-end overflow-hidden">
         {/* Grass blades effect using zig zag gradient or simplified divs */}
         <div className="w-full h-4 bg-green-600 opacity-50 rounded-t-full transform scale-y-50"></div>
      </div>
    </div>
  );
};

const Cloud = () => (
  <svg width="100" height="60" viewBox="0 0 100 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 50C8.954 50 0 41.046 0 30C0 18.954 8.954 10 20 10C21.5 10 22.9 10.2 24.3 10.6C27.6 4.2 34.3 0 42 0C51.8 0 60 6.8 62.3 16C64.5 15.3 66.9 15 69.4 15C80.7 15 90 23.3 90 33.8C96 34.8 100 39.6 100 45C100 53.284 93.284 60 85 60H20V50Z" />
  </svg>
);
