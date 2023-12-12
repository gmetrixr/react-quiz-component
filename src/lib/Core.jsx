import React, {
  useState, useEffect, useCallback, Fragment,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import QuizResultFilter from './core-components/QuizResultFilter';
import { checkAnswer, selectAnswer, rawMarkup } from './core-components/helpers';
import InstantFeedback from './core-components/InstantFeedback';
import Explanation from './core-components/Explanation';

function Core({
  questions, appLocale, showDefaultResult, onComplete, customResultPage,
  showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation,
  onQuestionSubmit,
}) {
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const [endQuiz, setEndQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttons, setButtons] = useState({});
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [filteredValue, setFilteredValue] = useState('all');
  const [userAttempt, setUserAttempt] = useState(1);
  const [showDefaultResultState, setShowDefaultResult] = useState(true);
  const [answerSelectionTypeState, setAnswerSelectionType] = useState(undefined);

  const [totalPoints, setTotalPoints] = useState(0);
  const [correctPoints, setCorrectPoints] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(questions[currentQuestionIndex]);
  const [questionSummary, setQuestionSummary] = useState(undefined);

  useEffect(() => {
    setShowDefaultResult(showDefaultResult !== undefined ? showDefaultResult : true);
  }, [showDefaultResult]);

  useEffect(() => {
    setActiveQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const { answerSelectionType } = activeQuestion;
    // Default single to avoid code breaking due to automatic version upgrade
    setAnswerSelectionType(answerSelectionType || 'single');
  }, [activeQuestion, currentQuestionIndex]);

  useEffect(() => {
    if (endQuiz) {
      let totalPointsTemp = 0;
      let correctPointsTemp = 0;
      for (let i = 0; i < questions.length; i += 1) {
        let point = questions[i].point || 0;
        if (typeof point === 'string' || point instanceof String) {
          point = parseInt(point, 10);
        }

        totalPointsTemp += point;

        if (correct.includes(i)) {
          correctPointsTemp += point;
        }
      }
      setTotalPoints(totalPointsTemp);
      setCorrectPoints(correctPointsTemp);
    }
  }, [endQuiz]);

  useEffect(() => {
    setQuestionSummary({
      numberOfQuestions: questions.length,
      numberOfCorrectAnswers: correct.length,
      numberOfIncorrectAnswers: incorrect.length,
      questions,
      userInput,
      totalPoints,
      correctPoints,
    });
  }, [totalPoints, correctPoints]);

  useEffect(() => {
    if (endQuiz && onComplete !== undefined && questionSummary !== undefined) {
      onComplete(questionSummary);
    }
  }, [questionSummary]);

  const nextQuestion = (currentQuestionIdx) => {
    setIncorrectAnswer(false);
    setIsCorrect(false);
    setShowNextQuestionButton(false);
    setButtons({});

    if (currentQuestionIdx + 1 === questions.length) {
      if (allowNavigation) {
        const submitQuiz = confirm('You have finished all the questions. Submit Quiz now?');
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

  const handleChange = (event) => {
    setFilteredValue(event.target.value);
  };

  const renderAnswerInResult = (question, userInputIndex) => {
    const { answers, correctAnswer, questionType } = question;
    let { answerSelectionType } = question;
    let answerBtnCorrectClassName;
    let answerBtnIncorrectClassName;

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || 'single';

    return answers.map((answer, index) => {
      if (answerSelectionType === 'single') {
        // correctAnswer - is string
        answerBtnCorrectClassName = (`${index + 1}` === correctAnswer ? 'correct' : '');
        answerBtnIncorrectClassName = (`${userInputIndex}` !== correctAnswer && `${index + 1}` === `${userInputIndex}` ? 'incorrect' : '');
      } else {
        // correctAnswer - is array of numbers
        answerBtnCorrectClassName = (correctAnswer.includes(index + 1) ? 'correct' : '');
        answerBtnIncorrectClassName = (!correctAnswer.includes(index + 1) && userInputIndex.includes(index + 1) ? 'incorrect' : '');
      }

      return (
        <div key={uuidv4()}>
          <button
            type="button"
            disabled
            className={`answerBtn btn ${answerBtnCorrectClassName}${answerBtnIncorrectClassName}`}
          >
            {questionType === 'text' && <span>{answer}</span>}
            {questionType === 'photo' && <img src={answer} alt="answer" />}
          </button>
        </div>
      );
    });
  };

  const renderTags = (answerSelectionType, numberOfSelection, segment) => {
    const {
      singleSelectionTagText,
      multipleSelectionTagText,
      pickNumberOfSelection,
    } = appLocale;

    return (
      <div className="tag-container">
        {answerSelectionType === 'single'
          && <span className="single selection-tag">{singleSelectionTagText}</span>}
        {answerSelectionType === 'multiple'
          && <span className="multiple selection-tag">{multipleSelectionTagText}</span>}
        <span className="number-of-selection">
          {pickNumberOfSelection.replace('<numberOfSelection>', numberOfSelection)}
        </span>
        {segment && <span className="selection-tag segment">{segment}</span>}
      </div>
    );
  };

  const renderQuizResultQuestions = useCallback(() => {
    let filteredQuestions;
    let filteredUserInput;

    if (filteredValue !== 'all') {
      if (filteredValue === 'correct') {
        filteredQuestions = questions.filter((question, index) => correct.indexOf(index) !== -1);
        filteredUserInput = userInput.filter((input, index) => correct.indexOf(index) !== -1);
      } else {
        filteredQuestions = questions.filter((question, index) => incorrect.indexOf(index) !== -1);
        filteredUserInput = userInput.filter((input, index) => incorrect.indexOf(index) !== -1);
      }
    }

    return (filteredQuestions || questions).map((question, index) => {
      const userInputIndex = filteredUserInput ? filteredUserInput[index] : userInput[index];

      // Default single to avoid code breaking due to automatic version upgrade
      const answerSelectionType = question.answerSelectionType || 'single';

      return (
        <div className="result-answer-wrapper" key={uuidv4()}>
          <h3 dangerouslySetInnerHTML={rawMarkup(`Q${question.questionIndex}: ${question.question} ${appLocale.marksOfQuestion.replace('<marks>', question.point)}`)} />
          {question.questionPic && <img src={question.questionPic} alt="question" />}
          {renderTags(answerSelectionType, question.correctAnswer.length, question.segment)}
          <div className="result-answer">
            {renderAnswerInResult(question, userInputIndex)}
          </div>
          <Explanation question={question} isResultPage />
        </div>
      );
    });
  }, [endQuiz, filteredValue]);
  const [currentAnswer, setCurrentAnswer] = useState({});
  const saveAnswer = ({ index, correctAnswer, answerSelectionType, selectedOptions }) => {
    setCurrentAnswer({
      index: index + 1,
      correctAnswer,
      answerSelectionType,
      selectedOptions,
    });
  };
  const resetAnswer = () => {
    setCurrentAnswer({});
  };
  const submitAnswer = () => {
    if (revealAnswerOnSubmit) {
      selectAnswer(currentAnswer.index, currentAnswer.correctAnswer, currentAnswer.answerSelectionType, {
        userInput,
        currentQuestionIndex,
        setButtons,
        setShowNextQuestionButton,
        incorrect,
        correct,
        setCorrect,
        setIncorrect,
        setUserInput,
      });
    } else {
      checkAnswer(currentAnswer.index, currentAnswer.correctAnswer, currentAnswer.sanswerSelectionType, {
        userInput,
        userAttempt,
        currentQuestionIndex,
        continueTillCorrect,
        showNextQuestionButton,
        incorrect,
        correct,
        setButtons,
        setIsCorrect,
        setIncorrectAnswer,
        setCorrect,
        setIncorrect,
        setShowNextQuestionButton,
        setUserInput,
        setUserAttempt,
      });
    }
  };

  const renderAnswers = (question, answerButtons) => {
    const {
      answers, correctAnswer, questionType, questionIndex,
    } = question;
    let { answerSelectionType } = question;
    const handleClick = (index) => {
      if (answerSelectionType === 'single') {
        saveAnswer({ index, answerSelectionType, correctAnswer });
      } else {
        if (!currentAnswer.selectedOptions) currentAnswer.selectedOptions = [index];
        else if (currentAnswer.selectedOptions.includes(index)) {
          currentAnswer.selectedOptions.splice(currentAnswer.selectedOptions.indexOf(index), 1);
        } else {
          currentAnswer.selectedOptions.push(index);
        }
        const userInputCopy = [...userInput];
        userInputCopy[currentQuestionIndex] = currentAnswer.selectedOptions;
        setUserInput(userInputCopy);
        saveAnswer({
          index,
          answerSelectionType,
          correctAnswer,
          selectedOptions: currentAnswer.selectedOptions,
        });
      }
    };
    const isCurrentAnswer = (index) => {
      // console.log(userInput);
      if (answerSelectionType === 'single') {
        return currentAnswer.index === index + 1 ? 'neutral' : 'what?';
      }
      if (!currentAnswer.selectedOptions) return 'noooo';
      return currentAnswer.selectedOptions.includes(index) ? 'neutral' : 'what?';
    };

    const checkSelectedAnswer = (index) => {
      if (userInput[questionIndex - 1] === undefined) {
        return false;
      }
      if (answerSelectionType === 'single') {
        return userInput[questionIndex - 1] === index;
      }
      return Array.isArray(userInput[questionIndex - 1]) && userInput[questionIndex - 1].includes(index);
    };

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || 'single';

    return answers.map((answer, index) => (
      <Fragment key={uuidv4()}>
        {(answerButtons[index] !== undefined)
          ? (
            <button
              type="button"
              disabled={answerButtons[index].disabled || false}
              className={`${answerButtons[index].className} ${isCurrentAnswer(index)} answerBtn btn`}
              onClick={() => handleClick(index)}
            >
              {questionType === 'text' && <span>{answer}</span>}
              {questionType === 'photo' && <img src={answer} alt="answer" />}
            </button>
          )
          : (
            <button
              type="button"
              onClick={() => handleClick(index)}
              className={`answerBtn btn ${isCurrentAnswer(index)}  ${(allowNavigation && checkSelectedAnswer(index + 1)) ? 'selected' : null}`}
            >
              {questionType === 'text' && answer}
              {questionType === 'photo' && <img src={answer} alt="answer" />}
            </button>
          )}
      </Fragment>
    ));
  };

  const renderResult = () => (
    <div className="card-body">
      <h2>
        {appLocale.resultPageHeaderText
          .replace('<correctIndexLength>', correct.length)
          .replace('<questionLength>', questions.length)}
      </h2>
      <h2>
        {appLocale.resultPagePoint
          .replace('<correctPoints>', correctPoints)
          .replace('<totalPoints>', totalPoints)}
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
      {!endQuiz
        && (
        <div className="questionWrapperBody">
          <div className="questionModal">
            <InstantFeedback
              question={activeQuestion}
              showInstantFeedback={showInstantFeedback}
              correctAnswer={isCorrect}
              incorrectAnswer={incorrectAnswer}
              onQuestionSubmit={onQuestionSubmit}
              userAnswer={[...userInput].pop()}
            />
          </div>
          <div>
            {`${appLocale.question} ${(currentQuestionIndex + 1)} / ${questions.length}:`}
          </div>
          <h3 dangerouslySetInnerHTML={rawMarkup(`${activeQuestion && activeQuestion.question} ${appLocale.marksOfQuestion.replace('<marks>', activeQuestion.point)}`)} />

          {activeQuestion && activeQuestion.questionPic && <img src={activeQuestion.questionPic} alt="question" />}
          {activeQuestion && renderTags(answerSelectionTypeState, activeQuestion.correctAnswer.length, activeQuestion.segment)}
          {activeQuestion && renderAnswers(activeQuestion, buttons)}
          {(true || showNextQuestionButton || allowNavigation)
          && (
          <div className="questionBtnContainer">
            {(allowNavigation && currentQuestionIndex > 0) && (
              <button
                onClick={() => nextQuestion(currentQuestionIndex - 2)}
                className="prevQuestionBtn btn"
                type="button"
              >
                {appLocale.prevQuestionBtn}
              </button>
            )}
            <div className="navContainer">
              <button
                onClick={() => {
                  if (currentAnswer.index) {
                    submitAnswer();
                    nextQuestion(currentQuestionIndex);
                    resetAnswer();
                  }
                }}
                className="nextQuestionBtn btn"
                type="button"
              >
                {appLocale.nextQuestionBtn}
              </button>
              <button
                onClick={() => {
                  nextQuestion(currentQuestionIndex);
                }}
                className="skibBtn btn"
                type="button"
              >
                Skip
              </button>
            </div>
          </div>
          )}
        </div>
        )}
      {endQuiz && showDefaultResultState && customResultPage === undefined
          && renderResult()}
      {endQuiz && !showDefaultResultState && customResultPage !== undefined
          && customResultPage(questionSummary)}
    </div>
  );
}

export default Core;
