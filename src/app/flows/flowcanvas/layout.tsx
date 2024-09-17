import { ReactNode } from 'react';

export default function FlowCanvasLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="">
      <main>{children}</main>
    </div>
  );
}
