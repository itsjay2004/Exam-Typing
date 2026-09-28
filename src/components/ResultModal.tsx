'use client';

import React, { useState } from 'react';
import { NTPCResult } from '../lib/ntpcEngine';
import {
  CheckCircle2,
  XCircle,
  Gauge,
  Keyboard,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Lightbulb,
  Calculator,
  Search,
  Filter,
  Columns2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface ResultModalProps {
  result: NTPCResult;
  onRetake: () => void;
  onNextTest: () => void;
}

export default function ResultModal({
  result,
  onRetake,
  onNextTest,
}: ResultModalProps) {
  const [activeView, setActiveView] = useState<'typed' | 'original' | 'split'>('typed');
  const [errorFilter, setErrorFilter] = useState<string>('all');
  const [wordSearch, setWordSearch] = useState<string>('');

  // Smart coaching feedback generated based on user metrics
  const getSmartInsights = () => {
    const tips: { type: 'success' | 'warning' | 'info'; message: string }[] = [];

    if (result.isPass) {
      tips.push({
        type: 'success',
        message: `Outstanding job! Your net speed of ${result.netWpm} WPM is comfortably above the 30 WPM NTPC qualifying threshold.`,
      });
    } else {
      if (result.netWpm < 30) {
        const gap = (30 - result.netWpm).toFixed(2);
        const penaltyReductionNeeded = Math.ceil(Number(gap) * (result.timeTakenMinutes || 10) / 10);
        tips.push({
          type: 'warning',
          message: `You are only ${gap} WPM away from qualifying! Eliminating just ${penaltyReductionNeeded} mistake(s) would recover ${penaltyReductionNeeded * 10} words and pass the test.`,
        });
      }
      if (result.totalWordsTyped < 300 && result.testDurationMinutes === 10) {
        tips.push({
          type: 'warning',
          message: `You typed ${result.totalWordsTyped} words. The official 10-minute exam requires at least 300 words typed regardless of net speed.`,
        });
      }
    }

    if (result.punctuationErrors >= 4) {
      tips.push({
        type: 'info',
        message: `High punctuation errors (${result.punctuationErrors}). While punctuation only counts as a half mistake (0.5), each error beyond the 5% buffer costs you 10 words. Slow down around commas and periods.`,
      });
    }

    if (result.capitalizationErrors >= 3) {
      tips.push({
        type: 'info',
        message: `Capitalization slips detected (${result.capitalizationErrors}). Watch your Shift key timing on proper nouns and sentence beginnings.`,
      });
    }

    if (result.backspaceCount > 15) {
      tips.push({
        type: 'warning',
        message: `Backspace pressed ${result.backspaceCount} times. In the real TCS iON exam, backspace is disabled. Practice keeping your flow moving forward without looking back.`,
      });
    }

    if (result.finalMistakes === 0) {
      tips.push({
        type: 'success',
        message: `Flawless accuracy! All your mistakes (${result.totalMistakes.toFixed(2)}) fell inside the 5% relaxation buffer (${result.allowedMistakes}), resulting in 0 word penalties!`,
      });
    }

    return tips;
  };

  const insights = getSmartInsights();

  // Filter word-by-word errors
  const filteredBreakdown = result.wordBreakdown.filter((item) => {
    const matchesFilter =
      errorFilter === 'all' ||
      item.errorType.toLowerCase().includes(errorFilter.toLowerCase());
    const matchesSearch =
      wordSearch === '' ||
      item.originalWord.toLowerCase().includes(wordSearch.toLowerCase()) ||
      item.typedWord.toLowerCase().includes(wordSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl mx-auto my-6 overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              CBTST Performance Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated under Official RRB NTPC 5% Forgiveness & 10x Penalty Guidelines
            </p>
          </div>
        </div>

        <Link
          href="/history"
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900 transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>View Progress History</span>
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {/* Modern Hero Qualification Card */}
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all ${
            result.isPass
              ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:to-slate-900/60 border-emerald-500/30'
              : 'bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-slate-50 dark:to-slate-900/60 border-rose-500/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                  result.isPass
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : 'bg-rose-600 text-white shadow-rose-500/25'
                }`}
              >
                {result.isPass ? (
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                ) : (
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      result.isPass
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {result.isPass ? 'Qualified for NTPC CBTST' : 'Did Not Qualify'}
                  </span>
                  <span className="text-xs text-slate-400">• Cutoff: 30 WPM</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                  {result.netWpm}{' '}
                  <span className="text-lg sm:text-xl font-normal text-slate-500 dark:text-slate-400">
                    Net WPM
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {result.isPass
                    ? `Exceeded qualifying speed by +${(result.netWpm - 30).toFixed(2)} WPM with ${result.accuracy}% accuracy.`
                    : `Needed +${(30 - result.netWpm).toFixed(2)} WPM more to meet the official 30 WPM threshold.`}
                </p>
              </div>
            </div>

            {/* Quick KPI Badges */}
            <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none flex items-center justify-between px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-xs">
                <span className="text-slate-500 dark:text-slate-400 mr-4">Gross Speed</span>
                <strong className="font-mono text-sm text-blue-600 dark:text-blue-400">{result.grossWpm} WPM</strong>
              </div>
              <div className="flex-1 sm:flex-none flex items-center justify-between px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-xs">
                <span className="text-slate-500 dark:text-slate-400 mr-4">5% Buffer Forgiven</span>
                <strong className="font-mono text-sm text-emerald-600 dark:text-emerald-400">{result.allowedMistakes} errors</strong>
              </div>
              <div className="flex-1 sm:flex-none flex items-center justify-between px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-xs">
                <span className="text-slate-500 dark:text-slate-400 mr-4">Penalized Mistakes</span>
                <strong className="font-mono text-sm text-rose-600 dark:text-rose-400">{result.finalMistakes} (-{result.penaltyWords}w)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Passage</span>
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

        {/* Smart AI Coaching Insights */}
        {insights.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>NTPC Performance Diagnostic & Recommendations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {insights.map((tip, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs flex items-start space-x-2.5 border ${
                    tip.type === 'success'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : tip.type === 'warning'
                      ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                      : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-80" />
                  <span className="leading-relaxed">{tip.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Official Formula Breakdown Card */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
            <Calculator className="w-4 h-4 text-blue-500" />
            <span>How Your Score Was Calculated (Official RRB NTPC Formula)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">1. Total Words</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                {result.totalWordsTyped}
              </span>
              <span className="text-[10px] text-slate-500">{result.typedKeystrokes} keystrokes / 5</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">2. Total Mistakes</span>
              <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
                {result.totalMistakes.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">{result.fullMistakes} full + {result.halfMistakes}/2 half</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">3. 5% Forgiven Buffer</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                -{result.allowedMistakes}
              </span>
              <span className="text-[10px] text-slate-500">5% of {result.totalWordsTyped} words</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">4. Net Mistakes</span>
              <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
                {result.finalMistakes}
              </span>
              <span className="text-[10px] text-slate-500">Mistakes beyond 5%</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">5. 10x Penalty</span>
              <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
                -{result.penaltyWords}
              </span>
              <span className="text-[10px] text-slate-500">{result.finalMistakes} × 10 words</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">6. Net Speed</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                {result.netWpm}
              </span>
              <span className="text-[10px] text-slate-500">({result.totalWordsTyped} - {result.penaltyWords}) / {result.timeTakenMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Word-by-Word Error Breakdown Explorer */}
        {result.wordBreakdown.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Error Explorer ({result.wordBreakdown.length} mistakes detected)
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['all', 'spelling', 'punctuation', 'capitalization', 'spacing', 'omission'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setErrorFilter(type)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors capitalize ${
                      errorFilter === type
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Quick Search */}
              <div className="relative w-full sm:w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search mistake..."
                  value={wordSearch}
                  onChange={(e) => setWordSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none"
                />
              </div>
            </div>

            {/* Error Table */}
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 uppercase font-semibold sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">Passage Word</th>
                    <th className="py-2.5 px-4">What You Typed</th>
                    <th className="py-2.5 px-4">Error Category</th>
                    <th className="py-2.5 px-4 text-center">Penalty Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {filteredBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-sans text-xs">
                        No errors match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBreakdown.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-2.5 px-4 text-center font-sans text-slate-400">{row.id}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {row.originalWord}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">
                          {row.typedWord}
                        </td>
                        <td className="py-2.5 px-4 font-sans">
                          <span
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-900 shadow-xs"
                            style={{ backgroundColor: row.color }}
                          >
                            {row.errorType}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-sans">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.mistakeType === 'Full Mistake'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            }`}
                          >
                            {row.mistakeType === 'Full Mistake' ? '1.0 Error' : '0.5 Error'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Visual Passage Highlighting with Segmented Control */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Passage Visual Inspection</span>
            </div>

            <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveView('typed')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  activeView === 'typed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Typed with Typos
              </button>
              <button
                type="button"
                onClick={() => setActiveView('original')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  activeView === 'original'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Original with Omissions
              </button>
              <button
                type="button"
                onClick={() => setActiveView('split')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors hidden sm:block ${
                  activeView === 'split'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Side-by-Side
              </button>
            </div>
          </div>

          <div className="p-5 text-sm sm:text-base leading-relaxed tracking-wide text-slate-800 dark:text-slate-200 font-sans max-h-80 overflow-y-auto">
            {activeView === 'split' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="font-bold block text-slate-400 uppercase text-[10px] mb-2">Original Passage</span>
                  <div dangerouslySetInnerHTML={{ __html: result.originalHighlightedHtml }} />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="font-bold block text-slate-400 uppercase text-[10px] mb-2">Your Typed Passage</span>
                  <div dangerouslySetInnerHTML={{ __html: result.typedHighlightedHtml || '<em>No words typed.</em>' }} />
                </div>
              </div>
            ) : activeView === 'typed' ? (
              <div dangerouslySetInnerHTML={{ __html: result.typedHighlightedHtml || '<em>No words typed.</em>' }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: result.originalHighlightedHtml }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
