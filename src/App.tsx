import { useEffect, useState } from 'react';
import { parseHistory, parseHistoryText } from './lib/parser';
import type { DayActivity } from './lib/types';
import { DatePicker } from './components/DatePicker';
import { Timeline } from './components/Timeline';
import { HistoryUpload } from './components/HistoryUpload';
import { clearPersistedHistoryUpload, loadPersistedHistoryUpload, savePersistedHistoryUpload } from './lib/storage';
import { Activity } from 'lucide-react';

function App() {
  const [data, setData] = useState<Record<string, DayActivity>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [hasPersistedUpload, setHasPersistedUpload] = useState(false);

  const availableDates = Object.keys(data);
  const activeDay = selectedDate ? data[selectedDate] : null;
  const hasData = availableDates.length > 0;
  const defaultHistoryUrl = `${import.meta.env.BASE_URL}history.csv`;

  const getPreferredDate = (parsed: Record<string, DayActivity>) => {
    const dates = Object.keys(parsed).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (dates.length === 0) return null;
    if (selectedDate && parsed[selectedDate]) return selectedDate;

    try {
      const hashVal = decodeURIComponent(window.location.hash.replace('#', '')).replace(/-/g, '/');
      if (hashVal && parsed[hashVal]) {
        return hashVal;
      }
    } catch {
      // Ignore malformed hash values and use the latest date instead.
    }

    return dates[0];
  };

  const applyParsedData = (
    parsed: Record<string, DayActivity>,
    options?: { fileName?: string | null; hasPersistedUpload?: boolean }
  ) => {
    setData(parsed);
    setSelectedDate(getPreferredDate(parsed));
    setUploadedFileName(options?.fileName ?? null);
    setHasPersistedUpload(options?.hasPersistedUpload ?? false);
    setError(null);
    setLoading(false);
  };

  const loadDefaultHistory = async () => {
    const parsed = await parseHistory(defaultHistoryUrl);
    applyParsedData(parsed);
  };

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        const savedUpload = await loadPersistedHistoryUpload();
        if (savedUpload) {
          const parsed = await parseHistoryText(savedUpload.text);
          if (!cancelled) {
            const dates = Object.keys(parsed).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
            let nextSelectedDate = dates[0] ?? null;

            try {
              const hashVal = decodeURIComponent(window.location.hash.replace('#', '')).replace(/-/g, '/');
              if (hashVal && parsed[hashVal]) {
                nextSelectedDate = hashVal;
              }
            } catch {
              // Ignore malformed hash values and use the latest date instead.
            }

            setData(parsed);
            setSelectedDate(nextSelectedDate);
            setUploadedFileName(savedUpload.name);
            setHasPersistedUpload(true);
            setError(null);
            setLoading(false);
          }
          return;
        }

        const parsed = await parseHistory(defaultHistoryUrl);
        if (!cancelled) {
          const dates = Object.keys(parsed).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          let nextSelectedDate = dates[0] ?? null;

          try {
            const hashVal = decodeURIComponent(window.location.hash.replace('#', '')).replace(/-/g, '/');
            if (hashVal && parsed[hashVal]) {
              nextSelectedDate = hashVal;
            }
          } catch {
            // Ignore malformed hash values and use the latest date instead.
          }

          setData(parsed);
          setSelectedDate(nextSelectedDate);
          setUploadedFileName(null);
          setHasPersistedUpload(false);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setData({});
          setSelectedDate(null);
          setUploadedFileName(null);
          setHasPersistedUpload(false);
          setError(err instanceof Error ? err.message : 'Failed to load history.csv');
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [defaultHistoryUrl]);

  useEffect(() => {
    if (selectedDate) {
      window.location.hash = encodeURIComponent(selectedDate.replace(/\//g, '-'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedDate]);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hashVal = decodeURIComponent(window.location.hash.replace('#', '')).replace(/-/g, '/');
        if (hashVal && data[hashVal]) {
          setSelectedDate(hashVal);
        }
      } catch {
        // Ignore malformed hash values from the address bar.
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [data]);

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setLoading(true);

    try {
      const csvText = await file.text();
      const parsed = await parseHistoryText(csvText);

      await savePersistedHistoryUpload({
        name: file.name,
        text: csvText
      });

      applyParsedData(parsed, {
        fileName: file.name,
        hasPersistedUpload: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse uploaded CSV');
      setLoading(false);
    } finally {
      setUploading(false);
    }
  };

  const handleClearUpload = async () => {
    setUploading(true);
    setLoading(true);

    try {
      await clearPersistedHistoryUpload();
      await loadDefaultHistory();
    } catch {
      setData({});
      setSelectedDate(null);
      setUploadedFileName(null);
      setHasPersistedUpload(false);
      setError('Saved CSV cleared. No fallback /history.csv could be loaded.');
      setLoading(false);
    } finally {
      setUploading(false);
    }
  };

  if (loading && !hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="w-10 h-10 text-blue-500 mb-4 animate-[bounce_2s_infinite]" />
          <p className="text-slate-400 font-medium tracking-wide">
            {uploading ? 'Loading Uploaded History...' : 'Analyzing Browser History...'}
          </p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-xl px-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] ring-1 ring-white/10">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Chronos</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              Load an exported browser history CSV to explore your timeline by day.
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-900/50 bg-red-950/30 p-4 text-center">
              <p className="text-sm font-semibold text-red-400">{error}</p>
              <p className="mt-1 text-xs leading-relaxed text-red-300/70">
                Upload a valid CSV or place a readable <span className="font-mono text-red-300">history.csv</span> in the public directory.
              </p>
            </div>
          ) : null}

          <HistoryUpload
            onFileSelect={handleFileSelect}
            onClear={handleClearUpload}
            fileName={uploadedFileName}
            isLoading={uploading}
            hasPersistedUpload={hasPersistedUpload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] ring-1 ring-white/10">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white tracking-tight">Chronos</h1>
              <p className="text-xs text-blue-400/80 font-semibold tracking-wider uppercase mt-0.5">Timeline Analyzer</p>
            </div>
          </div>

          <div className="grid w-full gap-3 lg:max-w-4xl lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-center">
            <HistoryUpload
              onFileSelect={handleFileSelect}
              onClear={handleClearUpload}
              fileName={uploadedFileName}
              isLoading={uploading}
              hasPersistedUpload={hasPersistedUpload}
              compact
            />
            <div className="lg:min-w-[19rem]">
              <DatePicker
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        {error ? (
          <div className="mx-auto mb-6 mt-6 max-w-5xl rounded-2xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        <Timeline day={activeDay} />
      </main>
    </div>
  );
}

export default App;
