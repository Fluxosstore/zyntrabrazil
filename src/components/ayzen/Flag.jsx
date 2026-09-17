import React from "react";

const FLAGS = {
  PT: (
    <svg viewBox="0 0 24 16" className="w-4 h-3 rounded-[2px] overflow-hidden block">
      <rect width="24" height="16" fill="#009C3B" />
      <path d="M12 2 L22 8 L12 14 L2 8 Z" fill="#FFDF00" />
      <circle cx="12" cy="8" r="2.6" fill="#002776" />
      <path d="M9.6 6.8 a2.6 2.6 0 0 0 4.4 2.4" stroke="#fff" strokeWidth="0.5" fill="none" />
    </svg>
  ),
  EN: (
    <svg viewBox="0 0 24 16" className="w-4 h-3 rounded-[2px] overflow-hidden block">
      <rect width="24" height="16" fill="#fff" />
      <rect y="0" width="24" height="1.23" fill="#B22234" />
      <rect y="2.46" width="24" height="1.23" fill="#B22234" />
      <rect y="4.92" width="24" height="1.23" fill="#B22234" />
      <rect y="7.38" width="24" height="1.23" fill="#B22234" />
      <rect y="9.84" width="24" height="1.23" fill="#B22234" />
      <rect y="12.3" width="24" height="1.23" fill="#B22234" />
      <rect y="14.76" width="24" height="1.23" fill="#B22234" />
      <rect width="10" height="8.6" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="1.5" cy="1.5" r="0.4" />
        <circle cx="3.5" cy="1.5" r="0.4" />
        <circle cx="5.5" cy="1.5" r="0.4" />
        <circle cx="7.5" cy="1.5" r="0.4" />
        <circle cx="2.5" cy="3" r="0.4" />
        <circle cx="4.5" cy="3" r="0.4" />
        <circle cx="6.5" cy="3" r="0.4" />
        <circle cx="8.5" cy="3" r="0.4" />
        <circle cx="1.5" cy="4.5" r="0.4" />
        <circle cx="3.5" cy="4.5" r="0.4" />
        <circle cx="5.5" cy="4.5" r="0.4" />
        <circle cx="7.5" cy="4.5" r="0.4" />
        <circle cx="2.5" cy="6" r="0.4" />
        <circle cx="4.5" cy="6" r="0.4" />
        <circle cx="6.5" cy="6" r="0.4" />
        <circle cx="8.5" cy="6" r="0.4" />
      </g>
    </svg>
  ),
  ES: (
    <svg viewBox="0 0 24 16" className="w-4 h-3 rounded-[2px] overflow-hidden block">
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
    </svg>
  ),
};

export default function Flag({ code, className = "" }) {
  return <span className={`inline-flex items-center ${className}`}>{FLAGS[code]}</span>;
}