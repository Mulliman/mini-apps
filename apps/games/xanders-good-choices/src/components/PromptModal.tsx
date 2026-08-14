import React, { useState } from 'react';
import { X, Copy, Check, Download, Image as ImageIcon } from 'lucide-react';
import { Question } from '../types';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, questions }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(questions.map((q) => q.category)))];

  const filteredQuestions =
    filterCategory === 'All' ? questions : questions.filter((q) => q.category === filterCategory);

  // Generate plain text of all prompts
  const getAllPromptsText = () => {
    let output = `# Image Generation Prompts for Xander's Good Choices\n`;
    output += `# Total Questions: ${filteredQuestions.length} | Category: ${filterCategory}\n\n`;

    filteredQuestions.forEach((q, idx) => {
      output += `=== QUESTION ${idx + 1}: ${q.scenario} (${q.category}) ===\n`;
      q.options.forEach((opt, optIdx) => {
        output += `Option ${optIdx + 1} (${opt.isCorrect ? 'GOOD CHOICE' : 'WRONG CHOICE'}): "${opt.text}"\n`;
        output += `Prompt: ${opt.imagePrompt || 'Flat minimalist toddler illustration on teal background. Blonde 4yo boy Xander.'}\n\n`;
      });
      output += `\n`;
    });

    return output;
  };

  const handleCopySingle = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getAllPromptsText());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([getAllPromptsText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `xander_image_prompts_${filterCategory.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2926]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#FEFAF2] w-full max-w-3xl rounded-[28px] shadow-2xl border border-[#E8E1D5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#2D2926] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <h2 className="text-base sm:text-lg font-black">Image Prompts Exporter for Flow</h2>
              <p className="text-xs text-[#E8E1D5] opacity-80">Copy prompts to generate artwork for Xander's scenarios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#E8E1D5] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Global Actions Bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-[#E8E1D5] flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#433D3A]">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs font-bold bg-[#FEFAF2] text-[#2D2926] border border-[#E8E1D5] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#433D3A] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({cat === 'All' ? questions.length : questions.filter((q) => q.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 bg-[#433D3A] hover:bg-[#2D2926] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy All Prompts'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 bg-white hover:bg-[#FEFAF2] border border-[#E8E1D5] text-[#433D3A] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .TXT</span>
            </button>
          </div>
        </div>

        {/* Prompt List Body */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[60vh]">
          {filteredQuestions.map((q, qIdx) => (
            <div key={q.id} className="bg-white rounded-2xl p-4 border border-[#E8E1D5] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#2D2926] bg-[#E8E1D5] px-2.5 py-0.5 rounded-full">
                  Question {qIdx + 1}
                </span>
                <span className="text-[11px] font-semibold text-[#7A7067]">{q.category}</span>
              </div>

              <h4 className="text-sm font-black text-[#2D2926]">{q.scenario}</h4>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt) => {
                  const promptKey = `${q.id}-${opt.id}`;
                  const promptText = opt.imagePrompt || `Flat minimalist toddler illustration on solid teal background (#3A96A0). Blonde 4yo boy Xander doing ${opt.text}`;
                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        opt.isCorrect
                          ? 'bg-[#ECFDF5] border-[#10B981]/40 text-[#065F46]'
                          : 'bg-[#FFF1F2] border-[#F43F5E]/40 text-[#991B1B]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-extrabold">
                        <span>
                          {opt.isCorrect ? '✅ Good Choice' : '❌ Wrong Choice'}: "{opt.text}"
                        </span>
                        <button
                          onClick={() => handleCopySingle(promptText, promptKey)}
                          className="px-2 py-1 bg-white hover:bg-gray-50 border border-[#E8E1D5] rounded-lg text-[11px] font-bold text-[#433D3A] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedIndex === promptKey ? (
                            <Check className="w-3 h-3 text-[#10B981]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedIndex === promptKey ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <p className="font-mono text-[11px] bg-white/80 p-2 rounded-lg border border-[#E8E1D5] text-[#2D2926] leading-relaxed select-all">
                        {promptText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
