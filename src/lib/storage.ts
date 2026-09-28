/**
 * LocalStorage manager for Test History, Analytics, and User Preferences
 */

import { NTPCResult } from './ntpcEngine';

export interface TestAttempt {
  id: string;
  timestamp: number;
  dateFormatted: string;
  passageId: string;
  passageTitle: string;
  durationMinutes: number;
  backspaceEnabled: boolean;
  result: NTPCResult;
}

export interface UserSettings {
  fontSize: number;
  darkMode: boolean;
  soundEnabled: boolean;
  backspaceEnabled: boolean;
  defaultDurationMinutes: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 18,
  darkMode: false,
  soundEnabled: true,
  backspaceEnabled: false, // Default is official TCS iON rule (backspace disabled)
  defaultDurationMinutes: 10,
};

const STORAGE_KEYS = {
  HISTORY: 'rrb_typing_history_v1',
  SETTINGS: 'rrb_typing_settings_v1',
};

export function getStoredSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getStoredSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

export function getTestHistory(): TestAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed: TestAttempt[] = JSON.parse(raw);
      // Sort newest first
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch {
    // fallback
  }
  return [];
}

export interface PassageAttemptStat {
  count: number;
  latest: TestAttempt;
  best: TestAttempt;
}

export function getPassageStatsMap(): Record<string, PassageAttemptStat> {
  const history = getTestHistory();
  const map: Record<string, PassageAttemptStat> = {};

  history.forEach((attempt) => {
    const id = attempt.passageId;
    if (!map[id]) {
      map[id] = {
        count: 1,
        latest: attempt,
        best: attempt,
      };
    } else {
      map[id].count++;
      if (attempt.result.netWpm > map[id].best.result.netWpm) {
        map[id].best = attempt;
      }
    }
  });

  return map;
}

export function saveTestAttempt(params: {
  passageId: string;
  passageTitle: string;
  durationMinutes: number;
  backspaceEnabled: boolean;
  result: NTPCResult;
}): TestAttempt {
  const now = new Date();
  const attempt: TestAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.getTime(),
    dateFormatted: now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    passageId: params.passageId,
    passageTitle: params.passageTitle,
    durationMinutes: params.durationMinutes,
    backspaceEnabled: params.backspaceEnabled,
    result: params.result,
  };

  if (typeof window !== 'undefined') {
    try {
      const history = getTestHistory();
      history.unshift(attempt);
      // Keep up to 200 attempts in localStorage
      const trimmed = history.slice(0, 200);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
  }

  return attempt;
}

export function deleteTestAttempt(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getTestHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function clearAllAppData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem('rrb_custom_passages');
    localStorage.removeItem('cbtst-theme');
  } catch {
    // ignore
  }
}

export interface AnalyticsSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  bestNetWpm: number;
  averageNetWpm: number;
  averageGrossWpm: number;
  averageAccuracy: number;
  averageMistakes: number;
  totalWordsTyped: number;
  errorCategoryTotals: {
    spelling: number;
    capitalization: number;
    punctuation: number;
    spacing: number;
    omissions: number;
    extra: number;
  };
}

export function calculateAnalytics(history: TestAttempt[]): AnalyticsSummary {
  if (!history || history.length === 0) {
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      passRate: 0,
      bestNetWpm: 0,
      averageNetWpm: 0,
      averageGrossWpm: 0,
      averageAccuracy: 0,
      averageMistakes: 0,
      totalWordsTyped: 0,
      errorCategoryTotals: {
        spelling: 0,
        capitalization: 0,
        punctuation: 0,
        spacing: 0,
        omissions: 0,
        extra: 0,
      },
    };
  }

  let passed = 0;
  let bestNet = 0;
  let sumNet = 0;
  let sumGross = 0;
  let sumAccuracy = 0;
  let sumMistakes = 0;
  let totalWords = 0;

  const errorTotals = {
    spelling: 0,
    capitalization: 0,
    punctuation: 0,
    spacing: 0,
    omissions: 0,
    extra: 0,
  };

  history.forEach((h) => {
    const r = h.result;
    if (r.isPass) passed++;
    if (r.netWpm > bestNet) bestNet = r.netWpm;

    sumNet += r.netWpm;
    sumGross += r.grossWpm;
    sumAccuracy += r.accuracy;
    sumMistakes += r.totalMistakes;
    totalWords += r.totalWordsTyped;

    errorTotals.spelling += r.spellingErrors || 0;
    errorTotals.capitalization += r.capitalizationErrors || 0;
    errorTotals.punctuation += r.punctuationErrors || 0;
    errorTotals.spacing += r.spacingErrors || 0;
    errorTotals.omissions += r.omissionErrors || 0;
    errorTotals.extra += r.extraWordErrors || 0;
  });

  const count = history.length;

  return {
    totalTests: count,
    passedTests: passed,
    failedTests: count - passed,
    passRate: Number(((passed / count) * 100).toFixed(1)),
    bestNetWpm: Number(bestNet.toFixed(2)),
    averageNetWpm: Number((sumNet / count).toFixed(2)),
    averageGrossWpm: Number((sumGross / count).toFixed(2)),
    averageAccuracy: Number((sumAccuracy / count).toFixed(1)),
    averageMistakes: Number((sumMistakes / count).toFixed(2)),
    totalWordsTyped: totalWords,
    errorCategoryTotals: errorTotals,
  };
}

export function exportHistoryAsJson(): string {
  const history = getTestHistory();
  const settings = getStoredSettings();
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    settings,
    history,
  };
  return JSON.stringify(data, null, 2);
}

export function importHistoryFromJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed.history)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      if (parsed.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      }
      return true;
    }
  } catch {
    // invalid JSON
  }
  return false;
}
