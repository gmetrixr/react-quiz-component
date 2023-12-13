import React, { useState, useEffect, useCallback, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import QuizResultFilter from "./core-components/QuizResultFilter";
import { rawMarkup } from "./core-components/helpers";
import InstantFeedback from "./core-components/InstantFeedback";
import Explanation from "./core-components/Explanation";
import {
  QuestionType,
  Question,
  AnswerType,
  onQuestionSubmitProps,
} from "./Quiz";
import { Locale } from "./Locale";
import { number } from "prop-types";
import QuestionComponent from "./core-components/Question";

enum AnswerFinalState {
  correct = "correct",
  wrong = "wrong",
  skipped = 'skipped'
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

interface CurrentAnswer {
  index?: number;
  correctAnswer?: number[];
  answerSelectionType?: AnswerType;
  selectedOptions?: number[];
}

function Core({
  questions,
  appLocale,
  allowSkip,
  showDefaultResult,
  onComplete,
  customResultPage,
  showInstantFeedback,
  continueTillCorrect,
  revealAnswerOnSubmit,
  allowNavigation,
  onQuestionSubmit,
  disableRenderTags,
}: CoreProps): React.JSX.Element {
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const [endQuiz, setEndQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttons, setButtons] = useState({});
  const [correct, setCorrect] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[][]>([]);
  const [filteredValue, setFilteredValue] = useState("all");
  const [userAttempt, setUserAttempt] = useState(1);
  const [showDefaultResultState, setShowDefaultResult] = useState(true);
  const [answerSelectionTypeState, setAnswerSelectionType] =
    useState<AnswerType>(AnswerType.single);

  const [finalAnswers, setFinalAnswers] = useState<AnswerFinalState[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctPoints, setCorrectPoints] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(
    questions[currentQuestionIndex]
  );
  const [questionSummary, setQuestionSummary] = useState<QuestionSummary>({});

  useEffect(() => {
    setShowDefaultResult(
      showDefaultResult !== undefined ? showDefaultResult : true
    );
  }, [showDefaultResult]);

  useEffect(() => {
    setActiveQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const { answerSelectionType } = activeQuestion;
    // Default single to avoid code breaking due to automatic version upgrade
    setAnswerSelectionType(answerSelectionType || AnswerType.single);
  }, [activeQuestion, currentQuestionIndex]);

  useEffect(() => {
    setQuestionSummary({
      numberOfQuestions: questions.length,
      numberOfCorrectAnswers: finalAnswers.filter(a => a === AnswerFinalState.correct).length,
      numberOfIncorrectAnswers: finalAnswers.filter(a => a === AnswerFinalState.wrong).length,
      numberOfSkippedAnswers: finalAnswers.filter(a => a === AnswerFinalState.skipped).length,
      questions,
      finalAnswers
    });
  }, [endQuiz]);

  useEffect(() => {
    if (endQuiz && onComplete !== undefined && questionSummary !== undefined) {
      onComplete(questionSummary);
    }
  }, [questionSummary]);

  const nextQuestion = (currentQuestionIdx: number) => {
    setIncorrectAnswer(false);
    setIsCorrect(false);
    setShowNextQuestionButton(false);
    setButtons({});

    if (currentQuestionIdx + 1 === questions.length) {
      if (allowNavigation) {
        const submitQuiz = confirm(
          "You have finished all the questions. Submit Quiz now?"
        );
        if (submitQuiz) {
          setEndQuiz(true);
        }
      } else {
        setEndQuiz(true);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIdx + 1);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredValue(event.target.value);
  };

  const renderAnswerInResult = (
    question: Question,
    userInputIndex: number[]
  ) => {
    const { answers, correctAnswer, questionType } = question;
    let { answerSelectionType } = question;
    let answerBtnCorrectClassName;
    let answerBtnIncorrectClassName: string;

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || AnswerType.single;

    return answers.map((answer, index) => {
      if (
        answerSelectionType === AnswerType.single ||
        typeof correctAnswer === "number" ||
        typeof userInputIndex === "number"
      ) {
        // correctAnswer - is string
        // answerBtnCorrectClassName = index + 1 === correctAnswer ? "correct" : "";
        // answerBtnIncorrectClassName = userInputIndex !== correctAnswer && index + 1 === userInputIndex
        //     ? "incorrect"
        //     : "";
      } else {
        // correctAnswer - is array of numbers
        answerBtnCorrectClassName = correctAnswer.includes(index + 1)
          ? "correct"
          : "";
        if (userInputIndex) {
          answerBtnIncorrectClassName =
            !correctAnswer.includes(index + 1) &&
            userInputIndex.includes(index + 1)
              ? "incorrect"
              : "";
        }
      }

      return (
        <div key={uuidv4()}>
          <button
            type="button"
            disabled
            className={`answerBtn btn ${"answerBtnCorrectClassName"}${answerBtnIncorrectClassName}`}
          >
            {questionType === "text" && <span>{answer}</span>}
            {questionType === "photo" && <img src={answer} alt="answer" />}
          </button>
        </div>
      );
    });
  };

  const renderTags = (
    answerSelectionType: AnswerType,
    numberOfSelection: number[],
    segment: string
  ) => {
    const {
      singleSelectionTagText,
      multipleSelectionTagText,
      pickNumberOfSelection,
    } = appLocale;

    return (
      <div className="tag-container">
        {answerSelectionType === AnswerType.single && (
          <span className="single selection-tag">{singleSelectionTagText}</span>
        )}
        {answerSelectionType === "multiple" && (
          <span className="multiple selection-tag">
            {multipleSelectionTagText}
          </span>
        )}
        <span className="number-of-selection">
          {pickNumberOfSelection.replace(
            "<numberOfSelection>",
            `${
              typeof numberOfSelection === "number"
                ? numberOfSelection
                : numberOfSelection.length
            }`
          )}
        </span>
        {segment && <span className="selection-tag segment">{segment}</span>}
      </div>
    );
  };

  const renderQuizResultQuestions = useCallback(() => {
    let filteredQuestions: Question[] | undefined;
    let filteredUserInput: number[][];
    if (filteredValue !== "all") {
      if (filteredValue === "correct") {
        filteredQuestions = questions.filter(
          (question, index) => correct.indexOf(index) !== -1
        );
        filteredUserInput = userInput.filter(
          (input, index) => correct.indexOf(index) !== -1
        );
      } else {
        filteredQuestions = questions.filter(
          (question, index) => incorrect.indexOf(index) !== -1
        );
        filteredUserInput = userInput.filter(
          (input, index) => incorrect.indexOf(index) !== -1
        );
      }
    }
    return (filteredQuestions || questions).map((question, index) => {
      const userInputIndex = filteredUserInput
        ? filteredUserInput[index]
        : userInput[index];

      // Default single to avoid code breaking due to automatic version upgrade
      const answerSelectionType =
        question.answerSelectionType || AnswerType.single;

      return (
        <div className="result-answer-wrapper" key={uuidv4()}>
          <h3
            dangerouslySetInnerHTML={rawMarkup(
              `Q${question.questionIndex}: ${
                question.question
              } ${appLocale.marksOfQuestion.replace(
                "<marks>",
                String(question.point)
              )}`
            )}
          />
          {question.questionPic && (
            <img src={question.questionPic} alt="question" />
          )}
          {renderTags(
            answerSelectionType,
            question.correctAnswer,
            question.segment || "basic"
          )}
          <div className="result-answer">
            {renderAnswerInResult(question, userInputIndex)}
          </div>
          <Explanation question={question} isResultPage />
        </div>
      );
    });
  }, [endQuiz, filteredValue]);

  const renderResult = () => (
    <div className="card-body">
      <h2>
        {appLocale.resultPageHeaderText
          .replace("<correctIndexLength>", String(correct.length))
          .replace("<questionLength>", String(questions.length))}
      </h2>
      <h2>
        {appLocale.resultPagePoint
          .replace("<correctPoints>", String(correctPoints))
          .replace("<totalPoints>", String(totalPoints))}
      </h2>
      <br />
      <QuizResultFilter
        filteredValue={filteredValue}
        handleChange={handleChange}
        appLocale={appLocale}
      />
      {renderQuizResultQuestions()}
    </div>
  );

  return (
    <div className="questionWrapper">
      {!endQuiz && (
        <div className="questionWrapperBody">
          <div className="questionInfo">
            {`${appLocale.question} ${currentQuestionIndex + 1} / ${
              questions.length
            }:`}
          </div>
          <QuestionComponent
            key={`question-${currentQuestionIndex}`}
            qObj={activeQuestion}
            disableRenderTags
            showInstantFeedback={showInstantFeedback}
            appLocale={appLocale}
            allowSkip={allowSkip}
            onNextQuestion={(isCorrect) => {
              setFinalAnswers([
                ...finalAnswers,
                isCorrect ? AnswerFinalState.correct : AnswerFinalState.wrong
              ]);
              nextQuestion(currentQuestionIndex);
            }}
            onSkip={()=> {
              setFinalAnswers([
                ...finalAnswers,
                AnswerFinalState.skipped
              ])
              nextQuestion(currentQuestionIndex)}
            }
          />
        </div>
      )}
      {endQuiz &&
        showDefaultResultState &&
        customResultPage === undefined &&
        renderResult()}
      {endQuiz &&
        !showDefaultResultState &&
        customResultPage !== undefined &&
        customResultPage(questionSummary)}
    </div>
  );
}

export default Core;
