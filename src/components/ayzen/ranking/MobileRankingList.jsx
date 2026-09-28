import React from "react";

function ModelLogo({ logo, size = 28 }) {
  if (logo?.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return (
    <img src={logo} alt="" className="rounded-full object-contain shrink-0" style={{ width: size, height: size }} />
  );
}

export default function MobileRankingList({ models }) {
  const list = models || [];
  const maxShare = list[0]?.share || 1;

  return (
    <div className="space-y-2.5">
      {list.map((m) => (
        <div key={m.rank} className="rounded-2xl border border-[#EBEBEB] bg-white p-3.5">
          <div className="flex items-center gap-3">
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#FEFBEB] border border-[#EBD48D] text-[11px] font-bold text-[#B45309]">
              #{m.rank}
            </span>
            <ModelLogo logo={m.logo} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate leading-tight">{m.name}</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">{m.tokens}</p>
            </div>
            <span className="text-base font-bold text-black shrink-0">
              {m.share.toFixed(1).replace(".", ",")}%
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[#E0E0E0] overflow-hidden">
            <div
              className="h-full bg-[#666666] rounded-full"
              style={{ width: `${Math.max(2, (m.share / maxShare) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#6B6B6B]">Tokens: {m.tokens}</span>
            <span className="text-xs font-semibold text-black">{m.share.toFixed(1).replace(".", ",")}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}