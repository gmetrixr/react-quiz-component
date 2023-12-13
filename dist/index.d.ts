import React from 'react';

declare const defaultLocale: {
    landingHeaderText: string;
    question: string;
    startQuizBtn: string;
    resultFilterAll: string;
    resultFilterCorrect: string;
    resultFilterIncorrect: string;
    nextQuestionBtn: string;
    prevQuestionBtn: string;
    resultPageHeaderText: string;
    resultPagePoint: string;
    singleSelectionTagText: string;
    multipleSelectionTagText: string;
    pickNumberOfSelection: string;
    marksOfQuestion: string;
};
type Locale = typeof defaultLocale;

type QuestionSummary = {
    numberOfQuestions?: number;
    numberOfCorrectAnswers?: number;
    numberOfIncorrectAnswers?: number;
    questions?: Question[];
    userInput?: (number | number[])[];
    totalPoints?: number;
    correctPoints?: number;
};

type QuestionType = "text" | "photo";
type AnswerType = "single" | "multiple";
type Question = {
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
type QuizProps = {
    quizTitle: string;
    quizSynopsis?: string;
    nrOfQuestions: number;
    questions: Question[];
    appLocale?: Locale;
};
type onQuestionSubmitProps = {
    question: Question;
    userAnswer: string | number | boolean;
    isCorrect: boolean;
};
type Props = {
    quiz: QuizProps;
    shuffle?: boolean;
    shuffleAnswer?: boolean;
    showDefaultResult?: boolean;
    customResultPage?: (questionSummary: QuestionSummary) => React.JSX.Element;
    onComplete: (questionSummary: QuestionSummary) => void;
    showInstantFeedback?: boolean;
    continueTillCorrect?: boolean;
    revealAnswerOnSubmit?: boolean;
    allowNavigation?: boolean;
    disableRenderTags?: boolean;
    onQuestionSubmit: (obj: any) => void;
    disableSynopsis?: boolean;
};
declare function Quiz({ quiz, shuffle, shuffleAnswer, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableRenderTags, disableSynopsis, }: Props): React.JSX.Element;

export { type AnswerType, type Props, type Question, type QuestionType, type QuizProps, Quiz as default, type onQuestionSubmitProps };
