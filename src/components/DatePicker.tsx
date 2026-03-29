import { format } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function DatePicker({ availableDates, selectedDate, onSelectDate }: Props) {
  // Sort dates nicely
  const sortedDates = [...availableDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const currentIndex = selectedDate ? sortedDates.indexOf(selectedDate) : -1;

  const navigate = (direction: 1 | -1) => {
    if (currentIndex === -1) return;
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < sortedDates.length) {
      onSelectDate(sortedDates[nextIndex]);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-lg">
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
        <Calendar className="text-blue-500 w-4 h-4" />
      </div>
      <div className="flex-1">
        <select 
          className="block w-full bg-transparent text-sm font-medium text-slate-200 outline-none cursor-pointer appearance-none"
          value={selectedDate || ''}
          onChange={(e) => onSelectDate(e.target.value)}
        >
          {sortedDates.map(date => {
            let label = date;
            try { 
               label = format(new Date(date), 'EEEE, MMMM do yyyy');
            } catch(e) {}
            return <option key={date} value={date} className="bg-slate-900">{label}</option>;
          })}
        </select>
      </div>
      <div className="flex gap-1">
        <button 
          onClick={() => navigate(-1)} 
          disabled={currentIndex <= 0}
          className="p-1.5 border border-slate-800 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => navigate(1)} 
          disabled={currentIndex >= sortedDates.length - 1}
          className="p-1.5 border border-slate-800 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
