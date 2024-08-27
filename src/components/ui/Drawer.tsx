import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right' | 'top' | 'bottom';
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  size = 'medium',
  position = 'left',
}) => {
  const sizeClasses = {
    small: 'w-1/4',
    medium: 'w-1/3',
    large: 'w-1/2',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0',
    bottom: 'bottom-0',
  };

  const translateClasses = {
    left: '-translate-x-full',
    right: 'translate-x-full',
    top: '-translate-y-full',
    bottom: 'translate-y-full',
  };

  const activeTranslateClasses = {
    left: 'translate-x-0',
    right: '-translate-x-0',
    top: 'translate-y-0',
    bottom: '-translate-y-0',
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          ></div>
          <div
            className={`fixed ${positionClasses[position]} ${
              sizeClasses[size]
            } ${isOpen ? activeTranslateClasses[position] : translateClasses[position]} ${position === 'left' || position === 'right' ? 'h-full' : 'w-full'} bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out`}
          >
            <div>
              <X
                className="absolute left-2 top-2 mt-2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={onClose}
              />
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Drawer;
