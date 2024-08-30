import React from 'react';
import { CopyrightIcon } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="font-extralight text-gray-700">
      <div className="px-4 sm:px-12 md:flex md:items-center md:justify-between">
        <h1 className="md:mb:-0 px-5 py-2.5 lg:leading-normal">
          <a
            href="https://www.dsti.gov.sl/about-us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abous Us
          </a>
        </h1>
        <CopyrightIcon className="-mr-72 size-4 px-0 font-thin text-gray-700" />
        <span className="-ml-72 px-0">2024DSTI.All right reserve</span>
        <h1 className="w-full px-5 py-2.5 md:w-auto">Privacy Policy</h1>
      </div>
    </footer>
  );
};

export default Footer;
