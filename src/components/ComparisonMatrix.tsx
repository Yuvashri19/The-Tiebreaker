import { useState, FormEvent } from "react";
import { Plus, Trash2, Dumbbell, Star, AlertCircle, HelpCircle } from "lucide-react";
import { ComparisonCriterion, ComparisonOption } from "../types";

export default function ComparisonMatrix({
  criteria,
  options,
  onCriteriaChange,
  onDynamicOptionsChange,
}: {
  criteria: ComparisonCriterion[];
  options: ComparisonOption[];
  onCriteriaChange: (updated: ComparisonCriterion[]) => void;
  onDynamicOptionsChange: (updated: ComparisonOption[]) => void;
}) {
  const [newCriterionName, setNewCriterionName] = useState("");
  const [newCriterionDesc, setNewCriterionDesc] = useState("");
  const [newCriterionWeight, setNewCriterionWeight] = useState(3);
  const [isAddingCriterion, setIsAddingCriterion] = useState(false);

  const [newOptionName, setNewOptionName] = useState("");
  const [isAddingOption, setIsAddingOption] = useState(false);

  // Dynamic Score Adjustments
  const handleScoreChange = (optionId: string, criterionId: string, rating: number) => {
    const updated = options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          scores: {
            ...opt.scores,
            [criterionId]: rating,
          },
        };
      }
      return opt;
    });
    onDynamicOptionsChange(updated);
  };

  // Modify criterion weight
  const handleWeightChange = (criterionId: string, weight: number) => {
    const updated = criteria.map((c) => (c.id === criterionId ? { ...c, weight } : c));
    onCriteriaChange(updated);
  };

  // Add custom Criterion
  const handleAddCriterion = (e: FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;

    const newId = `crit-custom-${Date.now()}`;
    const newCrit: ComparisonCriterion = {
      id: newId,
      name: newCriterionName.trim(),
      weight: newCriterionWeight,
      description: newCriterionDesc.trim() || undefined,
    };

    onCriteriaChange([...criteria, newCrit]);

    // Update all options to contain a default score of 5 for this new criterion
    const updatedOptions = options.map((opt) => ({
      ...opt,
      scores: {
        ...opt.scores,
        [newId]: 5,
      },
    }));
    onDynamicOptionsChange(updatedOptions);

    setNewCriterionName("");
    setNewCriterionDesc("");
    setNewCriterionWeight(3);
    setIsAddingCriterion(false);
  };

  // Delete evaluation Criterion
  const handleDeleteCriterion = (criterionId: string) => {
    const updatedCriteria = criteria.filter((c) => c.id !== criterionId);
    onCriteriaChange(updatedCriteria);

    // Clean up option score maps
    const updatedOptions = options.map((opt) => {
      const copy = { ...opt.scores };
      delete copy[criterionId];
      return {
        ...opt,
        scores: copy,
      };
    });
    onDynamicOptionsChange(updatedOptions);
  };

  // Add custom competitor Option Path
  const handleAddOption = (e: FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    // Create record matching existing criteria with moderate default scores of 5
    const baselineScores: Record<string, number> = {};
    criteria.forEach((crit) => {
      baselineScores[crit.id] = 5;
    });

    const newOpt: ComparisonOption = {
      id: `opt-custom-${Date.now()}`,
      name: newOptionName.trim(),
      scores: baselineScores,
    };

    onDynamicOptionsChange([...options, newOpt]);
    setNewOptionName("");
    setIsAddingOption(false);
  };

  // Delete Option pathway
  const handleDeleteOption = (optionId: string) => {
    onDynamicOptionsChange(options.filter((o) => o.id !== optionId));
  };

  // Helper: calculate total weighted scores for layout rankings
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
      id: opt.id,
      name: opt.name,
      weightedAverage,
      rawSum: totalScore,
    };
  });

  // Find math winner
  const mathWinner = [...scoresSummary].sort((a, b) => Number(b.weightedAverage) - Number(a.weightedAverage))[0];

  return (
    <div className="space-y-6" id="comparison-matrix-container">
      {/* Live Calculated Ranking Header Banner */}
      <div className="rounded-2xl border border-zinc-200/85 bg-zinc-900 border-zinc-800 p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="matrix-ranking-badge">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
            Direct Decision Multi-Criteria Matrix
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
            <Star className="h-4 w-4 text-indigo-400 fill-indigo-400" />
            Decision Ranking: {mathWinner ? `"${mathWinner.name}" leads` : "Awaiting variables"}
          </h3>
        </div>

        {/* Dynamic visual indicator bars of alternate outputs */}
        <div className="flex flex-col md:flex-row gap-4">
          {scoresSummary.map((sum) => {
            const isWinner = sum.id === mathWinner?.id;
            return (
              <div key={sum.id} className="flex items-center gap-2.5 bg-zinc-850 p-2.5 rounded-xl border border-zinc-800" id={`score-pill-${sum.id}`}>
                <div className={`h-2.5 w-2.5 rounded-full ${isWinner ? "bg-emerald-500" : "bg-zinc-500"}`}></div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-white leading-none line-clamp-1 max-w-[120px]">{sum.name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono font-medium mt-0.5">{sum.weightedAverage} / 10</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid Table representation */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200/90 bg-white shadow-xs max-w-full" id="decision-matrix-table-wrap">
        <table className="w-full text-left border-collapse" id="decision-matrix-table">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50">
              {/* Row Header column: Criterion names */}
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono min-w-[200px]">
                Evaluation Criterion
              </th>
              
              {/* Importance weights row column */}
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono text-center w-[120px]">
                Importance
              </th>

              {/* Columns per alternative options */}
              {options.map((opt) => (
                <th key={opt.id} className="p-4 text-center min-w-[180px] border-l border-zinc-100" id={`table-col-header-${opt.id}`}>
                  <div className="flex flex-col items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="text-xs font-bold text-zinc-900 line-clamp-2 max-w-[150px]" title={opt.name}>
                        {opt.name}
                      </span>
                      {options.length > 2 && (
                        <button
                          onClick={() => handleDeleteOption(opt.id)}
                          className="p-1 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 transition"
                          title="Remove alternative Option"
                          id={`btn-del-opt-${opt.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-zinc-150">
            {criteria.map((crit) => (
              <tr key={crit.id} className="hover:bg-zinc-50/40 transition group" id={`table-row-criterion-${crit.id}`}>
                {/* 1. Description & Name of Criterion */}
                <td className="p-4 space-y-1 max-w-[320px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-900 font-sans">{crit.name}</span>
                    <button
                      onClick={() => handleDeleteCriterion(crit.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-neutral-100 transition focus:opacity-100"
                      title="Remove Criterion"
                      id={`btn-del-crit-${crit.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {crit.description && (
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">{crit.description}</p>
                  )}
                </td>

                {/* 2. Weight Selector Cell */}
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5 bg-zinc-50 p-2 rounded-xl border border-zinc-150">
                    <div className="flex items-center gap-1">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={crit.weight}
                        onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                        className="h-1 w-14 bg-zinc-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
                        id={`crit-weight-input-${crit.id}`}
                      />
                      <span className="text-xs font-extrabold text-indigo-700 font-mono w-4">
                        {crit.weight}
                      </span>
                    </div>
                    <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-0.5">
                      <Dumbbell className="h-2 w-2" /> Weight
                    </span>
                  </div>
                </td>

                {/* 3. Option Rating Selector Selectors */}
                {options.map((opt) => {
                  const scoreValue = opt.scores[crit.id] ?? 5;
                  
                  return (
                    <td key={opt.id} className="p-4 border-l border-zinc-100 text-center" id={`cell-${opt.id}-${crit.id}`}>
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        {/* Interactive dynamic Score Selector from 1 to 10 */}
                        <div className="flex items-center gap-1 bg-zinc-50/50 p-1.5 rounded-lg border border-neutral-200">
                          <select
                            value={scoreValue}
                            onChange={(e) => handleScoreChange(opt.id, crit.id, Number(e.target.value))}
                            className="text-xs font-bold text-zinc-800 bg-transparent py-0.5 px-1 outline-none border-none cursor-pointer"
                            id={`select-score-${opt.id}-${crit.id}`}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "😞" : num === 10 ? "🏆" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400">Rating out of 10</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid containing Double adding subforms: Criterion or Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="matrix-actions-grid">
        
        {/* ADD NEW CRITERION */}
        <div className="p-5 border border-zinc-200/85 bg-white rounded-2xl shadow-sm" id="module-add-criterion">
          {!isAddingCriterion ? (
            <button
              onClick={() => setIsAddingCriterion(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 font-sans cursor-pointer"
              id="toggle-add-criterion-btn"
            >
              <Plus className="h-4.5 w-4.5" /> Add Custom Evaluation Criterion
            </button>
          ) : (
            <form onSubmit={handleAddCriterion} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono">Create Evaluation Factor</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="new-crit-name" className="block text-[10px] font-bold text-zinc-500 uppercase">Criterion Name *</label>
                  <input
                    type="text"
                    id="new-crit-name"
                    required
                    placeholder="e.g., Workplace Joy & Culture"
                    className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-semibold text-zinc-800 outline-none focus:border-indigo-500"
                    value={newCriterionName}
                    onChange={(e) => setNewCriterionName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="new-crit-weight" className="block text-[10px] font-bold text-zinc-500 uppercase">Initial Weight</label>
                  <select
                    className="block w-full rounded-xl border border-zinc-300/85 bg-white px-3 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-indigo-500"
                    value={newCriterionWeight}
                    onChange={(e) => setNewCriterionWeight(Number(e.target.value))}
                    id="new-crit-weight"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>Weight {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="new-crit-desc" className="block text-[10px] font-bold text-zinc-500 uppercase">Description / Operational score rule</label>
                <input
                  type="text"
                  id="new-crit-desc"
                  placeholder="e.g., Alignment with core creativity, day-to-day team camaraderie, stress loads."
                  className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-indigo-500"
                  value={newCriterionDesc}
                  onChange={(e) => setNewCriterionDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddingCriterion(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition"
                  id="cancel-add-crit-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition"
                  id="submit-add-crit-btn"
                >
                  Save Criterion
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ADD NEW OPTION ALTERNATIVE */}
        <div className="p-5 border border-zinc-200/85 bg-white rounded-2xl shadow-sm" id="module-add-option">
          {!isAddingOption ? (
            <button
              onClick={() => setIsAddingOption(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 font-sans cursor-pointer"
              id="toggle-add-option-btn"
            >
              <Plus className="h-4.5 w-4.5" /> Introduce Additional Option Pathway
            </button>
          ) : (
            <form onSubmit={handleAddOption} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono">Create Option Pathway</h4>
              
              <div className="space-y-1">
                <label htmlFor="new-opt-name" className="block text-[10px] font-bold text-zinc-500 uppercase">Alternative Name *</label>
                <input
                  type="text"
                  id="new-opt-name"
                  required
                  placeholder="e.g., Take a 3-month unpaid sabbatical"
                  className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-semibold text-zinc-800 outline-none focus:border-indigo-500"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center text-[10px] text-zinc-400 gap-1 font-sans italic">
                <HelpCircle className="h-3 w-3" /> Creates a new column inside the scoring table above.
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingOption(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition"
                  id="cancel-add-opt-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition"
                  id="submit-add-opt-btn"
                >
                  Save Pathway
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
