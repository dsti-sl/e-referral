import React from 'react';

interface NodeData {
  id: string;
  title: string;
  parentId?: string;
}
interface ColumnProps {
  column: {
    id: number;
    name: string;
    nodes: NodeData[];
    isActive: boolean;
  };
  onNodeClick: (nodeId: string) => void;
  isActive: boolean;
}

const FlowColumn: React.FC<ColumnProps> = ({
  column,
  onNodeClick,
  isActive,
}) => {
  return (
    <div
      className={`flex-1 border p-4 ${isActive ? 'bg-erefer-rose' : 'bg-gray-500'}`}
    >
      <h3 className="mb-4 text-lg font-semibold">{column.name}</h3>
      {column.nodes.map((node) => (
        <div
          key={node.id}
          className="mb-2 rounded bg-gray-200 p-2"
          onClick={() => onNodeClick(node.id)}
        >
          {node.title}
        </div>
      ))}
    </div>
  );
};

export default FlowColumn;
