import { AnswerType } from '../Quiz';
export declare const rawMarkup: (data: string | Node) => {
    __html: string;
};
export declare const selectAnswer: (index: number, correctAnswer: number | number[], answerSelectionType: AnswerType, { userInput, currentQuestionIndex, setButtons, setShowNextQuestionButton, incorrect, correct, setCorrect, setIncorrect, setUserInput, }: any) => void;
