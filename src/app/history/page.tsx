'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getTestHistory,
  calculateAnalytics,
  deleteTestAttempt,
  clearAllAppData,
  exportHistoryAsJson,
  importHistoryFromJson,
  TestAttempt,
  AnalyticsSummary,
} from '../../lib/storage';
import ProgressCharts from '../../components/ProgressCharts';
import ResultModal from '../../components/ResultModal';
import {
  Activity, ArrowDownToLine, ArrowUpFromLine, Check, Clock3, Eye,
  Keyboard, Search, Trash2, X,
} from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail'>('all');

  const loadData = () => {
    const list = getTestHistory();
    setHistory(list);
    setAnalytics(calculateAnalytics(list));
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this test record from your history?')) {
      deleteTestAttempt(id);
      loadData();
    }
  };

  const handleResetAllData = () => {
    if (confirm('Reset all app data? This permanently deletes test history, custom passages, saved settings, and the theme preference. This cannot be undone.')) {
      clearAllAppData();
      window.location.reload();
    }
  };

  const handleExport = () => {
    const blob = new Blob([exportHistoryAsJson()], { type: 'application/json' });
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
        if (importHistoryFromJson(content)) {
          alert('History imported successfully!');
          loadData();
        } else alert('Failed to parse history JSON file.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.passageTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'pass' ? item.result.isPass : !item.result.isPass);
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 space-y-7">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-emerald-50/90 dark:from-emerald-950/30 to-transparent pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 p-6 sm:p-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs font-bold tracking-wide mb-4">
                <Activity className="w-3.5 h-3.5" /> YOUR PRACTICE, OVER TIME
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">Progress that adds up.</h1>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">Review your speed, accuracy, and qualification trend across every RRB NTPC practice session.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/practice" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-emerald-700/20 transition-colors">
                <Keyboard className="w-4 h-4" /> Practice now
              </Link>
              <button type="button" onClick={handleExport} disabled={!history.length} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors" title="Download your history backup">
                <ArrowDownToLine className="w-4 h-4" /> Export
              </button>
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                <ArrowUpFromLine className="w-4 h-4" /> Import
                <input type="file" accept=".json,application/json" onChange={handleImport} className="sr-only" />
              </label>
              <button type="button" onClick={handleResetAllData} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Delete all saved app data and restore defaults">
                <Trash2 className="w-4 h-4" /><span className="hidden sm:inline">Reset data</span>
              </button>
            </div>
          </div>
          <div className="relative grid grid-cols-2 sm:grid-cols-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/30">
            <div className="px-6 py-3.5"><span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">Saved attempts</span><span className="mt-1 block text-sm font-bold text-slate-800 dark:text-slate-200">{history.length} {history.length === 1 ? 'session' : 'sessions'}</span></div>
            <div className="px-6 py-3.5 border-l border-slate-100 dark:border-slate-800"><span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">Qualified</span><span className="mt-1 block text-sm font-bold text-emerald-600 dark:text-emerald-400">{analytics?.passedTests ?? 0} passed</span></div>
            <div className="hidden sm:block px-6 py-3.5 border-l border-slate-100 dark:border-slate-800"><span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">Stored on</span><span className="mt-1 block text-sm font-bold text-slate-700 dark:text-slate-300">This browser</span></div>
          </div>
        </section>

        {analytics && <ProgressCharts history={history} analytics={analytics} />}

        <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-lg font-bold text-slate-900 dark:text-white">Test history</h2><span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{filteredHistory.length} of {history.length}</span></div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">Open a breakdown to inspect the result of any attempt.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="search" placeholder="Search test sets…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 placeholder:text-slate-400" />
              </div>
              <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-1" role="group" aria-label="Filter results">
                {(['all', 'pass', 'fail'] as const).map((status) => <button key={status} type="button" onClick={() => setFilterStatus(status)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${filterStatus === status ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>{status === 'all' ? 'All' : status === 'pass' ? 'Passed' : 'Failed'}</button>)}
              </div>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400"><Search className="w-5 h-5" /></div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{history.length ? 'No matching attempts' : 'Your attempts will appear here'}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{history.length ? 'Try another search or result filter.' : 'Complete a typing test to start building your progress history.'}</p>
              {!history.length && <Link href="/practice" className="inline-flex mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Start a practice test</Link>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <tr>{['Test set', 'Date', 'Time', 'Net WPM', 'Gross WPM', 'Accuracy', 'Mistakes', 'Result', ''].map((heading, i) => <th key={heading || i} className={`px-4 py-3 font-bold ${i > 1 ? 'text-center' : ''} ${i === 8 ? 'text-right' : ''}`}>{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHistory.map((item) => {
                    const r = item.result;
                    return <tr key={item.id} className="group hover:bg-emerald-50/50 dark:hover:bg-emerald-950/15 transition-colors">
                      <td className="px-4 py-4 max-w-[290px]"><div className="truncate font-semibold text-slate-800 dark:text-slate-200" title={item.passageTitle}>{item.passageTitle}</div><span className="text-xs text-slate-400">{r.totalWordsTyped} words typed</span></td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{item.dateFormatted}</td>
                      <td className="px-4 py-4 text-center text-xs text-slate-500 dark:text-slate-400">{item.durationMinutes}m</td>
                      <td className="px-4 py-4 text-center"><span className={`font-mono text-base font-extrabold ${r.isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>{r.netWpm}</span></td>
                      <td className="px-4 py-4 text-center font-mono text-slate-600 dark:text-slate-300">{r.grossWpm}</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-600 dark:text-slate-300">{r.accuracy}%</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-600 dark:text-slate-300">{r.totalMistakes.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${r.isPass ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'}`}>{r.isPass ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}{r.isPass ? 'PASS' : 'FAIL'}</span></td>
                      <td className="px-4 py-4 text-right whitespace-nowrap"><button type="button" onClick={() => setSelectedAttempt(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors" title="View word-by-word error breakdown"><Eye className="w-3.5 h-3.5" /><span>Breakdown</span></button><button type="button" onClick={() => handleDelete(item.id)} className="ml-1.5 rounded-lg p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" title="Delete attempt"><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <p className="text-center text-xs text-slate-400 dark:text-slate-600">Your practice history is saved locally in this browser.</p>
      </div>

      {selectedAttempt && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setSelectedAttempt(null); }}>
        <div className="min-h-full flex items-start justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-5xl my-2 sm:my-6">
            <button type="button" onClick={() => setSelectedAttempt(null)} className="absolute -top-1 -right-1 sm:top-3 sm:right-3 z-20 rounded-full bg-slate-900/90 p-2 text-white shadow-lg hover:bg-slate-700" aria-label="Close result breakdown"><X className="w-5 h-5" /></button>
            <ResultModal result={selectedAttempt.result} onRetake={() => { setSelectedAttempt(null); window.location.href = '/practice'; }} onNextTest={() => { setSelectedAttempt(null); window.location.href = '/practice'; }} />
          </div>
        </div>
      </div>}
    </main>
  );
}
