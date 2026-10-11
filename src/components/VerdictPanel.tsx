import { useState } from "react";
import { CheckSquare, Square, AlertTriangle, ShieldCheck, TrendingUp, Info } from "lucide-react";
import { DecisionVerdict, ComparisonOption, ComparisonCriterion } from "../types";

interface VerdictPanelProps {
  verdict: DecisionVerdict;
  options: ComparisonOption[];
  criteria: ComparisonCriterion[];
}

export default function VerdictPanel({ verdict, options, criteria }: VerdictPanelProps) {
  // Local state for interactive next steps checklist
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Dynamically compute math scores to see if the user's custom weights agree with the text verdict
  const scoresSummary = options.map((opt) => {
    let totalScore = 0;
    let totalWeight = 0;

    criteria.forEach((crit) => {
      const score = opt.scores[crit.id] ?? 5;
      totalScore += score * crit.weight;
      totalWeight += crit.weight;
    });

    const weightedAverage = totalWeight > 0 ? (totalScore / totalWeight).toFixed(1) : "0.0";
    return {
      name: opt.name,
      weightedAverage,
      rawSum: totalScore,
    };
  });

  // Sort computed options to find the mathematical winner based on user weights
  const mathWinner = [...scoresSummary].sort((a, b) => Number(b.weightedAverage) - Number(a.weightedAverage))[0];

  return (
    <div className="space-y-6" id="verdict-panel-container">
      {/* Visual Recommendation Indicator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Core AI/Text Verdict Recommended Winner */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-200/85 bg-amber-50/20 p-5 shadow-sm relative overflow-hidden" id="ai-verdict-card">
          <div className="absolute right-0 top-0 h-28 w-28 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <ShieldCheck className="h-5 p-0.5 w-5" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 font-mono">
                Consultant Verdict (Selected Alternative)
              </span>
              <h3 className="text-lg font-bold text-zinc-900" id="ai-verdict-winner-name">
                {verdict.winner}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                {verdict.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Live Mathematical Formula Result Card */}
        <div className="rounded-2xl border border-zinc-200/85 bg-slate-900 p-5 text-white shadow-sm flex flex-col justify-between" id="math-verdict-card">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
              Live Weight Metric
            </span>
            <p className="text-xs text-zinc-400 mt-1 mb-4 font-sans leading-relaxed">
              Dynamically derived from your custom criteria & option scoring weights below.
            </p>
          </div>

          <div className="space-y-3">
            {scoresSummary.map((sum) => {
              const isLead = sum.name === mathWinner?.name;
              return (
                <div key={sum.name} className="flex items-center justify-between gap-2" id={`score-summary-${sum.name}`}>
                  <span className={`text-xs line-clamp-1 ${isLead ? "font-semibold text-white" : "text-zinc-400"}`}>
                    {sum.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                      isLead ? "bg-indigo-600 font-bold text-white" : "bg-zinc-800 text-zinc-300"
                    }`}>
                      {sum.weightedAverage}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {mathWinner && (
            <div className="border-t border-zinc-800 pt-3 mt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-indigo-400" /> Math Peak:
              </span>
              <span className="text-white font-bold max-w-[120px] truncate" title={mathWinner.name}>
                {mathWinner.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Risk Mitigation Advice Section */}
      {verdict.mitigationStrategy && (
        <div className="rounded-2xl border border-zinc-200/85 bg-zinc-50/50 p-5" id="risk-mitigation-card">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" id="mitigation-warning-icon" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">Risk Hedging & Downside Cover</h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">{verdict.mitigationStrategy}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Plan Checklist */}
      {verdict.nextSteps && verdict.nextSteps.length > 0 && (
        <div className="rounded-2xl border border-zinc-200/85 bg-white p-5 shadow-sm" id="action-plan-checklist-card">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5 font-mono">
            <CheckSquare className="h-4 w-4 text-emerald-500" />
            Tactical Action Steps
          </h4>
          
          <div className="space-y-3">
            {verdict.nextSteps.map((step, idx) => {
              const isCompleted = !!completedSteps[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition ${
                    isCompleted 
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400 line-through" 
                      : "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-700"
                  }`}
                  id={`action-step-item-${idx}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckSquare className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Square className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                  <span className="text-xs font-medium leading-relaxed font-sans">{step}</span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-center gap-1 text-[10px] text-zinc-400 font-sans italic">
            <Info className="h-3 w-3" /> Tip: Completing actions helps formalize and lock in your final choice pathway.
          </div>
        </div>
      )}
    </div>
  );
}
