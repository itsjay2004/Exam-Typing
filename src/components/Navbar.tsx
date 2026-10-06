'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Keyboard, Home as HomeIcon, BarChart2, Sun, Moon, Sparkles, Tags } from 'lucide-react';
import { saveStoredSettings } from '../lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (pathname.startsWith('/test/')) return;
    const savedTheme = window.localStorage.getItem('cbtst-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    window.localStorage.setItem('cbtst-theme', nextTheme);
    saveStoredSettings({ darkMode: nextTheme === 'dark' });
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/practice', label: 'Practice', icon: Keyboard },
    { href: '/history', label: 'Progress', icon: BarChart2 },
    { href: '/#features', label: 'Features', icon: Sparkles },
    { href: '/#pricing', label: 'Pricing', icon: Tags },
  ];

  if (pathname.startsWith('/test/')) return null;

  return (
    <nav className="site-nav sticky top-0 z-50 text-slate-900">
      <div className="nav-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="KeySprint home">
          <span className="brand-icon flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Keyboard className="w-5 h-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="brand-name font-bold tracking-tight text-[15px] text-slate-900 flex items-center gap-1.5">
              KeySprint <span title="Placeholder brand name" className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">TEMP</span>
            </span>
            <span className="brand-subtitle text-[10px] text-slate-500 mt-1">RRB NTPC typing practice</span>
          </span>
        </Link>

        <div className="nav-items flex items-center gap-1 sm:gap-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const route = href.split('#')[0];
            const isActive = pathname === route && (route !== '/' || href === '/');
            return (
              <Link key={href} href={href} aria-current={isActive ? 'page' : undefined}
                className={`nav-link flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${isActive ? 'active' : ''}`}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/login" className="nav-auth-link">Log in</Link>
          <Link href="/signup" className="nav-signup-link">Sign up</Link>
          <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
