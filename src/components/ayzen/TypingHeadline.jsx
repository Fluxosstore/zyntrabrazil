import React, { useState, useEffect, useRef } from "react";

const WORDS = ["à imagem", "ao vídeo", "à imaginação", "à programação"];

const TYPE_SPEED = 60; // ms per char
const ERASE_SPEED = 35; // ms per char
const HOLD_MS = 5000; // hold full word for 5s

export default function TypingHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | erasing
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    const fullText = WORDS[wordIndex];

    if (phase === "typing") {
      if (displayText.length < fullText.length) {
        const id = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, TYPE_SPEED);
        timers.current.push(id);
      } else {
        const id = setTimeout(() => setPhase("erasing"), HOLD_MS);
        timers.current.push(id);
      }
    } else if (phase === "erasing") {
      if (displayText.length > 0) {
        const id = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length - 1));
        }, ERASE_SPEED);
        timers.current.push(id);
      } else {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setPhase("typing");
      }
    }
    return clearTimers;
  }, [displayText, phase, wordIndex]);

  return (
    <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-6 min-h-[2em] flex items-center justify-center flex-wrap gap-x-1.5">
      <span>Do rascunho</span>
      <span className="inline-flex items-baseline">
        {displayText}
      </span>
      <span>, num só lugar</span>
    </h1>
  );
}