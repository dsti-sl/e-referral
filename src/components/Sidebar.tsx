import { Home, Workflow } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="items-cent h-50 boarder-2 boarder-gray-900 w-50 flex flex-col justify-start bg-erefer-rose">
      <div className="mb-6">
        <nav className="space-7-4 flex flex-col py-16">
          <a
            href="/"
            className="item-centre m-auto flex flex-col px-2 py-4 text-gray-400 hover:text-white"
          >
            <Home className="m-auto mb-2 h-8 w-8 text-white" />
            <span className="text-xs">Dashboard</span>
          </a>
          <a
            href="/flows"
            className="item-center m-auto flex flex-col px-2 py-4 text-gray-400 hover:text-white"
          >
            <Workflow className="m-auto mb-2 h-8 w-8 text-white" />
            <span className="text-xs">Flows</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
