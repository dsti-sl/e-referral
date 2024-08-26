import { pages } from 'next/dist/build/templates/app-page';

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center gap-20 bg-rose-300 p-24 text-black">
      <div className="text-3xl">Welcome to e-Refferal Pathways</div>
      <div className="text-lg">
        e-Refferal Pathways Client Dashboard for creating and managing flows and
        data visualizations.
      </div>
    </div>
  );
}
