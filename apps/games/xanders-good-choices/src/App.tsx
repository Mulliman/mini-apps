import React, { useState, useMemo, useEffect } from 'react';
import { initialQuestions } from './data/questions';
import { Question, Option, ChoiceHistoryItem, CustomQuestionInput } from './types';
import { Header as QuizHeader } from './components/Header';
import Header from '../../../shared/Header';
import { QuestionCard } from './components/QuestionCard';
import { CompletionModal } from './components/CompletionModal';
import { ParentModal } from './components/ParentModal';
import { PromptModal } from './components/PromptModal';
import { soundEngine } from './utils/soundEffects';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    // Clean up older stale storage versions
    localStorage.removeItem('xander_questions_v1');
    localStorage.removeItem('xander_questions_v2');

    const saved = localStorage.getItem('xander_questions_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 30) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return initialQuestions;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [history, setHistory] = useState<ChoiceHistoryItem[]>([]);
  
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoRead, setAutoRead] = useState<boolean>(true);
  const [isParentModalOpen, setIsParentModalOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('xander_questions_v3', JSON.stringify(questions));
  }, [questions]);

  // Filter questions by selected category
  const activeQuestions = useMemo(() => {
    if (selectedCategory === 'All') return questions;
    const filtered = questions.filter((q) => q.category === selectedCategory);
    return filtered.length > 0 ? filtered : questions;
  }, [questions, selectedCategory]);

  const handleSelectCategory = (cat: string) => {
    soundEngine.stopSpeech();
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setHistory([]);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleToggleAutoRead = () => {
    setAutoRead(!autoRead);
  };

  const handleAnswerSelected = (option: Option, firstTry: boolean) => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    // Only add to history if not already recorded for this question
    const existingIndex = history.findIndex((h) => h.questionId === currentQ.id);
    if (existingIndex === -1) {
      if (option.isCorrect) {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }

      setHistory((prev) => [
        ...prev,
        {
          questionId: currentQ.id,
          scenario: currentQ.scenario,
          firstTryCorrect: firstTry && option.isCorrect,
          attempts: 1,
          chosenOptionId: option.id,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    soundEngine.stopSpeech();
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    soundEngine.stopSpeech();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setHistory([]);
  };

  const handleResetProgress = () => {
    handleRestart();
    setQuestions(initialQuestions);
    localStorage.removeItem('xander_questions_v3');
    setIsParentModalOpen(false);
  };

  const handleAddCustomQuestion = (input: CustomQuestionInput) => {
    const newQ: Question = {
      id: `custom_${Date.now()}`,
      scenario: input.scenario,
      speechText: input.scenario,
      category: input.category,
      options: [
        {
          id: `custom_${Date.now()}_good`,
          text: input.goodOptionText,
          isCorrect: true,
          actionType: 'custom',
          feedbackSpeech: `Yay! Excellent choice Xander!`,
          explanation: `Making good decisions helps everyone stay happy and safe!`,
          imagePrompt: `Flat minimalist toddler illustration on teal background (#3A96A0). Blonde 4yo boy Xander doing ${input.goodOptionText}`,
        },
        {
          id: `custom_${Date.now()}_bad`,
          text: input.badOptionText,
          isCorrect: false,
          actionType: 'custom',
          feedbackSpeech: `Oops! Let's choose the kind decision!`,
          explanation: `Let's try again!`,
          imagePrompt: `Flat minimalist toddler illustration on teal background (#3A96A0). Blonde 4yo boy Xander doing ${input.badOptionText}`,
        },
      ],
    };

    setQuestions((prev) => [newQ, ...prev]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const isCompleted = currentIndex >= activeQuestions.length && activeQuestions.length > 0;

  return (
    <div className="h-screen max-h-screen bg-[#FEFAF2] text-[#433D3A] flex flex-col font-sans overflow-hidden selection:bg-[#E8E1D5]">
      <Header title="Xander's Good Choices" />
      {/* Top Navigation Header */}
      <QuizHeader
        score={score}
        totalQuestions={activeQuestions.length}
        streak={streak}
        isMuted={isMuted}
        autoRead={autoRead}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onToggleMute={handleToggleMute}
        onToggleAutoRead={handleToggleAutoRead}
        onOpenParentModal={() => setIsParentModalOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 w-full overflow-y-auto p-3 sm:p-6 flex flex-col items-center">
        {!isCompleted && activeQuestions[currentIndex] ? (
          <QuestionCard
            key={activeQuestions[currentIndex]?.id || currentIndex}
            question={activeQuestions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={activeQuestions.length}
            autoRead={autoRead}
            onAnswerSelected={handleAnswerSelected}
            onNextQuestion={handleNextQuestion}
          />
        ) : (
          <CompletionModal
            score={score}
            totalQuestions={activeQuestions.length}
            history={history}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Parent Settings Modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        questions={questions}
        history={history}
        autoRead={autoRead}
        onToggleAutoRead={handleToggleAutoRead}
        onResetProgress={handleResetProgress}
        onAddCustomQuestion={handleAddCustomQuestion}
        onDeleteQuestion={handleDeleteQuestion}
      />

      {/* Image Prompts Exporter Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        questions={questions}
      />
    </div>
  );
}
