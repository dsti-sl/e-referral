import { CopyrightIcon } from 'lucide-react';

export default function Foote() {
  return (
    <footer className="w-full bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="UNICEF_Logo.png" alt="UNICEF Logo" className="h-6 w-auto" />
        </div>
        <div className="flex items-center">
          <span className="text-gray-700">© 2024 All rights reserved.</span>
        </div>
        <div className="flex items-center">
          <h1 className="px-5 py-2.5 md:mb-0 lg:leading-normal">
            <a
              href="https://www.dsti.gov.sl/about-us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              About Us
            </a>
          </h1>
          ;k
        </div>
      </div>
    </footer>
  );
}
