import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, ArrowRight, CornerRightDown } from "lucide-react";

interface DecisionFormProps {
  onSubmit: (decision: string, options: string) => Promise<void>;
  isLoading: boolean;
}

const LOADING_STEPS = [
  "Formulating exclusive alternatives...",
  "Synthesizing dynamic Pros and Cons...",
  "Deducing SWOT strengths & vulnerabilities...",
  "Constructing comprehensive criteria scoring models...",
  "Evaluating multi-factor weight metrics...",
  "Resolving ties and breaking down action plans..."
];

export default function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [decision, setDecision] = useState("");
  const [options, setOptions] = useState("");
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  // Cycle loading indicators slowly
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || isLoading) return;
    onSubmit(decision, options);
  };

  const handleQuickDilemma = (text: string, opts: string) => {
    setDecision(text);
    setOptions(opts);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-md glow-indigo" id="decision-setup-form-container">
      <h2 className="font-display text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-indigo-500" />
        Configure Your Dilemma
      </h2>
      <p className="text-xs font-medium text-zinc-500 mb-6 font-sans">
        Explain the choice or situation you are facing. Let Gemini construct your custom, weightable decision workspace instantly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" id="decision-setup-form">
        {/* Core Dilemma Textarea */}
        <div className="space-y-1.5">
          <label htmlFor="input-decision" className="block text-xs font-bold text-zinc-700 uppercase tracking-wide">
            1. What decision or choice are you evaluating? *
          </label>
          <textarea
            id="input-decision"
            rows={3}
            required
            disabled={isLoading}
            className="block w-full rounded-xl border border-zinc-300/80 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-zinc-50 disabled:text-zinc-500/80 outline-none transition"
            placeholder="e.g., Should I quit my stable corporate banking job to join a pre-seed AI startup, or stay for the guaranteed annual bonus?"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
          />
        </div>

        {/* Custom Option Pathways */}
        <div className="space-y-1.5">
          <label htmlFor="input-options" className="block text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center justify-between">
            <span>2. Alternate Options (Optional)</span>
            <span className="text-[10px] lowercase font-normal italic font-sans text-zinc-400">Leave blank for AI to brainstorm</span>
          </label>
          <input
            type="text"
            id="input-options"
            disabled={isLoading}
            className="block w-full rounded-xl border border-zinc-300/80 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-zinc-50 disabled:text-zinc-500/80 outline-none transition"
            placeholder="e.g., Risk Corporate Departure, Retain Safe Position (separated by commas)"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
          />
        </div>

        {/* Action Button & Loading Progress */}
        <div className="pt-2">
          {!isLoading ? (
            <button
              type="submit"
              disabled={!decision.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 px-4 py-3 text-sm font-semibold text-white shadow-sm transition outline-none cursor-pointer"
              id="submit-decision-btn"
            >
              Analyze Dilemma
              <Sparkles className="h-4 w-4 text-indigo-400" id="submit-btn-sparkle" />
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></div>
                <div className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 animate-pulse"></div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-indigo-950">Resolving variables with Gemini AI...</p>
                <div className="h-4 justify-center items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStepIdx}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[11px] text-indigo-600/80 font-mono font-medium"
                    >
                      {LOADING_STEPS[loadingStepIdx]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Quick Starter Templates */}
      {!isLoading && (
        <div className="mt-6 border-t border-zinc-100 pt-5 space-y-2.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5 font-mono">
            <CornerRightDown className="h-3 w-3 text-zinc-400" /> Quick Seed Prompts
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDilemma(
                "Should I buy a house now with higher interest rates, or keep renting for another year to save more capital?",
                "Buy House Now, Continue Renting"
              )}
              className="text-left text-xs p-2.5 rounded-lg border border-zinc-100 hover:border-zinc-200 bg-zinc-50/40 hover:bg-zinc-50 transition flex flex-col justify-between"
              id="quick-seed-house"
            >
              <span className="font-semibold text-zinc-800 line-clamp-1">Buy vs Rent Right Now</span>
              <span className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between w-full font-sans">
                Real Estate Finance <ArrowRight className="h-2.5 w-2.5 text-zinc-400" />
              </span>
            </button>

            <button
              onClick={() => handleQuickDilemma(
                "Should our brand launch a TikTok-first short video strategy, or double down on high-retention Email newsletters?",
                "TikTok Strategy, Email Newsletter"
              )}
              className="text-left text-xs p-2.5 rounded-lg border border-zinc-100 hover:border-zinc-200 bg-zinc-50/40 hover:bg-zinc-50 transition flex flex-col justify-between"
              id="quick-seed-marketing"
            >
              <span className="font-semibold text-zinc-800 line-clamp-1">TikTok vs Email Newsletters</span>
              <span className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between w-full font-sans">
                Marketing Outreach <ArrowRight className="h-2.5 w-2.5 text-zinc-400" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
