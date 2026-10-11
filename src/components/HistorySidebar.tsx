import { motion } from "motion/react";
import { Scale, Trash2, Plus, CornerDownRight, Bookmark } from "lucide-react";
import { DecisionWorkspace } from "../types";

interface HistorySidebarProps {
  decisions: DecisionWorkspace[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewDecision: () => void;
  onLoadSample: (sampleId: string) => void;
}

export default function HistorySidebar({
  decisions,
  activeId,
  onSelect,
  onDelete,
  onNewDecision,
  onLoadSample,
}: HistorySidebarProps) {
  return (
    <aside className="w-full lg:w-72 flex flex-col gap-5 shrink-0" id="decision-history-sidebar">
      {/* Primary Action Button */}
      <button
        onClick={onNewDecision}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-sans"
        id="btn-create-new-decision"
      >
        <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
        New Decision Analysis
      </button>

      {/* Preset Pre-Loaded Demos */}
      <div className="rounded-2xl border border-zinc-200/85 bg-white p-4 shadow-sm" id="demobank-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5 font-mono">
          <Bookmark className="h-3.5 w-3.5 stroke-[2.5] text-amber-500" />
          Interactive Presets
        </h3>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onLoadSample("sample-seattle")}
            className="group text-left text-xs font-medium p-2.5 rounded-lg border border-zinc-100 hover:border-indigo-100 hover:bg-indigo-50/40 transition flex flex-col gap-0.5"
            id="preset-btn-seattle"
          >
            <span className="font-semibold text-zinc-800 group-hover:text-indigo-900 line-clamp-1">Relocate to Seattle Tech</span>
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
              <CornerDownRight className="h-2.5 w-2.5" /> Career vs. Family
            </span>
          </button>
          
          <button
            onClick={() => onLoadSample("sample-ev")}
            className="group text-left text-xs font-medium p-2.5 rounded-lg border border-zinc-100 hover:border-indigo-100 hover:bg-indigo-50/40 transition flex flex-col gap-0.5"
            id="preset-btn-ev"
          >
            <span className="font-semibold text-zinc-800 group-hover:text-indigo-900 line-clamp-1">Electric SUV vs Hybrid</span>
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
              <CornerDownRight className="h-2.5 w-2.5" /> Financial Burden vs. Eco
            </span>
          </button>
        </div>
      </div>

      {/* Dynamic Decisions Catalog */}
      <div className="flex-1 rounded-2xl border border-zinc-200/85 bg-white p-4 shadow-sm flex flex-col min-h-[14rem]" id="user-decisions-catalog">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5 font-mono">
          <Scale className="h-3.5 w-3.5 text-indigo-500" />
          Your Dilemmas ({decisions.length})
        </h3>
        
        {decisions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
            <span className="text-xs font-medium text-zinc-400">No custom simulations saved yet. Try creating one!</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[18rem] lg:max-h-[28rem] flex flex-col gap-2.5 pr-0.5">
            {decisions.map((decision) => {
              const isActive = decision.id === activeId;
              return (
                <motion.div
                  key={decision.id}
                  layoutId={`list-item-${decision.id}`}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border transition ${
                    isActive
                      ? "border-indigo-600 bg-indigo-50/30 font-medium text-indigo-950"
                      : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/80 text-zinc-600"
                  }`}
                  id={`history-item-${decision.id}`}
                >
                  <button
                    onClick={() => onSelect(decision.id)}
                    className="flex-1 text-left pr-2 focus:outline-none"
                    id={`btn-select-${decision.id}`}
                  >
                    <p className="text-xs font-semibold line-clamp-2 leading-relaxed text-zinc-900 group-hover:text-indigo-950">
                      {decision.title}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-mono">
                      {new Date(decision.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(decision.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition shrink-0 focus:opacity-100"
                    title="Delete simulation"
                    id={`btn-delete-${decision.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
