import React from 'react';
import { QuestionSummary } from './Core.jsx';
import { Locale } from './Locale.jsx';
import './styles.css';
export type QuestionType = "text" | "photo";
export type AnswerType = "single" | "multiple";
export type Question = {
    question: string;
    questionType: QuestionType;
    questionPic?: string;
    answerSelectionType: AnswerType;
    answers: string[];
    correctAnswer: number | number[];
    messageForCorrectAnswer?: string;
    messageForIncorrectAnswer?: string;
    explanation?: string;
    point: number;
    questionIndex?: number;
    segment: string;
};
export type QuizProps = {
    quizTitle: string;
    quizSynopsis?: string;
    nrOfQuestions: number;
    questions: Question[];
    appLocale: Locale;
};
export type onQuestionSubmitProps = {
    question: Question;
    userAnswer: string | number | boolean;
    isCorrect: boolean;
};
export type Props = {
    quiz: QuizProps;
    shuffle?: boolean;
    shuffleAnswer?: boolean;
    showDefaultResult?: boolean;
    onComplete: (questionSummary: QuestionSummary) => {};
    customResultPage: any;
    showInstantFeedback: boolean;
    continueTillCorrect?: boolean;
    revealAnswerOnSubmit?: boolean;
    allowNavigation?: boolean;
    onQuestionSubmit: (obj: any) => {};
    disableSynopsis?: boolean;
};
declare function Quiz({ quiz, shuffle, shuffleAnswer, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableSynopsis, }: Props): React.JSX.Element;
export default Quiz;
