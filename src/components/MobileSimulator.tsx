import React, { useState } from 'react';

const MobileSimulator = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [telNumber, setTelNumber] = useState('');
  const [longLat, setLongLat] = useState('');
  const [userInput, setUserInput] = useState('');
  const [flowState, setFlowState] = useState(
    'Welcome to the E-referral USSD service. Press 1 for Menu A, Press 2 for Menu B.',
  );

  // Toggle the collapsible panel for phone number and long-lat input
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // Reset the flow back to the initial state
  const resetFlow = () => {
    setFlowState(
      'Welcome to the E-referral USSD service. Press 1 for Menu A, Press 2 for Menu B.',
    );
    setUserInput('');
  };

  // Handle input change for the USSD option input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  // Handle the "Send" button click to process the USSD option
  const handleSendClick = () => {
    if (userInput === '1') {
      setFlowState(
        'You selected Menu A. Press 1 for Option A1, Press 2 for Option A2.',
      );
    } else if (userInput === '2') {
      setFlowState(
        'You selected Menu B. Press 1 for Option B1, Press 2 for Option B2.',
      );
    } else {
      setFlowState('Invalid option. Please try again.');
    }
    setUserInput(''); // Clear input field after submission
  };

  return (
    <div className="mt-4">
      {/* Flow output - The mobile screen */}
      <div className="flow-output w-100 h-52 rounded-lg bg-gray-700 p-3">
        <p>{flowState}</p>
      </div>

      {/* Input field for USSD options */}
      <div className="relative mt-4">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="w-full rounded-full p-3 pr-10 text-black"
          placeholder="Enter option..."
        />
        <button
          onClick={handleSendClick}
          className="absolute right-1 top-1/2 -translate-y-1/2 transform rounded-full bg-erefer-rose p-2 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>

      {/* Arrow button to toggle the collapsible panel */}
      <button
        className="arrow-button mt-4 w-full rounded-lg bg-erefer-rose p-2 text-center"
        onClick={togglePanel}
      >
        {showPanel ? '▼' : '▲'}
      </button>

      {/* Reset button */}
      <div className="bottom-2/4 mt-4 flex items-center justify-center">
        <button
          onClick={resetFlow}
          className="r-2 mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-erefer-light text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>

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

export default MobileSimulator;
