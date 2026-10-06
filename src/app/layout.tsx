import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KeySprint | RRB NTPC CBTST Typing Practice',
  description:
    'Prepare for the RRB NTPC English typing skill test with timed practice, instant result breakdowns, and personal progress tracking.',
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
        <SiteFooter />
      </body>
    </html>
  );
}
