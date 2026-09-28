'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { soundController } from '../lib/sound';
import { Passage } from '../lib/passages';
import { AlertCircle, CheckCircle2, RotateCcw, XCircle, Layers } from 'lucide-react';

interface TypingAreaProps {
  passage: Passage;
  typedText: string;
  onTypedTextChange: (text: string) => void;
  backspaceEnabled: boolean;
  backspaceCount: number;
  onIncrementBackspace: () => void;
  isTestActive: boolean;
  onStartTest: () => void;
  onSubmitTest: () => void;
  onCancelTest: () => void;
  fontSize: number;
}

export default function TypingArea({
  passage,
  typedText,
  onTypedTextChange,
  backspaceEnabled,
  backspaceCount,
  onIncrementBackspace,
  isTestActive,
  onStartTest,
  onSubmitTest,
  onCancelTest,
  fontSize,
}: TypingAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);
  const [backspaceWarning, setBackspaceWarning] = useState(false);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus textarea when user clicks anywhere in the container
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [passage.id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Intercept Backspace
    if (e.key === 'Backspace') {
      onIncrementBackspace();
      if (!backspaceEnabled) {
        e.preventDefault();
        // Show subtle visual warning
        setBackspaceWarning(true);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        warningTimerRef.current = setTimeout(() => {
          setBackspaceWarning(false);
        }, 1500);
        return;
      }
    }

    // Play mechanical sound on printable keys and space
    if (e.key.length === 1 || e.key === ' ' || e.key === 'Enter') {
      soundController.playKeyClick();
      if (!isTestActive) {
        onStartTest();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTestActive && e.target.value.length > 0) {
      onStartTest();
    }
    onTypedTextChange(e.target.value);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    alert('Pasting text is disabled in RRB NTPC typing test.');
  }, []);

  // Compute live indicators
  const typedKeystrokes = typedText.length;
  const liveWords = Math.round(typedKeystrokes / 5);
  const passageKeystrokes = passage.text.length;
  const isRetyping = typedKeystrokes > passageKeystrokes;
  const currentLap = isRetyping ? Math.floor(typedKeystrokes / passageKeystrokes) + 1 : 1;

  return (
    <div className="flex flex-col space-y-4 max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Top Box: Original Passage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              Original Passage
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {passage.category}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Given Keystrokes: <strong className="font-mono text-slate-700 dark:text-slate-200">{passageKeystrokes}</strong>
            </span>
            <span>•</span>
            <span>
              Words: <strong className="font-mono text-slate-700 dark:text-slate-200">{passage.wordCount}</strong>
            </span>
          </div>
        </div>

        <div
          ref={passageRef}
          onCopy={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
          className="p-5 h-44 sm:h-52 overflow-y-auto font-sans text-slate-800 dark:text-slate-200 select-none bg-slate-50/40 dark:bg-slate-950/30 whitespace-pre-wrap tracking-wide"
        >
          {passage.text}
        </div>
      </div>

      {/* Retyping alert banner if candidate loops passage */}
      {isRetyping && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>
            Passage completed! You are now typing <strong>Lap #{currentLap}</strong> (Continuous retyping expands your 5% mistake forgiveness buffer).
          </span>
        </div>
      )}

      {/* Bottom Box: Candidate Typing Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors relative">
        <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isTestActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              Typing Area
            </span>
            {!isTestActive && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                (Timer will start automatically upon your first keystroke)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              Keystrokes: <strong className="font-mono text-slate-900 dark:text-white">{typedKeystrokes}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Words: <strong className="font-mono text-slate-900 dark:text-white">{liveWords}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Backspaces: <strong className={`font-mono ${backspaceCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>{backspaceCount}</strong>
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
            placeholder="Click here and start typing to begin the official RRB NTPC test..."
            className="w-full h-48 sm:h-56 p-5 font-sans outline-none resize-none bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-wide border-0 focus:ring-0"
          />

          {/* Floating warning when candidate hits backspace while disabled */}
          {backspaceWarning && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-bounce">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Backspace is Disabled in TCS Exam Mode</span>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancelTest}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Test</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onSubmitTest}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
