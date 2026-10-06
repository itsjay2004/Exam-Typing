import Link from 'next/link';
import { ArrowRight, Award, BarChart3, Check, Clock3, Keyboard, ShieldCheck, Sparkles, Target, Zap, ExternalLink } from 'lucide-react';

const benefits = [
  { icon: Target, title: 'Practice with a purpose', text: 'Work through English passages in a focused RRB NTPC CBTST practice session.' },
  { icon: BarChart3, title: 'Understand each score', text: 'Review net WPM, gross WPM, accuracy, and the mistakes behind your result.' },
  { icon: Clock3, title: 'Build timed-test routine', text: 'Use timed sessions to build steady pace and accuracy under a clock.' },
  { icon: ShieldCheck, title: 'Keep track of practice', text: 'Your attempts and progress stay in this browser, with no account required.' },
];

const comparison = [
  { name: 'KeySprint (placeholder)', href: null, summary: 'A focused browser-based practice tool for RRB NTPC English CBTST, with a transparent scoring breakdown and local attempt history.' },
  { name: 'Soni Typing Tutor', href: 'https://www.sonitypingtutor.com/', summary: 'Downloadable typing tutor covering English, Hindi, Marathi, and Punjabi, with a large exercise and test library.' },
  { name: 'TypingWale', href: 'https://www.typingwale.com/exams/rrb-ntpc-typing-test', summary: 'A broad government-exam platform spanning 36+ exam variants and three languages; it describes exam-specific interfaces and scoring.' },
  { name: 'AdityaTyping', href: 'https://www.adityatyping.online/tests/rrb-ntpc-typing-test/', summary: 'Lists 100 RRB NTPC tests, English and Hindi options, plus custom practice.' },
  { name: 'EzTyping', href: 'https://eztyping.com/category/rrb-ntpc-typing-test/', summary: 'Offers an RRB NTPC practice category within a wider government-exam typing platform.' },
];

