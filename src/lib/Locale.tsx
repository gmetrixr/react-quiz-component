const defaultLocale = {
  landingHeaderText: '<questionLength> Questions',
  question: 'Question',
  startQuizBtn: 'Start Quiz',
  resultFilterAll: 'All',
  resultFilterCorrect: 'Correct',
  resultFilterIncorrect: 'Incorrect',
  nextQuestionBtn: 'Next',
  prevQuestionBtn: 'Prev',
  resultPageHeaderText: 'You have completed the quiz. You got <correctIndexLength> out of <questionLength> questions.',
  resultPagePoint: 'You scored <correctPoints> out of <totalPoints>.',
  singleSelectionTagText: 'Single Selection',
  multipleSelectionTagText: 'Multiple Selection',
  pickNumberOfSelection: 'Pick <numberOfSelection>',
  marksOfQuestion: '(<marks> marks)',
};
export type Locale = typeof defaultLocale;
export default defaultLocale;
