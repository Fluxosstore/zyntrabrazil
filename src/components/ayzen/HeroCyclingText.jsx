import React, { useState, useEffect } from "react";

const PHRASES = [
  "A imagem num só lugar",
  "O vídeo num só lugar",
  "A programação num só lugar",
  "A imaginação num só lugar",
];

const TYPE_SPEED = 55; // ms per char
const ERASE_SPEED = 30; // ms per char
const HOLD_MS = 5000; // tempo que cada frase fica completa

export default function HeroCyclingText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | erasing

  useEffect(() => {
    const full = PHRASES[phraseIndex];

    if (phase === "typing") {
      if (display.length < full.length) {
        const t = setTimeout(() => setDisplay(full.slice(0, display.length + 1)), TYPE_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), 200);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      const t = setTimeout(() => setPhase("erasing"), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === "erasing") {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(full.slice(0, display.length - 1)), ERASE_SPEED);
        return () => clearTimeout(t);
      }
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
      setPhase("typing");
    }
  }, [display, phase, phraseIndex]);

  return (
    <span className="text-violet-600">
      {display}
      <span className="inline-block w-[2px] h-[0.85em] bg-violet-500 ml-0.5 animate-pulse align-middle" />
    </span>
  );
}