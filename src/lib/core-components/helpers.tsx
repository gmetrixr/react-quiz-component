import snarkdown from 'snarkdown';
import dompurify from 'dompurify';
import { AnswerType } from '../Quiz';

export const rawMarkup = (data : string | Node) => {
  const sanitizer = dompurify.sanitize;
  return { __html: snarkdown(sanitizer(data)) };
};
