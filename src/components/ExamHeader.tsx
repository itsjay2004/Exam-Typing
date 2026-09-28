'use client';

import React from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Delete,
  Clock,
  Type,
  Sun,
  Moon,
} from 'lucide-react';

interface ExamHeaderProps {
  timeLeftSeconds: number;
  totalDurationSeconds: number;
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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeftSeconds <= 60 && isTestActive;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Test title & Set */}
          <div className="flex items-center space-x-3">
            <div className="border-l-4 border-blue-600 pl-2.5">
              <h1 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {testTitle}
              </h1>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                English Typing • Standard 5 Key Depressions / Word
              </span>
            </div>
          </div>

          {/* Center: Controls Toolbar */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Font Size Slider */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <Type className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="range"
                min="14"
                max="26"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-16 h-1.5 accent-blue-600 cursor-pointer"
                title="Adjust Text Size"
              />
              <span className="font-mono text-[11px] font-semibold w-7 text-right">{fontSize}px</span>
            </div>

            {/* Duration Selector (Disabled during active test) */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedDuration}
                disabled={isTestActive}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer disabled:opacity-50"
              >
                <option value={10} className="dark:bg-slate-900">10 Min (Official)</option>
                <option value={5} className="dark:bg-slate-900">5 Min Practice</option>
                <option value={2} className="dark:bg-slate-900">2 Min Sprint</option>
                <option value={1} className="dark:bg-slate-900">1 Min Warmup</option>
              </select>
            </div>

            {/* Backspace Toggle Button */}
            <button
              type="button"
              disabled={isTestActive}
              onClick={onToggleBackspace}
              title={backspaceEnabled ? 'Backspace is currently ALLOWED (Practice Mode)' : 'Backspace is DISABLED (Official TCS Exam Mode)'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border transition-colors disabled:opacity-60 ${
                backspaceEnabled
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <Delete className="w-3.5 h-3.5" />
              <span>{backspaceEnabled ? 'Backspace: ON (Practice)' : 'Backspace: OFF (TCS Exam)'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mechanical Key Clicks: ON' : 'Mechanical Key Clicks: OFF'}
              className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullScreen}
              title="Toggle Fullscreen"
              className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors hidden sm:flex"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Right: Countdown Timer & Candidate Info */}
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm sm:text-base transition-colors ${
                isUrgent
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 animate-pulse'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase text-slate-500 dark:text-slate-400 font-sans font-medium mr-1">
                Time Left:
              </span>
              <span>{timeFormatted}</span>
            </div>

            {/* TCS style Candidate Profile badge */}
            <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                CA
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                  CANDIDATE
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  Roll: NTPC-2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
