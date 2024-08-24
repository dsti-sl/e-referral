import { useState } from 'react';

interface MenuCardProps {
  onSelect: (status: 'Active' | 'Draft' | 'Archived' | 'Deleted') => void;
}

export default function MenuCard({ onSelect }: MenuCardProps) {
  const [selected, setSelected] = useState<
    'Active' | 'Draft' | 'Archived' | 'Deleted'
  >('Active');

  const handleSelect = (
    status: 'Active' | 'Draft' | 'Archived' | 'Deleted',
  ) => {
    setSelected(status);
    onSelect(status);
  };

  return (
    <div className="w-35 h-60 rounded-lg bg-erefer-rose p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Flows Menu </h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => handleSelect('Active')}
            className={`text-left ${selected === 'Active' ? 'border-white-500 border-l-4 pl-2' : 'pl-2'}`}
          >
            <h3 className="font-regular">Active</h3>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect('Draft')}
            className={`text-center ${selected === 'Draft' ? 'border-white-500 border-l-4 pl-2' : 'pl-2'}`}
          >
            <h3 className="font-regular">Draft</h3>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect('Archived')}
            className={`text-center ${selected === 'Archived' ? 'border-white-500 border-l-4 pl-2' : 'pl-2'}`}
          >
            <h3 className="font-regular">Archived</h3>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect('Deleted')}
            className={`text-center ${selected === 'Deleted' ? 'border-white-500 border-l-4 pl-2' : 'pl-2'}`}
          >
            <h3 className="font-regular pr-2">Deleted</h3>
          </button>
        </li>
      </ul>
    </div>
  );
}
