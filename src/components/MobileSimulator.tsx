import { BASE_URL } from '@/lib/utils';
import React, { useState } from 'react';

const MobileSimulator = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [telNumber, setTelNumber] = useState('');
  const [longLat, setLongLat] = useState('');
  const [userInput, setUserInput] = useState('');
  const [menus, setMenus] = useState<{
    options: Choice[];
    title: string | null;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Toggle the collapsible panel for phone number and long-lat input
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // Reset the flow back to the initial state
  const resetFlow = () => {
    setMenus(null);
    setUserInput('');
  };

  // Handle input change for the USSD option input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const getFlowMenu = async (flow_priority: number | string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/channels/ussd?priority=${encodeURIComponent(flow_priority)}&initiator=${encodeURIComponent(telNumber)}&location=${encodeURIComponent(longLat)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status == 200) {
        const data = await response.json();
        setMenus(data);
      }
    } catch (error) {
      console.log('Error:  ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Flow output - The mobile screen */}
      {loading ? (
        <div className="flex justify-center">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200"
            style={{ borderTopColor: '#a85866' }}
          />
        </div>
      ) : (
        <div className="flow-output w-100 h-40 rounded-lg bg-gray-700 p-3">
          <ChoiceListing
            title={menus?.title as string}
            choices={menus?.options}
          />
        </div>
      )}

      {/* Input field for USSD options */}
      <div className="mt-4">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="w-full rounded-md p-2 text-black"
          placeholder="Enter option..."
        />
        <button
          disabled={loading || !userInput}
          onClick={() => {
            getFlowMenu(userInput);
          }}
          className="mt-2 w-full rounded-md bg-erefer-rose p-2 text-white"
        >
          Send
        </button>
      </div>

      {/* Reset button */}
      <button
        onClick={resetFlow}
        className="mt-4 w-full rounded-md bg-erefer-light p-2 text-black"
      >
        Reset Flow
      </button>

      {/* Arrow button to toggle the collapsible panel */}
      <button
        className="arrow-button mt-4 w-full rounded-lg bg-erefer-rose p-2 text-center"
        onClick={togglePanel}
      >
        {showPanel ? '▼' : '▲'}
      </button>

      {/* Collapsible panel with input fields */}
      {showPanel && (
        <div className="panel mt-2 rounded-lg bg-gray-800 p-3">
          <label htmlFor="tel-number" className="mb-2 block text-sm">
            Tel Number:
          </label>
          <input
            type="text"
            id="tel-number"
            value={telNumber}
            onChange={(e) => setTelNumber(e.target.value)}
            className="w-full rounded-md p-2 text-black"
            placeholder="Enter phone number"
          />

          <label htmlFor="long-lat" className="mb-2 mt-2 block text-sm">
            Long Lat Address:
          </label>
          <input
            type="text"
            id="long-lat"
            value={longLat}
            onChange={(e) => setLongLat(e.target.value)}
            className="w-full rounded-md p-2 text-black"
            placeholder="Enter Long/Lat"
          />
        </div>
      )}
    </div>
  );
};

type Choice = {
  priority: number;
  message: string;
};

interface ChoiceListingProps {
  title: string | undefined;
  choices: Choice[] | undefined;
}

const ChoiceListing: React.FC<ChoiceListingProps> = ({ choices, title }) => {
  return (
    <div className="mt-4">
      {title && <p>{title}</p>}
      {choices &&
        choices.map((choice, index) => (
          <div key={index} className="flex gap-8">
            <p>{choice.priority}</p>
            <p> {choice.message}</p>
          </div>
        ))}
    </div>
  );
};

export default MobileSimulator;
