# Chronos

> **Turn raw browser history into a clear, beautiful daily timeline.**

Chronos helps you explore your browsing activity as a clean, session-based timeline so you can quickly understand **where your time went, what you visited, and how your day unfolded**.

**Live demo:** [cyrusdavid.github.io/history-analyzer](https://cyrusdavid.github.io/history-analyzer/)

## Try It Now

* **Export your browser history** using [Export Chrome History](https://chromewebstore.google.com/detail/export-chrome-history/dihloblpkeiddiaojbagoecedbfpifdj)
* **Open Chronos:** [Launch the app](https://cyrusdavid.github.io/history-analyzer/)
* **Upload your CSV** to view your timeline

![Chronos screenshot](./Screenshot.jpg)

## Why Chronos?

Browser history is usually noisy, flat, and hard to scan.
Chronos transforms an exported browsing-history CSV into a readable experience that feels more like a product dashboard than a browser settings page.

With Chronos, you can:

* **See your day at a glance** with a chronological timeline
* **Group related visits into sessions** instead of scrolling through endless raw entries
* **Focus on signal over noise** with built-in domain exclusions
* **Jump between dates quickly** with URL-friendly navigation
* **Keep your data local** with browser-only processing and storage

---

## What It Does

Chronos takes a browser history export and turns it into:

* a **day-by-day timeline**
* grouped **sessions by domain**
* readable cards showing:

  * start time
  * end time
  * total duration
  * visited page titles

Instead of viewing hundreds of individual history rows, you get a structured story of your browsing activity.

---

## Core Features

### Fast CSV import

Drag and drop your exported history file, or use the file picker.

### Session-based timeline

Chronos groups adjacent visits from the same domain into short browsing sessions using a **15-minute threshold**.

### Date navigation

Browse activity by day and link directly to a specific date using the URL hash.

### Smart noise reduction

High-noise domains like YouTube, Facebook, ChatGPT, Gemini, and Reddit are excluded by default to keep the timeline focused.

### Local-first persistence

Your most recent uploaded CSV is stored in **IndexedDB**, so the app can restore it automatically on reload.

### Zero backend

Everything runs in the browser. No server. No account. No sync required.

---

## How It Works

Chronos processes your browser history in a few simple steps:

1. **Parse** rows from a browsing-history CSV
2. **Extract** the domain for each visited URL
3. **Filter** excluded domains
4. **Sort** visits chronologically
5. **Group** nearby visits from the same domain into sessions
6. **Render** the results as a clean daily timeline

A session is created when visits:

* belong to the **same domain**, and
* occur within **15 minutes** of one another

This makes the output much easier to scan than raw browser history.

---

## Who It’s For

Chronos is useful for:

* people reviewing their browsing habits
* researchers or analysts exploring browsing sessions
* productivity-minded users who want more context than standard browser history provides
* anyone who wants a more human-readable view of exported history data

---
## Privacy

Chronos is designed to run entirely in the browser.

* CSV parsing happens client-side
* timeline generation happens client-side
* uploaded data is stored locally in IndexedDB
* there is **no backend or server-side storage**

### Important notes

* timeline links are clickable and open the original URLs in a new tab
* uploaded CSV data remains in IndexedDB until cleared from the UI

---

## Current Limitations

Chronos is intentionally simple today. Current constraints include:

* session grouping is based only on **domain + 15-minute threshold**
* malformed dates rely on native `Date` parsing behavior
* excluded domains are hardcoded in `src/lib/parser.ts`
* data is browser-local and single-user
* there is no import wizard, schema validation flow, or export feature yet
* the interface is optimized for browsing activity, not deep analytics or reporting

---

## Product Direction

Potential future improvements could include:

* customizable exclusion rules
* adjustable session thresholds
* analytics and summaries
* search and filters
* exportable reports
* richer import validation

---

## Development

If you're working on Chronos locally, the standard development flow is:

```bash
npm install
npm run dev
```
