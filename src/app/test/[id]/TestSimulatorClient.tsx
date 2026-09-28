'use client';

import React, { useState, useEffect, useRef } from 'react';
import ExamHeader from '@/components/ExamHeader';
import TypingArea from '@/components/TypingArea';
import ResultModal from '@/components/ResultModal';
import { getAllPassages, getPassageById, Passage } from '@/lib/passages';
import { evaluateTypingTest, NTPCResult } from '@/lib/ntpcEngine';
import {
  getStoredSettings,
  saveStoredSettings,
  saveTestAttempt,
  DEFAULT_SETTINGS,
  UserSettings,
} from '@/lib/storage';
import { soundController } from '@/lib/sound';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TestSimulatorClientProps {
  passageId: string;
}

export default function TestSimulatorClient({ passageId }: TestSimulatorClientProps) {
  const router = useRouter();
  const [passages, setPassages] = useState<Passage[]>([]);
  const [passage, setPassage] = useState<Passage | null>(null);

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

  useEffect(() => {
    const all = getAllPassages();
    setPassages(all);
    const found = all.find((p) => p.id === passageId) || all[0];
    setPassage(found);

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
  }, [passageId]);

  // Start timer on first keystroke
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

    if (!passage) return;

    const now = Date.now();
    const elapsed = startTimeRef.current
      ? now - startTimeRef.current
      : selectedDuration * 60 * 1000;

    const evalResult = evaluateTypingTest({
      originalPassage: passage.text,
      typedText,
      testDurationMinutes: selectedDuration,
      elapsedMilliseconds: elapsed,
      backspaceCount,
    });

    setEvaluationResult(evalResult);

    // Save to LocalStorage
    saveTestAttempt({
      passageId: passage.id,
      passageTitle: passage.title,
      passageCategory: passage.category,
      durationMinutes: selectedDuration,
      backspaceEnabled: settings.backspaceEnabled,
      result: evalResult,
    });
  };

  // Cancel test
  const handleCancelTest = () => {
    if (isTestActive) {
      const confirmCancel = window.confirm(
        'Are you sure you want to cancel the current test? Your typed progress will be discarded.'
      );
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
    if (passages.length === 0 || !passage) return;
    const currentIndex = passages.findIndex((p) => p.id === passage.id);
    const nextIndex = (currentIndex + 1) % passages.length;
    const nextPassage = passages[nextIndex];
    resetTestState();
    router.push(`/test/${nextPassage.id}`);
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

  if (!passage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
        <p>Loading typing test...</p>
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
        testTitle={passage.title}
      />

      {/* Breadcrumb / Return to Dashboard Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 w-full flex items-center justify-between text-xs">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tests</span>
        </Link>

        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{passage.category}</span>
          <span>•</span>
          <span>{passage.wordCount} Words</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {isTestCompleted && evaluationResult ? (
          <ResultModal
            result={evaluationResult}
            onRetake={handleRetake}
            onNextTest={handleNextTest}
          />
        ) : (
          <TypingArea
            passage={passage}
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
