import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition({ msg, setMsg, lang = "pt-BR" }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const msgRef = useRef(msg);

  useEffect(() => {
    msgRef.current = msg;
  }, [msg]);

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    const baseText = msgRef.current || "";

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      const sep = baseText && !baseText.endsWith(" ") ? " " : "";
      setMsg(baseText + sep + finalText + interim);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }, [listening, setMsg, lang]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return { listening, toggle, supported };
}