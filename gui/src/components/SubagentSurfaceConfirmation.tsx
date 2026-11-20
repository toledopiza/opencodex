import { useEffect, useRef } from "react";
import { useT } from "../i18n/shared";
import { IconAlert } from "../icons";

export function SubagentSurfaceConfirmation({
  open,
  onContinue,
  onSwitchToV1,
  onDismiss,
}: {
  open: boolean;
  onContinue: () => void;
  onSwitchToV1: () => void;
  onDismiss: () => void;
}) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);
  if (!open) return null;
  return (
    <dialog ref={dialogRef} className="modal-overlay" role="dialog" aria-labelledby="subagent-surface-title" onCancel={event => { event.preventDefault(); onDismiss(); }} onClick={onDismiss}>
      <button type="button" className="modal-backdrop-dismiss" aria-label={t("common.close")} tabIndex={-1} onClick={onDismiss} />
      <div className="modal-card" onClick={event => event.stopPropagation()}>
        <div className="modal-head">
          <h3 id="subagent-surface-title">{t("models.surfaceNoticeTitle")}</h3>
        </div>
        <div className="notice-warn leading-relaxed" role="alert">
          <IconAlert />
          <span>{t("models.surfaceNoticeWarning")}</span>
        </div>
        <div style={{ marginTop: 18 }}>
          <a className="text-control" href="https://opencodex.me/guides/sub-agent-surface/" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
            {t("models.surfaceNoticeWhy")}
          </a>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onContinue}>{t("models.surfaceNoticeContinue")}</button>
          <button type="button" className="btn btn-primary" onClick={onSwitchToV1}>{t("models.surfaceNoticeSwitch")}</button>
        </div>
      </div>
    </dialog>
  );
}
