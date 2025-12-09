"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For the smooth entry
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useHistory } from "../hooks/useHistory";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // VS Code Dark Theme
import {
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Database,
  MessageCircle,
} from "lucide-react";

export default function HeroSection() {
  const { history, addToHistory, removeHistoryItem, isLoaded } = useHistory();
  const [activeTab, setActiveTab] = useState("query");
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate SQL");
      }

      const data = await response.json();
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
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-3xl  sm:max-w-5xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveTab("query")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "query"
                ? "bg-white border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Query
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "schema"
                ? "bg-white border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Database className="w-4 h-4" />
            Schema Setup
          </button>
        </div>

        <div className="p-6 min-h-[400px]">
          {/* TAB 1: SCHEMA INPUT */}
          {activeTab === "schema" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong> Paste your schema here. The AI
                  needs this to know your table names and columns.
                </p>
              </div>
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder="CREATE TABLE users (id INT, name TEXT...);"
                className="w-full h-64 p-4 rounded-lg border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-black outline-none resize-none"
              />
            </div>
          )}

          {activeTab === "query" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Describe your query
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Find all users who signed up last week..."
                  className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none resize-none text-base"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !input}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate SQL
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <AnimatePresence>
                {output && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full mt-8"
                  >
                    {/* THE "TERMINAL" WINDOW CONTAINER */}
                    <div className="relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-2xl ring-1 ring-white/10">
                      {/* WINDOW HEADER (Mac Style) */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
                        {/* Window Controls */}
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                        </div>

                        {/* Filename Label */}
                        <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
                          <Database className="w-3 h-3" />
                          <span>generated_query.sql</span>
                        </div>

                        {/* Action Button (Copy) */}
                        <button
                          onClick={copyToClipboard}
                          className={`
              flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200
              ${
                copied
                  ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/50"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white ring-1 ring-gray-700"
              }
            `}
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy SQL</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* CODE BODY */}
                      <div className="relative group">
                        {/* The Syntax Highlighter */}
                        <SyntaxHighlighter
                          language="sql"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: "1.5rem",
                            background: "transparent", // Use container bg
                            fontSize: "0.9rem",
                            lineHeight: "1.6",
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', monospace", // If you have these fonts
                          }}
                          showLineNumbers={true}
                          lineNumberStyle={{
                            minWidth: "2.5em",
                            paddingRight: "1em",
                            color: "#6e7681",
                            textAlign: "right",
                          }}
                          wrapLines={true}
                        >
                          {output}
                        </SyntaxHighlighter>

                        {/* Optional: Subtle Overlay for "Focus" effect */}
                        <div className="pointer-events-none absolute inset-0   from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* FOOTER NOTE (Optional Trust Builder) */}
                    <div className="mt-3 flex justify-end gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1 hover:text-gray-600 transition-colors cursor-pointer">
                        Running on PostgreSQL dialect
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 hover:text-gray-600 transition-colors cursor-pointer">
                        {output.split("\n").length} lines
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
