/**
 * RRB NTPC Computer Based Typing Skill Test (CBTST) Evaluation Engine
 * Matches official Railway Recruitment Board (RRB) and TCS iON guidelines.
 */

export interface WordToken {
  type: 'correct' | 'spelling' | 'omission' | 'extra' | 'spacing' | 'capitalization' | 'punctuation' | 'transposition';
  original?: string;
  user?: string;
  originalIndex?: number;
  userIndex?: number;
}

export interface NTPCResult {
  isPass: boolean;
  netWpm: number;
  grossWpm: number;
  totalWordsTyped: number;
  typedKeystrokes: number;
  totalGivenKeystrokes: number;
  timeTakenMinutes: number;
  timeTakenFormatted: string;
  testDurationMinutes: number;
  backspaceCount: number;

  // Mistakes
  fullMistakes: number;
  halfMistakes: number;
  totalMistakes: number;
  allowedMistakes: number;
  finalMistakes: number;
  penaltyWords: number;

  // Breakdown counts
  spellingErrors: number;
  omissionErrors: number;
  extraWordErrors: number;
  capitalizationErrors: number;
  punctuationErrors: number;
  spacingErrors: number;

  // Percentages
  accuracy: number;
  errorPercentage: number;

  // Detailed lists & highlight HTML
  wordBreakdown: {
    id: number;
    originalWord: string;
    typedWord: string;
    errorType: string;
    mistakeType: 'Full Mistake' | 'Half Mistake';
    color: string;
  }[];
  typedHighlightedHtml: string;
  originalHighlightedHtml: string;
}

// Normalize text identical to exam pre-processing
export function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance between two strings
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Strip punctuation for half-mistake check
const stripPunctuation = (str: string) =>
  str ? str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'?]/g, '') : '';

// Dynamic Programming alignment between original words and typed words
export function alignWords(originalWords: string[], typedWords: string[]): WordToken[] {
  const m = originalWords.length;
  const n = typedWords.length;

  const dp: {
    cost: number;
    type: WordToken['type'] | 'start';
    from: { i: number; j: number } | null;
  }[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => ({
      cost: Infinity,
      type: null as any,
      from: null,
    }))
  );

  dp[0][0] = { cost: 0, type: 'start', from: null };

  for (let j = 1; j <= n; j++) {
    dp[0][j] = {
      cost: j * 1.0,
      type: 'extra',
      from: { i: 0, j: j - 1 },
    };
  }

  for (let i = 1; i <= m; i++) {
    dp[i][0] = {
      cost: i * 1.0,
      type: 'omission',
      from: { i: i - 1, j: 0 },
    };
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const orig = originalWords[i - 1] ?? '';
      const user = typedWords[j - 1] ?? '';

      let matchCost = Infinity;
      let matchType: WordToken['type'] = 'spelling';

      if (orig === user) {
        matchCost = 0.0;
        matchType = 'correct';
      } else if (orig.toLowerCase() === user.toLowerCase()) {
        matchCost = 0.5;
        matchType = 'capitalization';
      } else if (stripPunctuation(orig).toLowerCase() === stripPunctuation(user).toLowerCase()) {
        matchCost = 0.5;
        matchType = 'punctuation';
      } else if (orig.toLowerCase().startsWith(user.toLowerCase())) {
        matchCost = 1.0;
        matchType = 'spelling';
      } else {
        const dist = levenshteinDistance(orig, user);
        const maxThreshold = Math.max(2, Math.min(4, Math.ceil(orig.length * 0.6)));
        if (dist <= maxThreshold) {
          matchCost = 1.0;
          matchType = 'spelling';
        } else {
          matchCost = Infinity;
        }
      }

      const matchOption = {
        cost: dp[i - 1][j - 1].cost + matchCost,
        type: matchType,
        from: { i: i - 1, j: j - 1 },
      };

      const omissionOption = {
        cost: dp[i - 1][j].cost + 1.0,
        type: 'omission' as const,
        from: { i: i - 1, j },
      };

      const extraOption = {
        cost: dp[i][j - 1].cost + 1.0,
        type: 'extra' as const,
        from: { i, j: j - 1 },
      };

      let best: {
        cost: number;
        type: WordToken['type'] | 'start';
        from: { i: number; j: number } | null;
      } = matchOption;
      if (omissionOption.cost < best.cost) best = omissionOption;
      if (extraOption.cost < best.cost) best = extraOption;

      dp[i][j] = best;
    }
  }

  // Backtrack to assemble tokens
  const tokens: WordToken[] = [];
  let currI = m;
  let currJ = n;

  while (currI > 0 || currJ > 0) {
    const cell = dp[currI][currJ];
    if (!cell || !cell.from) break;

    const fromI = cell.from.i;
    const fromJ = cell.from.j;

    if (fromI === currI - 1 && fromJ === currJ - 1) {
      tokens.unshift({
        type: cell.type as WordToken['type'],
        original: originalWords[currI - 1],
        user: typedWords[currJ - 1],
      });
    } else if (fromI === currI - 1 && fromJ === currJ) {
      tokens.unshift({
        type: 'omission',
        original: originalWords[currI - 1],
      });
    } else if (fromI === currI && fromJ === currJ - 1) {
      tokens.unshift({
        type: 'extra',
        user: typedWords[currJ - 1],
      });
    }

    currI = fromI;
    currJ = fromJ;
  }

  return tokens;
}

