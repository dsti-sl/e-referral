'use client';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useCallback } from 'react';
import MenuCard from '@/components/MenuCard';
import FlowsCard from '@/components/FlowsCard';
import Button from '@/components/Button';
import Drawer from '@/components/ui/Drawer';
import Forms, { FormsField } from '@/components/ui/Forms';
import { LoadingView } from '@/components/shared/LoadingView';

export default function FlowsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    'Active' | 'Draft' | 'Archived' | 'Deleted'
  >('Active');
  const [flowsData, setFlowsData] = useState<{ [key: string]: any[] }>({
    Active: [],
    Draft: [],
    Archived: [],
    Deleted: [],
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState<{
    size: 'small' | 'medium' | 'large';
    position: 'left' | 'right' | 'top' | 'bottom';
  }>({
    size: 'medium',
    position: 'right',
  });

  const BaseUrl = process.env.BASE_URL;

  const formFields: FormsField[] = [
    {
      id: 'message',
      label: 'Message*',
      type: 'text',
      placeholder: 'Enter flow message',
      required: true,
    },
    {
      id: 'allow_custom_feedback',
      label: '',
      type: 'checkbox',
      options: [
        {
          label: 'Allow Custom Input ',
          labelDescription: '(Allowing users to enter custom input)',
          value: 'allow_custom_feedback',
        },
      ],
    },
    {
      id: 'name',
      label: 'Name*',
      type: 'text',
      placeholder: 'Enter flow name',
      required: true,
    },
    {
      id: 'priority',
      label: 'Priority*',
      type: 'number',
      required: true,
    },
    {
      id: 'description',
      label: 'Description*',
      type: 'textarea',
      placeholder: 'Enter detailed description about the flow',
      required: true,
    },
    {
      id: 'terminate',
      label: '',
      type: 'checkbox',
      options: [{ label: 'Terminate', value: 'terminate' }],
    },
    {
      id: 'validate',
      label: '',
      type: 'checkbox',
      options: [{ label: 'Validate', value: 'validate' }],
    },
  ];

  const handleDrawerToggle = useCallback(
    (
      size: 'small' | 'medium' | 'large',
      position: 'left' | 'right' | 'top' | 'bottom',
    ) => {
      setDrawerConfig({ size, position });
      setIsDrawerOpen(true);
    },
    [],
  );

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleSave = useCallback(
    async (data: { [key: string]: any }) => {
      const newFlow = {
        name: data.name,
        message: data.message,
        description: data.description,
        priority: data.priority,
        allow_custom_feedback: data.allow_custom_feedback || false,
        validator: data.validator || null,
        terminator: data.terminator || null,
      };

      try {
        const response = await fetch(`${BaseUrl}/flows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFlow),
        });

        if (!response.ok) {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error!',
            text: errorData.detail || 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return;
        }

        const result = await response.json();

        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'Flow created successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        setFlowsData((prevData) => ({
          ...prevData,
          Active: [...prevData.Active, result],
        }));
      } catch (err) {
        console.error('Failed to save flow:', err);

        // Show error alert
        Swal.fire({
          title: 'Error!',
          text: err.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setIsDrawerOpen(false);
      }
    },
    [BaseUrl],
  );

  const fetchFlows = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/flows`);
      if (!response.ok) throw new Error('Failed to fetch flows');

      const data = await response.json();

      const activeFlows = data.filter(
        (flow: any) => !flow.is_disabled && flow.priority >= 0,
      );
      const draftFlows = data.filter((flow: any) => flow.priority === 0);
      const archivedFlows = data.filter(
        (flow: any) => flow.is_disabled && flow.priority < 0,
      );
      const deletedFlows = data.filter(
        (flow: any) => flow.is_disabled && flow.priority === -1,
      );

      setFlowsData({
        Active: activeFlows,
        Draft: draftFlows,
        Archived: archivedFlows,
        Deleted: deletedFlows,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.detail || 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-between sm:w-full md:flex-row">
      <div className="flex w-full flex-wrap md:flex-nowrap">
        <div className="ph-20 sm:w-full md:w-1/4 lg:w-1/4">
          <MenuCard onSelect={setSelectedStatus} />
        </div>
        <LoadingView
          isLoading={isLoading}
          text="Please Wait..."
          view={
            <div className="sm:mt-4 sm:w-full md:w-3/4 lg:w-3/4">
              <FlowsCard
                status={selectedStatus}
                flows={flowsData[selectedStatus]}
              />
            </div>
          }
        />
      </div>

      <div className="fixed right-24 top-24 py-4 pl-10">
        <Button
          onClick={() => handleDrawerToggle('medium', 'right')}
          className="rounded-18 flex items-center gap-1 bg-black px-2 py-2 text-white hover:bg-white hover:text-black"
        >
          <span>Create Flow</span>
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
