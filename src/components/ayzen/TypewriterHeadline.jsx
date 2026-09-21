import React, { useState, useEffect } from "react";

const PHRASES = [
  "A imagem num só lugar",
  "O vídeo num só lugar",
  "A programação num só lugar",
  "A imaginação num só lugar",
];

const TYPE_SPEED = 45; // ms per char
const ERASE_SPEED = 25; // ms per char
const HOLD_MS = 5000; // hold full phrase for 5s

export default function TypewriterHeadline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | erasing

  useEffect(() => {
    const full = PHRASES[phraseIndex];
    let timer;

    if (phase === "typing") {
      if (text.length < full.length) {
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), TYPE_SPEED);
      } else {
        timer = setTimeout(() => setPhase("holding"), HOLD_MS);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("erasing"), HOLD_MS);
    } else if (phase === "erasing") {
      if (text.length > 0) {
        timer = setTimeout(() => setText(full.slice(0, text.length - 1)), ERASE_SPEED);
      } else {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, phraseIndex]);

  return (
    <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-6 min-h-[2em] flex items-center justify-center">
      <span>{text}</span>
      <span className="inline-block w-[2px] h-5 sm:h-6 bg-black ml-1 animate-pulse" />
    </h1>
  );
}