export interface Choice {
  id: number;
  priority: number;
  message: string;
  link: string;
}

export interface MenuResponse {
  title: string | null;
  options: Choice[];
}

export interface SimulatorConfig {
  phoneNumber: string;
  location: string;
  limit: number;
}

export interface SessionEntry {
  title: string;
  selected: string;
}

export interface MobileSimulatorProps {
  /** Pre-fills the flow ID hint from the canvas URL. */
  defaultFlowId?: string;
  /** Controls whether the simulator panel is visible. */
  isOpen: boolean;
  /** Called when the user clicks the ✕ button inside the phone. */
  onClose: () => void;
}
