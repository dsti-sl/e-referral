import Link from 'next/link';

interface FlowsCardProps {
  status: 'Active' | 'Draft' | 'Archived' | 'Deleted';
  flows: Array<{ id: number; name: string }>;
  onFlowClick: (id: number) => void;
}

export default function FlowsCard({
  status,
  flows,
  onFlowClick,
}: FlowsCardProps) {
  return (
    <div className="rounded-lg p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-black">{status} Flows</h2>
      <ul className="space-y-4">
        {flows.length > 0 ? (
          flows.map((flow) => (
            <li
              key={flow.id}
              className="boarder rounded p-4 hover:border-gray-200 hover:bg-erefer-rose"
            >
              <Link
                href={`/flows/flowcanvas=${flow.id}`}
                className="text-md font-semibold text-black"
              >
                {flow.name}
              </Link>
              <p className="text-sm text-gray-500">Status: {status}</p>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No {status} flows available</li>
        )}
      </ul>
    </div>
  );
}
