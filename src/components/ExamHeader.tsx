'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Delete,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Type,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ExamHeaderProps {
  timeLeftSeconds: number;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  backspaceEnabled: boolean;
  onToggleBackspace: () => void;
  selectedDuration: number;
  onDurationChange: (minutes: number) => void;
  isTestActive: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  testTitle?: string;
}

export default function ExamHeader({
  timeLeftSeconds,
  fontSize,
  onFontSizeChange,
  soundEnabled,
  onToggleSound,
  backspaceEnabled,
  onToggleBackspace,
  selectedDuration,
  onDurationChange,
  isTestActive,
  darkMode,
  onToggleDarkMode,
  testTitle = 'RRB NTPC Typing Test',
}: ExamHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', updateFullscreenState);
    return () => document.removeEventListener('fullscreenchange', updateFullscreenState);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be unavailable in restricted browser contexts.
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeftSeconds <= 60 && isTestActive;

  return (
    <header className="exam-toolbar border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="exam-toolbar-inner max-w-[1440px] mx-auto px-3 sm:px-5">
        <div className="exam-toolbar-row">
          <div className="exam-identity">
            <Link href="/" className="exam-exit" title="Return to test catalog" aria-label="Return to test catalog">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="exam-identity-copy">
              <div className="exam-kicker"><span>RRB NTPC</span><i>CBTST</i><span>ENGLISH</span></div>
              <h1 title={testTitle}>{testTitle}</h1>
            </div>
          </div>

          <div className="exam-controls" aria-label="Test controls">
            <label className="exam-control exam-font-control" title="Adjust passage and typing text size">
              <Type className="w-4 h-4" />
              <input
                type="range"
                min="14"
                max="26"
                value={fontSize}
                onChange={(event) => onFontSizeChange(Number(event.target.value))}
                aria-label="Text size"
              />
              <span>{fontSize}px</span>
            </label>

            <label className="exam-control exam-duration-control" title="Choose test duration">
              <Clock className="w-4 h-4" />
              <select
                value={selectedDuration}
                disabled={isTestActive}
                onChange={(event) => onDurationChange(Number(event.target.value))}
                aria-label="Test duration"
              >
                <option value={10}>10 min · Official</option>
                <option value={5}>5 min · Practice</option>
                <option value={2}>2 min · Sprint</option>
                <option value={1}>1 min · Warm-up</option>
              </select>
            </label>

            <button
              type="button"
              disabled={isTestActive}
              onClick={onToggleBackspace}
              aria-pressed={backspaceEnabled}
              title={backspaceEnabled ? 'Backspace is allowed' : 'Backspace is blocked'}
              className={`exam-control exam-backspace-control ${backspaceEnabled ? 'is-enabled' : 'is-locked'}`}
            >
              <Delete className="w-4 h-4" />
              <span>{backspaceEnabled ? 'Bksp allowed' : 'Bksp blocked'}</span>
            </button>

            <button type="button" onClick={onToggleSound} className="exam-icon-control" aria-label={soundEnabled ? 'Turn typing sound off' : 'Turn typing sound on'} title={soundEnabled ? 'Typing sound on' : 'Typing sound off'} aria-pressed={soundEnabled}>
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button type="button" onClick={onToggleDarkMode} className="exam-icon-control" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Light mode' : 'Dark mode'} aria-pressed={darkMode}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button type="button" onClick={toggleFullscreen} className="exam-icon-control" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-pressed={isFullscreen}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          <div className={`exam-clock ${isUrgent ? 'is-urgent' : ''}`} aria-live="off">
            <span className="exam-clock-label">TIME LEFT</span>
            <span className="exam-clock-value">{timeFormatted}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
