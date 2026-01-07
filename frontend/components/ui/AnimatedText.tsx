"use client";
import { useState, useEffect } from "react";

const words = [
  "Natural language to SQL",
  "Correct your SQL in seconds",
  "Understand what your query actually does",
  "Make your queries lightning fast",
];

export default function AutoTypingText() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 10); // Pause before erasing
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length); // Move to next word
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 40 : 40
    ); // Speed: erasing is usually faster than typing

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <h1 className="text-2xl  font-extrabold text-gray-800">
        {`${words[index].substring(0, subIndex)}`}
        <span className="animate-pulse transition-all border-r-4 border-black ml-1"></span>
      </h1>
    </div>
  );
}
