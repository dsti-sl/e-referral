import { Home, Workflow } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="items-cent flex h-full w-20 flex-col justify-start bg-gray-900">
      <div className="mb-6">
        <nav className="space-7-4 flex flex-col">
          <a
            href="/"
            className="item-centre m-auto flex flex-col px-2 py-4 text-gray-400 hover:text-white"
          >
            <Home className="m-auto mb-2 h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </a>
          <a
            href="/"
            className="item-center m-auto flex flex-col px-2 py-4 text-gray-400 hover:text-white"
          >
            <Workflow className="m-auto mb-2 h-6 w-6" />
            <span className="text-xs">Flows</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
