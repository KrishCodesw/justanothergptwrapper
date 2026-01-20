"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useHistory } from "../hooks/useHistory";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  LayoutTemplate,
  History,
  Lock,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  Database,
  Terminal,
  Trash2,
} from "lucide-react";

const GUEST_LIMIT = 2;

// --- Helper Components ---
const Tooltip = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
      {text}
    </span>
  </div>
);

export default function ZenSqlEditor({ isPro }: { isPro?: boolean }) {
  const { history, addToHistory, removeHistoryItem, setHistory } = useHistory();

  // Core State
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState(""); // SQL Output
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // UI State
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Default closed for cleaner start
  const [showLimitModal, setShowLimitModal] = useState(false);

  // --- Load Logic ---
  useEffect(() => {
    const savedSchema = localStorage.getItem("sql_active_schema");
    if (savedSchema) {
      setSchema(savedSchema);
      setIsSchemaOpen(true);
    }

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
              timestamp: new Date(item.createdAt).getTime(),
            })),
          );
        })
        .catch(console.error);
    }
  }, [isPro, setHistory]);

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (!schema.trim()) {
      setIsSchemaOpen(true); // Open drawer to nudge user
      return;
    }

    setLoading(true);
    localStorage.setItem("sql_active_schema", schema);
    setOutput(""); // Reset output for animation effect

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
        // Save Pro
        fetch("/api/queries/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input, sql: data.response, schema }),
        }).catch(console.error);
        addToHistory(input, "GENERATE", data.response, schema);
      } else {
        // Guest Limit
        if (history.length < GUEST_LIMIT) {
          addToHistory(input, data.response, schema);
        } else {
          setShowLimitModal(true);
        }
      }

      setOutput(data.response);
    } catch (error) {
      setOutput("-- Error: Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const loadSession = (item: any) => {
    setInput(item.query);
    setOutput(item.sql);
    setSchema(item.schema || "");
    setIsSchemaOpen(!!item.schema);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* ================= 1. LEFT DOCK (Navigation) ================= */}
      <nav className="hidden md:flex flex-col items-center py-6 w-18 bg-white border-r border-slate-100 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0">
        <div className="mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full px-3">
          <Tooltip text="History">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl transition-all duration-300 w-full flex justify-center ${
                showHistory
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <History className="w-5 h-5" />
            </button>
          </Tooltip>

          <Tooltip text="New Query">
            <button
              onClick={() => {
                setInput("");
                setOutput("");
              }}
              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 w-full flex justify-center"
            >
              <Zap className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </nav>

      {/* ================= 2. HISTORY DRAWER ================= */}
      <AnimatePresence>
        {showHistory && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="
  hidden
  md:flex md:flex-col
  h-full
  shrink-0
  bg-white
  border-r border-slate-100
  z-20
  overflow-y-auto overflow-x-hidden
"
          >
            <div className="p-5 flex-1 overflow-y-auto">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">
                Recent Queries
              </h2>
              <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="text-sm text-slate-400 italic pl-1">
                    No history found.
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      onClick={() => loadSession(item)}
                      className="group relative p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.sql ? "bg-emerald-400" : "bg-orange-300"
                          }`}
                        />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {item.query}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHistoryItem(item.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-md transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {!isPro && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                  <span>Guest Usage</span>
                  <span>
                    {history.length}/{GUEST_LIMIT}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${history.length >= GUEST_LIMIT ? "bg-red-500" : "bg-indigo-500"}`}
                    style={{
                      width: `${Math.min((history.length / GUEST_LIMIT) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ================= 3. WORKSPACE (Split Pane) ================= */}
      <main className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
        {/* --- LEFT: INPUT PANE --- */}
        {/* min-w-0 is CRITICAL for flex items to shrink properly when the right pane expands */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fc] relative">
          <div className="flex-1 overflow-y-auto px-4 md:px-0">
            <div className="max-w-3xl mx-auto w-full py-8 md:py-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 px-2"
              >
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  Ask your database
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Transform natural language into optimized SQL
                </p>
              </motion.div>

              {/* The "Card" */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                {/* Prompt Input */}
                <div className="p-6">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Find users who signed up in the last 7 days and ordered more than twice..."
                    className="w-full h-32 md:h-40 resize-none outline-none text-lg text-slate-700 placeholder:text-slate-300 bg-transparent font-medium leading-relaxed"
                    spellCheck={false}
                  />
                </div>

                {/* Schema Toggle */}
                <div className="border-t border-slate-50">
                  <button
                    onClick={() => setIsSchemaOpen(!isSchemaOpen)}
                    className="w-full flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider hover:bg-slate-50 transition-colors"
                  >
                    {isSchemaOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    Context: Schema
                    {!schema && (
                      <span className="ml-auto text-[10px] text-indigo-400 normal-case flex items-center gap-1">
                        Required
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isSchemaOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50"
                      >
                        <div className="p-6 pt-2">
                          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-mono">
                              <Database className="w-3 h-3" /> schema.sql
                            </div>
                            <textarea
                              value={schema}
                              onChange={(e) => setSchema(e.target.value)}
                              placeholder="CREATE TABLE users (id INT, name TEXT...);"
                              className="w-full h-32 bg-transparent resize-none outline-none text-xs font-mono text-slate-600 leading-normal"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !input}
                    className="ml-auto flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Generate <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: OUTPUT PANE (Fixed Overflow Issue) --- */}
        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 md:static md:w-[45%] md:min-w-[400px] bg-[#1e1e1e] flex flex-col border-l border-slate-800 shadow-2xl z-40"
            >
              {/* Toolbar */}
              <div className="h-14 shrink-0 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-[#1e1e1e]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 ml-2">
                    result.sql
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCode}
                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  {/* Close Button for User Control */}
                  <button
                    onClick={() => setOutput("")}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editor Surface - Correctly Scrollable */}
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 overflow-auto custom-scrollbar p-6">
                  <SyntaxHighlighter
                    language="sql"
                    style={vscDarkPlus}
                    customStyle={{
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      fontSize: "0.85rem",
                      lineHeight: "1.7",
                      fontFamily: '"Fira Code", monospace',
                    }}
                    showLineNumbers={true}
                    wrapLines={true} // Wraps long lines to prevent horizontal break
                  >
                    {output}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Status Bar */}
              <div className="h-8 shrink-0 bg-[#252526] border-t border-white/5 flex items-center px-4 text-[10px] text-slate-500 font-mono select-none">
                <Terminal className="w-3 h-3 mr-2 opacity-50" />
                <span>Ready</span>
                <span className="mx-2 opacity-20">|</span>
                <span>UTF-8</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- LIMIT MODAL --- */}
      <AnimatePresence>
        {showLimitModal && !isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Guest limit reached
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  You've used your {GUEST_LIMIT} free queries. Sign up to
                  continue generating SQL without limits.
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
