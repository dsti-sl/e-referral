'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchMenu, buildUssdPath } from './api';
import type {
  Choice,
  MenuResponse,
  SessionEntry,
  SimulatorConfig,
} from './types';

const DEFAULT_CONFIG: SimulatorConfig = {
  phoneNumber: '',
  location: '8.4897,-11.812',
  limit: 3,
};

// Viewport hook
export function useNarrowViewport(threshold = 700): boolean {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < threshold);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [threshold]);
  return isNarrow;
}

// Simulator hook
export interface SimulatorControls {
  // State
  config: SimulatorConfig;
  showConfig: boolean;
  showMapPicker: boolean;
  currentMenu: MenuResponse | null;
  history: SessionEntry[];
  input: string;
  loading: boolean;
  // Setters
  setConfig: React.Dispatch<React.SetStateAction<SimulatorConfig>>;
  setShowConfig: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMapPicker: React.Dispatch<React.SetStateAction<boolean>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  // Actions
  selectOption: (choice: Choice) => Promise<void>;
  handleSubmit: () => Promise<void>;
  resetFlow: () => void;
  closeConfig: () => void;
}

export function useSimulator(): SimulatorControls {
  const [config, setConfig] = useState<SimulatorConfig>(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenuResponse | null>(null);
  const [history, setHistory] = useState<SessionEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const callUssd = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const data = await fetchMenu(path);
      setCurrentMenu(data);
    } catch (err) {
      console.error('USSD error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startFlow = useCallback(
    async (flowId: string) => {
      setHistory([]);
      setCurrentMenu(null);
      await callUssd(
        buildUssdPath(
          flowId,
          config.phoneNumber,
          config.location,
          config.limit,
        ),
      );
    },
    [config, callUssd],
  );

  const selectOption = useCallback(
    async (choice: Choice) => {
      if (currentMenu?.title) {
        setHistory((prev) => [
          ...prev,
          {
            title: currentMenu.title!,
            selected: `${choice.priority}. ${choice.message}`,
          },
        ]);
      }
      await callUssd(choice.link);
    },
    [currentMenu, callUssd],
  );

  const handleSubmit = useCallback(async () => {
    const val = input.trim();
    if (!val) return;
    setInput('');

    const dialMatch = val.match(/^\*(\d+)#$/);
    if (dialMatch) {
      await startFlow(dialMatch[1]);
      return;
    }

    if (currentMenu) {
      const num = parseInt(val, 10);
      const choice = currentMenu.options.find((o) => o.priority === num);
      if (choice) {
        await selectOption(choice);
        return;
      }
    }

    if (/^\d+$/.test(val)) {
      await startFlow(val);
    }
  }, [input, currentMenu, startFlow, selectOption]);

  const resetFlow = useCallback(() => {
    setCurrentMenu(null);
    setHistory([]);
    setInput('');
  }, []);

  const closeConfig = useCallback(() => {
    setShowConfig(false);
    setShowMapPicker(false);
  }, []);

  return {
    config,
    showConfig,
    showMapPicker,
    currentMenu,
    history,
    input,
    loading,
    setConfig,
    setShowConfig,
    setShowMapPicker,
    setInput,
    selectOption,
    handleSubmit,
    resetFlow,
    closeConfig,
  };
}
