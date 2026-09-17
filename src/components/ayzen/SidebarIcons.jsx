export function DiamondLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dia-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="14" height="14" rx="4" fill="url(#dia-grad)" transform="rotate(45 12 12)" />
    </svg>
  );
}

export function ChatPlusIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L3 21Z" />
      <circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <path d="M19 2v4M17 4h4" />
    </svg>
  );
}

export function BooksIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="7" height="16" rx="1" />
      <rect x="14" y="4" width="7" height="16" rx="1" />
      <line x1="6.5" y1="8" x2="6.5" y2="10" />
      <line x1="17.5" y1="8" x2="17.5" y2="10" />
    </svg>
  );
}

export function IntegrationIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="6" height="6" rx="1" />
      <path d="M8 12C12 12 12 5 16 5" />
      <rect x="16" y="2" width="5" height="5" rx="0.5" transform="rotate(45 18.5 4.5)" />
    </svg>
  );
}