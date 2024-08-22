import { Home, Workflow } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="items-cent flex h-full w-20 flex-col bg-gray-900 py-4">
      <div className="mb-6">
        <nav className="space-7-4 flex flex-col">
          <a
            href="/"
            className="item-center flex flex-col text-gray-400 hover:text-white"
          >
            <Home className="mb-2 h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </a>
          <a
            href="/"
            className="hover:text-whte item-center flex flex-col text-gray-400"
          >
            <Workflow className="mb-2: h-6 w-6" />
            <span className="text-xs">Flows</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
