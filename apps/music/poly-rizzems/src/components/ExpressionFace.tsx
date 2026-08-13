import React from 'react';
import { ExpressionType } from '../types';

export const EXPRESSIONS: ExpressionType[] = [
  'none', 'happy', 'sad', 'sick', 'angry', 'excited', 'dizzy', 'surprised', 'sleepy', 'cool', 'silly'
];

export function getRandomExpression(): ExpressionType {
  const exprs = EXPRESSIONS.filter(e => e !== 'none');
  return exprs[Math.floor(Math.random() * exprs.length)];
}

interface Props {
  type?: ExpressionType;
  className?: string;
}

export default function ExpressionFace({ type, className = "w-full h-full opacity-60 text-black" }: Props) {
  if (!type) {
    return null;
  }
  
  let content = null;
  let customStrokeWidth = "2";
  
  switch (type) {
    case 'none':
      content = <circle cx="12" cy="12" r="8" strokeDasharray="3 3" opacity="0.3" />;
      break;
    case 'happy':
      content = <><path strokeLinecap="round" strokeWidth="2.5" d="M8 9h.01M16 9h.01" /><path strokeLinecap="round" d="M8 14a4 4 0 0 0 8 0" /></>;
      break;
    case 'sad':
      content = <><path strokeLinecap="round" strokeWidth="2.5" d="M8 10h.01M16 10h.01" /><path strokeLinecap="round" d="M8 16a4 4 0 0 1 8 0" /></>;
      break;
    case 'sick':
      content = <><path strokeLinecap="round" strokeLinejoin="round" d="M7 8l2 2m0-2l-2 2m7-2l2 2m0-2l-2 2" /><path strokeLinejoin="round" d="M7 16l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5" /></>;
      break;
    case 'angry':
      content = <><path strokeLinecap="round" d="M6.5 8l3.5 2m7.5-2l-3.5 2" /><path strokeLinecap="round" strokeWidth="2.5" d="M8 12h.01M16 12h.01" /><path strokeLinecap="round" d="M9 16h6" /></>;
      break;
    case 'excited':
      content = <><path strokeLinecap="round" d="M6 10a2 2 0 0 1 4 0M14 10a2 2 0 0 1 4 0" /><path strokeLinecap="round" d="M9 15a3 3 0 0 0 6 0" /></>;
      break;
    case 'dizzy':
      content = <><path strokeLinecap="round" d="M6 10c0-1.5 1-2 2-2s2 .5 2 2-.5 1-1 1-1-.5-1-1zm10 0c0-1.5 1-2 2-2s2 .5 2 2-.5 1-1 1-1-.5-1-1z" /><path strokeLinecap="round" d="M8 15.5c1.5 1 2.5 1 4 0s2.5-1 4 0" /></>;
      break;
    case 'surprised':
      content = <><path strokeLinecap="round" d="M7 7a2 2 0 0 1 2-1M15 7a2 2 0 0 1 2-1" /><path strokeLinecap="round" strokeWidth="2.5" d="M8 10h.01M16 10h.01" /><circle cx="12" cy="15" r="2.5" /></>;
      break;
    case 'sleepy':
      content = <><path strokeLinecap="round" d="M6 10a2 2 0 0 0 4 0M14 10a2 2 0 0 0 4 0M10 15h4" /></>;
      break;
    case 'cool':
      content = <><path strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.3" d="M4 9h16l-2 4.5H6L4 9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4.5" /><path strokeLinecap="round" d="M9 16c1 1 3 1 5 0" /></>;
      break;
    case 'silly':
      content = <><circle cx="8" cy="9" r="1.5" /><circle cx="16" cy="9" r="1" /><path strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.3" d="M9 14h6v2a3 3 0 0 1-6 0v-2z" /><path strokeLinecap="round" d="M9 14h6" /></>;
      break;
    default:
      return null;
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={customStrokeWidth} className={className}>
      {content}
    </svg>
  );
}