// Handle spacing errors (words merged or split)
export function resolveSpacingErrors(tokens: WordToken[]): WordToken[] {
  const result: WordToken[] = [];
  const visited = new Set<number>();

  for (let i = 0; i < tokens.length; i++) {
    if (visited.has(i)) continue;

    const t1 = tokens[i];
    const t2 = i + 1 < tokens.length ? tokens[i + 1] : null;
    const t3 = i + 2 < tokens.length ? tokens[i + 2] : null;

    // Two extra words matching one omitted word (split word)
    if (t2 && t3 && t1.type === 'extra' && t2.type === 'extra' && t3.type === 'omission') {
      const combined = (t1.user ?? '') + (t2.user ?? '');
      const revCombined = (t2.user ?? '') + (t1.user ?? '');
      const orig = t3.original ?? '';

      const dist1 = levenshteinDistance(orig, combined);
      const dist2 = levenshteinDistance(orig, revCombined);
      const threshold = Math.max(2, Math.min(4, Math.ceil(orig.length * 0.6)));

      if (dist1 <= threshold && dist1 < dist2) {
        result.push({
          type: 'spacing',
          original: orig,
          user: `${t1.user ?? ''} ${t2.user ?? ''}`,
        });
        visited.add(i + 1);
        visited.add(i + 2);
        continue;
      }
    }

    // One typed word matching two original words (merged words)
    if (t2 && t1.type === 'spelling' && t2.type === 'omission') {
      const combinedOrig = (t1.original ?? '') + (t2.original ?? '');
      if ((t1.user ?? '').toLowerCase() === combinedOrig.toLowerCase()) {
        result.push({
          type: 'spacing',
          original: `${t1.original ?? ''} ${t2.original ?? ''}`,
          user: t1.user,
        });
        visited.add(i + 1);
        continue;
      }
    }

    if (t2 && t1.type === 'omission' && t2.type === 'spelling') {
      const combinedOrig = (t1.original ?? '') + (t2.original ?? '');
      if ((t2.user ?? '').toLowerCase() === combinedOrig.toLowerCase()) {
        result.push({
          type: 'spacing',
          original: `${t1.original ?? ''} ${t2.original ?? ''}`,
          user: t2.user,
        });
        visited.add(i + 1);
        continue;
      }
    }

    result.push(t1);
  }

  return result;
}

// Re-check adjacent omission + extra pairs for capitalization or spelling mistakes
export function refineOmissionExtraPairs(tokens: WordToken[]): WordToken[] {
  const result: WordToken[] = [];
  let i = 0;

  while (i < tokens.length) {
    const t1 = tokens[i];
    const t2 = i + 1 < tokens.length ? tokens[i + 1] : null;

    if (t2 && t1.type === 'omission' && t2.type === 'extra') {
      const orig = t1.original ?? '';
      const user = t2.user ?? '';

      if (orig.toLowerCase() === user.toLowerCase()) {
        if (orig === user) {
          result.push({ type: 'correct', original: orig, user });
        } else {
          result.push({ type: 'capitalization', original: orig, user });
        }
        i += 2;
        continue;
      }

      const dist = levenshteinDistance(orig, user);
      if (dist <= Math.max(2, Math.ceil(orig.length * 0.5))) {
        result.push({ type: 'spelling', original: orig, user });
        i += 2;
        continue;
      }
    }

    result.push(t1);
    i++;
  }

  return result;
}

// Multi-passage looping support (if user finished original passage and continues typing)
export function expandPassageForRetyping(originalWords: string[], typedWords: string[]): string[] {
  if (typedWords.length <= originalWords.length) {
    return originalWords;
  }
  const loopsNeeded = Math.ceil(typedWords.length / originalWords.length) + 1;
  const expanded: string[] = [];
  for (let l = 0; l < loopsNeeded; l++) {
    expanded.push(...originalWords);
  }
  return expanded;
}

