import HeroVideo from "@/components/ui/HeroVideo";
import { ArrowRight } from "lucide-react";
import AutoTypingText from "@/components/ui/AnimatedText";

const LandingPage = () => {
  const tools = [
    {
      title: "Natural Language to SQL",
      description:
        "Generate complex SQL queries from plain English prompts and your database schema instantly.",

      link: "/nl2sql",
      primary: true,
    },
    {
      title: "Query Corrector",
      description:
        "Identify syntax errors or logical flaws in your SQL and get instant fixes.",

      link: "#",
    },
    {
      title: "Query Explainer",
      description:
        "Paste a complex query and receive a human-readable explanation of what it does.",

      link: "#",
    },
    {
      title: "Query Optimizer",
      description:
        "Analyze performance bottlenecks and get recommendations to speed up your queries.",

      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black   selection:bg-green-300">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-center items-center">
        <div className="text-2xl font-semibold rounded-2xl underline-offset-4 decoration-2 decoration-transparent transition-all duration-300 hover:decoration-blue-500 hover:underline  tracking-wider ">
          GET<span className="text-amber-800"> SQL</span>
        </div>
      </nav>

      <main className="max-w-7xl  mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          {/* LEFT COLUMN: TEXT */}
          <div className="lg:w-1/2 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-wide mb-6 leading-tight">
              Get Your Queries Instantly
              <br />
              <span className="text-amber-800">with natural language.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 hover:tracking-widest transition-all duration-300 leading-relaxed mb-8 max-w-lg">
              The all-in-one toolkit for generating and fixing SQL, eliminating
              the need to browse endless documentation.
            </p>
          </div>

          {/* RIGHT COLUMN: VIDEO (The Yellow Area) */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
            <HeroVideo />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl bg-amber-800 p-2 lg:grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`
                group relative p-8 rounded-lg border transition-all duration-300
                ${"bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"}
              `}
            >
              <a href="/nl2sql">
                <h3 className="group transition-all duration-500 ease-in-out text-2xl font-semibold mb-3 tracking-normal hover:tracking-widest group-hover:text-blue-600 flex items-center gap-2">
                  {tool.title}

                  <ArrowRight
                    className="
      w-5 h-5
      opacity-0
      -translate-x-2
      transition-all duration-300 ease-in-out
      group-hover:opacity-100
      group-hover:translate-x-0
    "
                  />
                </h3>
              </a>

              <p className="text-black hover:tracking-wider transition-all ease-in-out duration-500 font-bold h-12">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
        <div className="transition-all   duration-500 ease-in-out  hover:tracking-widest text-xl  text-black leading-relaxed ">
          <AutoTypingText />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
