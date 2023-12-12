import React, { useState, useEffect, useCallback } from 'react';
import Core, { QuestionSummary } from './Core';
import defaultLocale, { Locale } from './Locale';
import './styles.css';
import { number } from 'prop-types';
export type QuestionType = "text" | "photo";
export type AnswerType = "single" | "multiple";

export type Question = {
  question: string,
  questionType: QuestionType,
  questionPic?: string,
  answerSelectionType: AnswerType,
  answers: string[],
  correctAnswer: number | number[],
  messageForCorrectAnswer?: string,
  messageForIncorrectAnswer?: string,
  explanation?: string,
  point: number,
  questionIndex?: number,
  segment: string
}

export type QuizProps = {
  quizTitle: string,
  quizSynopsis?: string,
  nrOfQuestions: number,
  questions: Question[],
  appLocale?: Locale
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
  customResultPage?: (questionSummary: QuestionSummary) => React.JSX.Element,
  onComplete: (questionSummary : QuestionSummary) => void,
  showInstantFeedback?: boolean,
  continueTillCorrect?: boolean,
  revealAnswerOnSubmit?: boolean,
  allowNavigation?: boolean,
  onQuestionSubmit: (obj: any) => void,
  disableSynopsis?: boolean,
};

function Quiz({
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
} : Props) : React.JSX.Element {
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState(quiz.questions);
  const nrOfQuestions = quiz.nrOfQuestions && quiz.nrOfQuestions < quiz.questions.length
    ? quiz.nrOfQuestions
    : quiz.questions.length;

  // Shuffle answers funtion here
  const shuffleAnswerSequence = (oldQuestions : Question[] = []) : Question[] => {
    const newQuestions = oldQuestions.map((question) => {
      const answerWithIndex : [string, number][] = question.answers?.map((ans, i) => [ans, i]);
      const shuffledAnswersWithIndex = answerWithIndex.sort(
        () => Math.random() - 0.5,
      );
      const shuffledAnswers = shuffledAnswersWithIndex.map((ans) => ans[0]);
      if (question.answerSelectionType === 'single') {
        const oldCorrectAnswer = question.correctAnswer;
        const newCorrectAnswer = shuffledAnswersWithIndex.findIndex(
          (ans) => `${ans[1] + 1}` === `${oldCorrectAnswer}`,
        ) + 1;
        return {
          ...question,
          correctAnswer: newCorrectAnswer,
          answers: shuffledAnswers,
        };
      }
      if (question.answerSelectionType === 'multiple') {
        const oldCorrectAnswer = question.correctAnswer;
          if(typeof oldCorrectAnswer !== "number") {
          const newCorrectAnswer = oldCorrectAnswer.map(
            (cans) => shuffledAnswersWithIndex.findIndex(
              (ans) => `${ans[1] + 1}` === `${cans}`,
            ) + 1,
          );
          return {
            ...question,
            correctAnswer: newCorrectAnswer,
            answers: shuffledAnswers,
          };
        }
      }
      return question;
    });
    return newQuestions;
  };
  const shuffleQuestions = useCallback((q : Question[]) => {
    for (let i = q.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [q[i], q[j]] = [q[j], q[i]];
    }
    return q;
  }, []);

  useEffect(() => {
    if (disableSynopsis) setStart(true);
  }, []);

  useEffect(() => {
    let newQuestions = quiz.questions;

    if (shuffle) {
      newQuestions = shuffleQuestions(newQuestions);
    }

    if (shuffleAnswer) {
      newQuestions = shuffleAnswerSequence(newQuestions);
    }

    newQuestions.length = nrOfQuestions;
    newQuestions = newQuestions.map((question, index) => ({
      ...question,
      questionIndex: index + 1,
    }));
    setQuestions(newQuestions);
  }, [start]);

  const validateQuiz = (q : QuizProps) => {
    if (!q) {
      console.error('Quiz object is required.');
      return false;
    }

    for (let i = 0; i < questions.length; i += 1) {
      const {
        question,
        questionType,
        answerSelectionType,
        answers,
        correctAnswer,
      } = questions[i];
      if (!question) {
        console.error("Field 'question' is required.");
        return false;
      }

      if (!questionType) {
        console.error("Field 'questionType' is required.");
        return false;
      }
      if (questionType !== 'text' && questionType !== 'photo') {
        console.error(
          "The value of 'questionType' is either 'text' or 'photo'.",
        );
        return false;
      }

      if (!answers) {
        console.error("Field 'answers' is required.");
        return false;
      }
      if (!Array.isArray(answers)) {
        console.error("Field 'answers' has to be an Array");
        return false;
      }

      if (!correctAnswer) {
        console.error("Field 'correctAnswer' is required.");
        return false;
      }

      let selectType = answerSelectionType;

      if (!answerSelectionType) {
        // Default single to avoid code breaking due to automatic version upgrade
        console.warn(
          'Field answerSelectionType should be defined since v0.3.0. Use single by default.',
        );
        selectType = answerSelectionType || 'single';
      }

      // if (
      //   selectType === 'single'
      //   && !(typeof selectType === 'string' || selectType instanceof String)
      // ) {
      //   console.error(
      //     'answerSelectionType is single but expecting String in the field correctAnswer',
      //   );
      //   return false;
      // }

      if (selectType === 'multiple' && !Array.isArray(correctAnswer)) {
        console.error(
          'answerSelectionType is multiple but expecting Array in the field correctAnswer',
        );
        return false;
      }
    }

    return true;
  };

  if (!validateQuiz(quiz)) {
    return (
      <div>
        Need to pass a quiz object
      </div>
    );
  }

  const appLocale = {
    ...defaultLocale,
    ...quiz.appLocale,
  };

  return (
    <div className="react-quiz-container">
      {!start && (
        <div>
          <h2>{quiz.quizTitle}</h2>
          <div>
            {appLocale.landingHeaderText.replace(
              '<questionLength>',
              String(nrOfQuestions),
            )}
          </div>
          {quiz.quizSynopsis && (
            <div className="quiz-synopsis">{quiz.quizSynopsis}</div>
          )}
          <div className="startQuizWrapper">
            <button type="button" onClick={() => setStart(true)} className="startQuizBtn btn">
              {appLocale.startQuizBtn}
            </button>
          </div>
        </div>
      )}

      {start && (
        <Core
          questions={questions}
          showDefaultResult={showDefaultResult}
          onComplete={onComplete}
          customResultPage={customResultPage}
          showInstantFeedback={showInstantFeedback}
          continueTillCorrect={continueTillCorrect}
          revealAnswerOnSubmit={revealAnswerOnSubmit}
          allowNavigation={allowNavigation}
          appLocale={appLocale}
          onQuestionSubmit={onQuestionSubmit}
        />
      )}
    </div>
  );
}

export default Quiz;
