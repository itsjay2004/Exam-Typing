# RRB NTPC Typing Test Practice Platform (CBTST)

A specialized Next.js typing practice and progress tracking application built for candidates preparing for the **Railway Recruitment Board (RRB) NTPC Computer Based Typing Skill Test (CBTST)** on the official **TCS iON** exam pattern.

---

## 1. Core Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API oscillator synthesizer (zero external network latency, offline-ready mechanical keystroke clicks)
- **Data Persistence**: `localStorage` (client-side, zero login required, 100% private, Vercel-ready with JSON export/import backup)
- **Deployment**: Static & serverless ready for Vercel with zero database configuration.

---

## 2. Official RRB NTPC Calculation Formula

The engine in `src/lib/ntpcEngine.ts` implements the exact evaluation logic:

1. **Word Definition**: $1 \text{ Word} = 5 \text{ Keystrokes}$ (including spaces).
   $$\text{Total Words Typed} = \text{round}\left(\frac{\text{Typed Keystrokes}}{5}\right)$$
2. **Mistake Classification**:
   - **Full Mistakes ($1.0$ penalty)**:
     - Spelling / Substitution (typos, wrong words)
     - Extra Words (words typed not present in passage)
     - Omission (words skipped *inside* text; trailing un-typed words at the end do *not* count as omissions)
   - **Half Mistakes ($0.5$ penalty)**:
     - Capitalization (e.g., `indian` vs `Indian`)
     - Punctuation (e.g., `years` vs `years,`)
     - Spacing Errors (joined words like `everyday` or split words like `micro wave`)
   $$\text{Total Mistakes} = \text{Full Mistakes} + \frac{\text{Half Mistakes}}{2}$$
3. **The 5% Error Relaxation**:
   $$\text{Allowed Mistakes} = 5\% \times \text{Total Words Typed}$$
   $$\text{Penalized Mistakes} = \max(0, \text{Total Mistakes} - \text{Allowed Mistakes})$$
4. **10x Penalty Deduction**:
   $$\text{Penalty Words} = \text{Penalized Mistakes} \times 10$$
   $$\text{Net Speed (WPM)} = \max\left(0, \frac{\text{Total Words} - \text{Penalty Words}}{\text{Time in Minutes}}\right)$$
5. **Qualifying Benchmark**:
   - Net Speed $\ge 30.0\text{ WPM}$
   - Total Words Typed $\ge 300\text{ words}$ (for standard 10-minute test)
   - Both met $\rightarrow$ **PASS** (Green); otherwise $\rightarrow$ **FAIL** (Red).

---

## 3. Route & Page Structure

| Route | File Location | Purpose |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | **Tests Catalog & Dashboard**: Lists all available tests as cards. Displays status (Pass/Fail), Net WPM, accuracy, mistakes, and attempts count for attempted tests, with **"Attempt"** / **"Re-attempt"** and **"View Last Result"** buttons. |
| `/test/[id]` | `src/app/test/[id]/page.tsx` | **Dedicated Exam Simulator**: Clean, focused test interface with timer, passage box, typing textarea, backspace blocker, font slider, and the full diagnostic result screen on completion. |
| `/history` | `src/app/history/page.tsx` | **Progress & Analytics**: Interactive SVG trend charts (Net WPM vs. Gross WPM with 30 WPM cutoff line), mistake category breakdown, full test history table, and JSON export/import. |
| `/passages` | `src/app/passages/page.tsx` | **Passage Bank**: Catalog of official practice passages with category filters and word counts. |

---

## 4. Key Components & Modules

- **`src/lib/ntpcEngine.ts`**: Dynamic programming (DP) word alignment algorithm with Levenshtein edit distance, omission/extra post-processing, spacing error detection, and official NTPC formula evaluation.
- **`src/lib/passages.ts`**: Central registry of test passages (`DEFAULT_PASSAGES`) and custom passage helpers.
- **`src/lib/storage.ts`**: LocalStorage helper managing `TestAttempt[]`, user preferences (font size, sound, dark mode, backspace toggle, duration), aggregate analytics, and `getPassageStatsMap()`.
- **`src/lib/sound.ts`**: Web Audio API mechanical typewriter sound synthesizer.
- **`src/components/ExamHeader.tsx`**: TCS iON-styled exam header with timer, text size slider, backspace toggle, sound toggle, duration selector, and candidate badge.
- **`src/components/TypingArea.tsx`**: Read-only passage reader and candidate typing textarea with backspace interception, paste prevention, and auto-looping passage detection.
- **`src/components/ResultModal.tsx`**: Modernized diagnostic report showing Pass/Fail status, headline KPI cards, step-by-step formula math, smart AI coaching advice, category-filtered error explorer, and side-by-side passage visualizer.
- **`src/components/ProgressCharts.tsx`**: Responsive SVG charts tracking speed progression and mistake distributions.
- **`src/components/Navbar.tsx`**: Top navigation header linking Tests Catalog, Progress & Analytics, and Passage Bank.

---

## 5. Content Management (How to Add / Modify Passages)

Passages are stored directly in code in [`src/lib/passages.ts`](src/lib/passages.ts) under the `DEFAULT_PASSAGES` array.

### To Add a New Passage:
Open `src/lib/passages.ts` and append an entry to `DEFAULT_PASSAGES`:

```typescript
{
  id: 'test-09',
  title: 'Test Set #09: Indian Semiconductor Mission',
  category: 'Technology',
  wordCount: 335,
  text: `Your passage text goes here...`,
}
```

- When you push to GitHub, Vercel will automatically generate static pages (`/test/test-09`), add the test card to the homepage catalog, and make it universally accessible to all users.
- Users can also create temporary/practice custom passages directly from the UI via the **"+ Add Custom Passage"** button, which stores them in their browser's LocalStorage.

---

## 6. Key Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build check & static page generation
npm run build

# Run production server
npm run start
```
