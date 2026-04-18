import Papa from 'papaparse';
import type { HistoryRow, HistoryItem, SessionBlock, DayActivity } from './types';

const EXCLUDED_DOMAINS = ['youtube.com', 'facebook.com', 'chatgpt.com', 'gemini.google.com', 'reddit.com'];

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function isExcluded(domain: string): boolean {
  return EXCLUDED_DOMAINS.some(excluded => domain.includes(excluded.replace('www.', '')));
}

function buildDayActivity(rows: HistoryRow[]): Record<string, DayActivity> {
  const items: HistoryItem[] = [];
  for (const row of rows) {
    if (!row.url) continue;

    const domain = extractDomain(row.url);
    if (isExcluded(domain)) continue;

    let timestamp = new Date();
    try {
      timestamp = new Date(`${row.date} ${row.time}`);
    } catch {
      console.warn('Invalid date format', row.date, row.time);
    }

    items.push({
      id: row.id || `doc-${Math.random()}`,
      timestamp,
      dateStr: row.date,
      timeStr: row.time,
      title: row.title,
      url: row.url,
      domain,
      transition: row.transition
    });
  }

  items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const groupedByDate: Record<string, HistoryItem[]> = {};
  for (const item of items) {
    if (!groupedByDate[item.dateStr]) {
      groupedByDate[item.dateStr] = [];
    }
    groupedByDate[item.dateStr].push(item);
  }

  const days: Record<string, DayActivity> = {};
  for (const [date, dateItems] of Object.entries(groupedByDate)) {
    const blocks: SessionBlock[] = [];
    let currentBlock: SessionBlock | null = null;

    for (const item of dateItems) {
      if (!currentBlock) {
        currentBlock = {
          id: `block-${Date.now()}-${Math.random()}`,
          domain: item.domain,
          startTime: item.timestamp,
          endTime: item.timestamp,
          items: [item]
        };
      } else {
        const timeDiff = item.timestamp.getTime() - currentBlock.endTime.getTime();
        const isSameDomain = currentBlock.domain === item.domain;

        if (isSameDomain && timeDiff <= 15 * 60 * 1000) {
          currentBlock.items.push(item);
          currentBlock.endTime = item.timestamp;
        } else {
          blocks.push(currentBlock);
          currentBlock = {
            id: `block-${Date.now()}-${Math.random()}`,
            domain: item.domain,
            startTime: item.timestamp,
            endTime: item.timestamp,
            items: [item]
          };
        }
      }
    }

    if (currentBlock) blocks.push(currentBlock);
    days[date] = { date, blocks };
  }

  return days;
}

export async function parseHistoryText(csvText: string): Promise<Record<string, DayActivity>> {
  return new Promise((resolve, reject) => {
    Papa.parse<HistoryRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(buildDayActivity(results.data));
      },
      error: (error: Error) => reject(error)
    });
  });
}

export async function parseHistory(fileUrl: string): Promise<Record<string, DayActivity>> {
  return new Promise((resolve, reject) => {
    Papa.parse<HistoryRow>(fileUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(buildDayActivity(results.data));
      },
      error: (error: Error) => reject(error)
    });
  });
}
