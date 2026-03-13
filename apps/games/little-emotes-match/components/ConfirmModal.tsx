import React from 'react';
import { Check, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 border-4 border-sky-400">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Switch Game?</h2>
        <p className="text-gray-600 mb-8 text-lg">You will lose your current progress!</p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
            <span>No</span>
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_0_rgb(14,165,233)] hover:shadow-[0_2px_0_rgb(14,165,233)] hover:translate-y-[2px]"
          >
            <Check className="w-5 h-5" />
            <span>Yes</span>
          </button>
        </div>
      </div>
    </div>
  );
};