import React, { Fragment, useEffect, useState } from "react";
import { AnswerType, Question, QuestionType } from "../Quiz";
import { rawMarkup } from "./helpers";
import { v4 as uuidv4 } from "uuid";
import { stat } from "fs";
import { Locale } from "../Locale";

const QuestionComponent = ({
  qObj,
  disableRenderTags,
  showInstantFeedback,
  appLocale,
  allowSkip,
  onNextQuestion,
  onSkip,
}: {
  qObj: Question;
  disableRenderTags?: boolean;
  showInstantFeedback?: boolean;
  appLocale: Locale;
  allowSkip?: boolean;
  onNextQuestion: (question: Question, isCorrect: boolean) => void;
  onSkip: () => void;
}) => {
  const answers = qObj.answers;
  const [reveal, setReveal] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const handleClick = (index: number) => {
    if(reveal) return;
    let soCpy = [...selectedOptions];
    if (
      qObj.answerSelectionType === AnswerType.single &&
      selectedOptions.length === 1
    ) {
      soCpy = [];
    }
    if (soCpy.includes(index)) {
      soCpy.splice(soCpy.indexOf(index), 1);
    } else {
      soCpy.push(index);
    }
    setSelectedOptions(soCpy);
  };
  const isCurrentAnswerCorrect = () => {
    if(selectedOptions.length === 0) return false;
    if(qObj.correctAnswer.length !== selectedOptions.length) return false;
    for(let i=0; i< qObj.correctAnswer.length; i++) {
      if(!selectedOptions.includes(qObj.correctAnswer[i]-1)) return false;
    }
    return true;
  };

  const handleNext = () => {
    let result = isCurrentAnswerCorrect();
    if(!showInstantFeedback) {
      if(selectedOptions.length > 0) {
        return onNextQuestion(qObj, result);
      }
    }
    if(showInstantFeedback) {
      if(reveal) {
        return onNextQuestion(qObj, result);
      }
    } 
    if(selectedOptions.length > 0 && qObj.answerSelectionType === AnswerType.single) {
      return onNextQuestion(qObj, result);
    }
  };

  const isNextAllowed = () => {
    if(!showInstantFeedback) return selectedOptions.length > 0;
    let result = isCurrentAnswerCorrect();
    if(showInstantFeedback) {
      if(reveal) {
        return true;
      }
    }
    if(selectedOptions.length > 0 && qObj.answerSelectionType === AnswerType.single) {
      return true;
    }
    return false;
  };

  const isSelected = (index: number) => selectedOptions.includes(index);
  const isCorrect = (index: number) => qObj.correctAnswer.includes(index + 1);

  const getAnswerState = (index: number) => {
    if(showInstantFeedback) {
      if(reveal) {
        if(isCorrect(index)) return AnswerOptionState.correct;
        if(isSelected(index) && !isCorrect(index)) return AnswerOptionState.wrong;
      }
      if(isSelected(index)) {
        if(isCorrect(index)) {
          if(isCurrentAnswerCorrect()) {
            setReveal(true);
          }
          return AnswerOptionState.correct;
        } else {
          setReveal(true);
          return AnswerOptionState.wrong;
        } 
      } else {
        return AnswerOptionState.unchecked;
      }
    } else {
      return isSelected(index) ? AnswerOptionState.correct : AnswerOptionState.unchecked;
    }
  }
  const getInstantFeedbackClasses = (index: number) => {
    if(!showInstantFeedback) return "";
    if(reveal) {
      if(isCorrect(index)) return "correctBorder";
      if(isSelected(index) && !isCorrect(index)) return "wrongBorder";
    }
    if(selectedOptions.includes(index)) {
      if(isCorrect(index)) return "correctBorder";
      else return "wrongBorder";
    }
    return "";
  }

  return (
    <>
      <h3
        className="question"
        dangerouslySetInnerHTML={rawMarkup(qObj.question)}
      />
      {qObj.questionPic && <img src={qObj.questionPic} alt="question" />}
      {!disableRenderTags && <Tags />}
      <div className="answersList">
        {answers.map((answer, index) => {
          return (
            <Fragment key={uuidv4()}>
              <button
                type="button"
                onClick={() => handleClick(index)}
                className={`answerBtn btn ${getInstantFeedbackClasses(index)}`}
              >
                <div className="answerItem">
                  <CustomIndicators
                    state={getAnswerState(index)}
                    type={qObj.answerSelectionType}
                  />
                  <div>{qObj.questionType === QuestionType.text && answer}</div>
                  <div>
                    {qObj.questionType === QuestionType.photo && (
                      <img src={answer} alt="answer" />
                    )}
                  </div>
                </div>
              </button>
            </Fragment>
          );
        })}
      </div>
      <div className="navContainer">
            <button
              onClick={handleNext}
              className={`nextQuestionBtn btn ${isNextAllowed() ? "" : "disabled"}`}
              type="button"
            >
              {appLocale.nextQuestionBtn}
            </button>
            {allowSkip && (
              <button
                onClick={onSkip}
                className="skipBtn btn"
                type="button"
              >
                Skip
              </button>
            )}
          </div>
    </>
  );
};

