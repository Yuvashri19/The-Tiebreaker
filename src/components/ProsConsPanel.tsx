import { useState, FormEvent } from "react";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Dumbbell, Scale } from "lucide-react";
import { DecisionFactor, FactorType } from "../types";

interface ProsConsPanelProps {
  factors: DecisionFactor[];
  onChange: (updated: DecisionFactor[]) => void;
}

export default function ProsConsPanel({ factors, onChange }: ProsConsPanelProps) {
  // Local state for adding custom factor inline
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newWeight, setNewWeight] = useState(3);
  const [newType, setNewType] = useState<FactorType>("pro");
  const [isAdding, setIsAdding] = useState(false);

  const pros = factors.filter((f) => f.type === "pro");
  const cons = factors.filter((f) => f.type === "con");

  // Sum weights to calculate dynamic balance meter
  const totalProWeight = pros.reduce((sum, f) => sum + f.weight, 0);
  const totalConWeight = cons.reduce((sum, f) => sum + f.weight, 0);
  const aggregateWeight = totalProWeight + totalConWeight;
  const proPercentage = aggregateWeight > 0 ? (totalProWeight / aggregateWeight) * 100 : 50;

  const handleWeightChange = (id: string, weight: number) => {
    const updated = factors.map((f) => (f.id === id ? { ...f, weight } : f));
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = factors.filter((f) => f.id !== id);
    onChange(updated);
  };

  const handleAddFactor = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newFactor: DecisionFactor = {
      id: `custom-pc-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      description: newDesc.trim() || undefined,
      weight: newWeight,
    };

    onChange([...factors, newFactor]);
    setNewName("");
    setNewDesc("");
    setNewWeight(3);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6" id="proscons-panel-container">
      {/* Live Cumulative Weight Balance Meter */}
      <div className="rounded-2xl border border-zinc-200/85 bg-white p-5 shadow-sm" id="proscons-balance-meter">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1">
            <Scale className="h-3.5 w-3.5 text-indigo-500" />
            Weighted Force Balance
          </span>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-emerald-600 font-mono">Pros: +{totalProWeight}</span>
            <span className="text-zinc-300">|</span>
            <span className="text-red-600 font-mono">Cons: -{totalConWeight}</span>
          </div>
        </div>

        {/* Meter Line */}
        <div className="h-3.5 w-full rounded-full bg-red-100 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${proPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[11px] text-zinc-500 mt-2 font-sans font-medium">
          <span>{proPercentage.toFixed(0)}% Pro-bias forces</span>
          <span>{(100 - proPercentage).toFixed(0)}% Con-bias forces</span>
        </div>
      </div>

      {/* Main Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PROS COLUMN */}
        <div className="space-y-4" id="pros-column-container">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 font-display">
              <ArrowUpRight className="h-5 w-5 text-emerald-500 stroke-[2.5]" />
              Pros (Advantages/Upsides)
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold font-mono">
              {pros.length} items
            </span>
          </div>

          <div className="space-y-3">
            {pros.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center italic font-sans bg-zinc-50/50 rounded-xl border border-dashed border-zinc-150">
                No active Pros defined. Create custom factors below.
              </p>
            ) : (
              pros.map((factor) => (
                <div
                  key={factor.id}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/10 p-4 transition duration-200 hover:shadow-xs group hover:border-emerald-200"
                  id={`factor-card-${factor.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-zinc-900 leading-snug">{factor.name}</h4>
                      {factor.description && (
                        <p className="text-xs text-zinc-500 leading-relaxed font-sans">{factor.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(factor.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                      title="Remove Factor"
                      id={`btn-delete-factor-${factor.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Weight Slider Section */}
                  <div className="mt-4 pt-3 border-t border-emerald-100/50 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" /> IMPORTANCE:
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={factor.weight}
                        onChange={(e) => handleWeightChange(factor.id, Number(e.target.value))}
                        className="h-1 w-24 bg-emerald-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-600"
                        id={`slider-weight-${factor.id}`}
                      />
                      <span className="text-xs font-bold text-emerald-700 font-mono w-4 text-center">
                        {factor.weight}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CONS COLUMN */}
        <div className="space-y-4" id="cons-column-container">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-sm font-bold text-red-800 flex items-center gap-1.5 font-display">
              <ArrowDownRight className="h-5 w-5 text-red-500 stroke-[2.5]" />
              Cons (Drawbacks/Risks)
            </h3>
            <span className="text-xs bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full font-semibold font-mono">
              {cons.length} items
            </span>
          </div>

          <div className="space-y-3">
            {cons.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center italic font-sans bg-zinc-50/50 rounded-xl border border-dashed border-zinc-155">
                No active Cons defined. Create custom factors below.
              </p>
            ) : (
              cons.map((factor) => (
                <div
                  key={factor.id}
                  className="rounded-xl border border-red-100 bg-red-50/10 p-4 transition duration-200 hover:shadow-xs group hover:border-red-200"
                  id={`factor-card-${factor.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-zinc-900 leading-snug">{factor.name}</h4>
                      {factor.description && (
                        <p className="text-xs text-zinc-500 leading-relaxed font-sans">{factor.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(factor.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                      title="Remove Factor"
                      id={`btn-delete-factor-${factor.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Weight Slider Section */}
                  <div className="mt-4 pt-3 border-t border-red-100/50 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" /> COST-WEIGHT:
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={factor.weight}
                        onChange={(e) => handleWeightChange(factor.id, Number(e.target.value))}
                        className="h-1 w-24 bg-red-200 rounded-lg appearance-none cursor-ew-resize accent-red-600"
                        id={`slider-weight-${factor.id}`}
                      />
                      <span className="text-xs font-bold text-red-700 font-mono w-4 text-center">
                        {factor.weight}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Adding Custom Factor Panel */}
      <div className="border border-zinc-200/85 rounded-2xl bg-white p-5 shadow-sm" id="add-factor-card">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 font-sans cursor-pointer"
            id="toggle-add-factor-btn"
          >
            <Plus className="h-4 w-4" /> Add Custom Pro or Con Factor
          </button>
        ) : (
          <form onSubmit={handleAddFactor} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono">Create Custom Force Factor</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="new-factor-name" className="block text-[10px] font-bold text-zinc-500 uppercase">Title *</label>
                <input
                  type="text"
                  id="new-factor-name"
                  required
                  placeholder="e.g., Extended commute time"
                  className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-indigo-500"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Analysis Pathway</label>
                <div className="flex rounded-xl bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => setNewType("pro")}
                    className={`flex-1 text-center py-1 rounded-lg text-xs font-semibold ${
                      newType === "pro" ? "bg-white text-emerald-800 shadow-sm" : "text-zinc-500"
                    }`}
                    id="type-select-pro"
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType("con")}
                    className={`flex-1 text-center py-1 rounded-lg text-xs font-semibold ${
                      newType === "con" ? "bg-white text-red-800 shadow-sm" : "text-zinc-500"
                    }`}
                    id="type-select-con"
                  >
                    Con
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="new-factor-desc" className="block text-[10px] font-bold text-zinc-500 uppercase">Detailed Description</label>
              <input
                type="text"
                id="new-factor-desc"
                placeholder="e.g., Adds 45 mins of subway travel each way daily."
                className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-indigo-500"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Weight Impact:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="h-1 w-24 bg-zinc-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
                  id="new-factor-weight-slider"
                />
                <span className="text-xs font-bold text-zinc-700 font-mono">{newWeight}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition whitespace-nowrap"
                  id="cancel-add-factor-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition whitespace-nowrap"
                  id="submit-add-factor-btn"
                >
                  Save factor
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
