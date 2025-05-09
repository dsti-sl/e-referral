// Reusable next.js built in button component

import { ReactNode, forwardRef } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, onClick, className }, ref) => {
  return (
    <button
      ref={ref}
      className={`rounded bg-erefer-rose px-4 py-2 text-black hover:bg-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';


export default Button;