export default function HomePage() {
  return (
    <main className="marketing-page">
      <section className="marketing-hero">
        <div className="marketing-container hero-grid">
          <div className="hero-copy">
            <div className="marketing-eyebrow"><span className="eyebrow-dot" /> INDEPENDENT RRB NTPC CBTST PRACTICE</div>
            <h1>Prepare for the test with a score you can <em>understand.</em></h1>
            <p className="hero-description">Practice English typing in a clear, exam-style screen. See how your net WPM is calculated, review your errors, and use each attempt to guide the next one.</p>
            <div className="hero-actions">
              <Link href="/practice" className="button-primary">Start practicing <ArrowRight size={17} /></Link>
              <Link href="#how-it-works" className="button-secondary">See how it works</Link>
            </div>
            <div className="hero-trust"><span><Check size={15} /> NTPC-focused English practice</span><span><Check size={15} /> No account needed</span></div>
          </div>
          <div className="hero-visual" aria-label="Typing practice result preview">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="practice-card">
              <div className="practice-card-top"><span className="practice-brand"><Keyboard size={16} /> CBTST PRACTICE</span><span className="live-pill"><i /> PRACTICE</span></div>
              <div className="practice-title">Illustrative result preview</div>
              <div className="practice-passage">The progress of a nation depends on the dedication, discipline and hard work of its people. Every opportunity to learn helps build a stronger future.</div>
              <div className="practice-divider" />
              <div className="practice-metrics"><div><strong>32.4</strong><span>NET WPM</span></div><div><strong>96<span>%</span></strong><span>ACCURACY</span></div><div><strong>08:42</strong><span>TIME LEFT</span></div></div>
              <div className="practice-progress"><span /></div>
              <div className="practice-card-footer"><span><Sparkles size={14} /> Example only</span><span>Review every attempt</span></div>
            </div>
            <div className="floating-note"><span className="note-icon"><Award size={17} /></span><span><b>Build consistency</b><small>One session at a time</small></span></div>
            <div className="hero-stamp"><span>RRB</span><small>NTPC<br/>READY</small></div>
          </div>
        </div>
        <div className="hero-bottom"><div className="marketing-container hero-bottom-inner"><span>ONE EXAM · CLEAR PRACTICE</span><div><span>RRB NTPC</span><i /> <span>CBTST FORMAT</span><i /> <span>ENGLISH TYPING</span></div></div></div>
      </section>

      <section className="ntpc-overview-section" id="ntpc-overview">
        <div className="marketing-container ntpc-overview-card">
          <div className="ntpc-overview-copy">
            <div className="section-label">The exam, at a glance</div>
            <h2>RRB NTPC <em>CBTST</em></h2>
            <p>The Computer Based Typing Skill Test is qualifying in nature. This practice tool currently focuses on the English typing option and its published speed and error-scoring rules.</p>
            <a className="official-rules-link" href="https://www.rrbcdg.gov.in/uploads/2024/06-NTPCUG/062024NTPCUG-CBTST_Instructions.pdf" target="_blank" rel="noreferrer">Read the RRB instructions <ExternalLink size={14} /></a>
          </div>
          <div className="ntpc-facts">
            <div><strong>30 WPM</strong><span>English qualifying speed</span></div>
            <div><strong>10 min</strong><span>Evaluated typing time</span></div>
            <div><strong>300 words</strong><span>Minimum words typed in English</span></div>
            <div><strong>5% buffer</strong><span>Allowed before deductions</span></div>
          </div>
          <div className="ntpc-rule-note"><Check size={16} /><span>For practice scoring, half mistakes count as 0.5; mistakes beyond the 5% allowance deduct 10 words each from the net-speed calculation.</span></div>
          <div className="ntpc-card-action"><span>See how your own attempt measures up.</span><Link href="/practice" className="button-primary">Go to NTPC practice <ArrowRight size={16} /></Link></div>
          <p className="ntpc-disclaimer">Independent practice only. This is not an official RRB or TCS iON service; current recruitment notices take precedence.</p>
        </div>
      </section>

      <section className="section-intro marketing-container" id="how-it-works">
        <div className="section-label">A clearer way to prepare</div><h2>Practice. Review. <em>Improve.</em></h2>
        <p>Each session ends with a transparent breakdown of speed, accuracy, and the mistakes that affected your score.</p>
      </section>

      <section className="comparison-section" id="compare">
        <div className="marketing-container">
          <div className="section-intro comparison-intro"><div className="section-label">Compare practice options</div><h2>Different tools suit <em>different routines.</em></h2><p>Some platforms cover many exams or languages. KeySprint is designed around one use case: RRB NTPC English typing practice.</p></div>
          <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>Platform</th><th>Publicly listed focus</th></tr></thead><tbody>{comparison.map((item) => <tr key={item.name}><th scope="row">{item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.name} <ExternalLink size={12} /></a> : <span className="comparison-current">{item.name}</span>}</th><td>{item.summary}</td></tr>)}</tbody></table></div>
          <p className="comparison-note">Descriptions summarize each provider’s public product pages and may change. They are not independent product reviews; check each provider for current features and plans.</p>
        </div>
      </section>

      <section className="feature-grid marketing-container" id="features">
        {benefits.map(({ icon: Icon, title, text }, index) => <article className="feature-card" key={title}><div className={`feature-icon tone-${index}`}><Icon size={21} /></div><h3>{title}</h3><p>{text}</p><span className="feature-number">0{index + 1}</span></article>)}
      </section>

      <section className="exam-section" id="exam">
        <div className="marketing-container exam-grid"><div><div className="section-label">One goal, focused practice</div><h2>Made for the <em>RRB NTPC</em> typing test.</h2><p>Stay focused on the English typing skill test with practice passages, configurable session duration, and a detailed report when you finish.</p><ul className="check-list"><li><Check size={17} /> Timed typing sessions</li><li><Check size={17} /> Net speed and accuracy feedback</li><li><Check size={17} /> Mistake categories and passage review</li><li><Check size={17} /> Personal practice history on your device</li></ul><Link href="/practice" className="text-link">Explore practice tests <ArrowRight size={16} /></Link></div>
          <div className="exam-summary"><div className="summary-head"><span className="summary-mark"><Keyboard size={18} /></span><div><b>RRB NTPC CBTST</b><small>English typing practice</small></div><span className="summary-tag">FOCUSED</span></div><div className="summary-body"><div className="summary-row"><span>Practice mode</span><b>Timed session</b></div><div className="summary-row"><span>Result review</span><b>Speed · accuracy · errors</b></div><div className="summary-row"><span>Progress history</span><b>Saved in this browser</b></div></div><div className="summary-note"><Zap size={16} /> Finish a session to get your detailed report.</div></div>
        </div>
      </section>

      <section className="pricing-section" id="pricing"><div className="marketing-container">
        <div className="section-intro pricing-intro"><div className="section-label">Simple early access pricing</div><h2>Pick your practice <em>plan.</em></h2><p>Choose the access period that fits your preparation schedule.</p></div>
        <div className="pricing-grid">
          <article className="price-card"><div className="plan-name">1 MONTH</div><div className="price"><span>₹</span>79<small>/ month</small></div><p>For a focused month of regular practice.</p><ul><li><Check size={16}/> RRB NTPC typing practice</li><li><Check size={16}/> Timed sessions and result reports</li><li><Check size={16}/> Practice history on your device</li></ul><Link href="/signup" className="button-price">Choose monthly</Link></article>
          <article className="price-card featured-price"><div className="popular-badge">BEST VALUE</div><div className="plan-name">3 MONTHS</div><div className="price"><span>₹</span>149<small>/ 3 months</small></div><p>More time to build a consistent routine.</p><ul><li><Check size={16}/> RRB NTPC typing practice</li><li><Check size={16}/> Timed sessions and result reports</li><li><Check size={16}/> Practice history on your device</li></ul><Link href="/signup" className="button-primary price-cta">Choose 3 months <ArrowRight size={16}/></Link><div className="price-footnote">About ₹50 per month</div></article>
        </div><p className="pricing-note">Plans are displayed for launch planning. Account creation and payment are not available yet.</p>
      </div></section>

      <section className="final-cta"><div className="marketing-container final-cta-inner"><div><div className="section-label">Your next session starts here</div><h2>Put your practice into motion.</h2><p>Try a typing test and see what your next focused session can teach you.</p></div><Link href="/practice" className="button-light">Start practicing <ArrowRight size={17}/></Link></div></section>
    </main>
  );
}
