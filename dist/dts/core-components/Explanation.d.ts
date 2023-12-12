import React from 'react';
import { Question } from '../Quiz';
declare function Explanation({ question, isResultPage }: {
    question: Question;
    isResultPage: boolean;
}): React.JSX.Element | null;
export default Explanation;
