'use client';

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import type { SimulatorConfig, SessionEntry } from './types';

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs text-gray-400">
      Loading map…
    </div>
  ),
});

export interface ConfigPanelProps {
  config: SimulatorConfig;
  onConfigChange: React.Dispatch<React.SetStateAction<SimulatorConfig>>;
  showMapPicker: boolean;
  setShowMapPicker: React.Dispatch<React.SetStateAction<boolean>>;
  history: SessionEntry[];
  defaultFlowId?: string;
  onReset: () => void;
  onClose: () => void;
}

export function ConfigPanel({
  config,
  onConfigChange,
  showMapPicker,
  setShowMapPicker,
  history,
  defaultFlowId,
  onReset,
  onClose,
}: ConfigPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Simulator Configuration
        </p>
        <button
          onClick={onClose}
          className="text-gray-500 transition-colors hover:text-white"
          aria-label="Close configuration panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Phone Number (initiator)
          </label>
          <input
            type="text"
            value={config.phoneNumber}
            onChange={(e) =>
              onConfigChange((c) => ({ ...c, phoneNumber: e.target.value }))
            }
            className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-erefer-rose"
            placeholder="e.g. 23278238542"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Location (lat, lng)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={config.location}
              onChange={(e) =>
                onConfigChange((c) => ({ ...c, location: e.target.value }))
              }
              className="min-w-0 flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-erefer-rose"
              placeholder="8.4897,-11.812"
            />
            <button
              onClick={() => setShowMapPicker((v) => !v)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                showMapPicker
                  ? 'bg-erefer-rose text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-erefer-rose hover:text-white'
              }`}
            >
              Map
            </button>
          </div>
          {showMapPicker && (
            <div className="mt-2 h-44 overflow-hidden rounded-lg border border-gray-700">
              <MapPicker
                location={config.location}
                onSelect={(lat, lng) => {
                  onConfigChange((c) => ({
                    ...c,
                    location: `${lat.toFixed(6)},${lng.toFixed(6)}`,
                  }));
                  setShowMapPicker(false);
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Results limit per page
          </label>
          <input
            type="number"
            value={config.limit}
            onChange={(e) =>
              onConfigChange((c) => ({
                ...c,
                limit: Math.max(1, parseInt(e.target.value) || 3),
              }))
            }
            className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-erefer-rose"
            min={1}
            max={10}
          />
        </div>

        {defaultFlowId && (
          <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">
            Canvas flow:{' '}
            <span className="font-mono text-erefer-rose">
              *{defaultFlowId}#
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-700" />

      {/* Session history */}
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Session Progress
        </p>
        {history.length === 0 ? (
          <p className="text-xs italic text-gray-600">No active session yet.</p>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-1">
            {history.map((h, i) => (
              <div
                key={i}
                className="border-l-2 border-erefer-rose pl-3 text-xs"
              >
                <p className="text-gray-400">{h.title}</p>
                <p className="font-medium text-white">↳ {h.selected}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full rounded-lg bg-gray-700 py-2 text-xs font-medium text-gray-300 hover:bg-gray-600"
      >
        Reset Session
      </button>
    </div>
  );
}
