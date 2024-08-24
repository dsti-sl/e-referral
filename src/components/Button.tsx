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
      className={`rounded bg-blue-500 px-4 py-2 text-white hover:text-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
