import React from 'react';
import { CopyrightIcon } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="flex items-center font-extralight text-gray-700">
      <div className="m-auto flex px-96">
        <CopyrightIcon className="size-4 pt-1" />
        <h1 className="text-sm">2024DSTI.All right reserve</h1>
      </div>

      <div className="ml-auto flex px-2 text-sm">
        <a
          href="https://dsti.gov.sl/about-us"
          target="_blank"
          rel="noopener noreferrer cursor-pointer"
        >
          Abous Us
        </a>
        <h1 className="px-4 text-sm">Privacy Policy</h1>
      </div>
    </footer>
  );
};

export default Footer;
