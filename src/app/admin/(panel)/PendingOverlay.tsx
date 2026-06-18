"use client";

import { useFormStatus } from "react-dom";

/**
 * Full-screen blocking overlay shown while a change is being saved. It freezes
 * the page (covers the viewport, captures clicks) so nothing else happens until
 * the action finishes. Bilingual label (EN · LT).
 */
export function PendingOverlay({ show, label }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div className="adm-overlay" role="alert" aria-busy="true" aria-live="assertive">
      <div className="adm-overlay-box">
        <span className="adm-spinner" aria-hidden="true" />
        <span>{label ?? "Saving… · Išsaugoma…"}</span>
      </div>
    </div>
  );
}

/**
 * Same overlay, driven by the nearest <form>'s submit state. Drop it inside any
 * form that posts to a server action.
 */
export function FormPendingOverlay({ label }: { label?: string }) {
  const { pending } = useFormStatus();
  return <PendingOverlay show={pending} label={label} />;
}
