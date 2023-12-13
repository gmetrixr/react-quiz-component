import React from "react";
import { AnswerFinalState } from "./Core";
import { Locale } from "./Locale";
import "./styles.css";
export declare enum QuestionType {
    text = "text",
    photo = "photo"
}
export declare enum AnswerType {
    single = "single",
    multiple = "multiple"
}
export type Question = {
    question: string;
    questionType: QuestionType;
    questionPic?: string;
    answerSelectionType: AnswerType;
    answers: string[];
    correctAnswer: number[];
    messageForCorrectAnswer?: string;
    messageForIncorrectAnswer?: string;
    explanation?: string;
    point: number;
    questionIndex?: number;
    segment?: string;
};
export type QuizProps = {
    quizTitle: string;
    quizSynopsis?: string;
    nrOfQuestions: number;
    questions: Question[];
    appLocale?: Locale;
};
export type onQuestionSubmitProps = {
    question: Question;
    userAnswer: number | number[];
    isCorrect: boolean;
};
export type Props = {
    quiz: QuizProps;
    shuffle?: boolean;
    allowSkip?: boolean;
    shuffleAnswer?: boolean;
    showDefaultResult?: boolean;
    customResultPage?: (questionSummary: QuestionSummary) => React.JSX.Element;
    onComplete: (questionSummary: QuestionSummary) => void;
    showInstantFeedback?: boolean;
    continueTillCorrect?: boolean;
    revealAnswerOnSubmit?: boolean;
    allowNavigation?: boolean;
    disableRenderTags?: boolean;
    onQuestionSubmit: (question: Question, isCorrect: boolean) => void;
    disableSynopsis?: boolean;
};
export type QuestionSummary = {
    numberOfQuestions?: number;
    numberOfCorrectAnswers?: number;
    numberOfIncorrectAnswers?: number;
    numberOfSkippedAnswers?: number;
    questions?: Question[];
    finalAnswers?: AnswerFinalState[];
};
declare function Quiz({ quiz, shuffle, allowSkip, shuffleAnswer, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableRenderTags, disableSynopsis, }: Props): React.JSX.Element;
export default Quiz;
