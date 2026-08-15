import React, { useState } from 'react';
import { X, Lock, Unlock, Plus, Trash2, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { Question, CustomQuestionInput, ChoiceHistoryItem } from '../types';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  history: ChoiceHistoryItem[];
  autoRead: boolean;
  onToggleAutoRead: () => void;
  onResetProgress: () => void;
  onAddCustomQuestion: (input: CustomQuestionInput) => void;
  onDeleteQuestion: (id: string) => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  questions,
  history,
  autoRead,
  onToggleAutoRead,
  onResetProgress,
  onAddCustomQuestion,
  onDeleteQuestion,
}) => {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [mathAnswer, setMathAnswer] = useState<string>('');
  const [mathError, setMathError] = useState<boolean>(false);

  // New Custom Question Form State
  const [scenario, setScenario] = useState<string>('');
  const [goodText, setGoodText] = useState<string>('');
  const [badText, setBadText] = useState<string>('');
  const [category, setCategory] = useState<string>('Playtime & Sharing');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathAnswer.trim() === '7') {
      setUnlocked(true);
      setMathError(false);
    } else {
      setMathError(true);
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario || !goodText || !badText) return;

    onAddCustomQuestion({
      scenario,
      goodOptionText: goodText,
      badOptionText: badText,
      category,
    });

    setScenario('');
    setGoodText('');
    setBadText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2926]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FEFAF2] w-full max-w-2xl rounded-[32px] shadow-2xl border border-[#E8E1D5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#2D2926] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {unlocked ? <Unlock className="w-5 h-5 text-[#10B981]" /> : <Lock className="w-5 h-5 text-[#F59E0B]" />}
            <h2 className="text-xl font-black">Parents Area & Custom Scenarios</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#E8E1D5] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!unlocked ? (
            /* Parent Gate Math Lock */
            <form onSubmit={handleUnlock} className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#E8E1D5] text-[#2D2926] rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#2D2926]">Parents Math Check</h3>
              <p className="text-sm text-[#7A7067] max-w-xs">
                Please answer this quick question to enter parent settings:
              </p>
              <div className="text-2xl font-black text-[#2D2926] bg-white px-6 py-3 rounded-2xl border border-[#E8E1D5]">
                What is 3 + 4 = ?
              </div>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Answer"
                className="w-32 text-center text-xl font-bold py-2.5 px-4 rounded-xl border-2 border-[#D4CBB8] focus:outline-none focus:border-[#433D3A] bg-white"
                autoFocus
              />
              {mathError && <p className="text-xs font-bold text-[#F43F5E]">Incorrect, please try again!</p>}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#433D3A] hover:bg-[#2D2926] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Unlock Settings
              </button>
            </form>
          ) : (
            /* Unlocked Parent Dashboard */
            <div className="space-y-6">
              {/* Settings Controls */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-3">
                <h3 className="text-sm font-extrabold text-[#2D2926] uppercase tracking-wide">General Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#433D3A]" />
                    <span className="text-sm font-bold text-[#433D3A]">Auto Read Out Loud (Text to Speech)</span>
                  </div>
                  <button
                    onClick={onToggleAutoRead}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      autoRead ? 'bg-[#10B981] text-white' : 'bg-[#E8E1D5] text-[#7A7067]'
                    }`}
                  >
                    {autoRead ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between">
                  <span className="text-sm font-bold text-[#433D3A]">Reset Xander's Progress & Stars</span>
                  <button
                    onClick={onResetProgress}
                    className="px-3.5 py-1.5 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#991B1B] font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-[#F43F5E]/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Progress</span>
                  </button>
                </div>
              </div>

              {/* Add Custom Question Form */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] space-y-4">
                <h3 className="text-base font-extrabold text-[#2D2926] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#433D3A]" />
                  <span>Add a Custom Scenario for Xander</span>
                </h3>

                <form onSubmit={handleCreateQuestion} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#433D3A] mb-1">Scenario / Question Title</label>
                    <input
                      type="text"
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                      placeholder="e.g. When Xander finishes eating his apple..."
                      className="w-full text-sm font-medium px-3.5 py-2 rounded-xl border border-[#E8E1D5] bg-[#FEFAF2] focus:outline-none focus:ring-2 focus:ring-[#433D3A]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#065F46] mb-1">Good Choice ✅</label>
                      <input
                        type="text"
                        value={goodText}
                        onChange={(e) => setGoodText(e.target.value)}
                        placeholder="e.g. Xander puts his bowl in the sink"
                        className="w-full text-sm font-medium px-3.5 py-2 rounded-xl border border-[#10B981]/40 bg-[#ECFDF5] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#991B1B] mb-1">Wrong Choice ❌</label>
                      <input
                        type="text"
                        value={badText}
                        onChange={(e) => setBadText(e.target.value)}
                        placeholder="e.g. Xander drops bowl on the rug"
                        className="w-full text-sm font-medium px-3.5 py-2 rounded-xl border border-[#F43F5E]/40 bg-[#FFF1F2] focus:outline-none focus:ring-2 focus:ring-[#F43F5E]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#433D3A] mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-sm font-medium px-3.5 py-2 rounded-xl border border-[#E8E1D5] bg-[#FEFAF2] focus:outline-none focus:ring-2 focus:ring-[#433D3A]"
                    >
                      <option value="Playtime & Sharing">🧸 Playtime & Sharing</option>
                      <option value="Food & Mealtimes">🍎 Food & Mealtimes</option>
                      <option value="Bedtime & Evening">🌙 Bedtime & Evening</option>
                      <option value="Manners & Kindness">✨ Manners & Kindness</option>
                      <option value="Emotions & Self-Control">❤️ Emotions & Self-Control</option>
                      <option value="Safety & Out and About">🛑 Safety & Out and About</option>
                      <option value="Potty Training">🚽 Potty Training</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#433D3A] hover:bg-[#2D2926] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Save Custom Scenario
                  </button>
                </form>
              </div>

              {/* Existing Question List */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-[#2D2926] uppercase tracking-wide">Active Questions ({questions.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-white rounded-xl border border-[#E8E1D5] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-extrabold text-[#2D2926]">{idx + 1}. {q.scenario}</p>
                        <p className="text-[#7A7067] font-medium">Category: {q.category}</p>
                      </div>
                      {questions.length > 3 && (
                        <button
                          onClick={() => onDeleteQuestion(q.id)}
                          className="p-1.5 text-[#F43F5E] hover:bg-[#FFF1F2] rounded-lg transition-colors shrink-0 cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
