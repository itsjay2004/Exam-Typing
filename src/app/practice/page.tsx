'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllPassages,
  deleteCustomPassage,
  DEFAULT_PASSAGES,
  Passage,
} from '../../lib/passages';
import {
  getTestHistory,
  getPassageStatsMap,
  PassageAttemptStat,
  TestAttempt,
} from '../../lib/storage';
import ResultModal from '../../components/ResultModal';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Eye,
  Search,
  BarChart2,
  BookOpen,
  Sparkles,
  Trash2,
  Award,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [passages, setPassages] = useState<Passage[]>(DEFAULT_PASSAGES);
  const [statsMap, setStatsMap] = useState<Record<string, PassageAttemptStat>>({});
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'attempted' | 'unattempted'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [previewAttempt, setPreviewAttempt] = useState<TestAttempt | null>(null);

  const loadData = () => {
    const loadedPassages = getAllPassages();
    const history = getTestHistory();
    setPassages(loadedPassages);
    setAttempts(history);
    setStatsMap(getPassageStatsMap());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCustom = (id: string) => {
    if (confirm('Delete this custom passage?')) {
      deleteCustomPassage(id);
      loadData();
    }
  };

  // Compute aggregate numbers
  const totalPassages = passages.length;
  const attemptedCount = Object.keys(statsMap).filter((id) => passages.some((passage) => passage.id === id)).length;
  const unattemptedCount = Math.max(0, totalPassages - attemptedCount);
  const passedAttempts = attempts.filter((attempt) => attempt.result.isPass).length;
  const failedAttempts = attempts.length - passedAttempts;
  const recentAttempts = attempts.slice(0, 25);
  const recentAverageNetWpm = recentAttempts.length
    ? (recentAttempts.reduce((total, attempt) => total + attempt.result.netWpm, 0) / recentAttempts.length).toFixed(1)
    : null;
  const recentAverageAccuracy = recentAttempts.length
    ? (recentAttempts.reduce((total, attempt) => total + attempt.result.accuracy, 0) / recentAttempts.length).toFixed(1)
    : null;
  const bestAttempt = attempts.reduce<TestAttempt | null>(
    (best, attempt) => (!best || attempt.result.netWpm > best.result.netWpm ? attempt : best),
    null,
  );
  const bestNetWpm = bestAttempt?.result.netWpm.toFixed(1) ?? null;
  const bestAccuracy = bestAttempt?.result.accuracy.toFixed(1) ?? null;

  // Filter passages
  const filteredPassages = passages.filter((p) => {
    const stat = statsMap[p.id];
    const isAttempted = Boolean(stat);

    if (filterType === 'attempted' && !isAttempted) return false;
    if (filterType === 'unattempted' && isAttempted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchText = p.text.toLowerCase().includes(q);
      if (!matchTitle && !matchText) return false;
    }

    return true;
  });

  return (
    <main className="home-page min-h-screen bg-slate-100/60 dark:bg-slate-950 transition-colors pb-16">
      {/* Hero Welcome & Quick Stats Banner */}
      <div className="home-banner bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="home-banner-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="home-intro flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="home-kicker inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Railway Recruitment Board (RRB NTPC) Skill Test</span>
              </div>
              <h1 className="home-title text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Your next best <span className="text-emerald-700">practice</span> starts here.
              </h1>
              <p className="home-description text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Build exam day confidence with focused RRB NTPC typing drills, instant feedback, and progress that stays yours.
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/history"
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Full Analytics</span>
              </Link>
            </div>
          </div>

          {/* Practice and performance snapshot */}
          <div className="home-stats grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="home-stat-card">
              <div className="home-stat-heading">
                <div className="home-stat-icon blue"><BookOpen className="w-4 h-4" /></div>
                <span className="home-stat-label">Passage coverage</span>
              </div>
              <span className="home-stat-value">{totalPassages} <small>sets</small></span>
              <div className="home-stat-detail"><span>{attemptedCount} attempted</span><span>{unattemptedCount} to go</span></div>
              <div className="home-stat-track" aria-label={`${attemptedCount} of ${totalPassages} passages attempted`}>
                <span style={{ width: `${totalPassages ? (attemptedCount / totalPassages) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="home-stat-card">
              <div className="home-stat-heading">
                <div className="home-stat-icon green"><CheckCircle2 className="w-4 h-4" /></div>
                <span className="home-stat-label">Test outcomes</span>
              </div>
              <div className="home-stat-pair">
                <span className="pass">{passedAttempts}<small> passed</small></span>
                <span className="fail">{failedAttempts}<small> failed</small></span>
              </div>
              <span className="home-stat-note">{attempts.length} total {attempts.length === 1 ? 'attempt' : 'attempts'}</span>
            </div>

            <div className="home-stat-card">
              <div className="home-stat-heading">
                <div className="home-stat-icon violet"><Activity className="w-4 h-4" /></div>
                <span className="home-stat-label">Recent average</span>
              </div>
              <span className="home-stat-value">{recentAverageNetWpm ?? '—'} <small>{recentAverageNetWpm ? 'net WPM' : 'no tests yet'}</small></span>
              <div className="home-stat-secondary">
                <span>Avg accuracy</span>
                <strong>{recentAverageAccuracy ? `${recentAverageAccuracy}%` : '—'}</strong>
              </div>
              <span className="home-stat-note">{recentAttempts.length ? `Across last ${recentAttempts.length} ${recentAttempts.length === 1 ? 'test' : 'tests'}` : 'Complete a test to start tracking'}</span>
            </div>

            <div className="home-stat-card">
              <div className="home-stat-heading">
                <div className="home-stat-icon amber"><Award className="w-4 h-4" /></div>
                <span className="home-stat-label">Personal best</span>
              </div>
              <span className="home-stat-value">{bestNetWpm ?? '—'} <small>{bestNetWpm ? 'net WPM' : 'no record yet'}</small></span>
              <div className="home-stat-secondary">
                <span>Accuracy on best run</span>
                <strong>{bestAccuracy ? `${bestAccuracy}%` : '—'}</strong>
              </div>
              <span className="home-stat-note">Qualifying target: 30 net WPM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search and progress filters */}
        <div className="home-toolbar bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Tests ({totalPassages})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('attempted')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'attempted'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Attempted ({attemptedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('unattempted')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'unattempted'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Unattempted ({unattemptedCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search test sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Test Cards Grid */}
        {filteredPassages.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No test sets match your search</h3>
            <p className="text-xs text-slate-400 mt-1">Try another passage title or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPassages.map((p) => {
              const stat = statsMap[p.id];
              const isAttempted = Boolean(stat);
              const latestResult = stat?.latest.result;
              const isPass = latestResult?.isPass ?? false;

              return (
                <div
                  key={p.id}
                  className={`passage-card bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isAttempted
                      ? isPass
                        ? 'is-pass border-emerald-500/30'
                        : 'is-fail border-rose-500/30'
                      : 'is-new border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Card Header Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {isAttempted ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              isPass
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {isPass ? 'PASS' : 'FAIL'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {stat.count}x
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Unattempted
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="passage-title font-bold text-[15px] text-slate-900 dark:text-white leading-snug mb-1.5">
                      {p.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono block mb-3">
                      {p.wordCount} words • Standard 10 Min Set
                    </span>

                    {/* Attempted Card: Detailed Performance Summary Box */}
                    {isAttempted && latestResult ? (
                      <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                          <span className="text-xs text-slate-500 font-medium">Net Typing Speed</span>
                          <span
                            className={`text-lg font-extrabold font-mono ${
                              isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {latestResult.netWpm}{' '}
                            <span className="text-xs font-normal text-slate-400">WPM</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Accuracy:</span>
                            <strong className="font-mono text-emerald-600 dark:text-emerald-400">{latestResult.accuracy}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Gross WPM:</span>
                            <strong className="font-mono text-blue-600 dark:text-blue-400">{latestResult.grossWpm}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Mistakes:</span>
                            <strong className="font-mono text-rose-600 dark:text-rose-400">{latestResult.totalMistakes.toFixed(1)}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Typed Words:</span>
                            <strong className="font-mono text-slate-700 dark:text-slate-300">{latestResult.totalWordsTyped}</strong>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 text-right pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                          Last taken: {stat.latest.dateFormatted}
                        </div>
                      </div>
                    ) : (
                      /* Unattempted Card: Passage Text Preview */
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed my-3 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 font-sans">
                        {p.text}
                      </p>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {p.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustom(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete custom passage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="flex items-center space-x-2 ml-auto">
                      {isAttempted && stat && (
                        <button
                          type="button"
                          onClick={() => setPreviewAttempt(stat.latest)}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="View last test breakdown"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Last Result</span>
                        </button>
                      )}

                      <Link
                        href={`/test/${p.id}`}
                        className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-all ${
                          isAttempted
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {isAttempted ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-attempt</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Attempt Test</span>
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: View Previous Result */}
      {previewAttempt && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-sm">
          <div className="min-h-full flex items-start justify-center px-3 py-4 sm:px-6 sm:py-6">
            <div className="max-w-5xl w-full relative" role="dialog" aria-modal="true" aria-label="Previous test result">
              <button
                type="button"
                onClick={() => setPreviewAttempt(null)}
                className="fixed top-3 right-3 z-[60] p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-lg"
                aria-label="Close result"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <ResultModal
                result={previewAttempt.result}
                onRetake={() => {
                  const passageId = previewAttempt.passageId;
                  setPreviewAttempt(null);
                  window.location.href = `/test/${passageId}`;
                }}
                onNextTest={() => {
                  setPreviewAttempt(null);
                  window.location.href = `/test/${passages[0].id}`;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
