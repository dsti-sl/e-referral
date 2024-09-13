import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface Flow {
  id: number;
  name: string;
  description: string;
}

interface FlowsCardProps {
  status: 'Active' | 'Draft' | 'Archived' | 'Deleted';
  flows: Flow[];
}

export default function FlowsCard({ status, flows }: FlowsCardProps) {
  // State to track the active status of each flow by its ID
  const [activeStates, setActiveStates] = useState<Record<number, boolean>>(
    flows.reduce(
      (acc, flow) => {
        acc[flow.id] = status === 'Active';
        return acc;
      },
      {} as Record<number, boolean>,
    ),
  );

  const BaseUrl = process.env.BASE_URL;

  const handleToggle = async (id: number) => {
    const newStatus = !activeStates[id];

    console.log('data', newStatus);

    try {
      const response = await fetch(`${BaseUrl}/flows/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_disabled: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update flow status: ${response.statusText}`);
      }

      // Update the state only if the API call is successful
      setActiveStates((prevState) => ({
        ...prevState,
        [id]: newStatus,
      }));

      // Show success alert using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `The flow has been ${newStatus ? 'Disabled' : 'Enable'}.`,
      });
    } catch (error) {
      console.error('Error updating flow status:', error);

      // Optionally, you can show an error alert as well
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the flow status. Please try again.',
      });
    }
  };

  return (
    <div className="card rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-black">{status} Flows</h2>
      <ul className="space-y-4">
        {flows.length > 0 ? (
          flows.map((flow) => (
            <li
              key={flow.id}
              className="rounded border p-4 hover:border-gray-200 hover:bg-gray-200"
            >
              <Link
                href={`/flows/flowcanvas?flowId=${flow.id}`} // Passing the flowId as a query parameter
                className="text-md font-semibold text-black"
              >
                {flow.name}
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">{flow.description}</p>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="toggle-checkbox sr-only"
                    checked={activeStates[flow.id]}
                    onChange={() => handleToggle(flow.id)}
                  />
                  <span className="mr-6 text-sm text-gray-700">
                    {activeStates[flow.id] ? 'Disabled' : 'Enabled'}
                  </span>
                  <div
                    className={`relative mr-4 inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      activeStates[flow.id] ? 'bg-erefer-rose' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                        activeStates[flow.id]
                          ? 'translate-x-6'
                          : 'translate-x-0'
                      }`}
                    />
                  </div>
                </label>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No {status} flows available</li>
        )}
      </ul>
    </div>
  );
}
