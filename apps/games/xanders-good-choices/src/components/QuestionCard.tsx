import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, Option } from '../types';
import { IllustrationRenderer } from './IllustrationRenderer';
import { soundEngine } from '../utils/soundEffects';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  autoRead: boolean;
  onAnswerSelected: (option: Option, firstTry: boolean) => void;
  onNextQuestion: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  autoRead,
  onAnswerSelected,
  onNextQuestion,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrectChoice, setIsCorrectChoice] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);

  // Shuffle options on question change so answer position varies
  useEffect(() => {
    setSelectedOptionId(null);
    setIsCorrectChoice(null);
    setAttempts(0);

    // Create a stable shuffle
    const optionsCopy = [...question.options];
    optionsCopy.sort(() => (question.id.charCodeAt(question.id.length - 1) % 2 === 0 ? 0.5 - Math.random() : Math.random() - 0.5));
    setShuffledOptions(optionsCopy);

    // Auto-read question if enabled
    if (autoRead) {
      soundEngine.speak(question.speechText);
    }

    return () => {
      soundEngine.stopSpeech();
    };
  }, [question, autoRead]);

  const handleSpeakQuestion = () => {
    soundEngine.speak(question.speechText);
  };

  const handleSpeakOption = (e: React.MouseEvent, option: Option) => {
    e.stopPropagation();
    soundEngine.speak(option.text);
  };

  const handleOptionClick = (option: Option) => {
    // If already got it right, skip
    if (isCorrectChoice === true) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setIsCorrectChoice(true);
      soundEngine.playCorrectChime();
      soundEngine.speak(option.feedbackSpeech);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#42A5F5', '#FDD835', '#66BB6A', '#AB47BC']
      });

      onAnswerSelected(option, newAttempts === 1);
    } else {
      setIsCorrectChoice(false);
      soundEngine.playWrongBoing();
      soundEngine.speak(option.feedbackSpeech);

      onAnswerSelected(option, false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6">
      {/* Question Header & Progress Bar */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-[#E8E1D5] flex flex-col gap-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#2D2926] bg-[#E8E1D5] px-3.5 py-1 rounded-full">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs font-semibold text-[#7A7067] bg-[#FEFAF2] border border-[#E8E1D5] px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E8E1D5] h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-[#433D3A] h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Title & Speak Button */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#2D2926] leading-snug">
            {question.scenario}
          </h2>
          <button
            onClick={handleSpeakQuestion}
            id="speak-question-btn"
            title="Read Question Out Loud"
            className="p-3 bg-[#FEFAF2] hover:bg-[#E8E1D5] border border-[#E8E1D5] text-[#433D3A] rounded-2xl shrink-0 transition-transform active:scale-95 shadow-xs cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Options Grid (2 Large Choice Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {shuffledOptions.map((option) => {
          const isThisSelected = selectedOptionId === option.id;
          const showGreen = isCorrectChoice === true && option.isCorrect;
          const showRed = isThisSelected && isCorrectChoice === false;

          return (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option)}
              id={`option-card-${option.id}`}
              className={`group cursor-pointer bg-white rounded-[32px] p-4 sm:p-5 border-2 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden shadow-2xs hover:shadow-md active:scale-[0.98] ${
                showGreen
                  ? 'border-[#10B981] bg-[#ECFDF5] ring-8 ring-[#10B981]/15'
                  : showRed
                  ? 'border-[#F43F5E] bg-[#FFF1F2] ring-8 ring-[#F43F5E]/15 animate-shake'
                  : 'border-[#E8E1D5] hover:border-[#D4CBB8]'
              }`}
            >
              {/* Illustration / Image Renderer */}
              <div className="relative">
                {option.image ? (
                  <div
                    className={`relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-2xs border transition-all duration-300 ${
                      showGreen
                        ? 'border-[#10B981] bg-[#ECFDF5]'
                        : showRed
                        ? 'border-[#F43F5E] bg-[#FFF1F2]'
                        : 'border-[#E8E1D5] bg-[#FEFAF2]'
                    }`}
                  >
                    <img
                      src={option.image}
                      alt={option.text}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <IllustrationRenderer
                    actionType={option.actionType}
                    isCorrect={showGreen ? true : showRed ? false : undefined}
                  />
                )}

                {/* Speaker icon inside illustration top left */}
                <button
                  onClick={(e) => handleSpeakOption(e, option)}
                  title="Read Option Out Loud"
                  className="absolute top-2 left-2 p-2 bg-white/90 hover:bg-white text-[#433D3A] rounded-xl shadow-xs border border-[#E8E1D5] transition-transform active:scale-90 cursor-pointer z-10"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Option Text Label */}
              <div className="flex items-center justify-between gap-2 min-h-14">
                <p className="text-lg sm:text-xl font-black text-[#2D2926] group-hover:text-[#000000] leading-snug">
                  {option.text}
                </p>

                {/* State Badge Icon */}
                {showGreen && (
                  <div className="bg-[#10B981] text-white p-2 rounded-full shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                {showRed && (
                  <div className="bg-[#F43F5E] text-white p-2 rounded-full shrink-0 shadow-md">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Banner & Next Button */}
      {isCorrectChoice === true && (
        <div className="bg-[#ECFDF5] border-2 border-[#10B981]/60 rounded-[32px] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="bg-[#10B981] text-white p-3 rounded-2xl shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#065F46]">Great Job, Xander!</h3>
              <p className="text-[#047857] text-sm sm:text-base font-semibold mt-0.5">
                {question.options.find((o) => o.isCorrect)?.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={onNextQuestion}
            id="next-question-btn"
            className="w-full sm:w-auto px-8 py-4 bg-[#433D3A] hover:bg-[#2D2926] active:scale-95 text-white font-black text-lg rounded-full shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{currentIndex + 1 === totalQuestions ? 'See Results 🎉' : 'Next Question'}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {isCorrectChoice === false && (
        <div className="bg-[#FFF1F2] border-2 border-[#F43F5E]/40 rounded-[32px] p-5 shadow-2xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="bg-[#F43F5E] text-white p-2.5 rounded-2xl shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#991B1B]">Let's try again!</h4>
              <p className="text-[#B91C1C] text-xs sm:text-sm font-medium">
                Tap the other choice to find the good decision!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
