import React from 'react';
import { Locale } from '../Locale';
interface QuizResultFilter {
    filteredValue: any;
    handleChange: any;
    appLocale: Locale;
}
declare function QuizResultFilter({ filteredValue, handleChange, appLocale }: QuizResultFilter): React.JSX.Element;
export default QuizResultFilter;
