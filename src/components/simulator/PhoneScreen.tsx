'use client';

import { Home, SendHorizonal, X } from 'lucide-react';
import type { Choice, MenuResponse } from './types';

interface PhoneScreenProps {
  phoneNumber: string;
  location: string;
  loading: boolean;
  currentMenu: MenuResponse | null;
  input: string;
  hint: string;
  onClose: () => void;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  onSelectOption: (choice: Choice) => void;
  onReset: () => void;
}

export function PhoneScreen({
  phoneNumber,
  location,
  loading,
  currentMenu,
  input,
  hint,
  onClose,
  onInputChange,
  onSubmit,
  onSelectOption,
  onReset,
}: PhoneScreenProps) {
  return (
    <div
      className="relative flex-shrink-0 shadow-2xl"
      style={{
        width: '320px',
        height: '660px',
        border: '14px solid #0a0a0a',
        borderRadius: '48px',
        background: '#0a0a0a',
      }}
    >
      {/* Notch */}
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 bg-[#0a0a0a]"
        style={{
          width: '100px',
          height: '20px',
          borderRadius: '0 0 16px 16px',
        }}
      />
      {/* Side button */}
      <div
        className="absolute bg-[#0a0a0a]"
        style={{
          right: '-14px',
          top: '120px',
          width: '4px',
          height: '60px',
          borderRadius: '0 4px 4px 0',
        }}
      />

      {/* Screen */}
      <div
        className="flex h-full flex-col overflow-hidden bg-[#111827] text-white"
        style={{ borderRadius: '34px' }}
      >
        {/* Status bar */}
        <div className="flex h-8 flex-shrink-0 items-end justify-between bg-gray-900 px-5 pb-1">
          <span className="text-[10px] text-gray-500">E-Referral</span>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-white"
            aria-label="Close simulator"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* App header */}
        <div className="flex-shrink-0 bg-gray-900 px-4 pb-3">
          <h3 className="text-sm font-semibold text-white">
            E-referral USSD Service
          </h3>
          <p className="text-[10px] text-gray-500">
            {phoneNumber || 'No number set'} · {location}
          </p>
        </div>

        {/* USSD content */}
        <div className="flex-1 overflow-y-auto bg-[#1e293b] p-4 text-sm">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600"
                style={{ borderTopColor: '#a85866' }}
              />
            </div>
          ) : !currentMenu ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <p className="text-sm">Dial a flow to begin</p>
              <p className="mt-1 font-mono text-xl text-erefer-rose">{hint}</p>
              <p className="mt-2 text-xs">or enter a plain flow ID</p>
            </div>
          ) : (
            <div>
              {currentMenu.title && (
                <p className="mb-3 text-base font-bold text-white">
                  {currentMenu.title}
                </p>
              )}
              {currentMenu.options.length > 0 ? (
                <div className="space-y-1">
                  {currentMenu.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOption(opt)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-200 transition-colors hover:bg-gray-700 active:bg-gray-600"
                    >
                      <span className="w-6 flex-shrink-0 font-mono text-sm text-erefer-rose">
                        {opt.priority}.
                      </span>
                      <span className="text-sm">{opt.message}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">[End of session]</p>
              )}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 bg-gray-900 px-4 py-3">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              className="w-full rounded-full bg-white py-2.5 pl-4 pr-12 text-sm text-black outline-none"
              placeholder={currentMenu ? 'Enter option number…' : hint}
            />
            <button
              disabled={loading || !input.trim()}
              onClick={onSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-erefer-rose p-1.5 text-white disabled:opacity-40"
              aria-label="Send"
            >
              <SendHorizonal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Home button */}
        <div className="flex flex-shrink-0 justify-center bg-gray-900 pb-4 pt-2">
          <button
            onClick={onReset}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-erefer-rose text-white shadow-lg"
            title="Reset session"
            aria-label="Reset"
          >
            <Home className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
