import React from 'react';
import { Smartphone } from 'lucide-react';

const FloatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="group fixed right-3 top-1/4 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-500 text-white shadow-lg transition-all duration-100 hover:h-16 hover:w-40 hover:rounded-lg hover:border-2 hover:border-erefer-rose hover:bg-erefer-rose"
      onClick={onClick}
    >
      <Smartphone className="h-8 w-8" />
      <span className="hidden text-center group-hover:flex">
        Run in Simulator
      </span>
    </button>
  );
};

export default FloatButton;
