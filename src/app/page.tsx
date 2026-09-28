'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllPassages,
  saveCustomPassage,
  deleteCustomPassage,
  DEFAULT_PASSAGES,
  Passage,
} from '../lib/passages';
import {
  getTestHistory,
  getPassageStatsMap,
  PassageAttemptStat,
  TestAttempt,
} from '../lib/storage';
import ResultModal from '../components/ResultModal';
import {
  Keyboard,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  RotateCcw,
  Eye,
  Search,
  Filter,
  BarChart2,
  BookOpen,
  Download,
  Upload,
  Sparkles,
  Layers,
  Trash2,
  Clock,
  Target,
  Award,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [passages, setPassages] = useState<Passage[]>(DEFAULT_PASSAGES);
  const [statsMap, setStatsMap] = useState<Record<string, PassageAttemptStat>>({});
  const [filterType, setFilterType] = useState<'all' | 'attempted' | 'unattempted'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewAttempt, setPreviewAttempt] = useState<TestAttempt | null>(null);

  // New passage form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Custom');
  const [newText, setNewText] = useState('');

  const loadData = () => {
    const loadedPassages = getAllPassages();
    setPassages(loadedPassages);
    setStatsMap(getPassageStatsMap());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) {
      alert('Please enter passage text.');
      return;
    }
    saveCustomPassage(newTitle, newCategory, newText);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewText('');
    loadData();
  };

  const handleDeleteCustom = (id: string) => {
    if (confirm('Delete this custom passage?')) {
      deleteCustomPassage(id);
      loadData();
    }
  };

  const handleExportPassages = () => {
    const blob = new Blob([JSON.stringify(passages, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rrb-ntpc-passages-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute aggregate numbers
  const totalPassages = passages.length;
  const attemptedCount = Object.keys(statsMap).length;
  const unattemptedCount = totalPassages - attemptedCount;

  const categories = ['All', ...Array.from(new Set(passages.map((p) => p.category)))];

  // Filter passages
  const filteredPassages = passages.filter((p) => {
    const stat = statsMap[p.id];
    const isAttempted = Boolean(stat);

    if (filterType === 'attempted' && !isAttempted) return false;
    if (filterType === 'unattempted' && isAttempted) return false;

    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchText = p.text.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchText && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 transition-colors pb-16">
      {/* Hero Welcome & Quick Stats Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Railway Recruitment Board (RRB NTPC) Skill Test</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Typing Test Practice Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Choose any passage below to take a real TCS iON simulation test. Evaluates using the official 5% error relaxation buffer and 10x penalty formula, with instant progress tracking.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Passage</span>
              </button>

              <Link
                href="/history"
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Full Analytics</span>
              </Link>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Tests</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{totalPassages} Sets</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attempted</span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{attemptedCount} Tests</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Unattempted</span>
                <span className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">{unattemptedCount} Tests</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Floor</span>
                <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">≥ 30 Net WPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters, Categories & Search Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
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

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Test Cards Grid */}
        {filteredPassages.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No test sets match your filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or search query.</p>
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
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isAttempted
                      ? isPass
                        ? 'border-emerald-500/30'
                        : 'border-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Card Header Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {p.category}
                      </span>

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
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug mb-1">
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

      {/* Modal: Add Custom Passage */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Add New Practice Passage</span>
                </h3>
                <p className="text-xs text-slate-500">Paste any text to instantly generate a playable NTPC test set.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Passage Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Editorial on Artificial Intelligence & Railways"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Economy, Technology, Custom"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Passage Content (Paste text here)
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Paste paragraph here (recommended 300 to 450 words)..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none text-xs font-sans leading-relaxed resize-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Word count: {newText.trim().split(/\s+/).filter((w) => w.length > 0).length} words
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Save & Add Test Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Previous Result */}
      {previewAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-5xl w-full my-8 relative">
            <button
              type="button"
              onClick={() => setPreviewAttempt(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-lg"
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
      )}
    </div>
  );
}
