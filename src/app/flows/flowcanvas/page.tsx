'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms from '@/components/ui/Forms';
import { Trash2Icon, ArrowLeft, EditIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { formFields } from '@/utils/helpers';

interface NodeData {
  id?: string;
  name: string;
  message?: string;
  parent_id?: any;
  description?: string;
  priority?: string;
  terminator?: boolean;
  allow_custom_feedback?: boolean;
  validator?: boolean;
  is_disabled?: boolean;
  descendants?: Array<object>;
}

interface Column {
  id: string;
  name: string;
  nodes: NodeData[];
  isActive: boolean;
}

const initialColumns: Column[] = [
  { id: 'col-1', name: 'Initialize Flow', nodes: [], isActive: true },
  { id: 'col-2', name: '', nodes: [], isActive: false },
  { id: 'col-3', name: '', nodes: [], isActive: false },
  { id: 'col-4', name: '', nodes: [], isActive: false },
  { id: 'col-5', name: '', nodes: [], isActive: false },
];

const FlowCanvas: React.FC = () => {
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flowId');
  const BaseUrl = process.env.BASE_URL;

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [clickedNodes, setClickedNodes] = useState<string[]>([]);
  const [nodeToEdit, setNodeToEdit] = useState<NodeData | null>(null);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);

  // Fetch descendants on page load for the initial flowId
  useEffect(() => {
    if (flowId) {
      fetchFlowDescendants(flowId, 'col-1', null);
    }
  }, [flowId]);

  const fetchFlowDescendants = async (
    parentId: string,
    columnId: string,
    selectedNodeId: string | null,
  ) => {
    try {
      const response = await fetch(`${BaseUrl}/flows/${parentId}`);
      if (!response.ok) throw new Error('Failed to fetch descendants');
      const result = await response.json();

      const filteredDescendants = selectedNodeId
        ? result.descendants.filter(
            (descendant: NodeData) => descendant.parent_id === selectedNodeId,
          )
        : result.descendants.filter(
            (descendant: NodeData) => descendant.parent_id == flowId,
          );

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === columnId
            ? { ...col, nodes: filteredDescendants || [], name: result.name }
            : col,
        ),
      );
    } catch (error) {
      console.error('Error fetching flow data:', error);
    }
  };

  const handleNodeClick = async (columnId: string, nodeId: string) => {
    const currentIndex = columns.findIndex((col) => col.id === columnId);

    // Show only the next column
    setColumns((prevColumns) =>
      prevColumns.map((col, index) => ({
        ...col,
        isActive: index <= currentIndex + 1,
      })),
    );

    setSelectedNodeId(nodeId);
    setClickedNodes([nodeId]);

    const nextColumnIndex = currentIndex + 1;
    if (nextColumnIndex < columns.length) {
      const nextColumnId = columns[nextColumnIndex].id;
      await fetchFlowDescendants(nodeId, nextColumnId, nodeId);
      setCurrentColumnIndex(nextColumnIndex);
    }
  };

  const handleAddOrEditNode = async (data: NodeData) => {
    const parentId = selectedNodeId || flowId;
    const newNode = {
      ...data,
      parent_id: parentId,
      allow_custom_feedback: data.allow_custom_feedback,
    };

    try {
      const response = await fetch(`${BaseUrl}/flows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNode),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          text: errorData.detail || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
      const result = await response.json();
      Swal.fire({
        title: 'Success!',
        text: 'Flow created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setColumns((prevColumns) =>
        prevColumns.map((col, index) =>
          index === currentColumnIndex
            ? { ...col, nodes: [...col.nodes, result] }
            : col,
        ),
      );
    } catch (error) {
      console.error('Error adding node:', error);
    } finally {
      setIsDrawerOpen(false);
      setNodeToEdit(null); // Clear the nodeToEdit state after saving
    }
  };

  const deleteNodeAndChildren = (columnId: string, nodeId: string) => {
    const nodesToDelete = new Set<string>();
    const collectNodesToDelete = (currentNodeId: string) => {
      nodesToDelete.add(currentNodeId);
      columns.forEach((column) => {
        column.nodes.forEach((node) => {
          if (node.parent_id === currentNodeId) {
            collectNodesToDelete(node.id);
          }
        });
      });
    };
    collectNodesToDelete(nodeId);

    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        nodes: column.nodes.filter((node) => !nodesToDelete.has(node.id)),
      })),
    );
  };

  const handleEdit = (node: NodeData) => {
    setNodeToEdit(node);
    setIsDrawerOpen(true);
    console.log('node =>', node);
  };

  return (
    <div className="p-10">
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

      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) =>
          column.isActive ? (
            <div
              key={column.id}
              className="rounded-lg border bg-[rgba(20,13,13,0.81)] p-8"
            >
              <h2 className="text-center text-lg font-semibold text-white">
                {column.name}
              </h2>

              <ul className="mt-4 space-y-4">
                {column.nodes.map((node: any) => (
                  <li
                    key={node.id}
                    className="group relative cursor-pointer rounded-lg p-2 hover:bg-erefer-rose"
                    onClick={() => handleNodeClick(column.id, node.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-lg font-semibold">
                        {node.priority && <span>{node.priority}. </span>}
                        {node.name}
                      </div>
                      <div className="absolute right-2 top-2 mt-1 hidden space-x-2 border-gray-300 group-hover:flex">
                        <EditIcon
                          className="h-5 w-5 cursor-pointer"
                          onClick={() => handleEdit(node)}
                        />
                        <Trash2Icon
                          className="h-5 w-5 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNodeAndChildren(column.id, node.id);
                          }}
                        />
                      </div>
                    </div>

                    {node.allow_custom_feedback && (
                      <div className="mt-2 rounded-md bg-green-100 p-2 text-green-700">
                        Custom feedback enabled
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {column.isActive && columns.length <= 5 && (
                <Button
                  onClick={() => {
                    setNodeToEdit(null); // Clear nodeToEdit for adding a new node
                    setIsDrawerOpen(true);
                  }}
                  className="text-black-500 mt-2 w-full bg-white hover:bg-erefer-light hover:text-white"
                >
                  Add Prompt to {column.name}
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
          initialData={nodeToEdit}
          onClose={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default FlowCanvas;
