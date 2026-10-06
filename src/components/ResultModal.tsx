'use client';

import React, { useState } from 'react';
import { NTPCResult } from '../lib/ntpcEngine';
import {
  CheckCircle2,
  XCircle,
  Gauge,
  Keyboard,
  BarChart2,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Info,
  Calculator,
} from 'lucide-react';
import Link from 'next/link';

interface ResultModalProps {
  result: NTPCResult;
  onRetake: () => void;
  onNextTest: () => void;
  onClose?: () => void;
}

export default function ResultModal({
  result,
  onRetake,
  onNextTest,
}: ResultModalProps) {
  const [passageView, setPassageView] = useState<'comparison' | 'inline'>('inline');
  const reviewColors: Record<string, string> = {
    spelling: '#FF9999',
    extra: '#FFC1CC',
    omission: '#00FFFF',
    capitalization: '#FFFF99',
    punctuation: '#DDA0DD',
    spacing: '#FFA500',
    transposition: '#FF9999',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-7xl mx-auto my-6 overflow-hidden transition-colors">
      {/* Header Banner */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Typing Test Result
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated using Official RRB NTPC (TCS iON) 5% Relaxation Formula
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/history"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-900 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Progress & Trends</span>
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Pass / Fail Big Status Box */}
        <div
          className={`py-4 px-6 rounded-2xl text-center border transition-all ${
            result.isPass
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            {result.isPass ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            )}
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {result.isPass ? 'Pass' : 'Fail'}
            </span>
          </div>
          <p className="text-sm font-semibold opacity-90">
            Net Speed: <strong className="font-mono text-base">{result.netWpm} WPM</strong>
            <span className="mx-2 text-slate-400">•</span>
            <span>Qualifying Requirement: 30 WPM</span>
          </p>
          {!result.isPass && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
              {result.netWpm < 30
                ? `Net speed fell below 30 WPM threshold by ${(30 - result.netWpm).toFixed(2)} WPM.`
                : `Total typed words (${result.totalWordsTyped}) fell short of minimum word count floor.`}
            </p>
          )}
        </div>

        {/* 6 Key Stat Headline Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              NET WPM
            </span>
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono mt-0.5 block ${
                result.netWpm >= 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {result.netWpm}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              GROSS WPM
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5 block">
              {result.grossWpm}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              TOTAL MISTAKES
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-0.5 block">
              {result.totalMistakes.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              TIME TAKEN
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
              {result.timeTakenFormatted}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              ACCURACY
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {result.accuracy}%
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              WORDS TYPED
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5 block">
              {result.totalWordsTyped}
            </span>
          </div>
        </div>

        {/* 3 Detailed Breakdown Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Performance Metrics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Performance Metrics
              </h3>
            </div>

            <ul className="space-y-2 text-xs">
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Typing Speed (Net WPM)</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{result.netWpm}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Gross Typing Speed (WPM)</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.grossWpm}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Full Mistakes</span>
                <strong className="text-rose-600 dark:text-rose-400 font-mono">{result.fullMistakes}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Half Mistakes</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.halfMistakes}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Total Mistakes (Full + Half/2)</span>
                <strong className="text-rose-600 dark:text-rose-400 font-mono">{result.totalMistakes.toFixed(2)}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Allowed Mistakes (5%)</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.allowedMistakes}</strong>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Final Penalized Mistakes</span>
                <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">{result.finalMistakes}</strong>
              </li>
            </ul>
          </div>

          {/* Column 2: Typing Metrics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                <Keyboard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Typing Metrics
              </h3>
            </div>

            <ul className="space-y-2 text-xs">
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Spelling / Substitution</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.spellingErrors}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Omission (Word Skipped)</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.omissionErrors}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Extra Word Added</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.extraWordErrors}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Capitalization Error</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.capitalizationErrors}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Punctuation Error</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.punctuationErrors}</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Spacing Error (Joined/Split)</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{result.spacingErrors}</strong>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Backspace Count</span>
                <strong className="text-amber-600 dark:text-amber-400 font-mono">{result.backspaceCount}</strong>
              </li>
            </ul>
          </div>

          {/* Column 3: Calculation & Error Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Net WPM Calculation
                </h3>
              </div>

              <ul className="space-y-2 text-xs">
                <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">1. Actual Words Typed</span>
                  <strong className="text-slate-900 dark:text-slate-100 font-mono">
                    {result.totalWordsTyped} <span className="text-[10px] text-slate-400 font-sans font-normal">({result.typedKeystrokes}/5)</span>
                  </strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">2. Total Errors (Full + Half/2)</span>
                  <strong className="text-rose-600 dark:text-rose-400 font-mono">
                    {result.totalMistakes.toFixed(2)}
                  </strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">3. 5% Exemption Buffer</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                    -{result.allowedMistakes} <span className="text-[10px] text-slate-400 font-sans font-normal">(Forgiven)</span>
                  </strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">4. Net Penalized Errors</span>
                  <strong className="text-rose-600 dark:text-rose-400 font-mono">
                    {result.finalMistakes}
                  </strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">5. 10x Word Penalty</span>
                  <strong className="text-rose-600 dark:text-rose-400 font-mono">
                    -{result.penaltyWords} words
                  </strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">6. Net Words Remaining</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-mono">
                    {Math.max(0, Number((result.totalWordsTyped - result.penaltyWords).toFixed(2)))} words
                  </strong>
                </li>
                <li className="flex justify-between items-center py-1.5 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 mt-1">
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">Final Net WPM</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    {result.netWpm} WPM
                  </strong>
                </li>
              </ul>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
              <span>Accuracy: {result.accuracy}%</span>
              <span>Time: {result.timeTakenFormatted}</span>
            </div>
          </div>
        </div>

        {/* Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </button>

          <button
            type="button"
            onClick={onNextTest}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            <span>Next Practice Passage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Error Color Legend (Identical to Screenshot) */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Error Color Legend</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#FF9999' }}></span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Spelling / Substitution</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                Full Mistake
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#FFC1CC' }}></span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Extra Word</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                Full Mistake
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#00FFFF' }}></span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Omission (Word Skipped)</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                Full Mistake
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#DDA0DD' }}></span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Punctuation</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Half Mistake
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#FFFF99' }}></span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Capitalization</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Half Mistake
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#FFA500' }}></span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Spacing Error (Joined/Split)</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Half Mistake
              </span>
            </div>
          </div>
        </div>

        {/* Word-by-Word Error Breakdown Table (Identical to Screenshot) */}
        {result.wordBreakdown.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/70 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Error Breakdown — Word by Word ({result.wordBreakdown.length} mistakes detected)
              </h3>
            </div>

            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">ORIGINAL WORD</th>
                    <th className="py-2.5 px-4">TYPED WORD</th>
                    <th className="py-2.5 px-4">ERROR TYPE</th>
                    <th className="py-2.5 px-4 text-center">MISTAKE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {result.wordBreakdown.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2 px-4 text-center font-sans text-slate-500">{row.id}</td>
                      <td className="py-2 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {row.originalWord}
                      </td>
                      <td className="py-2 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {row.typedWord}
                      </td>
                      <td className="py-2 px-4 font-sans">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-900"
                          style={{ backgroundColor: row.color }}
                        >
                          {row.errorType}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.mistakeType === 'Full Mistake'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }`}
                        >
                          {row.mistakeType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Full paragraph review with side-by-side and inline modes */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Passage Evaluation</h3>
            </div>
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-900" role="group" aria-label="Passage review layout">
              <button type="button" onClick={() => setPassageView('comparison')} aria-pressed={passageView === 'comparison'} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${passageView === 'comparison' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
                Side by side
              </button>
              <button type="button" onClick={() => setPassageView('inline')} aria-pressed={passageView === 'inline'} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${passageView === 'inline' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
                Inline mistakes
              </button>
            </div>
          </div>

          {passageView === 'inline' ? (
            <div className="p-5 text-sm leading-relaxed font-sans text-slate-800 dark:text-slate-200">
              <div className="flex flex-wrap items-end gap-x-1.5 gap-y-2">
                {result.passageReview.map((token, index) => {
                  const isMistake = !token.pending && token.type !== 'correct';
                  const original = token.originalWord ?? '∅';
                  const typed = token.typedWord ?? '— skipped —';
                  const color = reviewColors[token.type];
                  const pendingStartsHere = token.pending && !result.passageReview[index - 1]?.pending;

                  return (
                    <React.Fragment key={`${index}-${token.originalWord ?? 'extra'}`}>
                      {pendingStartsHere && (
                        <span className="basis-full mt-2 border-t border-dashed border-slate-300 pt-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          Not evaluated · remaining words in this lap
                        </span>
                      )}
                      <span className={`inline-flex max-w-full flex-col items-center align-bottom text-center ${token.pending ? 'text-slate-400 dark:text-slate-500' : ''}`}>
                        {isMistake && (
                          <span className="mb-0.5 max-w-full break-words rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
                            {typed}
                          </span>
                        )}
                        <span className={`break-words rounded px-1 py-0.5 ${token.pending ? 'bg-slate-100 dark:bg-slate-800' : ''}`} style={isMistake ? { backgroundColor: color } : undefined}>
                          {original}
                        </span>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
              {result.passageReview.length === 0 && <p className="text-slate-500">No passage text to review.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
          <section className="min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Typed Paragraph (Errors Highlighted)</h3>
            </div>
            <div className="p-5 text-sm leading-relaxed tracking-wide text-slate-800 dark:text-slate-200 font-sans break-words">
              <div
                dangerouslySetInnerHTML={{
                  __html: result.typedHighlightedHtml || '<em>No words typed.</em>',
                }}
              />
            </div>
          </section>

          <section className="min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Original Paragraph (Omissions Highlighted)</h3>
            </div>
            <div className="p-5 text-sm leading-relaxed tracking-wide text-slate-800 dark:text-slate-200 font-sans break-words">
              <div
                dangerouslySetInnerHTML={{
                  __html: result.originalHighlightedHtml,
                }}
              />
            </div>
          </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
