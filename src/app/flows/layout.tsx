// Layout specific to the "about" page route.
import { ReactNode } from 'react';

export default function FlowsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col p-12">
      <main>{children}</main>
    </div>
  );
}
