import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RRB NTPC Typing Test Practice | TCS iON Exam Simulator & Analytics',
  description:
    'Free online RRB NTPC Computer Based Typing Skill Test (CBTST) simulator with official 5% relaxation calculation formula, backspace toggle, progress tracking, and detailed error breakdown.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
