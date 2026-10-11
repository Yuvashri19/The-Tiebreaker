import { motion } from "motion/react";
import { Scale, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-zinc-200/80 pb-6 sm:flex-row">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <Scale className="h-6 w-6 stroke-[2.2]" id="app-logo-scale" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            The Tiebreaker
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 font-sans">
              <Sparkles className="h-3 w-3" id="sparkles-badge" /> AI Enabled
            </span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 font-sans">
            Rigorous multi-angle decision modeling with dynamic criterion weightings.
          </p>
        </div>
      </motion.div>
      
      <div className="text-right text-xs text-zinc-400 font-mono hidden md:block">
        UTC: {new Date().toISOString().slice(11, 19)} | 2026 Ready
      </div>
    </header>
  );
}
