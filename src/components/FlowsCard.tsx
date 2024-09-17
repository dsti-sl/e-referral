import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { LoadingView } from '@/components/shared/LoadingView'; // Adjust the path as necessary
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'; // Import icons from lucide-react

interface Flow {
  id: number;
  name: string;
  description: string;
  is_disabled: boolean;
}

interface FlowsCardProps {
  status: 'Active' | 'Draft' | 'Archived' | 'Deleted';
}

const FlowsCard = ({ status }: FlowsCardProps) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [skip, setSkip] = useState(0); // Pagination state
  const [limit] = useState(10); // Number of records per page
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const BaseUrl = process.env.BASE_URL;

  const fetchFlows = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BaseUrl}/flows?skip=${skip}&limit=${limit}&status_eq=${status}&name_like=${searchQuery}`,
      );
      if (!response.ok) throw new Error('Failed to fetch flows');

      const data = await response.json();
      setFlows(data || []);
    } catch (error) {
      console.error('Failed to fetch flows', error);
    } finally {
      setIsLoading(false);
    }
  }, [BaseUrl, skip, limit, status, searchQuery]);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const handleNext = () => {
    if (flows.length === limit) {
      setSkip(skip + limit);
    }
  };

  const handlePrevious = () => {
    if (skip - limit >= 0) {
      setSkip(skip - limit);
    }
  };

  const handleToggle = async (id: number) => {
    const flow = flows.find((flow) => flow.id === id);
    if (!flow) return;

    const newStatus = !flow.is_disabled;

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

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `The flow has been ${newStatus ? 'Disabled' : 'Enabled'}.`,
      });

      // Refetch flows after status change
      fetchFlows();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the flow status. Please try again.',
      });
    }
  };

  const handleSearch = () => {
    setSkip(0); // Reset pagination when searching
    fetchFlows();
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchFlows();
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-black">{status} Flows</h2>
      <div className="mb-4 flex items-center space-x-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border p-4 pr-10 text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center rounded bg-erefer-rose p-4 px-4 py-4 text-white"
        >
          <Search className="mr-2 h-5 w-5 text-white" />
          Search
        </button>
      </div>
      <div className="card w-full rounded-lg bg-white p-4 shadow-md">
        <LoadingView
          isLoading={isLoading}
          view={
            <>
              <ul className="space-y-4">
                {flows.length > 0 ? (
                  flows.map((flow) => (
                    <li
                      key={flow.id}
                      className="rounded border p-4 hover:border-gray-200 hover:bg-gray-200"
                    >
                      <Link
                        href={`/flows/flowcanvas?flowId=${flow.id}`}
                        className="text-md font-semibold text-black"
                      >
                        {flow.name}
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {flow.description}
                        </p>
                        <label className="flex cursor-pointer items-center">
                          {/* Switch component */}
                          <span className="mx-4 text-sm text-gray-700">
                            {flow.is_disabled ? 'Disabled' : 'Enabled'}
                          </span>
                          <div
                            className={`relative inline-block h-6 w-11 ${
                              flow.is_disabled ? 'bg-gray-400' : 'bg-green-600'
                            } rounded-full transition-colors duration-200`}
                            onClick={() => handleToggle(flow.id)}
                          >
                            <span
                              className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                                flow.is_disabled ? 'translate-x-5' : ''
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">
                    No {status} flows available
                  </li>
                )}
              </ul>
            </>
          }
        />
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={skip === 0}
            className={`flex items-center space-x-2 rounded px-4 py-4 ${
              skip === 0 ? 'bg-gray-500' : 'bg-erefer-rose'
            } px-4 py-2 text-white`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>
          <button
            onClick={handleNext}
            disabled={flows.length < limit}
            className={`flex items-center space-x-2 rounded px-4 py-4 ${
              flows.length < limit ? 'bg-gray-500' : 'bg-erefer-rose'
            } px-4 py-2 text-white`}
          >
            <ArrowRight className="h-5 w-5" />
            <span>Next</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FlowsCard;
