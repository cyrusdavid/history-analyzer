export interface HistoryRow {
  order: string;
  id: string;
  date: string;
  time: string;
  title: string;
  url: string;
  visitCount: string;
  typedCount: string;
  transition: string;
}

export interface HistoryItem {
  id: string;
  timestamp: Date;
  dateStr: string;
  timeStr: string;
  title: string;
  url: string;
  domain: string;
  transition: string;
}

export interface SessionBlock {
  id: string;
  domain: string;
  startTime: Date;
  endTime: Date;
  items: HistoryItem[];
}

export interface DayActivity {
  date: string;
  blocks: SessionBlock[];
}
