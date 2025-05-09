// Reusable next.js built in button component

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, className = '', type = 'button', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`rounded bg-erefer-rose px-4 py-2 text-black hover:bg-white ${className}`}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
