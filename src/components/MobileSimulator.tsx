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
      <div className="flow-output w-100 h-40 rounded-lg bg-gray-700 p-3">
        <p>{flowState}</p>
      </div>

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
          onClick={handleSendClick}
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

export default MobileSimulator;
