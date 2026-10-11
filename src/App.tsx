import { useState, useEffect } from "react";
import Header from "./components/Header";
import HistorySidebar from "./components/HistorySidebar";
import DecisionForm from "./components/DecisionForm";
import VerdictPanel from "./components/VerdictPanel";
import ProsConsPanel from "./components/ProsConsPanel";
import SWOTPanel from "./components/SWOTPanel";
import ComparisonMatrix from "./components/ComparisonMatrix";
import { SAMPLE_DECISIONS } from "./sampleDecisions";
import { DecisionWorkspace, DecisionFactor, SWOTItem, ComparisonCriterion, ComparisonOption } from "./types";
import { Edit2, Check, Scale, BookOpen, Layers, BarChart4, ChevronRight, HelpCircle } from "lucide-react";

export default function App() {
  const [decisions, setDecisions] = useState<DecisionWorkspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Tabs: 'verdict', 'proscons', 'swot', 'comparison'
  const [activeTab, setActiveTab] = useState<"verdict" | "proscons" | "swot" | "comparison">("verdict");
  
  // Title/Description inline editing state
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Load saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem("tiebreaker_decisions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DecisionWorkspace[];
        setDecisions(parsed);
        if (parsed.length > 0) {
          setActiveId(parsed[0].id);
        }
      } catch (err) {
        console.error("Local storage decode error. Resorting to samples.");
        setDecisions(SAMPLE_DECISIONS);
        setActiveId(SAMPLE_DECISIONS[0].id);
      }
    } else {
      // Seed with highly detailed, realistic sample decisions
      setDecisions(SAMPLE_DECISIONS);
      setActiveId(SAMPLE_DECISIONS[0].id);
    }
  }, []);

  // Sync to localstorage whenever changes occur
  const saveToLocalStorage = (list: DecisionWorkspace[]) => {
    localStorage.setItem("tiebreaker_decisions", JSON.stringify(list));
  };

  const activeWorkspace = decisions.find((d) => d.id === activeId) || null;

  // Initialize editing state when active simulation changes
  useEffect(() => {
    if (activeWorkspace) {
      setEditTitle(activeWorkspace.title);
      setEditDesc(activeWorkspace.description || "");
    }
  }, [activeId]);

  // Handle analytical fetch from Gemini API
  const handleAnalyzeDilemma = async (decisionText: string, optionsText: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/decision/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: decisionText,
          options: optionsText,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || "API Analysis error.");
      }

      const generatedWorkspace = (await res.json()) as DecisionWorkspace;

      const updatedList = [generatedWorkspace, ...decisions];
      setDecisions(updatedList);
      setActiveId(generatedWorkspace.id);
      setActiveTab("verdict");
      saveToLocalStorage(updatedList);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during dynamic AI synthesis. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch Active Decision
  const handleSelectDecision = (id: string) => {
    setActiveId(id);
    setErrorMsg(null);
    setActiveTab("verdict");
    setIsEditingMeta(false);
  };

  // Remove saved decision
  const handleDeleteDecision = (id: string) => {
    const updated = decisions.filter((d) => d.id !== id);
    setDecisions(updated);
    saveToLocalStorage(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Reset to form
  const handleNewDecision = () => {
    setActiveId(null);
    setIsEditingMeta(false);
    setErrorMsg(null);
  };

  // Quick Seed preset
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DECISIONS.find((s) => s.id === sampleId);
    if (!sample) return;

    // Check if it already exists in the active workspace array
    const exists = decisions.find((d) => d.id === sample.id);
    let updated = [...decisions];
    if (!exists) {
      updated = [sample, ...decisions];
      setDecisions(updated);
    }
    setActiveId(sample.id);
    setActiveTab("verdict");
    setIsEditingMeta(false);
    saveToLocalStorage(updated);
  };

  // Update Specific sections of active Workspace
  const handleUpdateFactors = (nextFactors: DecisionFactor[]) => {
    if (!activeId) return;
    const updated = decisions.map((d) => {
      if (d.id === activeId) {
        return {
          ...d,
          prosCons: nextFactors,
        };
      }
      return d;
    });
    setDecisions(updated);
    saveToLocalStorage(updated);
  };

  const handleUpdateSWOT = (nextSWOT: SWOTItem[]) => {
    if (!activeId) return;
    const updated = decisions.map((d) => {
      if (d.id === activeId) {
        return {
          ...d,
          swot: nextSWOT,
        };
      }
      return d;
    });
    setDecisions(updated);
    saveToLocalStorage(updated);
  };

  const handleUpdateCriteria = (nextCriteria: ComparisonCriterion[]) => {
    if (!activeId) return;
    const updated = decisions.map((d) => {
      if (d.id === activeId) {
        return {
          ...d,
          criteria: nextCriteria,
        };
      }
      return d;
    });
    setDecisions(updated);
    saveToLocalStorage(updated);
  };

  const handleUpdateOptionsScores = (nextOptions: ComparisonOption[]) => {
    if (!activeId) return;
    const updated = decisions.map((d) => {
      if (d.id === activeId) {
        return {
          ...d,
          comparisonOptions: nextOptions,
          options: nextOptions.map(o => o.name), // Sync base labels too
        };
      }
      return d;
    });
    setDecisions(updated);
    saveToLocalStorage(updated);
  };

  // Save Title/Description edit
  const handleSaveMetaEditing = () => {
    if (!activeId || !editTitle.trim()) return;
    const updated = decisions.map((d) => {
      if (d.id === activeId) {
        return {
          ...d,
          title: editTitle.trim(),
          description: editDesc.trim() || undefined,
        };
      }
      return d;
    });
    setDecisions(updated);
    saveToLocalStorage(updated);
    setIsEditingMeta(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16 font-sans antialiased text-zinc-900" id="applet-viewport">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Core Branding Header */}
        <Header />

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 flex items-center justify-between" id="global-error-overlay">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-500 hover:text-red-700 ml-4 font-mono select-none"
            >
              ✕ Dismiss
            </button>
          </div>
        )}

        {/* Main Full-Scale Columns Workspace */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR CATALOG LIST (Left column on large grids) */}
          <HistorySidebar
            decisions={decisions}
            activeId={activeId}
            onSelect={handleSelectDecision}
            onDelete={handleDeleteDecision}
            onNewDecision={handleNewDecision}
            onLoadSample={handleLoadSample}
          />

          {/* SIMULATION VISUALIZER WORKSPACE (Primary workspace panel) */}
          <main className="flex-1 w-full" id="workspace-primary-box">
            
            {activeWorkspace ? (
              <div className="space-y-6">
                
                {/* Active Dilemma Header & Description card */}
                <div className="rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-xs relative" id="active-decision-meta-card">
                  {!isEditingMeta ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-900 leading-snug" id="workspace-title-display">
                          {activeWorkspace.title}
                        </h2>
                        <button
                          onClick={() => {
                            setEditTitle(activeWorkspace.title);
                            setEditDesc(activeWorkspace.description || "");
                            setIsEditingMeta(true);
                          }}
                          className="p-2 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 rounded-lg transition shrink-0"
                          title="Edit Title/Background"
                          id="btn-edit-title"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {activeWorkspace.description && (
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed font-sans max-w-4xl" id="workspace-desc-display">
                          {activeWorkspace.description}
                        </p>
                      )}
                      
                      {/* Dynamic Options Badges inline */}
                      <div className="flex flex-wrap gap-2 pt-1 text-[10px] uppercase font-mono font-bold text-zinc-400 items-center">
                        <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> ALTERNATIVES:</span>
                        {activeWorkspace.options && activeWorkspace.options.map((opt, idx) => (
                          <span key={idx} className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md font-semibold">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-mono">Modify Dilemma Definition</h3>
                      
                      <div className="space-y-1">
                        <label htmlFor="edit-title-input" className="block text-[10px] font-bold text-zinc-500 uppercase">Primary Title</label>
                        <input
                          id="edit-title-input"
                          type="text"
                          required
                          className="block w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 outline-none font-semibold"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="edit-desc-input" className="block text-[10px] font-bold text-zinc-500 uppercase">Context description</label>
                        <textarea
                          id="edit-desc-input"
                          rows={2}
                          className="block w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-600 focus:border-indigo-500 outline-none font-medium"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2 border-t border-zinc-100">
                        <button
                          onClick={() => setIsEditingMeta(false)}
                          className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-neutral-100 transition"
                          id="cancel-meta-edit"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveMetaEditing}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-semibold shadow-xs transition flex items-center gap-1"
                          id="save-meta-edit"
                        >
                          <Check className="h-3.5 w-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analytical Tab Toggles */}
                <div className="flex border-b border-zinc-200 bg-white/70 backdrop-blur-xs p-1.5 rounded-xl border border-zinc-250/20 shadow-xs gap-1 sm:gap-2 overflow-x-auto" id="workspace-tab-navbar">
                  <button
                    onClick={() => setActiveTab("verdict")}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                      activeTab === "verdict"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                    id="tab-btn-verdict"
                  >
                    <Scale className="h-4 w-4" />
                    Verdict & Plan
                  </button>

                  <button
                    onClick={() => setActiveTab("proscons")}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                      activeTab === "proscons"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                    id="tab-btn-proscons"
                  >
                    <BookOpen className="h-4 w-4" />
                    Pros & Cons ({activeWorkspace.prosCons.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("swot")}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                      activeTab === "swot"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                    id="tab-btn-swot"
                  >
                    <Layers className="h-4 w-4" />
                    SWOT Matrix ({activeWorkspace.swot.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("comparison")}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                      activeTab === "comparison"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                    id="tab-btn-comparison"
                  >
                    <BarChart4 className="h-4 w-4" />
                    Comparison Table ({activeWorkspace.criteria.length})
                  </button>
                </div>

                {/* Selected Tab content display */}
                <div className="pt-3" id="active-tab-panel-display">
                  {activeTab === "verdict" && (
                    <VerdictPanel
                      verdict={activeWorkspace.verdict}
                      options={activeWorkspace.comparisonOptions}
                      criteria={activeWorkspace.criteria}
                    />
                  )}
                  {activeTab === "proscons" && (
                    <ProsConsPanel
                      factors={activeWorkspace.prosCons}
                      onChange={handleUpdateFactors}
                    />
                  )}
                  {activeTab === "swot" && (
                    <SWOTPanel
                      items={activeWorkspace.swot}
                      onChange={handleUpdateSWOT}
                    />
                  )}
                  {activeTab === "comparison" && (
                    <ComparisonMatrix
                      criteria={activeWorkspace.criteria}
                      options={activeWorkspace.comparisonOptions}
                      onCriteriaChange={handleUpdateCriteria}
                      onDynamicOptionsChange={handleUpdateOptionsScores}
                    />
                  )}
                </div>

              </div>
            ) : (
              // Empty initial Form State
              <DecisionForm onSubmit={handleAnalyzeDilemma} isLoading={isLoading} />
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
