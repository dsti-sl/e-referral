// Layout specific to the "about" page route.
import { ReactNode } from 'react';
import Button from '@/components/Button';

export default function FlowsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col p-12">
      <h1 className="text-black">Flows</h1>
      <main>{children}</main>
    </div>
  );
}
