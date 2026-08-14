export type ActionType = 
  | 'push'
  | 'give_toy'
  | 'sleep'
  | 'climb_bed'
  | 'share_apple'
  | 'throw_food'
  | 'tidy_toys'
  | 'leave_mess'
  | 'ask_nicely'
  | 'pull_hair'
  | 'hold_hand'
  | 'run_street'
  | 'wash_hands'
  | 'eat_dirty_hands'
  | 'listen_adult'
  | 'scream_kick'
  | 'wait_slide'
  | 'push_slide'
  | 'say_sorry'
  | 'laugh_run'
  | 'custom';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  actionType: ActionType;
  feedbackSpeech: string;
  explanation: string;
  imagePrompt?: string;
  image?: string;
}

export interface Question {
  id: string;
  scenario: string;
  speechText?: string;
  category: string;
  options: Option[];
}

export interface ChoiceHistoryItem {
  questionId: string;
  scenario: string;
  firstTryCorrect: boolean;
  attempts: number;
  chosenOptionId: string;
  timestamp: string;
}

export interface CustomQuestionInput {
  scenario: string;
  goodOptionText: string;
  badOptionText: string;
  category: Question['category'];
}
