import React from "react";
import {
  Database,
  Search,
  Zap,
  FileText,
  ArrowRight,
  Construction,
} from "lucide-react";

const LandingPage = () => {
  const tools = [
    {
      title: "Natural Language to SQL",
      description:
        "Generate complex SQL queries from plain English prompts and your database schema instantly.",
      icon: <Database className="w-6 h-6" />,
      status: "Live",
      link: "/generate",
      primary: true,
    },
    {
      title: "Query Corrector",
      description:
        "Identify syntax errors or logical flaws in your SQL and get instant fixes.",
      icon: <Construction className="w-6 h-6" />,
      status: "Coming Soon",
      link: "#",
    },
    {
      title: "Query Explainer",
      description:
        "Paste a complex query and receive a human-readable explanation of what it does.",
      icon: <FileText className="w-6 h-6" />,
      status: "Coming Soon",
      link: "#",
    },
    {
      title: "Query Optimizer",
      description:
        "Analyze performance bottlenecks and get recommendations to speed up your queries.",
      icon: <Zap className="w-6 h-6" />,
      status: "Coming Soon",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black  selection:bg-green-300">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-center items-center">
        <div className="text-2xl font-semibold tracking-wider ">
          SQL<span className="text-amber-800"> AI</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-32">
        <div className="max-w-3xl mb-24">
          <h1 className="text-2xl   sm:text-5xl font-semibold tracking-wide mb-8 leading-tight">
            Get Your Queries Instantly
            <br />
            <span className="text-amber-800 ">with natural language.</span>
          </h1>
          <p className="text-xl  text-black leading-relaxed max-w-xl">
            A suite of AI-powered tools designed to help you generate, correct,
            explain, and optimize SQL queries without the headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`
                group relative p-8 rounded-2xl border transition-all duration-300
                ${
                  tool.primary
                    ? "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                    : "bg-slate-50 border-slate-200/60 hover:bg-white hover:border-slate-200"
                }
              `}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 rounded-lg ${
                    tool.primary
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tool.icon}
                </div>

                {/* Status Badge */}
                <span
                  className={`
                  text-xs font-medium px-2.5 py-1 rounded-full border
                  ${
                    tool.status === "Live"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }
                `}
                >
                  {tool.status}
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>

              <p className="text-slate-500 mb-8 leading-relaxed h-12">
                {tool.description}
              </p>

              <div className="flex items-center text-sm font-medium">
                {tool.status === "Live" ? (
                  <span className="flex items-center text-slate-900 group-hover:gap-2 transition-all">
                    Launch Tool <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                ) : (
                  <span className="text-slate-400 cursor-not-allowed">
                    In Development
                  </span>
                )}
              </div>

              {/* Make whole card clickable if live */}
              {tool.status === "Live" && (
                <a
                  href={tool.link}
                  className="absolute inset-0"
                  aria-label={`Go to ${tool.title}`}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200">
        <div className="flex justify-between items-center text-slate-400 text-sm">
          <p>&copy; 2025 SQL AI Suite</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
