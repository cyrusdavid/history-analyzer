import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { DayActivity } from '../lib/types';

export function Timeline({ day }: { day: DayActivity | null }) {
  if (!day) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">💤</span>
        </div>
        <p className="font-medium text-lg">No activity found for this day.</p>
        <p className="text-sm opacity-60 text-center mt-2 max-w-sm">
          You either didn't browse any sites, or all of your visits matched our exclusions list.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="relative border-l-2 border-slate-800/80 ml-4 pb-12">
        {day.blocks.map((block, i) => {
          let duration = Math.round((block.endTime.getTime() - block.startTime.getTime()) / 60000);
          if (duration === 0) duration = 1; // display at least 1 min

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              key={block.id}
              className="mb-8 ml-8 relative group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[2.55rem] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-950 group-hover:bg-blue-400 group-hover:scale-110 transition-all z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl hover:border-slate-700/80 hover:bg-slate-900 transition-all shadow-lg relative overflow-hidden group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Subtle gradient accent line on the left inside the card */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100 tracking-tight">{block.domain}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1.5 flex items-center gap-2">
                      <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {format(block.startTime, 'HH:mm')}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {format(block.endTime, 'HH:mm')}
                      </span>
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {duration} min
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  {block.items.map(item => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm text-slate-400 hover:text-blue-400 truncate transition-colors hover:translate-x-1 transform duration-200"
                    >
                      {item.title || item.url}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
