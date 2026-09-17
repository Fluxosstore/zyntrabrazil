export default function IncognitoAvatar({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fedora brim */}
      <ellipse cx="16" cy="11" rx="11" ry="1.8" fill="currentColor" stroke="none" />
      {/* Fedora crown */}
      <path d="M9 11c0-2 2-3.5 7-3.5s7 1.5 7 3.5" fill="currentColor" stroke="none" />
      <path d="M9.5 10.5c0-1.8 2-3 6.5-3s6.5 1.2 6.5 3" />
      {/* Sunglasses bridge */}
      <path d="M14 16h4" />
      {/* Left lens */}
      <rect x="4.5" y="14.5" width="9" height="3.5" rx="1.5" />
      {/* Right lens */}
      <rect x="18.5" y="14.5" width="9" height="3.5" rx="1.5" />
      {/* Jaw / face outline */}
      <path d="M7.5 19c0 4 3.5 7 8.5 7s8.5-3 8.5-7" />
    </svg>
  );
}