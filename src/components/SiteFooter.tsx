'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Keyboard } from 'lucide-react';

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/test/')) return null;

  return (
    <footer className="marketing-footer">
      <div className="marketing-container footer-main">
        <Link href="/" className="footer-brand">
          <span className="footer-brand-mark"><Keyboard size={18} /></span>
          <span><b>KeySprint <span className="brand-placeholder">placeholder</span></b><small>Focused RRB NTPC typing practice</small></span>
        </Link>
        <div className="footer-links">
          <Link href="/about">About</Link><Link href="/contact">Contact</Link>
          <Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link>
          <Link href="/login">Log in</Link><Link href="/signup">Sign up</Link>
        </div>
      </div>
      <div className="marketing-container footer-bottom">
        <span>© {new Date().getFullYear()} KeySprint. All rights reserved.</span>
        <span>Independent practice tool. Not affiliated with RRB or TCS iON.</span>
      </div>
    </footer>
  );
}
