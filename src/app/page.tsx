'use client';

import React, { useState, useEffect, useRef } from 'react';
import ExamHeader from '../components/ExamHeader';
import TypingArea from '../components/TypingArea';
import ResultModal from '../components/ResultModal';
import { getAllPassages, DEFAULT_PASSAGES, Passage } from '../lib/passages';
import { evaluateTypingTest, NTPCResult } from '../lib/ntpcEngine';
import {
  getStoredSettings,
  saveStoredSettings,
  saveTestAttempt,
  DEFAULT_SETTINGS,
  UserSettings,
} from '../lib/storage';
import { soundController } from '../lib/sound';
import { BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ExamPage() {
  const [passages, setPassages] = useState<Passage[]>(DEFAULT_PASSAGES);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Test State
  const [typedText, setTypedText] = useState('');
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(10 * 60);

  // Results
  const [evaluationResult, setEvaluationResult] = useState<NTPCResult | null>(null);

  // Timing references
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Load passages and settings on mount
  useEffect(() => {
    const loadedPassages = getAllPassages();
    setPassages(loadedPassages);

    const stored = getStoredSettings();
    setSettings(stored);
    setSelectedDuration(stored.defaultDurationMinutes);
    setTimeLeftSeconds(stored.defaultDurationMinutes * 60);
    soundController.setEnabled(stored.soundEnabled);

    if (stored.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const currentPassage = passages[currentPassageIndex] || passages[0];

  // Start test on first keypress
  const handleStartTest = () => {
    if (isTestActive || isTestCompleted) return;
    setIsTestActive(true);
    startTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Submit & evaluate test
  const finishTest = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTestActive(false);
    setIsTestCompleted(true);

    const now = Date.now();
    const elapsed = startTimeRef.current
      ? now - startTimeRef.current
      : selectedDuration * 60 * 1000;

    const evalResult = evaluateTypingTest({
      originalPassage: currentPassage.text,
      typedText,
      testDurationMinutes: selectedDuration,
      elapsedMilliseconds: elapsed,
      backspaceCount,
    });

    setEvaluationResult(evalResult);

    // Save to LocalStorage
    saveTestAttempt({
      passageId: currentPassage.id,
      passageTitle: currentPassage.title,
      passageCategory: currentPassage.category,
      durationMinutes: selectedDuration,
      backspaceEnabled: settings.backspaceEnabled,
      result: evalResult,
    });
  };

  // Cancel test
  const handleCancelTest = () => {
    if (isTestActive) {
      const confirmCancel = window.confirm('Are you sure you want to cancel the current test? Your typed progress will be discarded.');
      if (!confirmCancel) return;
    }
    resetTestState();
  };

  // Reset state for new attempt
  const resetTestState = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTestActive(false);
    setIsTestCompleted(false);
    setEvaluationResult(null);
    setTypedText('');
    setBackspaceCount(0);
    setTimeLeftSeconds(selectedDuration * 60);
    startTimeRef.current = null;
  };

  // Retake same test
  const handleRetake = () => {
    resetTestState();
  };

  // Move to next test passage
  const handleNextTest = () => {
    if (passages.length === 0) return;
    const nextIndex = (currentPassageIndex + 1) % passages.length;
    setCurrentPassageIndex(nextIndex);
    resetTestState();
  };

  // Handlers for settings
  const handleFontSizeChange = (size: number) => {
    const updated = saveStoredSettings({ fontSize: size });
    setSettings(updated);
  };

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    soundController.setEnabled(nextVal);
    const updated = saveStoredSettings({ soundEnabled: nextVal });
    setSettings(updated);
  };

  const handleToggleBackspace = () => {
    const nextVal = !settings.backspaceEnabled;
    const updated = saveStoredSettings({ backspaceEnabled: nextVal });
    setSettings(updated);
  };

  const handleDurationChange = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeftSeconds(minutes * 60);
    const updated = saveStoredSettings({ defaultDurationMinutes: minutes });
    setSettings(updated);
  };

  const handleToggleDarkMode = () => {
    const nextVal = !settings.darkMode;
    if (nextVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const updated = saveStoredSettings({ darkMode: nextVal });
    setSettings(updated);
  };

  if (!currentPassage) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
        Loading exam simulator...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100/60 dark:bg-slate-950 transition-colors pb-12">
      {/* Top Header Bar */}
      <ExamHeader
        timeLeftSeconds={timeLeftSeconds}
        totalDurationSeconds={selectedDuration * 60}
        fontSize={settings.fontSize}
        onFontSizeChange={handleFontSizeChange}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        backspaceEnabled={settings.backspaceEnabled}
        onToggleBackspace={handleToggleBackspace}
        selectedDuration={selectedDuration}
        onDurationChange={handleDurationChange}
        isTestActive={isTestActive}
        darkMode={settings.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        testTitle={currentPassage.title}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {/* Quick passage selector pill dropdown during setup */}
        {!isTestActive && !isTestCompleted && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Select Passage:</span>
              <select
                value={currentPassageIndex}
                onChange={(e) => {
                  setCurrentPassageIndex(Number(e.target.value));
                  resetTestState();
                }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-800 dark:text-slate-200 outline-none shadow-sm cursor-pointer"
              >
                {passages.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    {p.title} ({p.wordCount} words)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
              <Link
                href="/passages"
                className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse All {passages.length} Passages / Add Custom</span>
              </Link>
            </div>
          </div>
        )}

        {/* If Test Completed: Show Complete Result Modal */}
        {isTestCompleted && evaluationResult ? (
          <ResultModal
            result={evaluationResult}
            onRetake={handleRetake}
            onNextTest={handleNextTest}
          />
        ) : (
          /* Typing Simulation Interface */
          <TypingArea
            passage={currentPassage}
            typedText={typedText}
            onTypedTextChange={setTypedText}
            backspaceEnabled={settings.backspaceEnabled}
            backspaceCount={backspaceCount}
            onIncrementBackspace={() => setBackspaceCount((prev) => prev + 1)}
            isTestActive={isTestActive}
            onStartTest={handleStartTest}
            onSubmitTest={finishTest}
            onCancelTest={handleCancelTest}
            fontSize={settings.fontSize}
          />
        )}
      </main>
    </div>
  );
}
