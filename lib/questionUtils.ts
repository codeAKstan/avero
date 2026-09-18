/**
 * Strips option prefixes like (a), (B), a., b), 1., etc. and extra whitespace.
 */
export function normalizeOptionText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^(\([a-d1-4]\)|[a-d1-4][\.\)-])\s*/i, "")
    .trim();
}

/**
 * Robustly checks if user choice matches correct answer regardless of prefix formatting.
 */
export function isAnswerMatch(choice1: string, choice2: string): boolean {
  if (!choice1 || !choice2) return false;
  const clean1 = normalizeOptionText(choice1).toLowerCase();
  const clean2 = normalizeOptionText(choice2).toLowerCase();
  return clean1 === clean2;
}

/**
 * Sanitizes a single question object to ensure options and correctAnswer have clean option text.
 */
export function sanitizeQuestion<T extends { options?: string[]; correctAnswer?: string }>(q: T): T {
  if (!q) return q;
  return {
    ...q,
    options: Array.isArray(q.options)
      ? q.options.map((opt) => normalizeOptionText(opt))
      : q.options,
    correctAnswer: q.correctAnswer ? normalizeOptionText(q.correctAnswer) : q.correctAnswer,
  };
}

/**
 * Sanitizes an array of question objects.
 */
export function sanitizeQuestions<T extends { options?: string[]; correctAnswer?: string }>(questions: T[]): T[] {
  if (!Array.isArray(questions)) return [];
  return questions.map(sanitizeQuestion);
}
