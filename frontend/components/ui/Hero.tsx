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
  Loader2,
  Database,
  MessageCircle,
  Trash2,
  Plus,
  History,
  Lock,
  X,
  /* hamburger */
} from "lucide-react";

const GUEST_LIMIT = 2;

export default function HeroSection({ isPro }: { isPro?: boolean }) {
  // CHANGE 1: We destructure `setHistory` here
  const { history, addToHistory, removeHistoryItem, isLoaded, setHistory } =
    useHistory();

  const [activeTab, setActiveTab] = useState("query");
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Responsive: mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedSchema = localStorage.getItem("sql_active_schema");
    if (savedSchema) setSchema(savedSchema);
  }, []);

  // CHANGE 2: Fix the Fetch Logic (Mapping DB fields to UI fields)
  useEffect(() => {
    if (isPro) {
      console.log("Fetching DB History...");
      fetch("/api/queries/get")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch history");
          return res.json(); // <--- Fixed syntax error here
        })
        .then((data) => {
          console.log("Loaded DB History:", data);

          // Map backend fields to frontend format
          // Backend: { id, prompt, sourceSchema, sql, createdAt }
          // Frontend: { id, query, schema, sql, timestamp }
          const formattedHistory = data.map((item: any) => ({
            id: item.id,
            query: item.prompt,
            sql: item.sql,
            schema: item.sourceSchema,
            timestamp: new Date(item.createdAt).getTime(),
          }));

          setHistory(formattedHistory);
        })
        .catch((err) => console.error(err));
    }
  }, [isPro, setHistory]);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (!schema.trim()) {
      alert("Please provide the Database Schema first.");
      setActiveTab("schema");
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
    localStorage.setItem("sql_active_schema", schema);
    setOutput("");

    const combinedPrompt = `\n### DATABASE SCHEMA:\n${schema}\n\n### QUESTION:\n${input}\n    `;

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      if (!response.ok) throw new Error("Failed to generate SQL");

      const data = await response.json();

      // --- 3. SAVE LOGIC ---
      if (isPro) {
        // --- PATH A: PRO USER (Save to DB) ---
        try {
          await fetch("/api/queries/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: input,
              sql: data.response,
              schema: schema,
            }),
          });

          // Update UI immediately (Optimistic update)
          addToHistory(input, "GENERATE", data.response, schema);
        } catch (saveError) {
          console.error("Failed to save query to DB", saveError);
        }
      } else {
        // --- PATH B: GUEST USER (Local Storage + Limits) ---
        if (history.length < GUEST_LIMIT) {
          addToHistory(input, data.response, schema);
        } else {
          setShowLimitModal(true);
        }
      }
      // ---------------------

      setOutput(data.response);
    } catch (error) {
      console.error(error);
      setOutput("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const loadSession = (item: any) => {
    setInput(item.query);
    setOutput(item.sql);
    setSchema(item.schema);
    setActiveTab("query");
    // if we're on mobile, close the drawer to show content
    setSidebarOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedirectToLogin = () => {
    window.location.href = "/auth/signin";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white font-sans text-black overflow-hidden relative">
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-gray-100"
          >
            {/* simple hamburger icon built with spans to avoid adding another dependency */}
            <div className="w-5">
              <span className="block h-0.5 bg-black rounded my-0.5" />
              <span className="block h-0.5 bg-black rounded my-0.5" />
              <span className="block h-0.5 bg-black rounded my-0.5" />
            </div>
          </button>
        </div>
        <div className="text-xs text-gray-500">{isPro ? "Pro" : "Guest"}</div>
      </div>

      {/* --- SIDEBAR (desktop) --- */}
      <aside className="hidden md:flex w-80 bg-white border-r flex-col z-10 shrink-0">
        <div className="p-4">
          <button
            onClick={() => {
              setInput("");
              setOutput("");
            }}
            className="p-3 flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Query
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <History className="w-3 h-3" />
              {isPro ? "History" : "Guest History"}
            </div>

            {/* Hide counter if Pro */}
            {!isPro && (
              <div
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  history.length >= GUEST_LIMIT
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {history.length} / {GUEST_LIMIT} Free
              </div>
            )}
          </div>

          {!isLoaded ? (
            <div className="text-sm text-gray-400 px-2">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-sm text-gray-400 px-2 italic">
              No queries yet.
            </div>
          ) : (
            <div className="space-y-1">
              {history
                .filter((item) => item.type === "GENERATE" || !item.type)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadSession(item)}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {item.query}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistoryItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1.5 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Only show Limit Banner if NOT Pro */}
          {!isPro && history.length >= GUEST_LIMIT && (
            <div className="mt-4 mx-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <Lock className="w-4 h-4 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-2">Guest limit reached.</p>
              <button
                onClick={handleRedirectToLogin}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Sign in to save more
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* --- SIDEBAR (mobile drawer) --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />

            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm font-semibold">History</div>
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="p-3">
                <div className="mb-3">
                  <button
                    onClick={() => {
                      setInput("");
                      setOutput("");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-2xl font-medium hover:bg-gray-800 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Query
                  </button>
                </div>

                {!isLoaded ? (
                  <div className="text-sm text-gray-400 px-2">Loading...</div>
                ) : history.length === 0 ? (
                  <div className="text-sm text-gray-400 px-2 italic">
                    No queries yet.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadSession(item)}
                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {item.query}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1.5 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!isPro && history.length >= GUEST_LIMIT && (
                  <div className="mt-4 mx-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <Lock className="w-4 h-4 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 mb-2">
                      Guest limit reached.
                    </p>
                    <button
                      onClick={handleRedirectToLogin}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Sign in to save more
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-4xl h-fit bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Tab header */}
            <div className="flex p-1 bg-slate-100 rounded-full w-fit mx-auto mb-6">
              <button
                onClick={() => setActiveTab("query")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === "query"
                    ? "bg-white text-indigo-600 shadow-sm" // Active State: Pop out
                    : "text-slate-500 hover:text-slate-700" // Inactive State: Blend in
                }`}
              >
                Query
              </button>
              <button
                onClick={() => setActiveTab("schema")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === "schema"
                    ? "bg-white text-indigo-600 shadow-sm" // Active State: Pop out
                    : "text-slate-500 hover:text-slate-700" // Inactive State: Blend in
                }`}
              >
                Schema
              </button>
            </div>

            <div className="p-6">
              {/* Schema Tab */}
              {activeTab === "schema" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <strong>Instructions:</strong> Paste your schema here.
                    </p>
                  </div>
                  <textarea
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    placeholder="CREATE TABLE users..."
                    className="w-full h-56 md:h-64 p-4 rounded-lg border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-black outline-none resize-none"
                  />
                </div>
              )}

              {/* Query Tab */}
              {activeTab === "query" && (
                <div className="space-y-6">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Find all users..."
                    className="w-full h-28 md:h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none resize-none text-base"
                  />
                  <div className="flex flex-col md:flex-row items-center md:justify-end gap-3">
                    <div className="w-full md:w-auto flex justify-between md:justify-end gap-3">
                      <button
                        onClick={handleGenerate}
                        disabled={loading || !input}
                        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Generating...
                          </>
                        ) : (
                          <>
                            Generate SQL <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Output */}
                  <AnimatePresence>
                    {output && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-4"
                      >
                        <div className="relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-2xl">
                          <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/80" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                              <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
                              <Database className="w-3 h-3" />
                              <span>generated_query.sql</span>
                            </div>
                            <button
                              onClick={copyToClipboard}
                              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md ${
                                copied
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-gray-800 text-gray-300"
                              }`}
                            >
                              {copied ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              {copied ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            language="sql"
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              padding: "1.5rem",
                              background: "transparent",
                              fontSize: "0.9rem",
                            }}
                            showLineNumbers={true}
                            wrapLines={true}
                          >
                            {output}
                          </SyntaxHighlighter>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- LIMIT MODAL --- */}
      <AnimatePresence>
        {showLimitModal && !isPro && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLimitModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl z-50 p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <Lock className="w-6 h-6 text-red-500" />
                </div>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Guest Limit Reached
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                You've generated 2 queries. This result was{" "}
                <strong>not saved</strong> to your history. Sign in to save
                unlimited queries.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRedirectToLogin}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Sign In / Sign Up
                </button>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full text-gray-500 py-2 text-sm hover:text-gray-800"
                >
                  Continue as Guest
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
