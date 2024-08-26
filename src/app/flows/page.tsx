'use client';

import { useState, useEffect } from 'react';
import MenuCard from '@/components/MenuCard';
import FlowsCard from '@/components/FlowsCard';
import Button from '@/components/Button';
import { Plus } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Forms, { FormsField } from '@/components/ui/Forms';

export default function FlowsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    'Active' | 'Draft' | 'Archived' | 'Deleted'
  >('Active');

  const [flowsData, setFlowsData] = useState({
    Active: [
      {
        id: 1,
        name: 'Flow 1',
        description: 'Description 1',
        startDate: '2024-01-01',
      },
      {
        id: 2,
        name: 'Flow 2',
        description: 'Description 2',
        startDate: '2024-01-02',
      },
    ],
    Draft: [
      {
        id: 3,
        name: 'Flow 3',
        description: 'Description 3',
        startDate: '2024-02-01',
      },
    ],
    Archived: [
      {
        id: 4,
        name: 'Flow 4',
        description: 'Description 4',
        startDate: '2024-03-01',
      },
    ],
    Deleted: [
      {
        id: 5,
        name: 'Flow 5',
        description: 'Description 5',
        startDate: '2024-04-01',
      },
    ],
  });

  // Drawer configuration
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState<{
    size: 'small' | 'medium' | 'large';
    position: 'left' | 'right' | 'top' | 'bottom';
  }>({
    size: 'medium',
    position: 'right',
  });

  // Dynamic form configuration using the custom Forms component
  const formFields: FormsField[] = [
    {
      id: 'name',
      label: 'Name/Title',
      type: 'text',
      placeholder: 'Enter flow name',
      required: true,
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter flow description',
      required: true,
    },
    {
      id: 'startDate',
      label: 'Start Date',
      type: 'date',
      placeholder: '',
      required: true,
    },
  ];

  // Handling drawer toggle when the "Create Flow" button is clicked.
  const handleDrawerToggle = (
    size: 'small' | 'medium' | 'large',
    position: 'left' | 'right' | 'top' | 'bottom',
  ) => {
    setDrawerConfig({ size, position });
    setIsDrawerOpen(true);
  };

  const handleSave = (data: { [key: string]: any }) => {
    const newFlowId = Date.now();
    const newFlow = {
      id: newFlowId,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
    };

    setFlowsData((prevData) => ({
      ...prevData,
      Active: [...prevData.Active, newFlow],
    }));

    setIsDrawerOpen(false);
  };

  // Fetching saved flows data from local storage on page load.
  useEffect(() => {
    const savedFlowsData = localStorage.getItem('flowsData');
    if (savedFlowsData) {
      setFlowsData(JSON.parse(savedFlowsData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowsData', JSON.stringify(flowsData));
  }, [flowsData]);

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
          onClick={() => {
            handleDrawerToggle('medium', 'right');
          }}
          className="rounded-18 flex items-center gap-1 bg-black px-2 py-2 text-white hover:bg-white hover:text-black"
        >
          <Plus className="h-5 w-5" />
          <span> Create Flow </span>
        </Button>
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size={drawerConfig.size}
        position={drawerConfig.position}
      >
        <h2 className="mb-4 text-lg font-semibold">Create New Flow</h2>
        <Forms fields={formFields} onSave={handleSave} />
      </Drawer>
    </div>
  );
}
