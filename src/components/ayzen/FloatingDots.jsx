import React, { useMemo } from "react";

const DOT_COUNT = 26;

export default function FloatingDots() {
  const dots = useMemo(
    () =>
      Array.from({ length: DOT_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 10,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes ayzen-rise {
          0% { top: 100%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: -6%; opacity: 0; }
        }
      `}</style>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-violet-500"
          style={{
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: d.opacity,
            animation: `ayzen-rise ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}