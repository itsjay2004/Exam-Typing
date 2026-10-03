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
  const [fontFamily, setFontFamily] = useState('tcs');
  const [autoFullscreen, setAutoFullscreen] = useState(true);

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
  const deadlineTimeRef = useRef<number | null>(null);
  const typedTextRef = useRef('');
  const backspaceCountRef = useRef(0);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

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
    window.localStorage.setItem('cbtst-theme', stored.darkMode ? 'dark' : 'light');
  }, [passageId]);

  useEffect(() => () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  }, []);

  // Start timer on first keystroke
  const handleStartTest = () => {
    if (hasStartedRef.current || hasSubmittedRef.current) return;
    hasStartedRef.current = true;
    setIsTestActive(true);
    startTimeRef.current = Date.now();
    deadlineTimeRef.current = startTimeRef.current + selectedDuration * 60 * 1000;

    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil(((deadlineTimeRef.current ?? Date.now()) - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);
      if (remaining === 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        finishTest();
      }
    }, 250);
  };

  // Submit & evaluate test
  const finishTest = () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
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
      typedText: typedTextRef.current,
      testDurationMinutes: selectedDuration,
      elapsedMilliseconds: elapsed,
      backspaceCount: backspaceCountRef.current,
    });

    setEvaluationResult(evalResult);

    // Save to LocalStorage
    saveTestAttempt({
      passageId: passage.id,
      passageTitle: passage.title,
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
      timerIntervalRef.current = null;
    }
    setIsTestActive(false);
    setIsTestCompleted(false);
    setEvaluationResult(null);
    hasStartedRef.current = false;
    hasSubmittedRef.current = false;
    typedTextRef.current = '';
    backspaceCountRef.current = 0;
    deadlineTimeRef.current = null;
    setTypedText('');
    setBackspaceCount(0);
    setTimeLeftSeconds(selectedDuration * 60);
    startTimeRef.current = null;
  };

  const handleTypedTextChange = (value: string) => {
    typedTextRef.current = value;
    setTypedText(value);
  };

  const handleIncrementBackspace = () => {
    backspaceCountRef.current += 1;
    setBackspaceCount(backspaceCountRef.current);
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
    window.localStorage.setItem('cbtst-theme', nextVal ? 'dark' : 'light');
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
    <div className="exam-screen flex-1 flex flex-col bg-slate-100/60 dark:bg-slate-950 transition-colors">
      {/* Top Header Bar */}
      <ExamHeader
        timeLeftSeconds={timeLeftSeconds}
        fontSize={settings.fontSize}
        onFontSizeChange={handleFontSizeChange}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        backspaceEnabled={settings.backspaceEnabled}
        onToggleBackspace={handleToggleBackspace}
        selectedDuration={selectedDuration}
        onDurationChange={handleDurationChange}
        isTestActive={isTestActive}
        darkMode={settings.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onManualFullscreenToggle={() => setAutoFullscreen(false)}
        testTitle={passage.title}
      />

      {/* Main Content Area */}
      <main className="exam-main flex-1 max-w-[1440px] mx-auto w-full">
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
            onTypedTextChange={handleTypedTextChange}
            backspaceEnabled={settings.backspaceEnabled}
            backspaceCount={backspaceCount}
            onIncrementBackspace={handleIncrementBackspace}
            isTestActive={isTestActive}
            onStartTest={handleStartTest}
            onSubmitTest={finishTest}
            onCancelTest={handleCancelTest}
            fontSize={settings.fontSize}
            fontFamily={fontFamily}
            autoFullscreen={autoFullscreen}
            onAutoFullscreenStarted={() => setAutoFullscreen(false)}
          />
        )}
      </main>
    </div>
  );
}
