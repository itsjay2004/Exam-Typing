'use client';

import React, { useState, useEffect } from 'react';
import {
  getTestHistory,
  calculateAnalytics,
  deleteTestAttempt,
  clearAllHistory,
  exportHistoryAsJson,
  importHistoryFromJson,
  TestAttempt,
  AnalyticsSummary,
} from '../../lib/storage';
import ProgressCharts from '../../components/ProgressCharts';
import ResultModal from '../../components/ResultModal';
import {
  History,
  Download,
  Upload,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Keyboard,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail'>('all');
  const [isMounted, setIsMounted] = useState(false);

  const loadData = () => {
    const list = getTestHistory();
    setHistory(list);
    setAnalytics(calculateAnalytics(list));
  };

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this test record from your history?')) {
      deleteTestAttempt(id);
      loadData();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire typing history? This cannot be undone.')) {
      clearAllHistory();
      loadData();
    }
  };

  const handleExport = () => {
    const json = exportHistoryAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rrb-typing-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importHistoryFromJson(content);
        if (success) {
          alert('History imported successfully!');
          loadData();
        } else {
          alert('Failed to parse history JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Filter history
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.passageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.passageCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'pass'
        ? item.result.isPass
        : !item.result.isPass;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <History className="w-6 h-6 text-blue-600" />
              <span>Progress Tracking & Analytics</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              All your RRB NTPC practice sessions are automatically stored in your browser's LocalStorage.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Keyboard className="w-4 h-4" />
              <span>Take New Test</span>
            </Link>

            <button
              type="button"
              onClick={handleExport}
              disabled={history.length === 0}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 disabled:opacity-50 transition-colors shadow-sm"
              title="Download your full test history as a JSON file backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors shadow-sm">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center space-x-1 px-2.5 py-2 rounded-lg font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
                title="Clear all saved history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Analytics Charts & KPI Cards */}
        {analytics && <ProgressCharts history={history} analytics={analytics} />}

        {/* Test History Log Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Detailed Test Log ({history.length} Attempts)
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click "View Breakdown" to inspect any past test's word-by-word error analysis.
              </span>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search passages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none w-44"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All Results</option>
                <option value="pass">Only Passed (≥30 WPM)</option>
                <option value="fail">Only Failed (&lt;30 WPM)</option>
              </select>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching test attempts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Passage Title</th>
                    <th className="py-3 px-4 text-center">Duration</th>
                    <th className="py-3 px-4 text-center">Net WPM</th>
                    <th className="py-3 px-4 text-center">Gross WPM</th>
                    <th className="py-3 px-4 text-center">Accuracy</th>
                    <th className="py-3 px-4 text-center">Total Mistakes</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHistory.map((item) => {
                    const r = item.result;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {item.dateFormatted}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.passageTitle}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {item.passageCategory} • {r.totalWordsTyped} words
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                          {item.durationMinutes}m
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                          <span
                            className={
                              r.isPass
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }
                          >
                            {r.netWpm}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-700 dark:text-slate-300">
                          {r.grossWpm}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-700 dark:text-slate-300">
                          {r.accuracy}%
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-700 dark:text-slate-300">
                          {r.totalMistakes.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              r.isPass
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {r.isPass ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {r.isPass ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedAttempt(item)}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors inline-flex items-center gap-1"
                            title="View word-by-word error breakdown"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Breakdown</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal to view a past test attempt's full breakdown */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-5xl w-full my-8 relative">
            <button
              type="button"
              onClick={() => setSelectedAttempt(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-lg"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <ResultModal
              result={selectedAttempt.result}
              onRetake={() => {
                setSelectedAttempt(null);
                window.location.href = '/';
              }}
              onNextTest={() => {
                setSelectedAttempt(null);
                window.location.href = '/';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
