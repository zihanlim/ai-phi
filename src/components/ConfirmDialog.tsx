"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className="bg-transparent p-0 m-0 max-w-md w-full"
    >
      <div className="bg-surface-container border border-outline-variant rounded-sm p-6 shadow-2xl">
        <h3 className="font-headline text-xl uppercase tracking-widest mb-3">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-surface-container border border-outline-variant text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-white hover:border-zinc-400 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
              destructive
                ? "bg-red-900/50 border border-red-700/50 text-red-400 hover:bg-red-900 hover:border-red-600"
                : "bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
