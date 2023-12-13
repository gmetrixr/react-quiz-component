import React from "react";
import { Question, QuestionSummary } from "./Quiz";
import { Locale } from "./Locale";
export declare enum AnswerFinalState {
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
    onQuestionSubmit: (quetion: Question, isCorrect: boolean) => void;
    onComplete: (questionSummary: QuestionSummary) => void;
    customResultPage?: (questionSummary: QuestionSummary) => React.JSX.Element;
}
declare function Core({ questions, appLocale, allowSkip, showDefaultResult, onComplete, customResultPage, showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation, onQuestionSubmit, disableRenderTags, }: CoreProps): React.JSX.Element;
export default Core;
