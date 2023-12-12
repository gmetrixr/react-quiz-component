import React from 'react';
import { Question } from '../Quiz';

function Explanation({ question, isResultPage } : { question: Question, isResultPage: boolean}) {
  const { explanation } = question;

  if (!explanation) {
    return null;
  }

  if (isResultPage) {
    return (
      <div className="explanation">
        {explanation}
      </div>
    );
  }

  return (
    <div>
      <br />
      {explanation}
    </div>
  );
}

export default Explanation;
