import { useState } from 'react';
import { Sparkles, ExternalLink, RotateCcw, Info, ShoppingBag } from 'lucide-react';
import { isDemoMode, ETSY_STORE_URL } from '../utils/demo';
import { useApp } from '../context/AppContext';

export default function DemoBanner({ onOpenDemoModal }) {
  const { resetData } = useApp();
  const [resetting, setResetting] = useState(false);

  // If not in demo mode (e.g. running ProjectFlow.html locally), render NOTHING
  if (!isDemoMode()) return null;

  const handleReset = () => {
    setResetting(true);
    resetData();
    setTimeout(() => setResetting(false), 600);
  };

  return (
    <div className="relative z-30 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white px-3 sm:px-6 py-2 shadow-md flex-shrink-0 border-b border-white/10 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        
        {/* Left: Badge + Explanation */}
        <div className="flex items-center gap-2.5 min-w-0 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-amber-200 border border-white/20 flex-shrink-0">
            <Sparkles size={11} className="text-amber-300 animate-pulse" />
            <span>Interactive Demo</span>
          </div>

          <p className="text-[11px] sm:text-xs text-blue-100 font-medium leading-tight truncate">
            <span>Test-drive all features freely! Session data resets on reload.</span>
            <span className="hidden md:inline ml-1 text-blue-200/80">Get the full offline edition on Etsy for lifetime use.</span>
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 transition-all cursor-pointer active:scale-97 disabled:opacity-50"
            title="Reset workspace to default demo tasks and projects"
          >
            <RotateCcw size={12} className={resetting ? 'animate-spin' : ''} />
            <span>{resetting ? 'Resetting...' : 'Reset Demo'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDemoModal?.('general')}
            className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 transition-all cursor-pointer"
            title="View edition comparison"
          >
            <Info size={12} />
            <span>Features</span>
          </button>

          <a
            href={ETSY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold text-xs bg-white text-blue-800 hover:bg-blue-50 active:scale-97 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag size={13} className="text-blue-700" />
            <span>Buy on Etsy</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>

      </div>
    </div>
  );
}

