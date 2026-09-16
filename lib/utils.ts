/**
 * Fisher-Yates shuffle algorithm to randomly shuffle an array in place or return a new shuffled copy.
 */
export function shuffleArray<T>(array: T[]): T[] {
  if (!array || !Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Robust evaluation to check whether a given option matches the correct answer,
 * accounting for prefix variations like "(b)", "b.", "b)", "B -", single letters, or exact string matches.
 */
export function isOptionCorrect(
  optText: string,
  optIdx: number,
  correctAnswerText: string
): boolean {
  if (!optText || !correctAnswerText) return false;

  const cleanOpt = optText.trim().toLowerCase();
  const cleanAns = correctAnswerText.trim().toLowerCase();

  // 1. Direct exact match
  if (cleanOpt === cleanAns) return true;

  // Helper to strip leading choice prefixes like "(a)", "a.", "a)", "a -", "1."
  const stripPrefix = (str: string) =>
    str.replace(/^(?:\([a-z0-9]\)|[a-z0-9][\.\)\-:])\s*/i, "").trim();

  const strippedOpt = stripPrefix(cleanOpt);
  const strippedAns = stripPrefix(cleanAns);

  // 2. Match stripped options without choice prefix labels
  if (strippedOpt && strippedAns && strippedOpt === strippedAns) {
    return true;
  }

  // 3. Single letter answer check (e.g., correctAnswer = "b" or "B" or "(b)" or "b.")
  const optionLetter = String.fromCharCode(97 + optIdx); // 'a', 'b', 'c', 'd'...
  const singleLetterAns = cleanAns.replace(/[\(\)\.\-\s]/g, "");

  if (singleLetterAns === optionLetter) {
    return true;
  }

  // 4. Substring comparison if stripped content is identical
  if (strippedOpt.length > 3 && strippedAns.length > 3) {
    if (strippedOpt === strippedAns) return true;
  }

  return false;
}
