// Layout specific to the "about" page route.
import { ReactNode } from 'react';

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col p-24">
      <header className="text-7xl">About Us</header>
      <main>{children}</main>
    </div>
  );
}
