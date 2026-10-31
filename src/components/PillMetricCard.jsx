import React from 'react';

export default function PillMetricCard({ label, valueText, percentage = 100, color = 'blue' }) {
  const pct = Math.min(100, Math.max(0, percentage));
  
  const radius = 16;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const colorMap = {
    blue: {
      bg: 'bg-blue-400/10 dark:bg-blue-500/10',
      border: 'border-white/70 dark:border-blue-500/20',
      text: 'text-blue-700 dark:text-blue-300',
      circleTrack: 'stroke-blue-200 dark:stroke-blue-900/50',
      circleProgress: 'stroke-blue-500 dark:stroke-blue-400',
      shadow: 'shadow-[0_8px_20px_rgb(59,130,246,0.12)] dark:shadow-[0_8px_20px_rgb(59,130,246,0.15)] hover:shadow-[0_12px_25px_rgb(59,130,246,0.2)]',
    },
    emerald: {
      bg: 'bg-emerald-400/10 dark:bg-emerald-500/10',
      border: 'border-white/70 dark:border-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      circleTrack: 'stroke-emerald-200 dark:stroke-emerald-900/50',
      circleProgress: 'stroke-emerald-500 dark:stroke-emerald-400',
      shadow: 'shadow-[0_8px_20px_rgb(16,185,129,0.12)] dark:shadow-[0_8px_20px_rgb(16,185,129,0.15)] hover:shadow-[0_12px_25px_rgb(16,185,129,0.2)]',
    },
    amber: {
      bg: 'bg-amber-400/10 dark:bg-amber-500/10',
      border: 'border-white/70 dark:border-amber-500/20',
      text: 'text-amber-700 dark:text-amber-300',
      circleTrack: 'stroke-amber-200 dark:stroke-amber-900/50',
      circleProgress: 'stroke-amber-500 dark:stroke-amber-400',
      shadow: 'shadow-[0_8px_20px_rgb(245,158,11,0.12)] dark:shadow-[0_8px_20px_rgb(245,158,11,0.15)] hover:shadow-[0_12px_25px_rgb(245,158,11,0.2)]',
    },
    red: {
      bg: 'bg-red-400/10 dark:bg-red-500/10',
      border: 'border-white/70 dark:border-red-500/20',
      text: 'text-red-700 dark:text-red-300',
      circleTrack: 'stroke-red-200 dark:stroke-red-900/50',
      circleProgress: 'stroke-red-500 dark:stroke-red-400',
      shadow: 'shadow-[0_8px_20px_rgb(239,68,68,0.12)] dark:shadow-[0_8px_20px_rgb(239,68,68,0.15)] hover:shadow-[0_12px_25px_rgb(239,68,68,0.2)]',
    },
    purple: {
      bg: 'bg-purple-400/10 dark:bg-purple-500/10',
      border: 'border-white/70 dark:border-purple-500/20',
      text: 'text-purple-700 dark:text-purple-300',
      circleTrack: 'stroke-purple-200 dark:stroke-purple-900/50',
      circleProgress: 'stroke-purple-500 dark:stroke-purple-400',
      shadow: 'shadow-[0_8px_20px_rgb(168,85,247,0.12)] dark:shadow-[0_8px_20px_rgb(168,85,247,0.15)] hover:shadow-[0_12px_25px_rgb(168,85,247,0.2)]',
    },
    slate: {
      bg: 'bg-slate-400/10 dark:bg-slate-500/10',
      border: 'border-white/70 dark:border-slate-500/20',
      text: 'text-slate-700 dark:text-slate-300',
      circleTrack: 'stroke-slate-200 dark:stroke-slate-700/50',
      circleProgress: 'stroke-slate-500 dark:stroke-slate-400',
      shadow: 'shadow-[0_8px_20px_rgb(100,116,139,0.12)] dark:shadow-[0_8px_20px_rgb(100,116,139,0.15)] hover:shadow-[0_12px_25px_rgb(100,116,139,0.2)]',
    }
  };

  const activeColor = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`inline-flex items-center gap-4 px-5 py-2.5 rounded-full border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${activeColor.bg} ${activeColor.border} ${activeColor.shadow} w-full sm:w-auto relative overflow-hidden`}
    >
      {/* Subtle glass reflection highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative flex items-center justify-center flex-shrink-0 w-11 h-11 bg-white/50 dark:bg-slate-900/50 rounded-full shadow-inner backdrop-blur-md border border-white/40 dark:border-slate-700/40">
        <svg className="absolute w-full h-full transform -rotate-90 scale-[1.1]" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="transparent"
            className={`${activeColor.circleTrack}`}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="transparent"
            className={`${activeColor.circleProgress} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className={`z-10 text-[11.5px] font-extrabold tracking-tight ${activeColor.text} drop-shadow-sm`}>
          {valueText}
        </span>
      </div>

      <span className="text-[13px] font-bold tracking-wide text-slate-700 dark:text-slate-200 pr-3 uppercase whitespace-nowrap z-10 drop-shadow-sm">
        {label}
      </span>
    </div>
  );
}
