import { useState } from "react";

export type SubagentSurfaceMode = "v1" | "default" | "v2";

const ACK_PREFIX = "ocx.subagent-surface-notice.v1:";

function readAck(apiBase: string): boolean {
  try { return window.localStorage.getItem(`${ACK_PREFIX}${apiBase}`) === "1"; } catch { return false; }
}

function writeAck(apiBase: string): void {
  try { window.localStorage.setItem(`${ACK_PREFIX}${apiBase}`, "1"); } catch { /* best effort */ }
}

export function useSubagentSurfaceConfirmation(
  apiBase: string,
  currentMode: SubagentSurfaceMode,
  applyMode: (mode: SubagentSurfaceMode) => void | Promise<void>,
  ready = true,
) {
  const [manualOpen, setManualOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<SubagentSurfaceMode | null>(null);
  const [acknowledged, setAcknowledged] = useState(() => readAck(apiBase));
  const [dismissed, setDismissed] = useState(false);
  const open = manualOpen || (ready && currentMode !== "v1" && !acknowledged && !dismissed);

  const requestMode = (mode: SubagentSurfaceMode) => {
    if (mode === "v1") { void applyMode(mode); return; }
    setPendingMode(mode);
    setManualOpen(true);
  };

  const acknowledge = () => {
    writeAck(apiBase);
    setAcknowledged(true);
    setManualOpen(false);
    const mode = pendingMode;
    setPendingMode(null);
    if (mode) void applyMode(mode);
  };

  const switchToV1 = () => {
    writeAck(apiBase);
    setAcknowledged(true);
    setManualOpen(false);
    setPendingMode(null);
    if (currentMode !== "v1") void applyMode("v1");
  };

  const dismiss = () => { setDismissed(true); setManualOpen(false); setPendingMode(null); };

  return { open, requestMode, acknowledge, switchToV1, dismiss };
}
