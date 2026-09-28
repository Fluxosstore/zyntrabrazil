import React from "react";

/**
 * Stack of three coins — line art, matches reference icon.
 * Three stacked ellipses with side walls and bottom curve.
 */
export function CoinStackIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="8" ry="2.5" />
      <path d="M4 5v14a8 2.5 0 0 0 16 0V5" />
      <path d="M4 10a8 2.5 0 0 0 16 0" />
      <path d="M4 15a8 2.5 0 0 0 16 0" />
    </svg>
  );
}

/**
 * Receipt with horizontal lines — line art, matches reference icon.
 * Scalloped bottom edge and three horizontal dashes of varying lengths.
 */
export function ReceiptLinesIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 2h14v17l-3 2l-3 -2l-3 2l-3 -2V2Z" />
      <path d="M8 8h8" />
      <path d="M8 12h5" />
    </svg>
  );
}