/**
 * Main NTPC Evaluation Function
 */
export function evaluateTypingTest(params: {
  originalPassage: string;
  typedText: string;
  testDurationMinutes: number; // configured total duration (e.g. 10)
  elapsedMilliseconds: number; // actual time spent (e.g. 600000)
  backspaceCount?: number;
}): NTPCResult {
  const {
    originalPassage,
    typedText,
    testDurationMinutes = 10,
    elapsedMilliseconds,
    backspaceCount = 0,
  } = params;

  const cleanedOriginal = cleanText(originalPassage);
  const cleanedTyped = cleanText(typedText);

  const originalWords = cleanedOriginal.split(' ').filter((w) => w.length > 0);
  const typedWords = cleanedTyped.split(' ').filter((w) => w.length > 0);

  // Expand passage if retyped
  const expandedOriginal = expandPassageForRetyping(originalWords, typedWords);

  // Align
  let alignedTokens = alignWords(expandedOriginal, typedWords);
  alignedTokens = resolveSpacingErrors(alignedTokens);
  alignedTokens = refineOmissionExtraPairs(alignedTokens);

  // Trim trailing omissions (words user didn't reach are NOT counted as errors)
  let lastNonOmissionIdx = -1;
  for (let i = alignedTokens.length - 1; i >= 0; i--) {
    if (alignedTokens[i].type !== 'omission') {
      lastNonOmissionIdx = i;
      break;
    }
  }

  if (lastNonOmissionIdx !== -1) {
    alignedTokens = alignedTokens.slice(0, lastNonOmissionIdx + 1);
  } else if (typedWords.length === 0) {
    alignedTokens = [];
  }

  // Count errors
  let spellingErrors = 0;
  let omissionErrors = 0;
  let extraWordErrors = 0;
  let capitalizationErrors = 0;
  let punctuationErrors = 0;
  let spacingErrors = 0;

  alignedTokens.forEach((t) => {
    switch (t.type) {
      case 'spelling':
        spellingErrors++;
        break;
      case 'omission':
        omissionErrors++;
        break;
      case 'extra':
        extraWordErrors++;
        break;
      case 'capitalization':
        capitalizationErrors++;
        break;
      case 'punctuation':
        punctuationErrors++;
        break;
      case 'spacing':
        spacingErrors++;
        break;
    }
  });

  const fullMistakes = spellingErrors + omissionErrors + extraWordErrors;
  const halfMistakes = capitalizationErrors + punctuationErrors + spacingErrors;
  const totalMistakes = fullMistakes + halfMistakes / 2;

  // Key stats
  const typedKeystrokes = cleanedTyped.length;
  const totalWordsTyped = Math.round(typedKeystrokes / 5);
  const totalGivenKeystrokes = cleanedOriginal.length;

  const timeTakenMinutes = elapsedMilliseconds > 0 ? elapsedMilliseconds / 60000 : testDurationMinutes;
  const totalSeconds = Math.round(elapsedMilliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const timeTakenFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // 5% error relaxation buffer
  const allowedMistakes = Number((0.05 * totalWordsTyped).toFixed(2));
  const finalMistakes = Math.max(0, Number((totalMistakes - allowedMistakes).toFixed(2)));
  const penaltyWords = Number((finalMistakes * 10).toFixed(2));

  // Speeds
  const grossWpm = timeTakenMinutes > 0 ? Math.round(totalWordsTyped / timeTakenMinutes) : 0;
  let netWpm = timeTakenMinutes > 0 ? Math.max(0, (totalWordsTyped - penaltyWords) / timeTakenMinutes) : 0;
  netWpm = Number(netWpm.toFixed(2));

  // Accuracy
  const accuracy =
    totalWordsTyped > 0
      ? Math.max(0, Number((((totalWordsTyped - totalMistakes) / totalWordsTyped) * 100).toFixed(2)))
      : 0;
  const errorPercentage = Number((100 - accuracy).toFixed(2));

  // Qualifying rules:
  // English NTPC requires >= 30 WPM net speed and at least 300 words typed (pro-rated if test duration is customized)
  const minRequiredWords = Math.round(300 * (testDurationMinutes / 10));
  const isPass = netWpm >= 30.0 && totalWordsTyped >= minRequiredWords;

  // Generate word-by-word error breakdown
  const wordBreakdown: NTPCResult['wordBreakdown'] = [];
  let errorCounter = 1;

  alignedTokens.forEach((token) => {
    if (token.type === 'correct') return;

    let errorType = '';
    let mistakeType: 'Full Mistake' | 'Half Mistake' = 'Full Mistake';
    let color = '';

    switch (token.type) {
      case 'spelling':
        errorType = 'Spelling / Substitution';
        mistakeType = 'Full Mistake';
        color = '#FF9999';
        break;
      case 'extra':
        errorType = 'Extra Word';
        mistakeType = 'Full Mistake';
        color = '#FFC1CC';
        break;
      case 'omission':
        errorType = 'Omission (Word Skipped)';
        mistakeType = 'Full Mistake';
        color = '#00FFFF';
        break;
      case 'capitalization':
        errorType = 'Capitalization';
        mistakeType = 'Half Mistake';
        color = '#FFFF99';
        break;
      case 'punctuation':
        errorType = 'Punctuation';
        mistakeType = 'Half Mistake';
        color = '#DDA0DD';
        break;
      case 'spacing':
        errorType = 'Spacing Error (Joined/Split)';
        mistakeType = 'Half Mistake';
        color = '#FFA500';
        break;
    }

    wordBreakdown.push({
      id: errorCounter++,
      originalWord: token.original ?? '—',
      typedWord: token.user ?? '—',
      errorType,
      mistakeType,
      color,
    });
  });

  // Generate typed paragraph with highlighted errors
  let typedHighlightedHtml = '';
  alignedTokens.forEach((token) => {
    const text = token.user ?? '';
    if (!text && token.type === 'omission') return;

    switch (token.type) {
      case 'correct':
        typedHighlightedHtml += `${text} `;
        break;
      case 'extra':
        typedHighlightedHtml += `<span style="background-color: #FFC1CC; padding: 2px 4px; border-radius: 3px;">${text}</span> `;
        break;
      case 'spelling':
        typedHighlightedHtml += `<span style="background-color: #FF9999; padding: 2px 4px; border-radius: 3px;">${text}</span> `;
        break;
      case 'spacing':
        typedHighlightedHtml += `<span style="background-color: #FFA500; padding: 2px 4px; border-radius: 3px;">${text}</span> `;
        break;
      case 'capitalization':
        typedHighlightedHtml += `<span style="background-color: #FFFF99; padding: 2px 4px; border-radius: 3px;">${text}</span> `;
        break;
      case 'punctuation':
        typedHighlightedHtml += `<span style="background-color: #DDA0DD; padding: 2px 4px; border-radius: 3px;">${text}</span> `;
        break;
    }
  });

  // Generate original paragraph with omissions highlighted
  let originalHighlightedHtml = '';
  alignedTokens.forEach((token) => {
    const orig = token.original ?? '';
    if (!orig && token.type === 'extra') return;

    switch (token.type) {
      case 'correct':
        originalHighlightedHtml += `${orig} `;
        break;
      case 'omission':
        originalHighlightedHtml += `<span style="background-color: #00FFFF; padding: 2px 4px; border-radius: 3px;">${orig}</span> `;
        break;
      case 'spelling':
        originalHighlightedHtml += `<span style="background-color: #FF9999; padding: 2px 4px; border-radius: 3px;">${orig}</span> `;
        break;
      case 'spacing':
        originalHighlightedHtml += `<span style="background-color: #FFA500; padding: 2px 4px; border-radius: 3px;">${orig}</span> `;
        break;
      case 'capitalization':
        originalHighlightedHtml += `<span style="background-color: #FFFF99; padding: 2px 4px; border-radius: 3px;">${orig}</span> `;
        break;
      case 'punctuation':
        originalHighlightedHtml += `<span style="background-color: #DDA0DD; padding: 2px 4px; border-radius: 3px;">${orig}</span> `;
        break;
    }
  });

  return {
    isPass,
    netWpm,
    grossWpm,
    totalWordsTyped,
    typedKeystrokes,
    totalGivenKeystrokes,
    timeTakenMinutes: Number(timeTakenMinutes.toFixed(2)),
    timeTakenFormatted,
    testDurationMinutes,
    backspaceCount,

    fullMistakes,
    halfMistakes,
    totalMistakes: Number(totalMistakes.toFixed(2)),
    allowedMistakes,
    finalMistakes,
    penaltyWords,

    spellingErrors,
    omissionErrors,
    extraWordErrors,
    capitalizationErrors,
    punctuationErrors,
    spacingErrors,

    accuracy,
    errorPercentage,

    wordBreakdown,
    typedHighlightedHtml: typedHighlightedHtml.trim(),
    originalHighlightedHtml: originalHighlightedHtml.trim(),
  };
}
