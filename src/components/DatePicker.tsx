import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function DatePicker({ availableDates, selectedDate, onSelectDate }: Props) {
  const sortedDates = [...availableDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const currentIndex = selectedDate ? sortedDates.indexOf(selectedDate) : -1;

  const includeDates = availableDates.map(d => new Date(d));
  const selected = selectedDate ? new Date(selectedDate) : null;

  const navigate = (direction: 1 | -1) => {
    if (currentIndex === -1) return;
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < sortedDates.length) {
      onSelectDate(sortedDates[nextIndex]);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-lg">
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-blue-500 pointer-events-none">
        <CalendarIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 relative">
        <ReactDatePicker
          selected={selected}
          onChange={(date: Date | null) => {
            if (!date) return;
            const targetTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            const matchingStr = availableDates.find(d => {
              const dTime = new Date(d);
              return new Date(dTime.getFullYear(), dTime.getMonth(), dTime.getDate()).getTime() === targetTime;
            });
            if (matchingStr) {
              onSelectDate(matchingStr);
            }
          }}
          includeDates={includeDates}
          dateFormat="EEEE, MMMM do yyyy"
          className="bg-transparent text-sm font-medium text-slate-200 outline-none w-full cursor-pointer placeholder-slate-500 caret-transparent"
          placeholderText="Select a date..."
        />
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
