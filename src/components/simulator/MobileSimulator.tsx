'use client';

import { Settings } from 'lucide-react';
import { useNarrowViewport, useSimulator } from './useSimulator';
import { ConfigPanel } from './ConfigPanel';
import { PhoneScreen } from './PhoneScreen';
import type { MobileSimulatorProps } from './types';

export function MobileSimulator({
  defaultFlowId,
  isOpen,
  onClose,
}: MobileSimulatorProps) {
  const isNarrow = useNarrowViewport();
  const sim = useSimulator();

  const hint = defaultFlowId ? `*${defaultFlowId}#` : `*<flowId>#`;

  const configPanelProps = {
    config: sim.config,
    onConfigChange: sim.setConfig,
    showMapPicker: sim.showMapPicker,
    setShowMapPicker: sim.setShowMapPicker,
    history: sim.history,
    defaultFlowId,
    onReset: sim.resetFlow,
    onClose: sim.closeConfig,
  };

  return (
    <>
      {/* Modal overlay */}
      {isNarrow && sim.showConfig && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={sim.closeConfig}
            aria-hidden="true"
          />
          <div
            className="fixed left-1/2 top-1/2 z-[61] max-h-[85vh] w-[min(90vw,360px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#0f172a] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Simulator configuration"
          >
            <ConfigPanel {...configPanelProps} />
          </div>
        </>
      )}

      {/* Slide-in container */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 flex transform items-center justify-end transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Config toggle tab */}
        <button
          onClick={() => {
            sim.setShowConfig((v) => !v);
            sim.setShowMapPicker(false);
          }}
          className={`flex flex-col items-center gap-1.5 rounded-l-xl px-2.5 py-5 shadow-xl transition-colors ${
            sim.showConfig
              ? 'bg-erefer-rose text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
          title="Toggle configuration"
          aria-label="Toggle simulator configuration"
        >
          <Settings className="h-5 w-5" />
          <span
            className="text-[9px] font-semibold uppercase tracking-widest"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Config
          </span>
        </button>

        {/* Side panel — wide viewports only */}
        {!isNarrow && (
          <div
            className={`h-[680px] overflow-hidden bg-[#0f172a] text-white shadow-2xl transition-all duration-300 ${
              sim.showConfig ? 'w-[300px]' : 'w-0'
            } rounded-2xl`}
          >
            {/* Fixed-width inner so content doesn't reflow during the slide animation */}
            <div className="h-full w-[300px] overflow-y-auto">
              <ConfigPanel {...configPanelProps} />
            </div>
          </div>
        )}

        {/* Phone */}
        <PhoneScreen
          phoneNumber={sim.config.phoneNumber}
          location={sim.config.location}
          loading={sim.loading}
          currentMenu={sim.currentMenu}
          input={sim.input}
          hint={hint}
          onClose={onClose}
          onInputChange={sim.setInput}
          onSubmit={sim.handleSubmit}
          onSelectOption={sim.selectOption}
          onReset={sim.resetFlow}
        />
      </div>
    </>
  );
}
