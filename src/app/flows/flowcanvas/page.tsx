'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms, { FormsField } from '@/components/ui/Forms';

interface NodeData {
  id: string;
  label: string;
  parentId?: string;
}

interface Column {
  id: string;
  title: string;
  nodes: NodeData[];
}

const initialColumns: Column[] = [
  { id: 'col-1', title: 'Intialised Flow', nodes: [] },
  { id: 'col-2', title: 'Stage One', nodes: [] },
  { id: 'col-3', title: 'Stage Two', nodes: [] },
  { id: 'col-4', title: 'Stage Three', nodes: [] },
  { id: 'col-5', title: 'Stage Four', nodes: [] },
];

const FlowCanvas: React.FC<{ flowId: string }> = ({ flowId }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);

  useEffect(() => {
    // When the API is ready, we will use this to fetch or initialize the flow
    console.log('Flow ID:', flowId);
  }, [flowId]);

  const formFields: FormsField[] = [
    {
      id: 'label',
      label: 'Node Label',
      type: 'text',
      placeholder: 'Enter node label',
      required: true,
    },
  ];

  const handleNodeClick = (columnId: string) => {
    setCurrentColumnId(columnId);
    setIsDrawerOpen(true); // click event that triggers node drawer
  };

  const handleAddNode = (data: { label: string }) => {
    if (!currentColumnId) return;

    const newNode: NodeData = {
      id: `${Date.now()}`,
      label: data.label,
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === currentColumnId
          ? { ...column, nodes: [...column.nodes, newNode] }
          : column,
      ),
    );

    setIsDrawerOpen(false);
    setCurrentColumnId(null);
  };

  return (
    <div className="h-screen w-full p-8">
      <Link href="/flows" className="text-sm text-gray-900 hover:text-black">
        Back to Flows
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-black">
        Flow Artboard for Flow {flowId}
      </h1>

      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="rounded-lg border bg-blue-800 p-4 shadow"
          >
            <h2 className="text-lg font-semibold">{column.title}</h2>
            <ul className="mt-4 space-y-2">
              {column.nodes.map((node) => (
                <li
                  key={node.id}
                  className="cursor-pointer rounded border bg-rose-500 p-2 shadow hover:bg-rose-900"
                  onClick={() => handleNodeClick(column.id)}
                >
                  {node.label}
                </li>
              ))}
            </ul>
            {column.nodes.length === 0 && (
              <p className="text-white-900 text-center text-sm">
                No nodes yet.
              </p>
            )}
            <Button
              onClick={() => handleNodeClick(column.id)}
              className="mt-2 w-full"
            >
              Add Node to {column.title}
            </Button>
          </div>
        ))}
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size="medium"
        position="right"
      >
        <h2 className="mb-4 text-lg font-semibold">Create New Node</h2>
        <Forms fields={formFields} onSave={handleAddNode} />
      </Drawer>
    </div>
  );
};

export default FlowCanvas;
