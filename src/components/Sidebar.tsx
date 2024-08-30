import { Home, Workflow } from 'lucide-react';
import { LogOutIcon } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="items-cent h-50 boarder-2 boarder-gray-900 w-50 flex flex-col justify-start bg-erefer-rose">
      <div className="mb-6">
        <nav className="space-7-4 flex flex-col py-16">
          <a
            href="/dashboard"
            className="item-centre m-auto flex flex-col object-cover px-2 py-4 text-white transition-transform duration-300 hover:scale-110 hover:bg-white hover:bg-opacity-20 hover:text-erefer-rose hover:shadow"
          >
            <Home className="m-auto mb-2 h-8 w-8 object-cover text-white transition-transform duration-300 hover:scale-110 hover:text-erefer-rose hover:shadow" />
            <span className="text-xs">Dashboard</span>
          </a>
          <a
            href="/flows"
            className="item-center m-auto flex flex-col object-cover px-2 py-4 text-white transition-transform duration-300 hover:scale-110 hover:bg-white hover:bg-opacity-20 hover:text-erefer-rose hover:shadow"
          >
            <Workflow className="m-auto mb-2 h-8 w-8 object-cover text-white transition-transform duration-300 hover:scale-110 hover:text-erefer-rose hover:shadow" />
            <span className="text-xs">Flows</span>
          </a>
        </nav>
      </div>
      <button className="m-auto mb-2 mt-72 pt-72">
        <LogOutIcon className="size-8 cursor-pointer object-cover transition-transform duration-300 hover:scale-110 hover:bg-white hover:bg-opacity-20 hover:text-erefer-rose hover:shadow" />
      </button>
      <div className="mt-30 pt-30 h-13 w-13 m-auto size-12 object-cover transition-transform duration-300 hover:scale-110 hover:shadow">
        <a
          href="https://www.dsti.gov.sl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="dsti.png" alt="Logo" />
        </a>
      </div>
    </div>
  );
}
