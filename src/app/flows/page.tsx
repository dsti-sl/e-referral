'use client';

import { useState } from 'react';
import MenuCard from '@/components/MenuCard';
import FlowsCard from '@/components/FlowsCard';
import Button from '@/components/Button';
import { Plus } from 'lucide-react';

export default function FlowsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    'Active' | 'Draft' | 'Archived' | 'Deleted'
  >('Active');

  const flowsData = {
    Active: [
      { id: 1, name: 'Flow 1' },
      { id: 2, name: 'Flow 2' },
    ],
    Draft: [{ id: 3, name: 'Flow 3' }],
    Archived: [{ id: 4, name: 'Flow 4' }],
    Deleted: [{ id: 5, name: 'Flow 5' }],
  };

  return (
    <div className="container mx-auto flex items-center justify-between">
      <div className="ph-20 w-1/4">
        <MenuCard onSelect={setSelectedStatus} />
      </div>
      <div className="w-3/4">
        <FlowsCard status={selectedStatus} flows={flowsData[selectedStatus]} />
      </div>
      <div className="fixed right-24 top-24 py-4 pl-20">
        <Button
          onClick={() => {}}
          className="rounded-18 flex items-center gap-1 bg-black px-2 py-2 text-white hover:bg-white hover:text-black"
        >
          <Plus className="h-5 w-5" />
          <span> Create Flow </span>
        </Button>
      </div>
    </div>
  );
}
