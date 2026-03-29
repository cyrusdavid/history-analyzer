import { useEffect, useState } from 'react';
import { parseHistory } from './lib/parser';
import type { DayActivity } from './lib/types';
import { DatePicker } from './components/DatePicker';
import { Timeline } from './components/Timeline';
import { Activity } from 'lucide-react';

function App() {
  const [data, setData] = useState<Record<string, DayActivity>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    parseHistory('/history.csv')
      .then((parsed) => {
        setData(parsed);
        const dates = Object.keys(parsed).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        if (dates.length > 0) {
          try {
            const hashVal = decodeURIComponent(window.location.hash.replace('#', '')).replace(/-/g, '/');
            if (hashVal && parsed[hashVal]) {
              setSelectedDate(hashVal);
            } else {
              setSelectedDate(dates[0]);
            }
          } catch(e) {
            setSelectedDate(dates[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to parse history.csv");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      window.location.hash = encodeURIComponent(selectedDate.replace(/\//g, '-'));
    }
  }, [selectedDate]);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hashVal = decodeURIComponent(window.location.hash.replace('#', '')).replace(/-/g, '/');
        if (hashVal && data[hashVal]) {
          setSelectedDate(hashVal);
        }
      } catch(e) {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="w-10 h-10 text-blue-500 mb-4 animate-[bounce_2s_infinite]" />
          <p className="text-slate-400 font-medium tracking-wide">Analyzing Browser History...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-2xl max-w-md text-center">
          <p className="text-red-400 font-semibold mb-2">{error}</p>
          <p className="text-red-300/70 text-sm leading-relaxed">Ensure a valid <span className="font-mono text-red-300">history.csv</span> file is located in the public directory and properly formatted to continue.</p>
        </div>
      </div>
    );
  }

  const availableDates = Object.keys(data);
  const activeDay = selectedDate ? data[selectedDate] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] ring-1 ring-white/10">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Chronos</h1>
              <p className="text-xs text-blue-400/80 font-semibold tracking-wider uppercase mt-0.5">Timeline Analyzer</p>
            </div>
          </div>
          
          <div className="w-full sm:w-80">
            <DatePicker 
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>
      </header>

      <main className="px-6 relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <Timeline day={activeDay} />
      </main>
    </div>
  );
}

export default App;
