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

declare enum AnswerFinalState {
    correct = "correct",
    wrong = "wrong",
    skipped = "skipped"
}

declare enum QuestionType {
    text = "text",
    photo = "photo"
}
declare enum AnswerType {
    single = "single",
    multiple = "multiple"
}
type Question = {
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
type QuizProps = {
    quizTitle: string;
    quizSynopsis?: string;
    nrOfQuestions: number;
    questions: Question[];
    appLocale?: Locale;
};
type onQuestionSubmitProps = {
    question: Question;
    userAnswer: number | number[];
    isCorrect: boolean;
};
type Props = {
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
type QuestionSummary = {
    numberOfQuestions?: number;
    numberOfCorrectAnswers?: number;
    numberOfIncorrectAnswers?: number;
    numberOfSkippedAnswers?: number;
    questions?: Question[];
    finalAnswers?: AnswerFinalState[];
};
declare function Quiz({ quiz, shuffle, allowSkip, shuffleAnswer, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableRenderTags, disableSynopsis, }: Props): React.JSX.Element;

export { AnswerType, type Props, type Question, type QuestionSummary, QuestionType, type QuizProps, Quiz as default, type onQuestionSubmitProps };
