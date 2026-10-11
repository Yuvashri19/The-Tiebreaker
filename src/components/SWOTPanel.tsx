import { useState, FormEvent } from "react";
import { Plus, Trash2, Dumbbell, Shield, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { SWOTItem, SWOTCategory } from "../types";

interface SWOTPanelProps {
  items: SWOTItem[];
  onChange: (updated: SWOTItem[]) => void;
}

export default function SWOTPanel({ items, onChange }: SWOTPanelProps) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newWeight, setNewWeight] = useState(3);
  const [newCategory, setNewCategory] = useState<SWOTCategory>("strength");
  const [isAdding, setIsAdding] = useState(false);

  const getCategoryItems = (cat: SWOTCategory) => items.filter((i) => i.category === cat);

  const handleWeightChange = (id: string, weight: number) => {
    const updated = items.map((i) => (i.id === id ? { ...i, weight } : i));
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    onChange(updated);
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: SWOTItem = {
      id: `custom-sw-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      description: newDesc.trim() || undefined,
      weight: newWeight,
    };

    onChange([...items, newItem]);
    setNewName("");
    setNewDesc("");
    setNewWeight(3);
    setIsAdding(false);
  };

  // Define Category specs for robust styling
  const categorySpecs: Record<SWOTCategory, { title: string; subtitle: string; bg: string; border: string; text: string; icon: any }> = {
    strength: {
      title: "Strengths",
      subtitle: "Internal capabilities",
      bg: "bg-blue-50/15",
      border: "border-blue-100",
      text: "text-blue-900",
      icon: Shield,
    },
    weakness: {
      title: "Weaknesses",
      subtitle: "Internal vulnerabilities",
      bg: "bg-amber-50/15",
      border: "border-amber-100",
      text: "text-amber-900",
      icon: ShieldAlert,
    },
    opportunity: {
      title: "Opportunities",
      subtitle: "External advantages",
      bg: "bg-emerald-50/15",
      border: "border-emerald-100",
      text: "text-emerald-900",
      icon: Sparkles,
    },
    threat: {
      title: "Threats",
      subtitle: "External hazards",
      bg: "bg-rose-50/15",
      border: "border-rose-100",
      text: "text-rose-900",
      icon: AlertCircle,
    },
  };

  return (
    <div className="space-y-6" id="swot-panel-container">
      {/* 2x2 Bento Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="swot-2x2-grid">
        {(["strength", "weakness", "opportunity", "threat"] as SWOTCategory[]).map((cat) => {
          const spec = categorySpecs[cat];
          const catItems = getCategoryItems(cat);
          const IconComponent = spec.icon;

          return (
            <div
              key={cat}
              className={`rounded-2xl border ${spec.border} ${spec.bg} p-5 flex flex-col justify-between min-h-[14rem] transition hover:shadow-xs`}
              id={`swot-quadrant-${cat}`}
            >
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-zinc-150">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white shadow-xs border border-zinc-200/50">
                      <IconComponent className={`h-4 w-4 ${spec.text}`} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${spec.text} leading-tight font-display`}>{spec.title}</h3>
                      <p className="text-[10px] text-zinc-400 font-sans">{spec.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                    {catItems.length} factors
                  </span>
                </div>

                <div className="space-y-2.5">
                  {catItems.length === 0 ? (
                    <p className="text-xs text-zinc-400/80 italic py-4 text-center font-sans">
                      None defined in this quadrant.
                    </p>
                  ) : (
                    catItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-zinc-150 p-3 group transition"
                        id={`swot-item-${item.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-zinc-800 leading-snug">{item.name}</h4>
                            {item.description && (
                              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{item.description}</p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-50 transition shrink-0"
                            title="Remove item"
                            id={`btn-delete-swot-item-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Adjust dynamic swot relevance weight */}
                        <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between gap-4">
                          <span className="text-[9px] text-zinc-400 font-mono flex items-center gap-0.5">
                            <Dumbbell className="h-2.5 w-2.5" /> WEIGHT:
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={item.weight}
                              onChange={(e) => handleWeightChange(item.id, Number(e.target.value))}
                              className="h-1 w-16 bg-zinc-100 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
                              id={`slider-swot-weight-${item.id}`}
                            />
                            <span className="text-[10px] font-bold text-zinc-600 font-mono w-3 text-center">
                              {item.weight}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adding Custom SWOT Item Panel */}
      <div className="border border-zinc-200/85 rounded-2xl bg-white p-5 shadow-sm" id="add-swot-item-card">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 font-sans cursor-pointer"
            id="toggle-add-swot-item-btn"
          >
            <Plus className="h-4 w-4" /> Add Custom SWOT Factor
          </button>
        ) : (
          <form onSubmit={handleAddItem} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono">Create Custom SWOT Metric</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="swot-item-name" className="block text-[10px] font-bold text-zinc-500 uppercase">Title *</label>
                <input
                  type="text"
                  id="swot-item-name"
                  required
                  placeholder="e.g., Immediate access to early investor network"
                  className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-indigo-500"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Quadrant Category</label>
                <select
                  className="block w-full rounded-xl border border-zinc-300/85 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SWOTCategory)}
                  id="swot-category-select"
                >
                  <option value="strength">Strength (Internal +)</option>
                  <option value="weakness">Weakness (Internal -)</option>
                  <option value="opportunity">Opportunity (External +)</option>
                  <option value="threat">Threat (External -)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="swot-item-desc" className="block text-[10px] font-bold text-zinc-500 uppercase">Description / Strategic Importance</label>
              <input
                type="text"
                id="swot-item-desc"
                placeholder="e.g., Partner venture firm wants to provide immediate intro meetings."
                className="block w-full rounded-xl border border-zinc-300/85 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-indigo-500"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Weight Relevance:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="h-1 w-24 bg-zinc-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
                  id="new-swot-weight-slider"
                />
                <span className="text-xs font-bold text-zinc-700 font-mono">{newWeight}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition whitespace-nowrap"
                  id="cancel-add-swot-item-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition whitespace-nowrap"
                  id="submit-add-swot-item-btn"
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
