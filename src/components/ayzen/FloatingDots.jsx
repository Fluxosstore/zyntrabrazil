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
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes ayzen-rise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110%); opacity: 0; }
        }
      `}</style>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute bottom-0 rounded-full bg-violet-500"
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