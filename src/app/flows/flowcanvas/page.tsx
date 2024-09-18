'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms from '@/components/ui/Forms';
import { Trash2Icon, ArrowLeft, EditIcon } from 'lucide-react'; // Add Edit icon
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
  const [clickedNodes, setClickedNodes] = useState<string[]>([]); // Track clicked nodes
  const [nodeToEdit, setNodeToEdit] = useState<NodeData | null>(null);
  const [currentColumnId, setCurrentColumnId] = useState<string>('col-1');

  // Fetch descendants on page load for the initial flowId
  useEffect(() => {
    if (flowId) {
      fetchFlowDescendants(flowId, 'col-1');
    }
  }, [flowId]);

  const fetchFlowDescendants = async (parentId: string, columnId: string) => {
    try {
      const response = await fetch(`${BaseUrl}/flows/${parentId}`);
      if (!response.ok) throw new Error('Failed to fetch descendants');
      const result = await response.json();

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === columnId
            ? { ...col, nodes: result.descendants || [], name: result.name }
            : col,
        ),
      );
    } catch (error) {
      console.error('Error fetching flow data:', error);
    }
  };

  const handleNodeClick = async (columnId: string, nodeId: string) => {
    setSelectedNodeId(nodeId);

    // Track clicked nodes for highlighting
    setClickedNodes((prevClickedNodes) =>
      prevClickedNodes.includes(nodeId)
        ? prevClickedNodes
        : [...prevClickedNodes, nodeId],
    );

    // Determine the next column and load its nodes
    const nextColumnIndex = columns.findIndex((col) => col.id === columnId) + 1;
    if (nextColumnIndex < columns.length) {
      const nextColumnId = columns[nextColumnIndex].id;
      await fetchFlowDescendants(nodeId, nextColumnId);
      setColumns((prevColumns) =>
        prevColumns.map((col, index) =>
          index === nextColumnIndex ? { ...col, isActive: true } : col,
        ),
      );
    }
    setCurrentColumnId(columns[nextColumnIndex]?.id || 'col-1');
  };

  const handleAddOrEditNode = async (data: NodeData) => {
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
      if (!response.ok) throw new Error('Failed to add node');
      const result = await response.json();

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === currentColumnId
            ? { ...col, nodes: [...col.nodes, result] }
            : col,
        ),
      );
    } catch (error) {
      console.error('Error adding node:', error);
    } finally {
      setIsDrawerOpen(false);
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
              className="rounded-lg border bg-[rgba(20,13,13,0.81)] p-4"
            >
              <h2 className="text-center text-lg font-semibold text-white">
                {column.name}
              </h2>
              <ul className="mt-4 space-y-2">
                {column.nodes.map((node) => (
                  <li
                    key={node.id}
                    className={`relative cursor-pointer rounded p-1 hover:bg-erefer-rose ${
                      clickedNodes.includes(node.id)
                        ? 'bg-erefer-rose text-white'
                        : ''
                    }`}
                    onClick={() => handleNodeClick(column.id, node.id)}
                  >
                    {node.priority && <span>{node.priority}: </span>}{' '}
                    {node.name}
                    <div className="absolute right-2 top-2 hidden space-x-2 group-hover:flex">
                      <EditIcon
                        className="h-5 w-5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNodeToEdit(node);
                          setIsDrawerOpen(true);
                        }}
                      />
                      <Trash2Icon
                        className="h-5 w-5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNodeAndChildren(column.id, node.id);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {column.isActive && (
                <Button
                  onClick={() => {
                    setNodeToEdit(null);
                    setIsDrawerOpen(true);
                  }}
                  className="text-black-500 mt-2 w-full bg-white hover:bg-erefer-light hover:text-white"
                >
                  Add Node to {column.name}
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
          onClose={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default FlowCanvas;
