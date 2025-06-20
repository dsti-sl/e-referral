'use client';
import { ArrowLeft, CirclePlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import Swal from 'sweetalert2';

import Button from '@/components/Button';
import FloatButton from '@/components/FloatButton';
import MobileFlowSimulator from '@/components/MobileSimulator';
import Drawer from '@/components/ui/Drawer';
import Forms from '@/components/ui/Forms';
import { formFields } from '@/utils/helpers';

interface NodeData {
  id?: string;
  name: string;
  message?: string;
  parent_id?: any;
  description?: string;
  priority?: string;
  terminator?: boolean;
  terminatorUrl?: string;
  allow_custom_feedback?: boolean;
  validator?: boolean;
  validatorUrl?: string;
  is_disabled?: boolean;
  descendants?: Array<object>;
}

interface Column {
  id: string;
  name: string;
  nodes: NodeData[];
  isActive: boolean;
  allowUserFeedback: boolean;
  showCustomFeedback?: boolean;
}

const initialColumns: Column[] = [
  {
    id: 'col-1',
    name: 'Initialize Flow',
    nodes: [],
    isActive: true,
    allowUserFeedback: false,
  },
  {
    id: 'col-2',
    name: '',
    nodes: [],
    isActive: false,
    allowUserFeedback: false,
  },
  {
    id: 'col-3',
    name: '',
    nodes: [],
    isActive: false,
    allowUserFeedback: false,
  },
  {
    id: 'col-4',
    name: '',
    nodes: [],
    isActive: false,
    allowUserFeedback: false,
  },
  {
    id: 'col-5',
    name: '',
    nodes: [],
    isActive: false,
    allowUserFeedback: false,
  },
];

const FlowCanvasContent: React.FC = () => {
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flowId');
  const BaseUrl = process.env.BASE_URL;

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [flowPath, setFlowPath] = useState<string[]>([]); // Track the flow path (ancestors + selected node)
  const [customFeedbackNodeId, setCustomFeedbackNodeId] = useState<
    string | null
  >(null); // Track the node with custom feedback
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // For the Add Node Drawer
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // For the Mobile Simulator Drawer
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeToEdit, setNodeToEdit] = useState<NodeData | null>(null);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);

  const fetchFlowDescendants = async (
    parentId: string,
    columnId: string,
    selectedNodeId: string | null,
  ) => {
    try {
      const response = await fetch(
        `${BaseUrl}/flows/${parentId}?is_disabled_eq=false`,
      );
      if (!response.ok) throw new Error('Failed to fetch descendants');
      const result = await response.json();

      const filteredDescendants = selectedNodeId
        ? result.descendants.filter(
            (descendant: NodeData) =>
              descendant.parent_id === selectedNodeId &&
              descendant.is_disabled === false,
          )
        : result.descendants.filter(
            (descendant: NodeData) =>
              descendant.parent_id == flowId &&
              descendant.is_disabled === false,
          );

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                nodes: filteredDescendants || [],
                name: result.name,
                allowUserFeedback: result.allow_custom_feedback || false,
              }
            : col,
        ),
      );
    } catch (error) {
      console.error('Error fetching flow data:', error);
    }
  };

  // Fetch descendants on page load for the initial flowId
  useEffect(() => {
    if (flowId) {
      fetchFlowDescendants(flowId, 'col-1', null);
    }
  }, [flowId, isDrawerOpen, fetchFlowDescendants]);

  // Handle node click event
  const handleNodeClick = async (columnId: string, nodeId: string) => {
    const currentIndex = columns.findIndex((col) => col.id === columnId);

    const clickedNode = columns
      .find((col) => col.id === columnId)
      ?.nodes.find((node) => node.id === nodeId);

    if (clickedNode?.allow_custom_feedback) {
      setCustomFeedbackNodeId(nodeId);
    } else {
      setCustomFeedbackNodeId(null);
    }

    updateFlowPath(nodeId);

    setColumns((prevColumns) =>
      prevColumns.map((col, index) => ({
        ...col,
        isActive: index <= currentIndex + 1,
      })),
    );

    setSelectedNodeId(nodeId);

    const nextColumnIndex = currentIndex + 1;
    if (nextColumnIndex < columns.length) {
      const nextColumnId = columns[nextColumnIndex].id;
      await fetchFlowDescendants(nodeId, nextColumnId, nodeId);
      setCurrentColumnIndex(nextColumnIndex);
    }
  };

  // Function to update the flow path (only ancestors + selected node)
  const updateFlowPath = (nodeId: string) => {
    const updatedPath: string[] = [];

    // Find and add the ancestors to the path
    let currentNode = columns
      .flatMap((col) => col.nodes)
      .find((node) => node.id === nodeId);
    while (currentNode) {
      updatedPath.unshift(currentNode.id as string);
      currentNode = columns
        .flatMap((col) => col.nodes)
        .find((node) => node.id === currentNode?.parent_id);
    }

    // Add the selected node to the path
    updatedPath.push(nodeId);

    // Set the new flow path (ancestors + selected node)
    setFlowPath(updatedPath);
  };

  // Handle node add/edit
  const handleAddOrEditNode = async (
    data: NodeData | { [key: string]: any } | any,
  ) => {
    const parentId = selectedNodeId || flowId;
    const newNode = {
      ...data,
      parent_id: parentId,
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

  // Delete node and its children
  const deleteNodeAndChildren = async (columnId: string, nodeId: string) => {
    const nodesToDelete = new Set<string>();

    try {
      // Collect nodes to delete (node and its descendants)
      const collectNodesToDelete = (currentNodeId: string) => {
        nodesToDelete.add(currentNodeId);
        columns.forEach((column) => {
          column.nodes.forEach((node) => {
            if (node.parent_id === currentNodeId) {
              collectNodesToDelete(node.id as string);
            }
          });
        });
      };
      collectNodesToDelete(nodeId);

      // Delete nodes from the server one by one
      for (const id of Array.from(nodesToDelete)) {
        const response = await fetch(`${BaseUrl}/flows/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error!',
            text: errorData.detail || 'An error occurred while deleting.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return; // Stop further execution if an error occurs
        }
      }

      // Show success message after all nodes are deleted
      Swal.fire({
        title: 'Success!',
        text: 'Node and its children were successfully deleted.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Remove the deleted nodes from the state
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          nodes: column.nodes.filter(
            (node) => !nodesToDelete.has(node.id as string),
          ),
        })),
      );
    } catch (error) {
      console.error('Error deleting node and children:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred while deleting.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsDrawerOpen(false); // Close the drawer after the operation
      setNodeToEdit(null); // Clear the nodeToEdit state
    }
  };

  // Handle Add Node click event
  const handleAddNode = () => {
    setIsDrawerOpen(true);
  };

  const handleRefresh = async (colIndex: number) => {
    if (colIndex === 0) {
      setFlowPath([]);
      setSelectedNodeId('');
      return setColumns((prevColumns) =>
        prevColumns.map((col, index) => ({
          ...col,
          isActive: index === colIndex,
        })),
      );
    }
  };

  return (
    <div className="p-10">
      <div className="mb-2 flex items-center">
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
        {columns.map((column, colIndex) =>
          column.isActive ? (
            <div
              key={column.id}
              className="flex flex-col justify-between rounded-lg border bg-[rgba(20,13,13,0.81)] p-6"
            >
              <div>
                <h2
                  onClick={() => handleRefresh(colIndex)}
                  className={`cursor-pointer text-center text-2xl font-semibold`}
                >
                  {column.name}
                </h2>

                <ul className="mt-4 space-y-4">
                  {column.nodes.map((node: NodeData) => (
                    <li
                      key={node.id}
                      className={`group relative cursor-pointer rounded-lg p-2 ${
                        flowPath.includes(node.id as string)
                          ? 'bg-erefer-light px-8'
                          : 'px-8 hover:bg-erefer-rose'
                      }`}
                      onClick={() =>
                        handleNodeClick(column.id, node.id as string)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-lg font-semibold">
                          {
                            <span>
                              {Number(node.priority) === 0
                                ? ''
                                : `${node.priority}. `}{' '}
                            </span>
                          }
                          {node.message}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {column.allowUserFeedback && (
                <p className="rounded-lg p-1 text-center text-sm text-green-100">
                  Allows custom feedback
                </p>
              )}
              {colIndex === currentColumnIndex + 1 && customFeedbackNodeId && (
                <div className="text-white-200 mt-2 rounded-lg text-center">
                  Custom feedback enabled
                </div>
              )}
              {colIndex === 0 && !selectedNodeId ? (
                <Button
                  onClick={handleAddNode}
                  className="mt-4 flex items-center justify-center rounded-full bg-erefer-rose p-3 text-white hover:bg-erefer-light hover:text-black"
                >
                  <CirclePlusIcon className="h-6 w-6" />
                </Button>
              ) : (
                column.isActive &&
                colIndex < currentColumnIndex && (
                  <Button
                    onClick={() => {
                      setNodeToEdit(null);
                      setIsDrawerOpen(true);
                    }}
                    className="mt-4 flex items-center justify-center rounded-full bg-erefer-rose p-3 text-white hover:bg-erefer-light hover:text-black"
                  >
                    <CirclePlusIcon className="h-6 w-6" />
                  </Button>
                )
              )}
            </div>
          ) : null,
        )}
      </div>

      {/* Drawer for Add Node */}
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
          initialData={nodeToEdit as NodeData}
          onClose={() => setIsDrawerOpen(false)}
        />
      </Drawer>

      {/* Drawer for Mobile Flow Simulator (styled as a mobile frame (styling still in progress)) */}
      <div
        className={`fixed right-20 top-20 h-[700px] w-80 transform rounded-lg bg-gray-900 text-white shadow-lg transition-transform duration-300 ${
          isMobileDrawerOpen
            ? 'translate-x-0'
            : 'fixed inset-full translate-x-full translate-y-full'
        }`}
        style={{
          border: '16px solid black',
          borderRadius: '36px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-center text-lg font-semibold">
              E-referral USSD Service
            </h3>
            <button
              className={`transform text-white shadow-lg transition-transform duration-300 ${
                isMobileDrawerOpen
                  ? 'translate-x-0'
                  : 'fixed inset-full translate-x-full translate-y-full'
              }`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              ✖
            </button>
          </div>

          <MobileFlowSimulator />
        </div>
      </div>

      {!isMobileDrawerOpen && (
        <FloatButton onClick={() => setIsMobileDrawerOpen(true)} />
      )}
    </div>
  );
};

const LoadingFlowCanvas = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div
        className="loader mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200"
        style={{ borderTopColor: '#a85866' }}
      ></div>
      <small className="text-black">Loading flow canvas...</small>
    </div>
  );
};

const FlowCanvas: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFlowCanvas />}>
      <FlowCanvasContent />
    </Suspense>
  );
};

export default FlowCanvas;
