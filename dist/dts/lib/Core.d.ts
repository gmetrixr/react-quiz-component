import React from 'react';
import { Question } from './Quiz';
import { Locale } from './Locale';
interface CoreProps {
    questions: Question[];
    appLocale: Locale;
    showDefaultResult?: boolean;
    showInstantFeedback?: boolean;
    continueTillCorrect?: boolean;
    revealAnswerOnSubmit?: boolean;
    allowNavigation?: boolean;
    disableRenderTags?: boolean;
    onQuestionSubmit: (obj: any) => void;
    onComplete: (questionSummary: QuestionSummary) => void;
    customResultPage?: (questionSummary: QuestionSummary) => React.JSX.Element;
}
export type QuestionSummary = {
    numberOfQuestions?: number;
    numberOfCorrectAnswers?: number;
    numberOfIncorrectAnswers?: number;
    questions?: Question[];
    userInput?: (number | number[])[];
    totalPoints?: number;
    correctPoints?: number;
};
declare function Core({ questions, appLocale, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableRenderTags }: CoreProps): React.JSX.Element;
export default Core;
