import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const VARIANTS = {
  success: {
    Icon: CheckCircle2,
    light: 'bg-white border-l-4 border-l-success text-ink',
    dark:  'bg-night-surface border-l-4 border-l-[#34d399] text-night-text',
    iconLight: 'text-success',
    iconDark:  'text-[#34d399]',
  },
  warning: {
    Icon: AlertTriangle,
    light: 'bg-white border-l-4 border-l-warning text-ink',
    dark:  'bg-night-surface border-l-4 border-l-[#fbbf24] text-night-text',
    iconLight: 'text-warning',
    iconDark:  'text-[#fbbf24]',
  },
  error: {
    Icon: XCircle,
    light: 'bg-white border-l-4 border-l-danger text-ink',
    dark:  'bg-night-surface border-l-4 border-l-[#f87171] text-night-text',
    iconLight: 'text-danger',
    iconDark:  'text-[#f87171]',
  },
  info: {
    Icon: Info,
    light: 'bg-white border-l-4 border-l-primary text-ink',
    dark:  'bg-night-surface border-l-4 border-l-hud text-night-text',
    iconLight: 'text-primary',
    iconDark:  'text-hud',
  },
};

let _id = 0;

export function ToastProvider({ children, isDark = false }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t));
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 320);
  }, []);

  const add = useCallback((message, variant = 'info', duration = 3800) => {
    const id = ++_id;
    setToasts(p => [...p, { id, message, variant, out: false }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const toast = useCallback(
    Object.assign((m, v, d) => add(m, v, d), {
      success: (m, d) => add(m, 'success', d),
      warning: (m, d) => add(m, 'warning', d),
      error:   (m, d) => add(m, 'error', d),
      info:    (m, d) => add(m, 'info', d),
    }),
    [add]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* ── Toast Stack (Top-centered so it never overlaps bottom cockpit controls) ── */}
      <div
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md"
        style={{ zIndex: 99999 }}
      >
        {toasts.map(t => {
          const v = VARIANTS[t.variant] ?? VARIANTS.info;
          const { Icon } = v;
          return (
            <div
              key={t.id}
              className={[
                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-card-lg',
                'border border-surface-border min-w-[280px] max-w-md',
                'transition-all duration-300',
                isDark ? v.dark : v.light,
                t.out
                  ? 'opacity-0 translate-y-4 scale-95'
                  : 'opacity-100 translate-y-0 scale-100',
              ].join(' ')}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isDark ? v.iconDark : v.iconLight}`} />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="p-1 rounded-lg text-ink-tertiary hover:text-ink hover:bg-surface-subtle transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
