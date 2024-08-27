'use client';

import { useState } from 'react';
import { SwimlaneFlow } from '@liangfaan/reactflow-swimlane';
import { ReactFlowProvider } from 'reactflow';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/Button';
import Forms, { FormsField } from '@/components/ui/Forms';
import Link from 'next/link';
import 'reactflow/dist/style.css';

interface NodeData {
  id: number;
  title: string;
  parentId?: number;
}

export default function FlowCanvas() {
  const [nodes, setNodes] = useState<NodeData[][]>([[], [], [], [], []]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<number | null>(null);
  const [activeColumns, setActiveColumns] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);

  const formFields: FormsField[] = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter stage title',
      required: true,
    },
  ];

  const handleNodeClick = (columnIndex: number, node: NodeData) => {
    const newActiveColumns = [...activeColumns];
    if (columnIndex + 1 < activeColumns.length) {
      newActiveColumns[columnIndex + 1] = true;
    }
    setActiveColumns(newActiveColumns);
    setCurrentColumn(columnIndex + 1);
  };

  const handleAddNode = (data: { title: string }) => {
    if (currentColumn === null || currentColumn >= nodes.length) return;

    const newNode: NodeData = {
      id: Date.now(),
      title: data.title,
      parentId:
        currentColumn > 0
          ? nodes[currentColumn - 1].slice(-1)[0]?.id
          : undefined,
    };

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      newNodes[currentColumn].push(newNode);
      return newNodes;
    });

    setIsDrawerOpen(false);
    setCurrentColumn(null);
  };

  return (
    <div style={{ height: 800 }}>
      <Link href="/flows" className="text-sm text-gray-500 hover:text-black">
        Back to Flows
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Flow Artboard</h1>
      <div className="h-full w-full">
        <ReactFlowProvider>
          <SwimlaneFlow
            rankDirection="LR"
            selectedFlow={{
              id: 'USSD Flow',
              swimlanes: nodes.map((column, columnIndex) => ({
                id: `Column-${columnIndex}`,
                label: `Column ${columnIndex + 1}`,
                layer: columnIndex,
                nodes: column.map((node) => ({
                  id: node.id.toString(),
                  label: node.title,
                  name: node.title,
                  onClick: () => handleNodeClick(columnIndex, node),
                })),
              })),
              edges: nodes.flatMap((column, columnIndex) =>
                columnIndex === 0
                  ? []
                  : column.map((node) => ({
                      id: `edge-${node.id}`,
                      sourceNodeId: nodes[columnIndex - 1]
                        .find((parentNode) => parentNode.id === node.parentId)
                        ?.id.toString(),
                      targetNodeId: node.id.toString(),
                    })),
              ),
            }}
          />
        </ReactFlowProvider>
      </div>
      {activeColumns.some((isActive) => isActive) && (
        <Button
          onClick={() => setIsDrawerOpen(true)}
          disabled={currentColumn === null}
          className="mt-4"
        >
          Add Node
        </Button>
      )}
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
}
