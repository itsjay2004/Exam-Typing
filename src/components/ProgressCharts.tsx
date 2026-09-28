'use client';

import React, { useState } from 'react';
import { TestAttempt, AnalyticsSummary } from '../lib/storage';
import { TrendingUp, Target, Award, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

interface ProgressChartsProps {
  history: TestAttempt[];
  analytics: AnalyticsSummary;
}

export default function ProgressCharts({ history, analytics }: ProgressChartsProps) {
  const [hoveredAttempt, setHoveredAttempt] = useState<TestAttempt | null>(null);

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
        <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
          No Test Attempts Yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Take your first RRB NTPC typing practice test on the simulator to start tracking your WPM, accuracy, and mistake patterns over time.
        </p>
      </div>
    );
  }

  // Reverse chronological to chronological for trend line
  const chronological = [...history].reverse();
  const maxWpm = Math.max(50, ...chronological.map((h) => Math.max(h.result.grossWpm, h.result.netWpm) + 5));

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Compute points for Net WPM and Gross WPM
  const pointsCount = chronological.length;
  const getX = (index: number) => {
    if (pointsCount === 1) return paddingX + graphWidth / 2;
    return paddingX + (index / (pointsCount - 1)) * graphWidth;
  };

  const getY = (wpm: number) => {
    const clamped = Math.max(0, Math.min(maxWpm, wpm));
    return svgHeight - paddingY - (clamped / maxWpm) * graphHeight;
  };

  const netWpmPath = chronological
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.result.netWpm)}`)
    .join(' ');

  const grossWpmPath = chronological
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.result.grossWpm)}`)
    .join(' ');

  const target30Y = getY(30);

  // Error category breakdown totals
  const totalErrors =
    analytics.errorCategoryTotals.spelling +
    analytics.errorCategoryTotals.capitalization +
    analytics.errorCategoryTotals.punctuation +
    analytics.errorCategoryTotals.spacing +
    analytics.errorCategoryTotals.omissions +
    analytics.errorCategoryTotals.extra;

  const errorCategories = [
    {
      name: 'Spelling / Typo',
      count: analytics.errorCategoryTotals.spelling,
      color: '#FF9999',
      kind: 'Full',
    },
    {
      name: 'Punctuation',
      count: analytics.errorCategoryTotals.punctuation,
      color: '#DDA0DD',
      kind: 'Half',
    },
    {
      name: 'Capitalization',
      count: analytics.errorCategoryTotals.capitalization,
      color: '#FFFF99',
      kind: 'Half',
    },
    {
      name: 'Spacing Error',
      count: analytics.errorCategoryTotals.spacing,
      color: '#FFA500',
      kind: 'Half',
    },
    {
      name: 'Omission (Skipped)',
      count: analytics.errorCategoryTotals.omissions,
      color: '#00FFFF',
      kind: 'Full',
    },
    {
      name: 'Extra Words',
      count: analytics.errorCategoryTotals.extra,
      color: '#FFC1CC',
      kind: 'Full',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">
              Best Net Speed
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {analytics.bestNetWpm} <span className="text-xs font-sans font-medium text-slate-500">WPM</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">
              Average Net Speed
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {analytics.averageNetWpm} <span className="text-xs font-sans font-medium text-slate-500">WPM</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">
              Average Accuracy
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
              {analytics.averageAccuracy}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">
              NTPC Pass Rate
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {analytics.passRate}%{' '}
              <span className="text-xs font-sans font-medium text-slate-500">
                ({analytics.passedTests}/{analytics.totalTests})
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Speed Progression Trend Line Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Net Speed vs. Gross Speed Progression</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track how your speed improves across attempts with the 30 WPM qualifying cutoff.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 inline-block"></span>
              <span className="text-slate-600 dark:text-slate-300">Net WPM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-blue-500 inline-block"></span>
              <span className="text-slate-600 dark:text-slate-300">Gross WPM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 border-b-2 border-dashed border-rose-500 inline-block"></span>
              <span className="text-rose-600 dark:text-rose-400 font-medium">30 WPM Floor</span>
            </div>
          </div>
        </div>

        {/* SVG Chart Area */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-56 select-none overflow-visible"
            >
              {/* Grid Lines */}
              {[0, 15, 30, 45, 60].map((val) => {
                if (val > maxWpm) return null;
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeDasharray={val === 30 ? '4 4' : 'none'}
                      className={val === 30 ? 'text-rose-500' : 'text-slate-400'}
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      className="fill-slate-400 font-mono"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* 30 WPM Benchmark Line Label */}
              <text
                x={svgWidth - paddingX + 5}
                y={target30Y + 3}
                fontSize="10"
                className="fill-rose-500 font-bold"
              >
                30 Cutoff
              </text>

              {/* Gross WPM Path */}
              <path
                d={grossWpmPath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeOpacity="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Net WPM Path */}
              <path
                d={netWpmPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chronological.map((h, i) => {
                const cx = getX(i);
                const cy = getY(h.result.netWpm);
                const isPass = h.result.isPass;
                return (
                  <g
                    key={h.id}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredAttempt(h)}
                    onMouseLeave={() => setHoveredAttempt(null)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={hoveredAttempt?.id === h.id ? 6 : 4}
                      fill={isPass ? '#10B981' : '#EF4444'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all"
                    />
                    <circle
                      cx={cx}
                      cy={getY(h.result.grossWpm)}
                      r={3}
                      fill="#3B82F6"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredAttempt && (
              <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 pointer-events-none z-10 font-sans">
                <div className="font-bold text-slate-200">
                  {hoveredAttempt.passageTitle}
                </div>
                <div className="text-[11px] text-slate-400 mb-1">
                  {hoveredAttempt.dateFormatted}
                </div>
                <div className="flex gap-3 text-xs mt-1">
                  <div>
                    Net: <strong className="text-emerald-400 font-mono">{hoveredAttempt.result.netWpm} WPM</strong>
                  </div>
                  <div>
                    Gross: <strong className="text-blue-400 font-mono">{hoveredAttempt.result.grossWpm} WPM</strong>
                  </div>
                  <div>
                    Mistakes: <strong className="text-rose-400 font-mono">{hoveredAttempt.result.totalMistakes}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mistake Distribution Analysis */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Mistake Distribution Breakdown
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Identifies which error categories reduce your net score the most across all {history.length} tests taken.
        </p>

        {totalErrors === 0 ? (
          <p className="text-xs text-slate-400 italic">No errors recorded yet!</p>
        ) : (
          <div className="space-y-3">
            {errorCategories.map((cat) => {
              const pct = totalErrors > 0 ? ((cat.count / totalErrors) * 100).toFixed(1) : '0';
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: cat.color }}></span>
                      {cat.name}
                      <span className="text-[10px] text-slate-400">({cat.kind} Mistake)</span>
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      <strong>{cat.count}</strong> errors ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color === '#FFFF99' ? '#EAB308' : cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
