import React from "react";

export default function ImaginingCard({ modelName }) {
  return (
    <div className="max-w-[80%]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm font-bold text-black">{modelName || "Imagem"}</span>
      </div>
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0B0B0E]">
        {/* Animated flares */}
        <div
          className="absolute w-2/3 h-2/3 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #6A00FF 0%, transparent 70%)",
            animation: "imagine-flare-1 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-1/2 h-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #4B0082 0%, transparent 70%)",
            animation: "imagine-flare-2 3.5s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-1/2 h-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #8A2BE2 0%, transparent 70%)",
            animation: "imagine-flare-3 4s ease-in-out infinite",
          }}
        />

        {/* Imaginando badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
          <span
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{ animation: "imagine-pulse 1.2s ease-in-out infinite" }}
          />
          <span className="text-[11px] font-medium text-white">Imaginando</span>
        </div>
      </div>
    </div>
  );
}