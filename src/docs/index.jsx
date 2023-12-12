import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import quiz from './quiz';
import Quiz from '../../dist/index.es';

const container = document.getElementById('app');
const root = createRoot(container);

function resultPage(obj) {
  console.log(obj, 'result');
  return (
    <div>This will be  a result page</div>
  );
}

function App() {
  const [quizResult, setQuizResult] = useState();

  return (
    <div style={{ margin: 'auto', width: '500px' }}>
      <Quiz
        quiz={quiz}
      // shuffle
      // shuffleAnswer
      // showInstantFeedback
      // continueTillCorrect
        onComplete={setQuizResult}
        onQuestionSubmit={(obj) => console.log('user question results:', obj)}
        disableSynopsis
        revealAnswerOnSubmit
      // customResultPage={resultPage}
      />
    </div>
  );
}

root.render(<App />);
