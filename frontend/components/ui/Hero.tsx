"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useHistory } from "../hooks/useHistory";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy, Check, Zap, LayoutTemplate, History, Lock, ChevronRight,
  ChevronDown, Loader2, X, Database, Terminal, Trash2, Code2, Cpu, Menu,
} from "lucide-react";

const GUEST_LIMIT = 2;

// --- Helper Components ---
const Tooltip = ({ children, text, side = "right" }: { children: React.ReactNode; text: string; side?: "right" | "top"; }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <span className={`absolute ${side === "right" ? "left-full ml-2" : "bottom-full mb-2"} px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl`}>
      {text}
    </span>
  </div>
);

// --- 1. Define Props Interfaces ---
interface HistoryListProps {
  history: any[];
  loadSession: (item: any) => void;
  removeHistoryItem: (id: string) => void;
  isPro?: boolean;
}

interface EditorPanelProps {
  input: string;
  setInput: (val: string) => void;
  schema: string;
  setSchema: (val: string) => void;
  isSchemaOpen: boolean;
  setIsSchemaOpen: (val: boolean) => void;
  handleGenerate: () => void;
  loading: boolean;
}

// --- 2. Move HistoryList OUTSIDE ---
const HistoryList = React.memo(({ history, loadSession, removeHistoryItem, isPro }: HistoryListProps) => (
  <div className="flex flex-col h-full">
    <div className="p-5 shrink-0 border-b border-slate-100/50">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Time Travel
      </h2>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      {history.length === 0 ? (
        <div className="text-sm text-slate-400 italic p-2 text-center mt-10">
          No queries yet.
        </div>
      ) : (
        history.map((item) => (
          <motion.div
            layout
            key={item.id}
            onClick={() => loadSession(item)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md cursor-pointer transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${item.sql ? "bg-emerald-400" : "bg-orange-300"}`} />
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistoryItem(item.id);
                }}
                className="md:opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-md transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-relaxed">
              {item.query}
            </p>
          </motion.div>
        ))
      )}
    </div>
    {!isPro && (
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Free Tier</span>
          <span>{history.length}/{GUEST_LIMIT}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((history.length / GUEST_LIMIT) * 100, 100)}%` }}
            className={`h-full ${history.length >= GUEST_LIMIT ? "bg-red-500" : "bg-indigo-500"}`}
          />
        </div>
      </div>
    )}
  </div>
));
HistoryList.displayName = "HistoryList";

// --- 3. Move EditorPanel OUTSIDE ---
const EditorPanel = React.memo(({ input, setInput, schema, setSchema, isSchemaOpen, setIsSchemaOpen, handleGenerate, loading }: EditorPanelProps) => (
  <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
    <div className="mb-6 md:mb-8 px-1">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
        Ask your database
      </h1>
      <p className="text-slate-500 text-sm md:text-base mt-2">
        Natural language to optimized SQL.
      </p>
    </div>

    <motion.div
      layout
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0"
    >
      <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Find users who signed up in the last 7 days and ordered more than twice..."
          className="w-full flex-1 resize-none outline-none text-base md:text-lg text-slate-700 placeholder:text-slate-300 bg-transparent font-medium leading-relaxed"
          spellCheck={false}
        />
      </div>
      <div className="px-4 md:px-6 mt-4 mb-2 flex justify-end items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !input}
          className="relative overflow-hidden flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 active:scale-95 border-dotted"
        >
          {loading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-100" />
            </div>
          )}
          <span>Generate</span>
          {/* <Sparkles className="w-4 h-4" /> */}
        </button>
      </div>

      <div className="border-t border-slate-50 bg-slate-50/30">
        <button
          onClick={() => setIsSchemaOpen(!isSchemaOpen)}
          className="w-full flex items-center justify-between px-6 py-3 text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            Schema Context
          </div>
          <div className="flex items-center gap-2">
            {!schema && <span className="text-[10px] text-amber-500 font-semibold lowercase px-2 py-0.5 bg-amber-50 rounded-full">Required</span>}
            {isSchemaOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </div>
        </button>
        <AnimatePresence>
          {isSchemaOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 200, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0 h-full overflow-y-auto">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
                  <textarea
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    placeholder="CREATE TABLE users (id INT, name TEXT...);"
                    className="w-full min-h-32 p-4 bg-transparent resize-none outline-none text-xs font-mono text-slate-600 leading-normal"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  </div>
));
EditorPanel.displayName = "EditorPanel";

// --- 4. Main Component ---
export default function ZenSqlEditor({ isPro }: { isPro?: boolean }) {
  const { history, addToHistory, removeHistoryItem, setHistory } = useHistory();

  // Core State
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // UI State
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  // Mobile UI State
  const [activeTab, setActiveTab] = useState<"editor" | "output" | "history">("editor");

  // --- Load Logic ---
  useEffect(() => {
    const savedSchema = localStorage.getItem("sql_active_schema");
    if (savedSchema) {
      setSchema(savedSchema);
      setIsSchemaOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isPro) {
      fetch("/api/queries/get")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setHistory(
            data.map((item: any) => ({
              id: item.id,
              query: item.prompt,
              sql: item.sql,
              schema: item.sourceSchema,
              timestamp: new Date(item.created_at).getTime(),
            }))
          );
        })
        .catch(console.error);
    }
  }, [isPro, setHistory]);

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (!schema.trim()) {
      setIsSchemaOpen(true);
      return;
    }

    setLoading(true);
    localStorage.setItem("sql_active_schema", schema);
    
    const combinedPrompt = `\n### SCHEMA:\n${schema}\n\n### REQUEST:\n${input}\n`;

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();

      if (isPro) {
        fetch("/api/queries/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input, sql: data.response, schema }),
        }).catch(console.error);
        addToHistory(input, "GENERATE", data.response, schema);
      } else {
        if (history.length < GUEST_LIMIT) {
          addToHistory(input, data.response, schema);
        } else {
          setShowLimitModal(true);
        }
      }

      setOutput(data.response);
      setActiveTab("output");
    } catch (error) {
      setOutput("-- Error: Ensure backend is running or check connection.");
      setActiveTab("output");
    } finally {
      setLoading(false);
    }
  };

  const loadSession = (item: any) => {
    setInput(item.query);
    setOutput(item.sql);
    setSchema(item.schema || "");
    setIsSchemaOpen(!!item.schema);
    setActiveTab("editor");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Render ---
  return (
    <div className="flex h-screen w-full bg-[#F3F5F8] text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <nav className="hidden md:flex flex-col items-center py-6 w-[72px] bg-white border-r border-slate-200 z-30 shrink-0">
        <div className="flex flex-col gap-4 w-full px-3">
          <Tooltip text="History">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl transition-all duration-300 w-full flex justify-center ${
                showHistory ? "bg-slate-100 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <History className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip text="New Query">
            <button
              onClick={() => {
                setInput("");
                setSchema("");
                setOutput("");
                setActiveTab("editor");
              }}
              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 w-full flex justify-center"
            >
              <Zap className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
        <div className="mt-auto px-3 w-full">
           <Tooltip text="Logout">
              <button 
                 onClick={() => window.location.href = "/auth/logout"}
                 className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all w-full flex justify-center"
               >
                  <Lock className="w-5 h-5" />
               </button>
           </Tooltip>
        </div>
      </nav>

      {/* ================= HISTORY DRAWER (DESKTOP) ================= */}
      <AnimatePresence>
        {showHistory && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:block h-full shrink-0 bg-[#FAFAFA] border-r border-slate-200 z-20 overflow-hidden"
          >
            {/* 5. Pass props to HistoryList */}
            <HistoryList 
              history={history} 
              loadSession={loadSession} 
              removeHistoryItem={removeHistoryItem} 
              isPro={isPro} 
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ================= MAIN AREA (Split View) ================= */}
      <main className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
        
        {/* --- LEFT PANE (Editor) --- */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-500">
             {/* Mobile Top Bar */}
             <div className="md:hidden h-14 bg-white border-b border-slate-100 flex items-center px-4 justify-between shrink-0">
                 <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <LayoutTemplate className="w-4 h-4 text-white" />
                     </div>
                     <span className="font-bold text-slate-800">GETSQL</span>
                 </div>
                 <div className="text-xs font-medium text-slate-100 bg-slate-100 px-2 py-1 rounded-md">
                    {isPro ? "PRO" : "GUEST"}
                 </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar pb-24 md:pb-8">
                <AnimatePresence mode="wait">
                    {activeTab === "editor" && (
                        <motion.div 
                            key="editor"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full"
                        >
                            {/* 6. Pass props to EditorPanel */}
                            <EditorPanel 
                              input={input}
                              setInput={setInput}
                              schema={schema}
                              setSchema={setSchema}
                              isSchemaOpen={isSchemaOpen}
                              setIsSchemaOpen={setIsSchemaOpen}
                              handleGenerate={handleGenerate}
                              loading={loading}
                            />
                        </motion.div>
                    )}
                    {activeTab === "history" && (
                        <motion.div 
                            key="history"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <HistoryList 
                              history={history} 
                              loadSession={loadSession} 
                              removeHistoryItem={removeHistoryItem} 
                              isPro={isPro} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
        </div>

        {/* --- RIGHT PANE (Output) --- */}
        <AnimatePresence>
          {(output && (window.innerWidth >= 768 || activeTab === "output")) && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 top-14 md:top-0 md:static md:w-[45%] md:min-w-[450px] bg-[#0f172a] flex flex-col border-l border-slate-800 shadow-2xl z-40"
            >
              <div className="h-12 shrink-0 border-b border-white/10 flex items-center justify-between px-4 bg-[#0f172a] select-none">
                <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono font-medium">sql_output.log</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={copyCode}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-md transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                        setOutput("");
                        setActiveTab("editor");
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 relative overflow-hidden bg-[#0f172a]">
                <div className="absolute inset-0 overflow-auto custom-scrollbar p-4 md:p-6">
                  <SyntaxHighlighter
                    language="sql"
                    style={vscDarkPlus}
                    customStyle={{
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", color: "#475569" }}
                  >
                    {output}
                  </SyntaxHighlighter>
                </div>
              </div>
              
               <div className="h-8 shrink-0 bg-[#0b1120] flex items-center px-4 text-[10px] text-slate-500 font-mono gap-4">
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> 0.4s</span>
                  <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Postgres</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around p-2">
              <button 
                onClick={() => setActiveTab("editor")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === "editor" ? "text-indigo-600 bg-indigo-50" : "text-slate-400"}`}
              >
                  <Code2 className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Editor</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("output")}
                disabled={!output}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${activeTab === "output" ? "text-indigo-600 bg-indigo-50" : "text-slate-400 disabled:opacity-30"}`}
              >
                  {output && <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                  <Terminal className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Result</span>
              </button>

              <button 
                onClick={() => setActiveTab("history")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === "history" ? "text-indigo-600 bg-indigo-50" : "text-slate-400"}`}
              >
                  <History className="w-5 h-5" />
                  <span className="text-[10px] font-medium">History</span>
              </button>
          </div>
      </div>

      {/* ================= LIMIT MODAL ================= */}
      <AnimatePresence>
        {showLimitModal && !isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Usage limit reached
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                You've used your {GUEST_LIMIT} free queries. Sign in to
                unlock unlimited SQL generation.
              </p>
              <button
                onClick={() => (window.location.href = "/auth/signin")}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-indigo-600 transition-colors shadow-lg"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
        .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}

// --- Icons used for extra polish ---
function Sparkles({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
}