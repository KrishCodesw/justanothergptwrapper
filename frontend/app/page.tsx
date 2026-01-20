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

      link: "/querycorrector",
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
    <div className="min-h-screen bg-white text-black bg-linear-to-t  from-amber-50 via-amber-100 amber-200 amber-400 to-amber-700   selection:bg-green-300">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8  flex justify-center items-center">
        <div className="text-5xl font-light tracking-tight">
          query<span className="font-extrabold">.</span>
        </div>
      </nav>

      <main className="max-w-7xl  mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="lg:w-1/2 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.1]">
              SQL that works.
              <br />
              <span className="text-black/80 font-medium">
                From intent to execution.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Generate, fix, explain, and optimize SQL using plain English and
              your schema.
            </p>
          </div>

          <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
            <HeroVideo />
          </div>
        </div>
        {/* bg-radial from-teal-100 via-amber-200 to-orange-300
         */}
        {/* bg-radial from-zinc-100 via-amber-200 to-zinc-300 */}
        <div
          className="grid grid-cols-1 md:grid-cols-2   bg-radial from-amber-50 via-amber-200 amber-400 amber-600 to-amber-800
 rounded-xl border-2 border-black   p-2 lg:grid-cols-2 gap-4"
        >
          {tools.map((tool, index) => (
            <div
              key={index}
              className="
    group relative p-8 rounded-xl
    bg-white/20
    backdrop-blur-2xl
    border border-white/30
    shadow-lg
    transition-all duration-300
    hover:shadow-2xl
    hover:-translate-y-1
    hover:scale-[1.02]
  "
            >
              <a href={tool.link}>
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
        <div className="mt-16 text-lg text-black/70 leading-relaxed">
          <AutoTypingText />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
