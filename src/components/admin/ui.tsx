"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------- fetch helper ------------------------------ */

export async function api<T = Record<string, unknown>>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  const json = await res.json().catch(() => ({ ok: false }));
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || "Something went wrong.");
  }
  return json as T;
}

/* --------------------------------- toaster --------------------------------- */

type Toast = { id: number; message: string; kind: "ok" | "err" };
const ToastCtx = createContext<{ toast: (message: string, kind?: "ok" | "err") => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((message: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 bg-ink text-cream text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl shadow-ink/40 border border-line-light animate-[toast-in_0.3s_ease-out]"
          >
            {t.kind === "ok" ? (
              <CheckCircle2 className="w-4 h-4 text-leaf" />
            ) : (
              <AlertCircle className="w-4 h-4 text-ember" />
            )}
            {t.message}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastCtx.Provider>
  );
}

/* ---------------------------------- modal ---------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          "bg-cream w-full rounded-t-3xl sm:rounded-3xl border border-line shadow-2xl max-h-[92vh] overflow-y-auto",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-cream/95 backdrop-blur flex items-center justify-between px-6 py-4 border-b border-line rounded-t-3xl z-10">
          <h3 className="font-display text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:bg-cream-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- toggle --------------------------------- */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? "Toggle"}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-[22px] rounded-full transition-colors duration-300 flex-none",
          checked ? "bg-ember" : "bg-ink/20"
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] w-4 h-4 rounded-full bg-cream shadow transition-all duration-300",
            checked ? "left-[21px]" : "left-[3px]"
          )}
        />
      </button>
      {label ? <span className="text-sm font-semibold text-ink/80">{label}</span> : null}
    </label>
  );
}

/* ------------------------------ confirm button ----------------------------- */

export function ConfirmButton({
  onConfirm,
  className,
  children,
}: {
  onConfirm: () => Promise<void> | void;
  className?: string;
  children: ReactNode;
}) {
  const [arm, setArm] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={cn(className, arm && "!bg-[#8e3b2c] !text-cream !border-[#8e3b2c]")}
      onClick={async () => {
        if (!arm) {
          setArm(true);
          setTimeout(() => setArm(false), 2600);
          return;
        }
        setBusy(true);
        try {
          await onConfirm();
        } finally {
          setBusy(false);
          setArm(false);
        }
      }}
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
      {arm ? "Confirm?" : children}
    </button>
  );
}

/* ---------------------------------- pills ---------------------------------- */

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#b4791e]/12 text-[#8a5d15] border-[#b4791e]/30",
  confirmed: "bg-leaf/10 text-leaf border-leaf/30",
  completed: "bg-ink/8 text-ink/70 border-ink/20",
  cancelled: "bg-[#8e3b2c]/10 text-[#8e3b2c] border-[#8e3b2c]/30",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full border text-[0.66rem] font-extrabold tracking-[0.12em] uppercase",
        STATUS_STYLES[status] ?? STATUS_STYLES.pending
      )}
    >
      {status}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <Loader2 className="w-6 h-6 animate-spin text-ember" />
    </div>
  );
}

/* ------------------------------ use401 router ------------------------------ */

export function useSignOut() {
  const router = useRouter();
  return async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };
}
