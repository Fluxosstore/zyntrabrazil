import React, { useState, useEffect, useRef } from "react";

const PHRASES = [
  "Do rascunho à imagem, num só lugar",
  "Do rascunho ao vídeo, num só lugar",
  "Do rascunho à programação, num só lugar",
  "Do rascunho à imaginação, num só lugar",
];

const TYPE_SPEED = 45; // ms per char
const ERASE_SPEED = 25; // ms per char
const HOLD_MS = 5000; // hold full phrase for 5s

export default function TypingHeadline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | erasing
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    const fullText = PHRASES[phraseIndex];

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
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setPhase("typing");
      }
    }
    return clearTimers;
  }, [displayText, phase, phraseIndex]);

  return (
    <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-6 min-h-[2em] flex items-center justify-center">
      <span>{displayText}</span>
      <span className="inline-block w-[2px] h-5 sm:h-6 bg-black ml-1 animate-pulse" />
    </h1>
  );
}