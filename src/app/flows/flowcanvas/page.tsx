'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms, { FormsField } from '@/components/ui/Forms';

interface NodeData {
  id: string;
  label: string;
  parentId?: string;
  priority?: string;
}

interface Column {
  id: string;
  title: string;
  nodes: NodeData[];
  isActive: boolean;
}

const initialColumns: Column[] = [
  { id: 'col-1', title: 'Initialize Flow', nodes: [], isActive: true },
  { id: 'col-2', title: '', nodes: [], isActive: false },
  { id: 'col-3', title: '', nodes: [], isActive: false },
  { id: 'col-4', title: '', nodes: [], isActive: false },
  { id: 'col-5', title: '', nodes: [], isActive: false },
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
      id: 'title',
      label: 'Node Label*',
      type: 'text',
      placeholder: 'Enter node label',
      required: true,
    },
    {
      id: 'priority',
      label: 'Priority*',
      type: 'select',
      options: [
        { label: 'One', value: '1' },
        { label: 'Medium', value: '2' },
        { label: 'Low', value: '3' },
      ],
      required: true,
    },
  ];

  const handleNodeClick = (columnId: string, nodeId: string) => {
    setSelectedNodeId(nodeId);

    const nextColumnIndex = columns.findIndex((col) => col.id === columnId) + 1;
    const prevColumnIndex = columns.findIndex((col) => col.id === columnId) - 1;

    setColumns((prevColumns) =>
      prevColumns.map((col, index) => {
        if (index === nextColumnIndex) {
          const parentNode = prevColumns
            .flatMap((col) => col.nodes)
            .find((node) => node.id === nodeId);
          return {
            ...col,
            isActive: true,
            title: `${parentNode?.priority || ''}: ${parentNode?.label || ''}`,
          };
        } else if (index === prevColumnIndex) {
          return {
            ...col,
            isActive: true,
          };
        } else if (index > nextColumnIndex) {
          return {
            ...col,
            isActive: false,
          };
        }
        return col;
      }),
    );

    setCurrentColumnId(columns[nextColumnIndex]?.id || null);
  };

  const handleNodeDoubleClick = (node: NodeData) => {
    setNodeToEdit(node);
    setIsDrawerOpen(true);
  };

  const handleAddOrEditNode = (data: { title: string; priority: string }) => {
    if (!currentColumnId) return;

    // Reset the active node when adding a new node in "Initialize Flow"
    if (currentColumnId === 'col-1') {
      setSelectedNodeId(null);
    }

    if (nodeToEdit) {
      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === currentColumnId
            ? {
                ...column,
                nodes: column.nodes.map((node) =>
                  node.id === nodeToEdit.id
                    ? { ...node, label: data.title, priority: data.priority }
                    : node,
                ),
              }
            : column,
        ),
      );
    } else {
      const newNode: NodeData = {
        id: `${Date.now()}`,
        label: data.title,
        parentId: currentColumnId !== 'col-1' ? selectedNodeId : undefined,
        priority: data.priority,
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

    while (currentNodeId) {
      flowPath.push(currentNodeId);
      const parentNode = columns
        .flatMap((col) => col.nodes)
        .find((node) => node.id === currentNodeId)?.parentId;
      currentNodeId = parentNode || undefined;
    }

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
      return columns.find((col) => col.id === columnId)?.nodes || [];
    }

    const flowPathNodes = getFlowPathNodes();

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

  const handleNodeDelete = (columnId: string, nodeId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              nodes: column.nodes.filter((node) => node.id !== nodeId),
            }
          : column,
      ),
    );

    setColumns((prevColumns) =>
      prevColumns.map((column, index) =>
        column.nodes.length === 0 && index > 0
          ? { ...column, isActive: false }
          : column,
      ),
    );
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
        {columns.map((column) =>
          column.isActive ? (
            <div
              key={column.id}
              className={`rounded-lg border p-4 shadow ${
                column.isActive ? 'bg-blue-800' : 'bg-gray-300'
              }`}
            >
              <h2 className="text-lg font-semibold text-white">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {getFilteredNodes(column.id).map((node) => (
                  <li
                    key={node.id}
                    className={`relative cursor-pointer rounded border p-2 shadow ${
                      selectedNodeId === node.id ||
                      getFlowPathNodes().includes(node.id)
                        ? 'bg-green-500'
                        : 'bg-black hover:bg-gray-100'
                    }`}
                    onClick={() => handleNodeClick(column.id, node.id)}
                    onDoubleClick={() => handleNodeDoubleClick(node)}
                  >
                    {node.priority && <span>{node.priority}: </span>}
                    {node.label}
                    <span
                      className="absolute right-2 top-2 cursor-pointer text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeDelete(column.id, node.id);
                      }}
                    >
                      🗑️
                    </span>
                  </li>
                ))}
              </ul>
              {column.id === 'col-1' && (
                <Button
                  onClick={() => {
                    setNodeToEdit(null);
                    setIsDrawerOpen(true);
                    setSelectedNodeId(null); // Reset the active node on add
                  }}
                  className="mt-2 w-full"
                >
                  Add Node to {column.title}
                </Button>
              )}
              {column.isActive &&
                currentColumnId === column.id &&
                column.id !== 'col-1' && (
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
          ) : null,
        )}
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
          initialData={
            nodeToEdit
              ? { title: nodeToEdit.label, priority: nodeToEdit.priority }
              : undefined
          }
        />
      </Drawer>
    </div>
  );
};

export default FlowCanvas;
