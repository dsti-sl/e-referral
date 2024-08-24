// Reusable next.js built in button component

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      className={`bg-erefer-rose rounded px-4 py-2 text-white hover:bg-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
