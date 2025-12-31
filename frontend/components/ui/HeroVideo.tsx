import React from "react";

const HeroVideo = () => {
  return (
    <div className="relative w-full">
      {/* 1. The Glow Effect */}
      <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 opacity-30 blur-2xl transition duration-1000 group-hover:opacity-100" />

      {/* 2. The Container */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
        <div className="flex items-center gap-2 px-2 pb-2 pt-1">
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-3 w-3 rounded-full bg-slate-200" />
        </div>

        {/* 3. The Video Player */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900 shadow-inner">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            {/* Replace with your actual video source */}
            <source src="/getsql best.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default HeroVideo;
