import React from "react";
import { Question, onQuestionSubmitProps } from "./Quiz";
import { Locale } from "./Locale";
declare enum AnswerFinalState {
    correct = "correct",
    wrong = "wrong",
    skipped = "skipped"
}
interface CoreProps {
    questions: Question[];
    appLocale: Locale;
    showDefaultResult?: boolean;
    showInstantFeedback?: boolean;
    continueTillCorrect?: boolean;
    revealAnswerOnSubmit?: boolean;
    allowNavigation?: boolean;
    disableRenderTags?: boolean;
    allowSkip?: boolean;
    onQuestionSubmit: (questionResult: onQuestionSubmitProps) => void;
    onComplete: (questionSummary: QuestionSummary) => void;
    customResultPage?: (questionSummary: QuestionSummary) => React.JSX.Element;
}
export type QuestionSummary = {
    numberOfQuestions?: number;
    numberOfCorrectAnswers?: number;
    numberOfIncorrectAnswers?: number;
    numberOfSkippedAnswers?: number;
    questions?: Question[];
    finalAnswers?: AnswerFinalState[];
};
declare function Core({ questions, appLocale, allowSkip, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableRenderTags, }: CoreProps): React.JSX.Element;
export default Core;