const Tags = () => {
  return <div>Tags Not supported</div>;
};

enum AnswerOptionState {
  correct="correct",
  wrong="wrong",
  unchecked="unchecked"
};

const _CustomIndicatorsOld = ({
  state,
  type,
}: {
  state: AnswerOptionState;
  type: AnswerType;
}) => {
  const colorMap = {
    "correct": "green",
    "wrong": "red",
    "unchecked": "grey"
  };

  if(type === AnswerType.multiple) {
    return (
      <div style={{
        minWidth: "20px",
        minHeight: "20px",
        marginRight: "20px",
        flex: 0,
        background: colorMap[state]
      }}></div>
    )
  } else {
    return (
      <div style={{
        minWidth: "20px",
        minHeight: "20px",
        borderRadius: "20px",
        marginRight: "20px",
        flex: 0,
        background: colorMap[state]
      }}></div>
    )
  }
}
const _CustomIndicators = ({
  state,
  type,
}: {
  state: AnswerOptionState;
  type: AnswerType;
}) => {
  const colorMap = {
    "correct": "green",
    "wrong": "red",
    "unchecked": "grey"
  };

  const style = {
    flex: 0,
    marginRight: "20px",
    minWidth: "20px",
    maxWidth: "20px"
  };

  if(type === AnswerType.multiple) {
    if(AnswerOptionState.unchecked === state) {
      return (
        <svg style={style} width="20" height="  20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#DEDEDE"/>
        </svg>
      )
    } else if(AnswerOptionState.correct === state) {
      return (
        <svg style={style} width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_1_15)">
          <rect width="120" height="120" rx="24" fill="#1EF533"/>
          <rect x="0.5" y="0.5" width="119" height="119" rx="23.5" stroke="black"/>
          </g>
          <path d="M21 63.6247L34.1923 82.4652M35.1775 84.1452L99.0683 36" stroke="white" strokeWidth="12" strokeLinecap="round"/>
          <defs>
          <filter id="filter0_b_1_15" x="-4" y="-4" width="128" height="128" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"/>
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1_15"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1_15" result="shape"/>
          </filter>
          </defs>
        </svg>
      )
    } else {
      return (
        <svg style={style} width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#E91E1E"/>
          <path d="M32 87.5685L88.5685 31M32 32.5685L88.5685 89.1371" stroke="white" strokeWidth="12" strokeLinecap="round"/>
        </svg>
      )
    }
  } else {
    if(AnswerOptionState.unchecked === state) {
      return (
        <svg style={style} width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="60" fill="#DEDEDE"/>
        </svg>
      )
    } else if(AnswerOptionState.correct === state) {
      return (
        <svg style={style} width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="12" width="96" height="96" rx="48" fill="white" stroke="#1EF533" strokeWidth="24"/>
        </svg>
      )
    } else {
      return (
        <svg style={style} width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="12" width="96" height="96" rx="48" fill="white" stroke="#E91E1E" strokeWidth="24"/>
        </svg>
      )
    }
  }
}
const CustomIndicators = React.memo(_CustomIndicators);

// const Radio = ({ fill, stroke } : { fill: string, stroke: string }) => {
//   return (
//     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <rect x="2" y="2" width="16" height="16" rx="8" fill={fill} stroke={stroke} strokeWidth="4"/>
//     </svg>
//   )
// }

export default QuestionComponent;
