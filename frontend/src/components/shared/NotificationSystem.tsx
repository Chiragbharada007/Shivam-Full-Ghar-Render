"use client";

import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X, Bell, Sparkles, RotateCcw } from "lucide-react";

export type NotificationKind = "toast" | "banner" | "progress";

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  variant?: "success" | "error" | "info" | "warning";
  kind?: NotificationKind;
  progress?: number;
  undoLabel?: string;
  onUndo?: () => void;
}

interface NotificationContextValue {
  notify: (item: Omit<NotificationItem, "id">) => string;
  dismiss: (id: string) => void;
  openDialog: (opts: { title: string; message: string; onConfirm: () => void }) => void;
  unreadCount: number;
  clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    return {
      notify: () => "",
      dismiss: () => {},
      openDialog: () => {},
      unreadCount: 0,
      clearUnread: () => {},
    };
  }
  return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [dialog, setDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const notify = (item: Omit<NotificationItem, "id">) => {
    const id = Math.random().toString(36).slice(2, 10);
    setItems((prev) => [{ ...item, id }, ...prev].slice(0, 4));
    setUnreadCount((c) => c + 1);
    if (item.kind !== "progress") {
      setTimeout(() => dismiss(id), 4500);
    }
    return id;
  };

  const openDialog = (opts: { title: string; message: string; onConfirm: () => void }) => {
    setDialog(opts);
  };

  const bannerItem = items.find((i) => i.kind === "banner");
  const toastItems = items.filter((i) => i.kind !== "banner");

  return (
    <NotificationContext.Provider
      value={{ notify, dismiss, openDialog, unreadCount, clearUnread: () => setUnreadCount(0) }}
    >
      {/* 2. Push Banner */}
      <AnimatePresence>
        {bannerItem && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] max-w-lg w-[92%] glass-purple text-white rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <Bell className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <span className="font-bold block">{bannerItem.title}</span>
                {bannerItem.message && <span className="text-emerald-200/80">{bannerItem.message}</span>}
              </div>
            </div>
            <button onClick={() => dismiss(bannerItem.id)} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      {/* 1. Toast + 7. Stacked + 8. Progress Toast */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2.5 w-80 max-w-[92vw] pointer-events-none">
        <AnimatePresence>
          {toastItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 - idx * 0.02 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto rounded-2xl p-4 glass-purple text-white shadow-2xl border border-emerald-400/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  {item.variant === "error" ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  ) : item.variant === "info" ? (
                    <Info className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  )}
                  <div className="text-xs">
                    <p className="font-bold">{item.title}</p>
                    {item.message && <p className="text-zinc-300 mt-0.5">{item.message}</p>}
                  </div>
                </div>
                <button onClick={() => dismiss(item.id)} className="text-zinc-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {item.undoLabel && item.onUndo && (
                <button
                  onClick={() => {
                    item.onUndo?.();
                    dismiss(item.id);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{item.undoLabel}</span>
                </button>
              )}
              {item.kind === "progress" && typeof item.progress === "number" && (
                <div className="mt-2.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-rose-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 6. Confirmation Dialog */}
      <AnimatePresence>
        {dialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="max-w-sm w-full rounded-3xl p-6 glass-purple text-white space-y-4"
            >
              <h3 className="font-display text-lg font-bold">{dialog.title}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{dialog.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDialog(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    dialog.onConfirm();
                    setDialog(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-rose-600 text-xs font-bold"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

// 3. Live Pill + 4. Badge + 5. Inline Alert reusable widgets
export function LiveStatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono-tech font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}

export function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="px-1.5 py-0.5 min-w-[18px] text-center rounded-full text-[10px] font-mono-tech font-bold bg-rose-500 text-white shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function InlineAlert({
  title,
  message,
  variant = "info",
}: {
  title: string;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
}) {
  const styles = {
    info: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-200",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-200",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200",
    error: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-200",
  }[variant];

  return (
    <div className={`rounded-2xl border p-4 text-xs flex items-start gap-3 ${styles}`}>
      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold">{title}</p>
        <p className="opacity-85 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
