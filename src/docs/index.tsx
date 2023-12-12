import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import quiz from './quiz';
import Quiz from '../lib/Quiz';
import { QuestionSummary } from '../lib/Core';

const container = document.getElementById('app');
const root = createRoot(container as Element);

function App() {
  const [quizResult, setQuizResult] = useState<QuestionSummary>();

  return (
    <div style={{ margin: 'auto', width: '500px' }}>
      <Quiz
        quiz={quiz}
      // shuffle
      // shuffleAnswer
      // showInstantFeedback
      // continueTillCorrect
        onComplete={(questionSummary: QuestionSummary) => setQuizResult(questionSummary)}
        onQuestionSubmit={(obj) => console.log('user question results:', obj)}
        disableSynopsis
        revealAnswerOnSubmit
      // customResultPage={resultPage}
      />
    </div>
  );
}

root.render(<App />);