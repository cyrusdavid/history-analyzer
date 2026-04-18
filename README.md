# Chronos

Chronos is a browser-history timeline viewer. It takes an exported browsing history CSV and turns it into a day-by-day activity timeline grouped by domain and short browsing sessions.

![Chronos screenshot](./Screenshot.jpg)

## Features

- Drag-and-drop CSV upload with file picker fallback
- Automatic restore of the last uploaded CSV using IndexedDB
- Date-based navigation with deep-linkable URL hash state
- Session grouping by domain using a 15-minute threshold
- Clean timeline cards with start time, end time, duration, and visited page titles
- Domain exclusions for high-noise sources such as YouTube, Facebook, ChatGPT, Gemini, and Reddit

## How It Works

Chronos parses rows from a browser history CSV, extracts the domain for each URL, filters excluded domains, sorts everything chronologically, and groups adjacent visits into session blocks.

Each session block is defined by:

- the same domain
- less than or equal to 15 minutes between visits

The UI then renders those blocks into a vertical daily timeline showing:

- domain name
- start and end time
- computed duration
- page titles for the visits within the session

## Getting Started


### Exporting browser history


Use the [Export Chrome History](https://chromewebstore.google.com/detail/export-chrome-history/dihloblpkeiddiaojbagoecedbfpifdj) chrome extension.

### Prerequisites

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Start the App

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Usage

Chronos supports two ways of loading data:

### Option 1: Upload a CSV

Use the upload area in the UI to:

- drag and drop a CSV file
- open the file picker manually

After a successful upload, the CSV contents are saved in IndexedDB and restored automatically on reload.

### Option 2: Ship a Default File

Place a CSV named `history.csv` in the `public/` directory:

```text
public/history.csv
```

If there is no saved upload in IndexedDB, the app will attempt to load this file on startup.


## Data Persistence

Uploaded files are stored locally in the browser using IndexedDB.

What this means:

- the latest uploaded CSV survives reloads
- the saved data is local to that browser profile
- there is no backend or server-side storage in this project

You can remove the saved file from the UI with the clear action.

## Privacy Notes

Chronos runs entirely in the browser. CSV parsing and timeline generation happen client-side.

Important caveat:

- links in the timeline are clickable and open the original URLs in a new tab
- uploaded CSV contents remain in IndexedDB until cleared

## Current Behavior and Limitations

- Session grouping is based only on domain + a 15-minute threshold
- Invalid or malformed dates fall back to `new Date()` behavior during parsing
- Excluded domains are hardcoded in `src/lib/parser.ts`
- The app is single-user and browser-local
- There is no import wizard, schema validation UI, or export flow yet
- The timeline view is designed for browsing, not analytics or reporting

