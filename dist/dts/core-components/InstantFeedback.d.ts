import React from 'react';
import { Question } from '../Quiz.js';
interface InstantFeedbackProps {
    showInstantFeedback: boolean;
    incorrectAnswer: boolean;
    correctAnswer: boolean;
    question: Question;
    userAnswer?: number | number[];
    onQuestionSubmit: ({ question, userAnswer, isCorrect }: {
        question: Question;
        userAnswer: number | number[] | undefined;
        isCorrect: boolean;
    }) => void;
}
declare function InstantFeedback({ showInstantFeedback, incorrectAnswer, correctAnswer, question, onQuestionSubmit, userAnswer, }: InstantFeedbackProps): React.JSX.Element;
export default InstantFeedback;
