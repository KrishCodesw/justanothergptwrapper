"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Database,
  MessageSquare,
} from "lucide-react";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("query");
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (!schema.trim()) {
      alert("Please provide the Database Schema first.");
      setActiveTab("schema");
      return;
    }

    setLoading(true);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveTab("query")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "query"
                ? "bg-white border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
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

              {/* Output Section */}
              {output && (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">
                      Generated SQL
                    </label>
                    <button
                      onClick={copyToClipboard}
                      className="text-xs flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied ? "Copied" : "Copy Code"}
                    </button>
                  </div>
                  <div className="relative group">
                    <pre className="w-full p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm font-mono border border-gray-800">
                      <code>{output}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
