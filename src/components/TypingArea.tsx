'use client';

import React, { useRef, useEffect, useState } from 'react';
import { soundController } from '../lib/sound';
import { Passage } from '../lib/passages';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

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
  fontFamily: string;
  autoFullscreen: boolean;
  onAutoFullscreenStarted: () => void;
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
  fontFamily,
  autoFullscreen,
  onAutoFullscreenStarted,
}: TypingAreaProps) {
  const selectedFont = fontFamily === 'arial'
    ? 'Arial, Helvetica, sans-serif'
    : fontFamily === 'georgia'
      ? 'Georgia, "Times New Roman", serif'
      : '"Times New Roman", Times, serif';
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

  const handleTypingAreaClick = async () => {
    if (!autoFullscreen || document.fullscreenElement) return;
    onAutoFullscreenStarted();
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen may be unavailable in restricted browser contexts.
    }
  };

  // Compute live indicators
  const typedKeystrokes = typedText.length;
  const liveWords = Math.round(typedKeystrokes / 5);
  const passageKeystrokes = passage.text.length;
  const isRetyping = typedKeystrokes > passageKeystrokes;
  const currentLap = isRetyping ? Math.floor(typedKeystrokes / passageKeystrokes) + 1 : 1;

  return (
    <div className="typing-workspace">
      <div className="exam-layout">
        <main className="exam-left-column">
          <section className="exam-panel reading-panel" aria-label="Original passage">
            <div className="exam-panel-heading">
              <span className="font-semibold">Passage</span>
              <div className="exam-passage-stats">
                <span><strong>{passage.wordCount}</strong> words</span>
                <span><strong>{passageKeystrokes}</strong> characters</span>
              </div>
            </div>
            <div
              ref={passageRef}
              onCopy={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              style={{ fontSize: `${fontSize}px`, fontFamily: selectedFont }}
              className="exam-passage-text"
            >
              {passage.text}
            </div>
          </section>

          {isRetyping && (
            <div className="exam-lap-note" role="status">
              Passage retyping · Lap #{currentLap}
            </div>
          )}

          <section className="exam-panel response-panel" aria-label="Typing response">
            <div className="exam-input-status">
              <span className="typing-ready-note">{isTestActive ? 'Test in progress' : 'Ready'}</span>
              <div className="typing-live-stats">
                <span>Keys <strong>{typedKeystrokes}</strong></span>
                <span>Words <strong>{liveWords}</strong></span>
                <span>Bksp <strong className={backspaceCount > 0 ? 'has-backspaces' : ''}>{backspaceCount}</strong></span>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                onClick={handleTypingAreaClick}
                value={typedText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                style={{ fontSize: `${fontSize}px`, fontFamily: selectedFont }}
                placeholder="Start typing the passage here…"
                className="exam-response-input"
                aria-label="Type the passage"
              />

              {backspaceWarning && (
                <div className="exam-backspace-warning">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Backspace is disabled in this test.</span>
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="exam-candidate-panel" aria-label="Candidate information">
          <div className="exam-candidate-profile">
            <img
              src="https://g26.tcsion.com//OnlineAssessment/images/NewCandidateImage.jpg"
              alt="Candidate"
              className="exam-candidate-photo"
            />
            <strong>Candidate</strong>
          </div>
          <div className="exam-candidate-context">
            You are viewing <strong>English Typing Practice</strong>
          </div>
          <div className="exam-candidate-instructions">
            <strong>Instructions</strong>
            <ul>
              <li>Type the passage shown on the left.</li>
              <li>{backspaceEnabled ? 'Backspace is enabled.' : 'Backspace is disabled for this attempt.'}</li>
              <li className="rounded-r border-l-2 border-amber-500 bg-amber-50 px-2 py-1 font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                For testing only: pasting and arrow keys are allowed.
              </li>
              <li>The test submits automatically when time runs out.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="exam-action-bar">
        <button type="button" onClick={onCancelTest} className="exam-cancel-button">
          <XCircle className="w-4 h-4" /><span>Cancel</span>
        </button>
        <button type="button" onClick={onSubmitTest} className="exam-submit-button">
          <CheckCircle2 className="w-4 h-4" /><span>Submit Test</span>
        </button>
      </div>
    </div>
  );
}
