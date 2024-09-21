'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms from '@/components/ui/Forms';
import { Trash2Icon, ArrowLeft, EditIcon, CirclePlusIcon } from 'lucide-react';
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

const FlowCanvas: React.FC = () => {
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flowId');
  const BaseUrl = process.env.BASE_URL;

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [flowPath, setFlowPath] = useState<string[]>([]); // Track the flow path (ancestors + selected node)
  const [customFeedbackNodeId, setCustomFeedbackNodeId] = useState<
    string | null
  >(null); // Track the node with custom feedback
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeToEdit, setNodeToEdit] = useState<NodeData | null>(null);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);

  // Fetch descendants on page load for the initial flowId
  useEffect(() => {
    if (flowId) {
      fetchFlowDescendants(flowId, 'col-1', null);
    }
  }, [flowId, isDrawerOpen]);

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
  const handleAddOrEditNode = async (data: NodeData) => {
    console.log('selectedNodeId', selectedNodeId);
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
      for (const id of nodesToDelete) {
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
          nodes: column.nodes.filter((node) => !nodesToDelete.has(node.id)),
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

  // Handle  click event
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
        {columns.map((column, colIndex) =>
          column.isActive ? (
            <div
              key={column.id}
              className="flex flex-col justify-between rounded-lg border bg-[rgba(20,13,13,0.81)] p-8"
            >
              <div>
                <h2
                  onClick={() => handleRefresh(colIndex)}
                  className={`cursor-pointer text-center text-2xl font-semibold`}
                >
                  {column.name}
                </h2>

                {column.allowUserFeedback && (
                  <p className="text-center text-sm text-gray-200">
                    (Allows custom feedback)
                  </p>
                )}

                <ul className="mt-4 space-y-4">
                  {column.nodes.map((node: NodeData) => (
                    <li
                      key={node.id}
                      className={`group relative cursor-pointer rounded-lg p-2 ${
                        flowPath.includes(node.id as string)
                          ? 'bg-erefer-light'
                          : 'px-8 hover:bg-erefer-rose'
                      }`}
                      onClick={() =>
                        handleNodeClick(column.id, node.id as string)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-lg font-semibold">
                          {node.priority && <span>{node.priority} </span>}.
                          {node.name}
                        </div>
                        <div className="absolute right-2 top-2 mt-1 hidden cursor-pointer space-x-2 border-gray-300 group-hover:flex">
                          {/* <EditIcon
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => handleEdit(node)}
                          /> */}
                          {/* <Trash2Icon
                            className="h-5 w-5 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNodeAndChildren(
                                column.id,
                                node.id as string,
                              );
                            }}
                          /> */}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* this is the implementation for the custom feedback enabled. But there are issues with it's persistence. */}
              {colIndex === currentColumnIndex + 1 && customFeedbackNodeId && (
                <div className="text-white-200 mt-2 rounded-lg text-center">
                  Custom feedback enabled
                </div>
              )}
              {colIndex === 0 && !selectedNodeId ? (
                <Button
                  onClick={handleAddNode}
                  className="mt-4 flex w-full items-center justify-center bg-erefer-rose text-white hover:bg-erefer-light hover:text-black"
                >
                  <CirclePlusIcon className="mr-2" />
                  Add Prompt Options to {column.name}
                </Button>
              ) : (
                column.isActive &&
                colIndex < currentColumnIndex && (
                  <Button
                    onClick={() => {
                      setNodeToEdit(null);
                      setIsDrawerOpen(true);
                    }}
                    className="mt-4 flex w-full items-center justify-center bg-erefer-rose text-white hover:bg-erefer-light hover:text-black"
                  >
                    <span className="flex items-center">
                      <CirclePlusIcon className="mr-2" />
                      Add Prompt
                    </span>
                  </Button>
                )
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
