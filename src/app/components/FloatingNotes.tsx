import { useEffect, useMemo, useState } from "react";
import { NotebookPen, X, Tag, Flag, Layers, FileText, Plus, ChevronLeft, CheckCircle, MoreVertical, Pencil, Trash2, Lock } from "lucide-react";
import { useNotes, STAGES } from "../notes/NotesContext";

const CATEGORIES = ["Liability", "Medical", "Damages", "Strategy", "General"];
const PRIORITIES = ["Low", "Medium", "High"];

const priorityColor: Record<string, string> = {
  Low: "bg-track text-ink",
  Medium: "bg-tint text-deep",
  High: "bg-red-50 text-red-700",
};

export function FloatingNotes() {
  const { notes, caseName, stage, docContext, addNote, updateNote, deleteNote } = useNotes();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "create">("list");
  const [filter, setFilter] = useState<string>("All");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  // The note being edited (its captured context is locked while editing).
  const editingNote = editingId ? notes.find((n) => n.id === editingId) : undefined;

  // Only show inside the intake pipeline stages.
  const isStagePage = (STAGES as readonly string[]).includes(stage);

  // Notes for the current case only.
  const caseNotes = useMemo(() => notes.filter((n) => n.caseName === caseName), [notes, caseName]);

  // When opening, land on Saved Notes and default the filter to the current stage.
  useEffect(() => {
    if (open) {
      setView("list");
      setFilter(stage || "All");
    }
  }, [open, stage]);

  // Auto-dismiss the success state.
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  if (!isStagePage) return null;

  const filtered = filter === "All" ? caseNotes : caseNotes.filter((n) => n.stage === filter);
  const countFor = (s: string) => (s === "All" ? caseNotes.length : caseNotes.filter((n) => n.stage === s).length);

  const resetForm = () => {
    setContent("");
    setCategory("General");
    setPriority("Medium");
    setEditingId(null);
  };

  const startCreate = () => {
    setSaved(false);
    resetForm();
    setView("create");
  };

  const startEdit = (note: typeof notes[number]) => {
    setMenuId(null);
    setSaved(false);
    setEditingId(note.id);
    setContent(note.content);
    setCategory(note.category);
    setPriority(note.priority);
    setView("create");
  };

  const handleSave = () => {
    if (!content.trim()) return;
    if (editingId) {
      updateNote(editingId, { content, category, priority });
    } else {
      addNote({ content, category, priority });
      setFilter(stage || "All");
    }
    resetForm();
    setView("list");
    setSaved(true);
  };

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Notes"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-ink hover:bg-deep text-white shadow-lg flex items-center justify-center transition-colors"
      >
        <NotebookPen className="w-6 h-6" strokeWidth={1.75} />
        {caseNotes.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center border-2 border-white">
            {caseNotes.length}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Transparent click-catcher — closes the panel, page stays visible */}
          <div className="fixed inset-0 z-[59]" onClick={() => setOpen(false)} />

          {/* Floating panel anchored above the button */}
          <div className="fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-3rem)] max-h-[72vh] bg-white border border-line rounded-xl shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {view === "create" ? (
                  <button onClick={() => { resetForm(); setView("list"); }} className="flex items-center gap-1 text-sm font-medium text-deep hover:text-ink transition-colors">
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.75} /> Back to Notes
                  </button>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-tint flex items-center justify-center shrink-0">
                      <NotebookPen className="w-4 h-4 text-deep" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-ink leading-tight">Case Notes</h2>
                      <p className="text-xs text-[#5B6B78] truncate">{caseName || "—"}</p>
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-tint rounded-lg transition-colors shrink-0">
                <X className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} />
              </button>
            </div>

            {view === "list" ? (
              /* ── Saved Notes ── */
              <>
                {/* Filters */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line overflow-x-auto shrink-0">
                  {["All", ...STAGES].map((s) => {
                    const active = filter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition-colors ${
                          active ? "bg-tint border-brand text-deep" : "bg-white border-line text-[#5B6B78] hover:border-soft hover:text-ink"
                        }`}
                      >
                        {s === "All" ? "All" : s} ({countFor(s)})
                      </button>
                    );
                  })}
                </div>

                {/* Success state */}
                {saved && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border-b border-green-200 text-green-800 text-sm shrink-0">
                    <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    Note saved successfully.
                  </div>
                )}

                {/* Note cards */}
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  <div className="eyebrow">Saved Notes ({caseNotes.length})</div>
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <NotebookPen className="w-8 h-8 text-[#9BDAEC] mb-3" strokeWidth={1.75} />
                      <p className="text-sm font-medium text-ink">No notes yet</p>
                      <p className="text-xs text-[#5B6B78] mt-1">Capture a thought for this {filter === "All" ? "case" : "stage"}.</p>
                    </div>
                  ) : (
                    filtered.map((n) => (
                      <div key={n.id} className="lg-zone rounded-xl p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${priorityColor[n.priority] ?? "bg-track text-ink"}`}>
                              <Flag className="w-3 h-3 inline -mt-0.5 mr-1" strokeWidth={1.75} />{n.priority}
                            </span>
                            <span className="text-xs text-[#5B6B78] bg-white border border-line px-2 py-0.5 rounded-md">{n.category}</span>
                            <span className="text-xs text-deep bg-tint px-2 py-0.5 rounded-md">{n.stage}</span>
                          </div>
                          {/* Overflow menu */}
                          <div className="relative ml-auto shrink-0">
                            <button
                              onClick={() => setMenuId(menuId === n.id ? null : n.id)}
                              className="p-1 -mr-1 hover:bg-tint rounded-lg transition-colors"
                              title="Note actions"
                            >
                              <MoreVertical className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} />
                            </button>
                            {menuId === n.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                                <div className="absolute right-0 mt-1 w-36 bg-white border border-line rounded-lg shadow-md z-20 overflow-hidden">
                                  <button onClick={() => startEdit(n)} className="w-full px-3 py-2 text-sm text-left text-ink hover:bg-wash flex items-center gap-2">
                                    <Pencil className="w-3.5 h-3.5 text-[#5B6B78]" strokeWidth={1.75} /> Edit Note
                                  </button>
                                  <button onClick={() => { deleteNote(n.id); setMenuId(null); }} className="w-full px-3 py-2 text-sm text-left text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2">
                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} /> Delete Note
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {n.reference && (
                          <div className="flex items-center gap-1.5 text-xs text-[#5B6B78] mb-1.5">
                            <Tag className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                            <span className="truncate">{n.contextType}: <span className="text-ink font-medium">{n.reference}</span></span>
                          </div>
                        )}
                        <p className="body-text leading-relaxed whitespace-pre-wrap break-words">{n.content}</p>
                        <p className="mono-ref mt-1.5">{n.author} · {n.timestamp}</p>
                        {n.editedAt && <p className="mono-ref text-[#9BA8B4]">Edited: {n.editedAt}</p>}
                      </div>
                    ))
                  )}
                </div>

                {/* New Note */}
                <div className="px-4 py-3 border-t border-line shrink-0">
                  <button
                    onClick={startCreate}
                    className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-deep text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.75} /> New Note
                  </button>
                </div>
              </>
            ) : (
              /* ── Create / Edit Note ── */
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {/* Captured context — locked to the note's original context when editing */}
                <div className="rounded-lg border border-line bg-offwhite p-3 space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="eyebrow">Captured Context</div>
                    {editingNote && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#5B6B78] uppercase tracking-wide">
                        <Lock className="w-3 h-3" strokeWidth={1.75} /> Locked
                      </span>
                    )}
                  </div>
                  <ContextRow icon={Layers} label="Stage" value={editingNote ? editingNote.stage : stage} />
                  <ContextRow icon={FileText} label="Case" value={(editingNote ? editingNote.caseName : caseName) || "—"} />
                  {editingNote
                    ? editingNote.reference && <ContextRow icon={Tag} label={editingNote.contextType ?? "Context"} value={editingNote.reference} />
                    : docContext && <ContextRow icon={Tag} label={docContext.contextType} value={docContext.reference} />}
                </div>

                {/* Note text */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your note…"
                  rows={4}
                  autoFocus
                  className="w-full border border-line rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-[#5B6B78] focus:outline-none focus:border-brand resize-none transition-colors"
                />

                {/* Attributes */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5B6B78] mb-1.5 block">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand bg-white">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5B6B78] mb-1.5 block">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand bg-white">
                      {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={handleSave} disabled={!content.trim()} className="flex-1 bg-ink hover:bg-deep text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {editingId ? "Save Changes" : "Save Note"}
                  </button>
                  <button onClick={() => { resetForm(); setView("list"); }} className="px-4 py-2.5 bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function ContextRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
      <span className="text-[#5B6B78]">{label}</span>
      <span className="text-ink font-medium truncate ml-auto text-right">{value}</span>
    </div>
  );
}
