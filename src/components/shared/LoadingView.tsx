import React from 'react';

interface LoadingViewProps {
  isLoading: boolean;
  view: React.ReactNode;
  centerLoader?: boolean;
  text?: string;
  addAppToasts?: boolean;
  fullHeight?: boolean;
  spinnerText?: string;
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
  centerLoader = true,
  text = 'Please Wait...',
  addAppToasts = false,
  fullHeight = true,
  spinnerText = 'Loading',
}: LoadingViewProps) {
  return (
    <ConditionalView
      condition={isLoading}
      trueView={<LoaderSpinner />}
      falseView={
        <div className={`${fullHeight ? 'md:w-full lg:w-full' : ''}`}>
          {view}
          {addAppToasts}
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
