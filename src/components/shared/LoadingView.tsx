import React from 'react';

interface LoadingViewProps {
  isLoading: boolean;
  view: React.ReactNode;
  centerLoader?: boolean;
  text?: string;
  addAppToasts?: boolean; // You might need to implement this
  fullHeight?: boolean;
  spinnerText?: string; // You might need to implement this
}

interface ConditionalViewProps {
  condition: boolean;
  trueView: React.ReactNode;
  falseView: React.ReactNode;
}

const LoaderSpinner = () => (
  <div className="flex min-h-screen flex-col items-center justify-center text-center">
    <div className="loader mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200"></div>
    <small className="text-black">Please Wait...</small>
  </div>
);

export function LoadingView({
  isLoading,
  view,
  centerLoader = true, // Use this prop if needed, e.g., for styling or layout
  text = 'Please Wait...', // You might want to use this in the spinner
  addAppToasts = false, // Implement this if needed
  fullHeight = true,
  spinnerText = 'Loading', // Use this in the spinner if needed
}: LoadingViewProps) {
  return (
    <ConditionalView
      condition={isLoading}
      trueView={<LoaderSpinner />}
      falseView={
        <div className={`${fullHeight ? 'md:w-full lg:w-full' : ''}`}>
          {view}
          {addAppToasts && <div>{/* Implement your toasts here */}</div>}
        </div>
      }
    />
  );
}

export function ConditionalView({
  condition,
  trueView,
  falseView,
}: ConditionalViewProps) {
  return <>{condition ? trueView : falseView}</>;
}
