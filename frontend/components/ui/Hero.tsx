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
  Lock, // NEW: Import Lock icon
  X, // NEW: Import X for modal
} from "lucide-react";

const GUEST_LIMIT = 2; // <--- 1. DEFINE THE LIMIT

export default function HeroSection() {
  const { history, addToHistory, removeHistoryItem, isLoaded } = useHistory();
  const [activeTab, setActiveTab] = useState("query");
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // NEW: State for the Limit Modal
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    const savedSchema = localStorage.getItem("sql_active_schema");
    if (savedSchema) setSchema(savedSchema);
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (!schema.trim()) {
      alert("Please provide the Database Schema first.");
      setActiveTab("schema");
      return;
    }

    setLoading(true);
    localStorage.setItem("sql_active_schema", schema);
    setOutput("");

    const combinedPrompt = `
### DATABASE SCHEMA:
${schema}

### QUESTION:
${input}
    `;

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      if (!response.ok) throw new Error("Failed to generate SQL");

      const data = await response.json();

      // --- 2. THE LIMIT LOGIC ---
      if (history.length < GUEST_LIMIT) {
        // If under limit, save as usual
        addToHistory(input, data.response, schema);
      } else {
        // If limit reached, DO NOT save, and show modal
        setShowLimitModal(true);
      }
      // --------------------------

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
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedirectToLogin = () => {
    // Replace with your actual login redirect
    window.location.href = "/auth/signin";
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden relative">
      {/* --- SIDEBAR --- */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10">
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => {
              setInput("");
              setOutput("");
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Query
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <History className="w-3 h-3" />
              Guest History
            </div>
            {/* 3. VISUAL COUNTER */}
            <div
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                history.length >= GUEST_LIMIT
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {history.length} / {GUEST_LIMIT} Free
            </div>
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

          {/* LIMIT REACHED BANNER IN SIDEBAR */}
          {history.length >= GUEST_LIMIT && (
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
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          {/* ... (Existing Card Component Code - No Changes Here) ... */}
          <div className="w-full max-w-4xl h-fit bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* ... Your Existing Header Tabs ... */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setActiveTab("query")}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 ${
                  activeTab === "query"
                    ? "bg-white border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Query
              </button>
              <button
                onClick={() => setActiveTab("schema")}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 ${
                  activeTab === "schema"
                    ? "bg-white border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Database className="w-4 h-4" /> Schema Setup
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
                    className="w-full h-64 p-4 rounded-lg border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-black outline-none resize-none"
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
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none resize-none text-base"
                  />
                  <div className="flex justify-end">
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

                  {/* Output */}
                  <AnimatePresence>
                    {output && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-8"
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
      </div>

      {/* --- 4. THE LIMIT MODAL --- */}
      <AnimatePresence>
        {showLimitModal && (
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
