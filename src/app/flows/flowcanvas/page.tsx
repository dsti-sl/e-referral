'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms, { FormsField } from '@/components/ui/Forms';
import { Trash2Icon, ArrowLeft } from 'lucide-react';

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
        { label: 'High', value: '1' },
        { label: 'Medium', value: '2' },
        { label: 'Low', value: '3' },
      ],
      required: true,
    },
  ];

  const handleAddNodeToInitializeFlow = () => {
    setNodeToEdit(null);
    setIsDrawerOpen(true);
    setSelectedNodeId(null); // Reset any active node on the column to add a new node
    setCurrentColumnId('col-1'); // This ensures that the current column ID is set to 'col-1'
  };

  const handleAddOrEditNode = (data: { title: string; priority: string }) => {
    if (!currentColumnId) return;

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

      // After adding a node to 'Initialize Flow', keep the column open for adding more nodes
      if (currentColumnId === 'col-1') {
        setCurrentColumnId('col-1');
        setSelectedNodeId(null);
      } else {
        // Reset the state for subsequent columns.
        setCurrentColumnId(null);
      }
    }

    setIsDrawerOpen(false);
    setNodeToEdit(null);
  };

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

  const deleteNodeAndChildren = (columnId: string, nodeId: string) => {
    // This ensure that all node IDs are collected before deleting
    const nodesToDelete = new Set<string>();
    const collectNodesToDelete = (currentNodeId: string) => {
      nodesToDelete.add(currentNodeId);
      columns.forEach((column) => {
        column.nodes.forEach((node) => {
          if (node.parentId === currentNodeId) {
            collectNodesToDelete(node.id);
          }
        });
      });
    };

    // Start collecting nodes from the target nodeId
    collectNodesToDelete(nodeId);

    // Update columns and remove nodes
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        nodes: column.nodes.filter((node) => !nodesToDelete.has(node.id)),
      })),
    );

    // Hide columns that are now empty
    setColumns((prevColumns) =>
      prevColumns.map((column, index) =>
        column.nodes.length === 0 && index > 0
          ? { ...column, isActive: false }
          : column,
      ),
    );

    // Keep the state of parent nodes persisted
    const deletedNode = columns
      .flatMap((col) => col.nodes)
      .find((node) => node.id === nodeId);
    if (deletedNode && deletedNode.parentId) {
      setSelectedNodeId(deletedNode.parentId);
    }

    console.log('Deleted nodes:', Array.from(nodesToDelete));
    console.log('Node ID:', nodeId);
  };

  return (
    <div className="">
      <div className="flex items-center">
        <Link
          href="/flows"
          className="mr-2 text-sm text-gray-900 hover:text-black"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-lg text-gray-800">
          Flows Management System {flowId}
        </h1>
      </div>

      <div className="grid grid-cols-5 gap-4 p-10">
        {columns.map((column) =>
          column.isActive ? (
            <div
              key={column.id}
              className={`rounded-lg border p-4 ${
                column.isActive
                  ? 'rounded-[10px] bg-[rgba(_20,_13,_13,_0.81)] backdrop-blur-[4.5px] backdrop-filter [box-shadow:0_2px_22px_0_rgba(_31,_38,_135,_0.37_)]'
                  : 'rounded-[10px] bg-[rgba(_0,_0,_0,_0.15_)] backdrop-blur-[5px] backdrop-filter [box-shadow:0_8px_32px_0_rgba(_31,_38,_135,_0.37_)]'
              }`}
            >
              <h2 className="text-center text-lg font-semibold text-white">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {getFilteredNodes(column.id).map((node) => (
                  <li
                    key={node.id}
                    className={`relative cursor-pointer rounded border p-2 shadow ${
                      selectedNodeId === node.id ||
                      getFlowPathNodes().includes(node.id)
                        ? 'bg-rose-200'
                        : 'bg-black hover:bg-blue-400'
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
                        deleteNodeAndChildren(column.id, node.id);
                      }}
                    >
                      <Trash2Icon className="bg-red h-6 w-6" />
                    </span>
                  </li>
                ))}
              </ul>
              {column.id === 'col-1' && (
                <Button
                  onClick={handleAddNodeToInitializeFlow}
                  className="text-black-500 mt-2 w-full bg-white hover:bg-erefer-light hover:text-white"
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
                    className="text-black-500 mt-2 w-full bg-white hover:bg-erefer-light hover:text-white"
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
