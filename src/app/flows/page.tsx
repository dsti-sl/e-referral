'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuCard from '@/components/MenuCard';
import FlowsCard from '@/components/FlowsCard';
import Button from '@/components/Button';
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState<{
    size: 'small' | 'medium' | 'large';
    position: 'left' | 'right' | 'top' | 'bottom';
  }>({
    size: 'medium',
    position: 'right',
  });

  const formFields: FormsField[] = [
    {
      id: 'name',
      label: 'Name/Title*',
      type: 'text',
      placeholder: 'Enter flow name',
      required: true,
    },
    {
      id: 'status',
      label: 'Status*',
      type: 'radio',
      options: [
        { label: 'Custom', value: 'custom' },
        { label: 'Disabled', value: 'disabled' },
      ],
      required: true,
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'High Level', value: 'high' },
        { label: 'Mid Level', value: 'mid' },
        { label: 'Low Level', value: 'low' },
      ],
      required: true,
    },
    {
      id: 'description',
      label: 'Description*',
      type: 'textarea',
      placeholder: 'Enter flow description',
      required: true,
    },
    {
      id: 'terminate',
      label: '',
      type: 'radio',
      options: [{ label: 'Terminate', value: 'terminate' }],
    },
    {
      id: 'validate',
      label: '',
      type: 'radio',
      options: [{ label: 'Validate', value: 'validate' }],
    },
  ];

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

  useEffect(() => {
    const savedFlowsData = localStorage.getItem('flowsData');
    if (savedFlowsData) setFlowsData(JSON.parse(savedFlowsData));
  }, []);

  useEffect(() => {
    localStorage.setItem('flowsData', JSON.stringify(flowsData));
  }, [flowsData]);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-between sm:w-full md:flex-row">
      <div className="ph-20 sm:w-full md:w-1/4 lg:w-1/4">
        <MenuCard onSelect={setSelectedStatus} />
      </div>
      <div className="sm:mt-4 sm:w-full md:ml-2 md:w-3/4 lg:w-3/4">
        <FlowsCard status={selectedStatus} flows={flowsData[selectedStatus]} />
      </div>
      <div className="fixed right-24 top-24 py-4 pl-20">
        <Button
          onClick={() => handleDrawerToggle('medium', 'right')}
          className="rounded-18 flex items-center gap-1 bg-black px-2 py-2 text-white hover:bg-white hover:text-black"
        >
          <span> Create Flow </span>
        </Button>
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        size={drawerConfig.size}
        position={drawerConfig.position}
      >
        <h2 className="mb-4 text-lg font-semibold">Create New Flow</h2>
        <Forms
          onClose={handleDrawerClose}
          fields={formFields}
          onSave={handleSave}
        />
      </Drawer>
    </div>
  );
}
