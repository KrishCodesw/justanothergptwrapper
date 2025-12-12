"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false, // We will render manually
  theme: "base",
  themeVariables: {
    primaryColor: "#ffffff",
    primaryTextColor: "#000000",
    primaryBorderColor: "#000000",
    lineColor: "#666666",
    secondaryColor: "#f3f4f6",
    tertiaryColor: "#ffffff",
  },
});

export default function ArchitectureDiagram() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  // Define your diagram code here
  const diagramCode = `
    graph TD
      subgraph Client ["🖥️ Frontend (Next.js)"]
        UI[User Interface]
        Store[Zustand Auth Store]
        Local[LocalStorage (Guest)]
      end

      subgraph Backend ["⚙️ Backend Layer"]
        NextAPI[Next.js API Routes]
        FastAPI[Python FastAPI Engine]
      end

      subgraph Data ["🗄️ Data & AI Layer"]
        DB[(PostgreSQL + Prisma)]
        Gemini[Google Gemini API]
      end

      %% Flows
      UI -->|1. Natural Language| FastAPI
      FastAPI -->|2. Prompt| Gemini
      Gemini -->|3. SQL Response| FastAPI
      FastAPI -->|4. JSON Response| UI

      UI -->|5. Save Query (Pro)| NextAPI
      NextAPI -->|6. Insert| DB
      
      UI -.->|Sync Guest Data| NextAPI
      Local -.->|Read History| UI
  `;

  useEffect(() => {
    const renderDiagram = async () => {
      if (chartRef.current) {
        try {
          // Generate a unique ID for the SVG
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          // Render the SVG based on the code
          const { svg } = await mermaid.render(id, diagramCode);
          setSvg(svg);
        } catch (error) {
          console.error("Mermaid failed to render:", error);
        }
      }
    };

    renderDiagram();
  }, [diagramCode]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        System Architecture
      </h3>
      {/* We inject the SVG directly into the HTML */}
      <div
        ref={chartRef}
        className="w-full flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
