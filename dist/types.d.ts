/// <reference types="react" />

export type Question = {
  question: string,
  questionType: string,
  questionPic: string,
  answerSelectionType: "single" | "multiple"
  answers: string[],
  correctAnswer: string,
  messageForCorrectAnswer: string,
  messageForIncorrectAnswer: string,
  explanation: string,
  point: number,
}

export type QuizProps = {
  quizTitle: string,
  quizSynopsis?: string,
  nrOfQuestions: number,
  questions: Question[],
};

export type onQuestionSubmitProps = {
  question: Question,
  userAnswer: string | number | boolean,
  isCorrect: boolean,
}

export type Props = {
  quiz: QuizProps,
  shuffle?: boolean,
  shuffleAnswer?: boolean,
  showDefaultResult?: boolean,
  onComplete?: () => {},
  customResultPage: any,
  showInstantFeedback?: boolean,
  continueTillCorrect?: boolean,
  revealAnswerOnSubmit?: boolean,
  allowNavigation?: boolean,
  onQuestionSubmit?: (obj: any) => {},
  disableSynopsis?: boolean,
};

declare const Quiz: ({
  quiz,
  shuffle,
  shuffleAnswer,
  showDefaultResult,
  onComplete,
  customResultPage,
  showInstantFeedback,
  continueTillCorrect,
  revealAnswerOnSubmit,
  allowNavigation,
  onQuestionSubmit,
  disableSynopsis,
}: Props) => JSX.Element;
export default Quiz;