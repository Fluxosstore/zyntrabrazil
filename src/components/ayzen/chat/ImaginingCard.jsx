import React from "react";
import { motion } from "framer-motion";

export default function ImaginingCard({ modelName, modelLogo }) {
  return (
    <div className="w-full max-w-[420px]">
      <div className="flex items-center gap-2 mb-1.5">
        {modelLogo && (
          <img src={modelLogo} alt={modelName || "Imagem"} className="w-5 h-5 rounded object-contain" />
        )}
        <span className="text-sm font-bold text-black">{modelName || "Imagem"}</span>
      </div>
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0A0F] border border-gray-200">
        {/* Aurora blobs */}
        <motion.div
          className="absolute w-[70%] h-[70%] rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, rgba(126,87,194,0.8) 0%, transparent 70%)", top: "5%", left: "0%" }}
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[60%] h-[60%] rounded-full blur-[35px]"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.7) 0%, transparent 70%)", bottom: "0%", right: "0%" }}
          animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[55%] h-[55%] rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.7) 0%, transparent 70%)", top: "20%", right: "10%" }}
          animate={{ x: [0, -50, 0], y: [0, 70, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Shimmering sweep */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/50"
            style={{ left: `${10 + i * 11}%`, bottom: "5%" }}
            animate={{ y: [0, -250], opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Center glow ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30"
          animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
        />

        {/* Imaginando badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-white">Imaginando</span>
        </div>
      </div>
    </div>
  );
}