'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms, { FormsField } from '@/components/ui/Forms';

interface NodeData {
  id: string;
  label: string;
  parentId?: string; // Ties child nodes to their parent node in the previous column
}

interface Column {
  id: string;
  title: string;
  nodes: NodeData[];
  isActive: boolean;
}

const initialColumns: Column[] = [
  { id: 'col-1', title: 'Initialise Flow', nodes: [], isActive: true },
  { id: 'col-2', title: 'Stage One', nodes: [], isActive: false },
  { id: 'col-3', title: 'Stage Two', nodes: [], isActive: false },
  { id: 'col-4', title: 'Stage Three', nodes: [], isActive: false },
  { id: 'col-5', title: 'Stage Four', nodes: [], isActive: false },
];

const FlowCanvas: React.FC<{ flowId: string }> = ({ flowId }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(
    'col-1',
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeToEdit, setNodeToEdit] = useState<NodeData | null>(null);

  const formFields: FormsField[] = [
    {
      id: 'label',
      label: 'Node Label',
      type: 'text',
      placeholder: 'Enter node label',
      required: true,
    },
  ];

  const handleNodeClick = (columnId: string, nodeId: string) => {
    setSelectedNodeId(nodeId);

    const nextColumnIndex = columns.findIndex((col) => col.id === columnId) + 1;
    if (nextColumnIndex < columns.length) {
      setColumns((prevColumns) =>
        prevColumns.map((col, index) => {
          if (index === nextColumnIndex) {
            return { ...col, isActive: true };
          }
          return col;
        }),
      );
      setCurrentColumnId(columns[nextColumnIndex].id);
    }
  };

  const handleNodeDoubleClick = (node: NodeData) => {
    setNodeToEdit(node);
    setIsDrawerOpen(true);
  };

  const handleAddOrEditNode = (data: { label: string }) => {
    if (!currentColumnId) return;

    if (nodeToEdit) {
      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === currentColumnId
            ? {
                ...column,
                nodes: column.nodes.map((node) =>
                  node.id === nodeToEdit.id
                    ? { ...node, label: data.label }
                    : node,
                ),
              }
            : column,
        ),
      );
    } else {
      const newNode: NodeData = {
        id: `${Date.now()}`,
        label: data.label,
        parentId: selectedNodeId || undefined,
      };

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === currentColumnId
            ? { ...column, nodes: [...column.nodes, newNode] }
            : column,
        ),
      );
    }

    setIsDrawerOpen(false);
    setNodeToEdit(null);
  };

  const getFlowPathNodes = (): string[] => {
    const flowPath: string[] = [];
    let currentNodeId = selectedNodeId;

    // Trace back to root, adding each node to the flow path
    while (currentNodeId) {
      flowPath.push(currentNodeId);
      const parentNode = columns
        .flatMap((col) => col.nodes)
        .find((node) => node.id === currentNodeId)?.parentId;
      currentNodeId = parentNode || undefined;
    }

    // Add children of the selected node to the flow path
    if (selectedNodeId) {
      const childNodes = columns
        .flatMap((col) => col.nodes)
        .filter((node) => node.parentId === selectedNodeId)
        .map((node) => node.id);
      flowPath.push(...childNodes);
    }

    return flowPath;
  };

  const getFilteredNodes = (columnId: string): NodeData[] => {
    if (columnId === 'col-1') {
      // The first column should always display its nodes
      return columns.find((col) => col.id === columnId)?.nodes || [];
    }

    const flowPathNodes = getFlowPathNodes();

    // Show nodes if they are part of the flow path or their parent is part of the flow path
    return (
      columns
        .find((col) => col.id === columnId)
        ?.nodes.filter(
          (node) =>
            flowPathNodes.includes(node.id) ||
            flowPathNodes.includes(node.parentId as string),
        ) || []
    );
  };

  const flowPathNodes = getFlowPathNodes();

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
            className={`rounded-lg border p-4 shadow ${
              column.isActive ? 'bg-blue-800' : 'bg-gray-300'
            }`}
          >
            <h2 className="text-lg font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-2">
              {getFilteredNodes(column.id).map((node) => (
                <li
                  key={node.id}
                  className={`cursor-pointer rounded border p-2 shadow ${
                    flowPathNodes.includes(node.id)
                      ? 'bg-green-300'
                      : selectedNodeId === node.id
                        ? 'bg-green-500'
                        : 'bg-black hover:bg-gray-100'
                  }`}
                  onClick={() => handleNodeClick(column.id, node.id)}
                  onDoubleClick={() => handleNodeDoubleClick(node)}
                >
                  {node.label}
                </li>
              ))}
            </ul>
            {column.isActive && currentColumnId === column.id && (
              <Button
                onClick={() => {
                  setNodeToEdit(null);
                  setIsDrawerOpen(true);
                }}
                className="mt-2 w-full"
              >
                Add Node to {column.title}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size="medium"
        position="right"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {nodeToEdit ? 'Edit Node' : 'Create New Node'}
        </h2>
        <Forms
          fields={formFields}
          onSave={handleAddOrEditNode}
          initialData={nodeToEdit ? { label: nodeToEdit.label } : undefined}
        />
      </Drawer>
    </div>
  );
};

export default FlowCanvas;
