'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TestAttempt, AnalyticsSummary } from '../lib/storage';
import { Activity, Award, BarChart3, CheckCircle2, Gauge, Target, TrendingUp } from 'lucide-react';

interface ProgressChartsProps {
  history: TestAttempt[];
  analytics: AnalyticsSummary;
}

const panelClass = 'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm';

export default function ProgressCharts({ history, analytics }: ProgressChartsProps) {
  const [hoveredAttempt, setHoveredAttempt] = useState<TestAttempt | null>(null);

  if (history.length === 0) {
    return <section className={`${panelClass} overflow-hidden`}>
      <div className="grid lg:grid-cols-[1fr_auto] items-center gap-8 p-7 sm:p-9 bg-gradient-to-br from-white via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
        <div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mb-5"><TrendingUp className="w-6 h-6" /></div><p className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">Your dashboard starts here</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Make your next practice count.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">After your first test, this space will show your typing speed, accuracy, pass rate, and the mistake patterns to focus on.</p></div>
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"><Activity className="w-4 h-4" /> Start your first test</Link>
      </div>
    </section>;
  }

  const chronological = [...history].reverse().slice(-12);
  const maxWpm = Math.max(50, ...chronological.map((h) => Math.max(h.result.grossWpm, h.result.netWpm) + 5));
  const svgWidth = 900;
  const svgHeight = 270;
  const left = 46;
  const right = 32;
  const top = 24;
  const bottom = 28;
  const graphWidth = svgWidth - left - right;
  const graphHeight = svgHeight - top - bottom;
  const getX = (index: number) => chronological.length === 1 ? left + graphWidth / 2 : left + index / (chronological.length - 1) * graphWidth;
  const getY = (wpm: number) => svgHeight - bottom - Math.max(0, Math.min(maxWpm, wpm)) / maxWpm * graphHeight;
  const netPath = chronological.map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.result.netWpm)}`).join(' ');
  const grossPath = chronological.map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.result.grossWpm)}`).join(' ');
  const ticks = [0, 15, 30, 45, 60].filter((value) => value <= maxWpm);
  const targetY = getY(30);
  const passPct = Math.round(analytics.passRate);

  const errors = [
    { name: 'Spelling & typos', count: analytics.errorCategoryTotals.spelling, color: 'bg-blue-500' },
    { name: 'Punctuation', count: analytics.errorCategoryTotals.punctuation, color: 'bg-indigo-500' },
    { name: 'Capitalization', count: analytics.errorCategoryTotals.capitalization, color: 'bg-cyan-500' },
    { name: 'Spacing', count: analytics.errorCategoryTotals.spacing, color: 'bg-violet-500' },
    { name: 'Omissions', count: analytics.errorCategoryTotals.omissions, color: 'bg-amber-500' },
    { name: 'Extra words', count: analytics.errorCategoryTotals.extra, color: 'bg-rose-500' },
  ];
  const totalErrors = errors.reduce((sum, error) => sum + error.count, 0);
  const leadingError = [...errors].sort((a, b) => b.count - a.count)[0];

  const metrics = [
    { title: 'Practice sessions', value: `${analytics.totalTests}`, unit: 'tests', note: `${analytics.passedTests} passed · ${analytics.failedTests} below target`, icon: Activity, tone: 'blue' },
    { title: 'Average net speed', value: `${analytics.averageNetWpm}`, unit: 'WPM', note: `Personal best ${analytics.bestNetWpm} WPM`, icon: Gauge, tone: 'indigo' },
    { title: 'Average accuracy', value: `${analytics.averageAccuracy}`, unit: '%', note: `${analytics.averageMistakes} average mistakes per test`, icon: Target, tone: 'cyan' },
    { title: 'Qualification rate', value: `${passPct}`, unit: '%', note: `${analytics.passedTests} of ${analytics.totalTests} at 30+ net WPM`, icon: Award, tone: 'violet' },
  ];
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300',
    violet: 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300',
  };

  return <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {metrics.map((metric) => <article key={metric.title} className={`${panelClass} p-4 sm:p-5`}>
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{metric.title}</p><div className="mt-2 flex items-baseline gap-1.5"><strong className="text-3xl tracking-tight font-extrabold font-mono text-slate-900 dark:text-white">{metric.value}</strong><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{metric.unit}</span></div></div><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[metric.tone]}`}><metric.icon className="w-5 h-5" /></div></div>
        <p className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2.5 text-xs text-slate-500 dark:text-slate-400">{metric.note}</p>
      </article>)}
    </div>

    <section className={`${panelClass} overflow-hidden`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4">
        <div><div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /><h2 className="font-bold text-slate-900 dark:text-white">Speed over time</h2></div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Most recent {chronological.length} {chronological.length === 1 ? 'attempt' : 'attempts'} · qualification target is 30 net WPM</p></div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5"><i className="h-0.5 w-4 rounded bg-blue-500" />Gross WPM</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-0.5 w-4 rounded bg-cyan-500" />Net WPM</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-0 w-4 border-t-2 border-dashed border-rose-500" />30 WPM target</span>
        </div>
      </div>
      <div className="relative px-2 sm:px-5 pb-4">
        <div className="w-full overflow-x-auto"><svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="block w-full min-w-[540px] h-56 sm:h-64 overflow-visible" role="img" aria-label="Net and gross typing speed for the most recent tests">
          {ticks.map((value) => <g key={value}><line x1={left} y1={getY(value)} x2={svgWidth - right} y2={getY(value)} stroke="currentColor" strokeOpacity="0.12" strokeDasharray={value === 30 ? '5 5' : undefined} className={value === 30 ? 'text-rose-500' : 'text-slate-400'} /><text x={left - 10} y={getY(value) + 4} textAnchor="end" fontSize="11" className="fill-slate-400 font-mono">{value}</text></g>)}
          <text x={svgWidth - right} y={targetY - 7} textAnchor="end" fontSize="10" className="fill-rose-500 font-semibold">30 WPM</text>
          <path d={grossPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeOpacity="0.65" strokeLinecap="round" strokeLinejoin="round" />
          <path d={netPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {chronological.map((attempt, i) => <g key={attempt.id} onMouseEnter={() => setHoveredAttempt(attempt)} onMouseLeave={() => setHoveredAttempt(null)} className="cursor-pointer">
            <circle cx={getX(i)} cy={getY(attempt.result.grossWpm)} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
            <circle cx={getX(i)} cy={getY(attempt.result.netWpm)} r={hoveredAttempt?.id === attempt.id ? 7 : 5} fill={attempt.result.isPass ? '#06b6d4' : '#f43f5e'} stroke="white" strokeWidth="2" className="transition-all" />
            <circle cx={getX(i)} cy={getY(attempt.result.netWpm)} r="12" fill="transparent" />
            {(chronological.length <= 6 || i === 0 || i === chronological.length - 1 || i % Math.ceil(chronological.length / 5) === 0) && <text x={getX(i)} y={svgHeight - 5} textAnchor="middle" fontSize="9" className="fill-slate-400">{i + 1}</text>}
          </g>)}
        </svg></div>
        {hoveredAttempt && <div className="pointer-events-none absolute right-8 top-2 z-10 max-w-[min(320px,80vw)] rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-xs text-white shadow-xl"><p className="truncate font-bold">{hoveredAttempt.passageTitle}</p><p className="mt-0.5 text-slate-400">{hoveredAttempt.dateFormatted}</p><div className="mt-2 flex gap-3"><span>Net <b className="text-cyan-300">{hoveredAttempt.result.netWpm}</b></span><span>Gross <b className="text-blue-300">{hoveredAttempt.result.grossWpm}</b></span><span>Accuracy <b className="text-white">{hoveredAttempt.result.accuracy}%</b></span></div></div>}
      </div>
    </section>

    <section className={`${panelClass} p-5 sm:p-6`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5"><div><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-500" /><h2 className="font-bold text-slate-900 dark:text-white">Mistake patterns</h2></div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Combined across all {history.length} {history.length === 1 ? 'session' : 'sessions'}.</p></div>{totalErrors > 0 && <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">{totalErrors} total mistakes</span>}</div>
      {totalErrors === 0 ? <p className="rounded-xl bg-slate-50 dark:bg-slate-950 px-4 py-5 text-sm text-slate-500 dark:text-slate-400">No mistakes have been recorded in your saved sessions.</p> : <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-6 items-center">
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">{errors.map((error) => { const pct = (error.count / totalErrors) * 100; return <div key={error.name}><div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="font-medium text-slate-700 dark:text-slate-300">{error.name}</span><span className="font-mono text-slate-500 dark:text-slate-400">{error.count} <span className="text-slate-400">· {pct.toFixed(0)}%</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${error.color} transition-all duration-500`} style={{ width: `${pct}%` }} /></div></div>; })}</div>
        <aside className="rounded-xl border border-blue-100 dark:border-blue-900/70 bg-blue-50/70 dark:bg-blue-950/30 p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Focus area</p><p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{leadingError.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">This accounts for {((leadingError.count / totalErrors) * 100).toFixed(0)}% of your recorded mistakes. Watch for it in your next session.</p><div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300"><CheckCircle2 className="w-3.5 h-3.5" /> One focus at a time</div></aside>
      </div>}
    </section>
  </div>;
}
