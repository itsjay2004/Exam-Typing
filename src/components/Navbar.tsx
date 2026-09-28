'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Keyboard, BarChart2, BookOpen, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Exam Simulator', icon: Keyboard },
    { href: '/history', label: 'Progress & Analytics', icon: BarChart2 },
    { href: '/passages', label: 'Passage Bank', icon: BookOpen },
  ];

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Keyboard className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  RRB NTPC <span className="text-blue-400 font-semibold text-xs px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-800">CBTST</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">TCS iON Pattern Typing Simulator</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Target: 30 WPM | 5% Relaxed</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
